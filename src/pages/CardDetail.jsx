import { useState, useRef, useEffect } from 'react'
import { Link, useParams, Navigate, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBySlug, CARDS, PROMOS } from '../data/cards'
import CardArt, { isPortraitArt } from '../components/CardArt'
import { Icon } from '../lib/icons'
import { useCompare } from '../lib/compare'
import pedestalUrl from '../assets/pedestal.png'

// Real downloadable product factsheets (PDFs in /public), keyed by card slug.
// The "buried PDF reimagined" content now ships as an actual file, not an
// in-app page — so it can be downloaded, shared and printed like a real doc.
const FACTSHEETS = {
  'one-card': 'uob-one-card-product-factsheet.pdf',
}

// Story / value-prop lifestyle images, keyed by card
const STORY_IMAGES = import.meta.glob('../assets/story-*.png', { eager: true, import: 'default' })
const storyImage = (key) => STORY_IMAGES[`../assets/story-${key}.png`]

// "Beyond cashback" lifestyle photos (2.10). Drop perk-<key>.png into assets;
// any tile without a matching photo keeps its icon + gradient as a fallback.
const PERK_IMAGES = import.meta.glob('../assets/perk-*.png', { eager: true, import: 'default' })
const perkImg = (key) => (key ? PERK_IMAGES[`../assets/perk-${key}.png`] : undefined)

// Reward product shots for the on-page reward module.
const REWARD_IMAGES = import.meta.glob('../assets/reward-*.png', { eager: true, import: 'default' })
const rewardPhoto = (key) => (key ? REWARD_IMAGES[`../assets/reward-${key}.png`] : undefined)
// Partner brand logos for the hero reward carousel's category slides.
const BRAND_IMG = import.meta.glob('../assets/brands/brand-*.{png,jpg,svg}', { eager: true, import: 'default' })
const brandImg = (key) =>
  BRAND_IMG[`../assets/brands/brand-${key}.png`] ||
  BRAND_IMG[`../assets/brands/brand-${key}.svg`] ||
  BRAND_IMG[`../assets/brands/brand-${key}.jpg`]

// Category offer photos for the reward-first hero (e.g. McDonald's food for the
// dining offer). Drop offer-<category-slug>.{png,jpg} into src/assets; until
// then the hero falls back to the card art. Slug = lowercased category, spaces
// and punctuation collapsed to single dashes (e.g. "Daily Commute" → daily-commute).
const OFFER_IMG = import.meta.glob('../assets/offer-*.{png,jpg}', { eager: true, import: 'default' })
const offerSlug = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const offerPhoto = (key) => (key ? OFFER_IMG[`../assets/offer-${key}.png`] || OFFER_IMG[`../assets/offer-${key}.jpg`] : undefined)
// Map each tile's title to its shared photo key (titles repeat across cards).
const PERK_KEY = {
  'SMART$ rebates, automatically': 'rebates',
  'UOB Deals & SMART$': 'rebates',
  'SMART$ rebates': 'rebates',
  'Unlock bonus interest with your UOB One Account': 'interest',
  'Contactless & mobile wallets': 'mobile-wallet',
  'Mobile wallets': 'mobile-wallet',
  'Year-round UOB Deals': 'deals',
  'UOB Deals': 'deals',
  'Complimentary insurance': 'womens-insurance',
  'Instant mobile wallet': 'instant-card',
  'Mobile-first': 'instant-card',
  'KrisFlyer integration': 'miles-credit',
  'Travel privileges': 'travel',
  'Made to be greener': 'eco',
  'Airport limousine & lounge': 'limo-lounge',
  'Travel insurance': 'travel-insurance',
  'Rich travel insurance': 'travel-insurance',
  'No categories to track': 'flat-rate',
  'No minimum spend': 'no-minimum',
  'Rebates as Lazada credit': 'lazada-credit',
  'Global lounge access': 'lounge',
}

// The sign-up reward shown ON the page (not routed away to the form). A
// physical gift (PROMOS) takes priority; otherwise the welcome boost banner.
function getReward(card) {
  const promo = PROMOS.find((p) => p.cards.includes(card.slug))
  if (promo) {
    return {
      eyebrow: 'Sign-up gift',
      big: promo.reward + (promo.worth ? ` — worth ${promo.worth}` : ''),
      condition: promo.condition,
      rewardImage: promo.rewardImage,
      validUntil: promo.validUntil,
      endsSoon: promo.endsSoon,
    }
  }
  if (card.promoBanner) {
    return {
      eyebrow: 'Welcome offer',
      big: card.promoBanner.headline || card.promoBanner.text,
      sub: card.promoBanner.sub || '',
      // Keep the headline rate AND its condition both legible (ONE Card caveat).
      condition: card.promoBanner.condition
        || 'New cardmembers only, for your first spend quarter. After that, earn the standard rate. T&Cs apply.',
      rewardImage: card.promoBanner.rewardImage || 'cash',
    }
  }
  return null
}

// Fallback imagery for category tiles that have no partner brand logos — a
// gradient tile with a category-appropriate emoji keeps the carousel populated
// on every card (e.g. Lady's "chosen category" tiles).
const CATEGORY_EMOJI = {
  beauty: '💄', wellness: '💄', dining: '🍽️', food: '🍔', fashion: '👗',
  travel: '✈️', air: '✈️', flight: '✈️', hotel: '🏨', family: '👨‍👩‍👧',
  transport: '🚆', commute: '🚆', grab: '🚗', shopping: '🛍️', online: '🛍️',
  groceries: '🛒', fuel: '⛽', utilities: '💡', overseas: '🌏', miles: '✈️',
  rewards: '🎁', entertainment: '🎬',
}
const categoryEmoji = (category = '') => {
  const c = category.toLowerCase()
  const hit = Object.keys(CATEGORY_EMOJI).find((k) => c.includes(k))
  return hit ? CATEGORY_EMOJI[hit] : '✨'
}
const CATEGORY_TILE_BG = 'linear-gradient(135deg,#143a6b,#0a2240)'

// Reward thumbnail backdrops (emoji on gradient) for the on-page reward module.
const REWARD_BG = {
  airpods: 'linear-gradient(135deg,#1b2a3d,#39516f)',
  miles: 'linear-gradient(135deg,#005eb8,#00237b)',
  luggage: 'linear-gradient(135deg,#7a2150,#b0306b)',
  cash: 'linear-gradient(135deg,#0a7a43,#16a35c)',
}

// Card Product Page — the main decision-making surface.
// Implements: at-a-glance summary above the fold (earnings/fees/eligibility/
// next steps), card-first hero, eligibility upfront, tabbed benefits, sticky
// Apply, FAQ accordion, and ONE contextual cross-sell (not 7-8 stacked blocks).
export default function CardDetail() {
  const { slug } = useParams()
  const card = cardBySlug(slug)
  const { has, toggle, add } = useCompare()
  if (!card) return <Navigate to="/" replace />

  const tabKeys = Object.keys(card.benefitTabs)
  const relatedPromo = PROMOS.find((p) => p.cards.includes(card.slug))
  // 2.13 — up to 2 cross-sell cards shown inline (same tier first, then any),
  // excluding self and the cards we don't surface in browse.
  const HIDDEN = ['absolute-cashback-card', 'lazada-uob-card', 'visa-infinite-metal-card']
  const pool = CARDS.filter((c) => c.slug !== card.slug && !HIDDEN.includes(c.slug))
  const crossSells = [
    ...pool.filter((c) => c.tier === card.tier),
    ...pool.filter((c) => c.tier !== card.tier),
  ].slice(0, 2)

  // Sticky footer trigger (2.5): the bottom Apply bar only appears once the
  // hero's own Apply Now button has scrolled out of view.
  const heroCtaRef = useRef(null)
  const [showSticky, setShowSticky] = useState(false)
  useEffect(() => {
    // Show the sticky bar once the hero CTA has scrolled ABOVE the viewport.
    // A capturing scroll listener catches scroll from BOTH the window (mobile)
    // and the inner phone-frame <main> (desktop) — IntersectionObserver was
    // unreliable across those two scroll contexts. Read the live rect each time.
    const update = () => {
      const node = heroCtaRef.current
      setShowSticky(!!node && node.getBoundingClientRect().bottom <= 0)
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [slug])

  // Value-prop H1 + card-name eyebrow, whether or not a bespoke `hero` exists.
  const eyebrow = card.hero?.eyebrow || `${card.name.toUpperCase()} CREDIT CARD`
  const headline = card.hero?.headline || card.valueProp || card.headline
  const bullets = card.hero?.body || card.highlights?.slice(0, 3) || []

  // Two hero variants: product-first (organic / direct) vs reward-first (paid
  // entry, ?from=offer) where the offer leads above the fold. ?offer=<category>
  // leads with a specific category cashback offer and a category photo.
  const [params] = useSearchParams()
  const reward = getReward(card)
  const offerKey = params.get('offer')
  const offerTile = offerKey ? (card.applyTiles || []).find((t) => offerSlug(t.category) === offerKey) : null
  // Per-category nudge for the floating offer photo (some PNGs sit left in their
  // canvas and overlap the card too much). Right-anchored, so a more-negative
  // value pushes the artwork further right. Defaults to 1%.
  const ck = `${card.slug}:${offerKey}`
  const offerRight = { 'ladys-card:dining': '-5%', 'ladys-card:travel': '-5%', 'preferred-visa-card:mobile-contactless': '-7%', 'preferred-visa-card:entertainment': '-6%', 'preferred-visa-card:food-delivery': '-13%', 'krisflyer-card:dining': '-10%', 'evol-card:mobile-contactless': '-7%', 'prvi-miles-card:overseas-spend': '-9%', 'lazada-uob-card:dining-transport': '-4%', 'visa-infinite-metal-card:overseas-spend': '-9%', 'visa-infinite-metal-card:travel-cover': '-9%' }[ck] || { 'daily-commute': '6%' }[offerKey] || '1%'
  // Optional left override to shift the card (and so the whole cluster).
  const cardLeftOverride = { 'ladys-card:dining': '8%', 'ladys-card:travel': '8%', 'evol-card:mobile-contactless': '19%' }[ck]
  // Optional bottom override to lower the offer photo in the default layout.
  const offerBottom = { 'preferred-visa-card:mobile-contactless': '-9%', 'lazada-uob-card:dining-transport': '-9%' }[ck] || '0px'
  // Per-category height for the floating offer photo (default 192px). Some
  // subjects (e.g. a person) read better scaled up toward the card's height.
  const offerH = { 'evol-card:mobile-contactless': '211px', 'prvi-miles-card:overseas-spend': '211px', 'visa-infinite-metal-card:overseas-spend': '211px' }[`${card.slug}:${offerKey}`]
    || { shopping: '224px', entertainment: '221px', 'online-shopping': '226px', 'air-travel': '225px', 'online-travel': '168px' }[offerKey]
    || '192px'
  // Optional per-category card-size override (default sizing otherwise).
  const cardSizeOverride = { 'evol-card:online-shopping': 'w-[34%] max-w-[124px]', 'evol-card:mobile-contactless': 'w-[36%] max-w-[130px]', 'absolute-cashback-card:public-transport': 'w-[34%] max-w-[124px]', 'lazada-uob-card:dining-transport': 'w-[34%] max-w-[124px]' }[`${card.slug}:${offerKey}`]
  // "Centered" composition: the card slides in from the left tilted the other
  // way while the offer photo sits to the right. Used where the default
  // right-anchored photo crowds the card.
  const heroCentered = offerKey === 'daily-commute'
  // "House" composition: the offer photo is the big centered hero, the card is
  // shrunk and tucked at its bottom-right, tilted right.
  const heroHouse = offerKey === 'utilities'
  // House-layout dimensions — same hero height across categories.
  const houseBoxH = '232px'
  const houseImgH = '228px'
  const houseCardBottom = 'bottom-0'
  // Fuel: a balanced, centered pair — pump on the left overlapping a larger
  // card on the right.
  const heroBalanced = offerKey === 'fuel'
  // Mirror the default layered hero (card on the right, offer photo on the left).
  const heroMirror = ['evol-card:online-shopping', 'absolute-cashback-card:public-transport'].includes(ck)
  // Offer-led: a big landscape offer photo is the hero, with a smaller card
  // tucked at its bottom-right.
  const heroOfferLed = ck === 'prvi-miles-card:flights-hotels'
  // Optional per-category card tilt (degrees). Negative leans the top left.
  const cardRotate = { 'evol-card:online-shopping': -14 }[ck] ?? (heroCentered ? 15 : -7)
  const cardRotateInit = cardRotate >= 0 ? cardRotate + 4 : cardRotate - 4
  // Per-category vertical offset for the card in the default layered hero.
  const cardTop = { 'ladys-card:beauty-wellness': '15%', 'ladys-card:dining': '15%', 'ladys-card:fashion': '15%', 'ladys-card:travel': '15%', 'preferred-visa-card:mobile-contactless': '10%', 'preferred-visa-card:entertainment': '10%', 'preferred-visa-card:food-delivery': '10%', 'preferred-visa-card:online-shopping': '10%', 'krisflyer-card:air-travel': '10%', 'krisflyer-card:dining': '10%', 'krisflyer-card:online-travel': '10%', 'evol-card:online-shopping': '10%', 'prvi-miles-card:overseas-spend': '10%', 'lazada-uob-card:dining-transport': '10%', 'visa-infinite-metal-card:overseas-spend': '10%', 'visa-infinite-metal-card:travel-cover': '10%' }[`${card.slug}:${offerKey}`] || '0%'
  // The reward-first "lead": a category offer tile takes priority, else the
  // card's welcome offer / sign-up gift.
  const lead = offerTile
    ? {
        eyebrow: offerTile.category,
        // Headline ties the offer to the card so an ad-lander immediately sees
        // which UOB card unlocks the cashback (e.g. "Up to 20% cashback with UOB
        // One Card"). A tile may override the lead phrase via `offerHeadline`.
        big: `${offerTile.offerHeadline || `${offerTile.value} ${offerTile.metric}`.trim()} with ${card.name}`,
        condition: offerTile.at || '',
        image: offerPhoto(offerSlug(offerTile.category)),
      }
    : reward
      ? {
          eyebrow: reward.eyebrow,
          big: reward.big,
          condition: reward.condition,
          // Use the reward photo, or the cashback 3D icon for cash welcome offers,
          // so the welcome-offer hero gets the same pedestal staging.
          image: rewardPhoto(reward.rewardImage) || (reward.rewardImage === 'cash' ? brandImg('cashback') : null),
        }
      : null
  const rewardFirst = params.get('from') === 'offer' && Boolean(lead)

  // In-page scroll (HashRouter makes href="#id" navigate, so scroll via JS).
  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Benefits tab state lifted here so the hero "Rewards" anchor can open the
  // Rewards tab and scroll to the Benefits section in one click.
  const [benefitsTab, setBenefitsTab] = useState(0)
  const rewardsTabIndex = card.benefits ? card.benefits.tabs.findIndex((t) => /reward/i.test(t.label)) : -1
  const goToRewards = () => {
    if (rewardsTabIndex >= 0) setBenefitsTab(rewardsTabIndex)
    scrollToId('benefits')
  }

  // 2.4 — "T&Cs apply" opens the product factsheet (PDF) when the card has one;
  // otherwise it falls back to the on-page terms section.
  const factsheet = FACTSHEETS[card.slug]
  const tcHref = factsheet ? `${import.meta.env.BASE_URL}${factsheet}` : '#terms'

  return (
    <div className="pb-20">
      {/* Hero — dark navy field so the card face pops (2.2). White headline,
          translucent chips, white benefit bullets, and an in-hero Apply Now. */}
      <div className="bg-[linear-gradient(180deg,#0a2240_0%,#0a2240_62%,#0c2647_100%)] text-white">
        <div className="px-5 pt-3">
          {rewardFirst ? (
            <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-white/55">
              <Link to="/" className="hover:text-white">All cards</Link>
              <Icon.Chevron size={13} className="-rotate-90 text-white/35" />
              <Link to={`/cards/${card.slug}`} className="hover:text-white">{card.name}</Link>
              <Icon.Chevron size={13} className="-rotate-90 text-white/35" />
              <span className="text-white">{lead.eyebrow}</span>
            </nav>
          ) : (
            <Link to="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-white/80 hover:text-white">
              <Icon.ArrowLeft size={16} /> All cards
            </Link>
          )}
        </div>

        {/* Card-first hero. Larger card face (key UOB brand asset). Two leads:
            product-first (organic) or reward-first (paid entry, ?from=offer). */}
        <section className="px-5 pt-6">
          {rewardFirst ? (
            <>
              <h1 className="font-display text-[26px] font-extrabold leading-[1.15] text-white">{lead.big}</h1>
              {lead.condition && <p className="mt-2.5 text-[13.5px] leading-snug text-white/65">{lead.condition}</p>}
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky">{eyebrow}</p>
              <h1 className="mt-2 font-display text-[24px] font-bold leading-[1.2] text-white">{headline}</h1>
            </>
          )}

          {/* Hero visual — a category offer photo when we have one for a
              ?offer= lead, otherwise the floating card face. */}
          {rewardFirst && lead.image ? (
            // Pedestal campaign hero — premium product-ad staging: a soft-lit
            // food cluster grounded on the left and the UOB card standing on a
            // lit blue pedestal on the right, sharing one stage plane. Landscape
            // cards are short, so the stage is shorter to avoid empty top space.
            <div className="relative mx-auto mt-6 w-full max-w-[340px]" style={{ height: isPortraitArt(card) ? '296px' : '244px' }}>
              {/* Ambient radial light so the navy has depth — wide and soft so
                  it never shows a hard edge. */}
              <div
                className="pointer-events-none absolute -inset-x-8 -inset-y-10"
                style={{ background: 'radial-gradient(135% 95% at 60% 22%, rgba(46,86,178,0.26), rgba(10,34,64,0) 72%)', filter: 'blur(8px)' }}
              />

              {/* RIGHT: spotlight + large pedestal + smaller standing card */}
              <div className="absolute bottom-0 right-0 z-10 h-full w-[60%]">
                {/* Vertical spotlight behind the card — a soft, blurred beam that
                    extends past the frame so its falloff never hits an edge. */}
                <div
                  className="pointer-events-none absolute left-1/2 -top-[24%] h-[150%] w-[120%] -translate-x-1/2"
                  style={{ background: 'radial-gradient(40% 38% at 50% 40%, rgba(104,162,255,0.42), rgba(104,162,255,0.12) 46%, rgba(104,162,255,0) 74%)', filter: 'blur(24px)' }}
                />
                {/* Pedestal platform — large, wider than the card, brought
                    forward (lower) so the stage reads as foreground. */}
                <img src={pedestalUrl} alt="" className="absolute -bottom-2 left-1/2 z-0 w-[150%] max-w-none -translate-x-1/2" />
                {/* Contact shadow where the card meets the pedestal. */}
                <div
                  className="pointer-events-none absolute bottom-[24%] left-1/2 z-[1] h-[17px] w-[52%] -translate-x-1/2 rounded-[50%]"
                  style={{ background: 'radial-gradient(closest-side, rgba(0,4,16,0.7), rgba(0,4,16,0) 75%)', filter: 'blur(3px)' }}
                />
                {/* Standing card — sits on the pedestal, larger / foreground. */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute z-10 drop-shadow-[0_20px_28px_rgba(0,6,22,0.6)] ${isPortraitArt(card) ? 'inset-x-0 mx-auto bottom-[24%] w-[58%] max-w-[138px]' : 'right-[2%] bottom-[27%] w-[76%] max-w-[150px]'}`}
                >
                  <CardArt card={card} bare floating />
                </motion.div>
              </div>

              {/* LEFT: food cluster grounded with a soft shadow, resting on the
                  same floor level as the pedestal, with a gap before it.
                  Daily-commute art is lifted a touch higher (per-screen). */}
              <div className="absolute left-0 z-20 w-[48%]" style={{ bottom: offerKey === 'daily-commute' ? '15%' : '5%' }}>
                <div
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-[18px] w-[80%] -translate-x-1/2 rounded-[50%]"
                  style={{ background: 'radial-gradient(closest-side, rgba(0,4,16,0.6), rgba(0,4,16,0) 75%)', filter: 'blur(5px)' }}
                />
                <motion.img
                  key={lead.image}
                  src={lead.image}
                  alt={lead.eyebrow}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mx-auto block h-[208px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_18px_24px_rgba(0,6,22,0.5)]"
                />
              </div>
            </div>
          ) : (
            <div className={`mx-auto mt-6 ${isPortraitArt(card) ? 'w-[37%] max-w-[138px]' : 'w-[80%] max-w-[300px]'}`}>
              <motion.div initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <CardArt card={card} bare floating />
              </motion.div>
            </div>
          )}

          {/* Product-first: benefit bullets. */}
          {!rewardFirst && bullets.length > 0 && (
            <ul className="mt-9 space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[15.5px] font-semibold leading-snug text-white">
                  <Icon.Check size={19} className="mt-0.5 shrink-0 text-sky" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Rolling benefits carousel — shown on both the product-first hero
              and the offer/campaign hero (above Apply now), so every page
              surfaces this card's rotating benefits. */}
          <HeroRewardCarousel reward={reward} card={card} excludeKey={rewardFirst ? offerKey : null} onReward={rewardFirst} />

          {/* In-hero Apply Now (2.3) — the first, most important CTA. */}
          <Link
            ref={heroCtaRef}
            to={`/apply/${card.slug}`}
            className="btn-primary btn-lg mt-5 flex w-full bg-uobred hover:bg-uobred-600"
          >
            Apply now
          </Link>

          {/* Reward-first: a clear path to the full card details below. */}
          {rewardFirst && (
            <button onClick={() => scrollToId('card-details')} className="mt-3 flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-white/70 hover:text-white">
              See full card details <Icon.Chevron size={16} />
            </button>
          )}

        </section>

        {/* Anchor links + T&Cs — same row, same styling. */}
        <div id="card-details" className="scroll-mt-4 mt-5 px-5">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 pb-7 text-[12.5px] font-semibold text-sky">
            {card.benefits && <button onClick={goToRewards} className="hover:text-white">Rewards</button>}
            <button onClick={() => scrollToId('eligibility')} className="hover:text-white">Eligibility</button>
            <button onClick={() => scrollToId('fees')} className="hover:text-white">Fees</button>
            <a
              href={tcHref}
              {...(factsheet ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="hover:text-white"
            >
              T&amp;Cs
            </a>
          </div>
        </div>
      </div>

      {/* At a glance — table for cards with structured rows, else the 4-fact grid */}
      {card.glance ? (
        <GlanceTable glance={card.glance} />
      ) : (
        <section id="glance" className="scroll-mt-20 px-5 pt-6">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">At a glance</h2>
          <div className="grid grid-cols-2 gap-3">
            <Glance icon={Icon.Coin} label="You earn" value={card.earn.rate} sub={card.earn.detail} accent />
            <Glance icon={Icon.Wallet} label="Annual fee" value={card.fees.annual} sub={card.fees.waiver} />
            <Glance icon={Icon.Shield} label="Eligibility" value={`Min ${card.eligibility.income}`} sub={`Age ${card.eligibility.age}+ · ${card.eligibility.residency}`} />
            <Glance icon={Icon.Clock} label="To apply" value="~5 mins" sub={card.nextStep.split(' · ')[1] || 'Singpass'} />
          </div>
        </section>
      )}

      {/* Already have this card? — existing-customer servicing component (Stage 2
          response). One designated, consistent spot on EVERY card page, right
          after the at-a-glance summary: lower priority than Apply but always
          visible, deep-linking the cardholder straight to their task. */}
      <AlreadyHaveCard card={card} goToRewards={goToRewards} scrollToId={scrollToId} />

      {/* Value prop + fit — one consolidated section: the lifestyle hook flows
          straight into an honest "is this card right for you?" verdict and the
          good-fit / think-twice columns (comparison-site candour, merged in). */}
      {(card.story || card.fit) && (
        <>
          <div className="px-5 pt-10">
            <hr className="border-t border-line" />
          </div>
          <section className="px-5 pt-8">
            {/* 2.8 — headline first, then image, then description. */}
            {card.story && (
              <>
                <h2 className="font-display text-[20px] font-bold leading-tight text-navy">{card.story.heading}</h2>
                {card.story.image && storyImage(card.story.image) && (
                  <img
                    src={storyImage(card.story.image)}
                    alt={`${card.name} — everyday spending categories`}
                    className="mt-5 w-full rounded-card object-cover"
                  />
                )}
                <div className="mt-5 space-y-3.5 text-[14px] leading-relaxed text-ink">
                  {card.story.paragraphs.map((p) => <p key={p}>{p}</p>)}
                </div>
              </>
            )}
            {card.fit && <FitCheck fit={card.fit} withinStory={Boolean(card.story)} />}
          </section>
          <div className="px-5 pt-10">
            <hr className="border-t border-line" />
          </div>
        </>
      )}

      {/* Benefits — restructured into tab-content by category with a
          how-it-works accordion (content-designer hierarchy) */}
      {card.benefits ? (
        <BenefitsSection benefits={card.benefits} active={benefitsTab} onActive={setBenefitsTab} />
      ) : (
        <section id="benefits" className="scroll-mt-20 px-5 pt-7">
          <h2 className="font-display text-[19px] font-bold text-navy">Why this card</h2>
          <ul className="mt-3 space-y-2">
            {card.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[14px] leading-snug text-ink">
                <Icon.Check size={18} className="mt-0.5 shrink-0 text-royal" />
                {h}
              </li>
            ))}
          </ul>
          <BenefitTabs tabs={card.benefitTabs} tabKeys={tabKeys} />
        </section>
      )}

      {/* Secondary benefits — value beyond the headline cashback/rewards */}
      {card.secondaryBenefits && <SecondaryBenefits items={card.secondaryBenefits} heading={card.secondaryHeading} />}

      {/* Eligibility & documents */}
      <EligibilitySection card={card} />

      {/* Fees — annual fee & charges */}
      <FeesSection card={card} />

      {/* How it works — worked example of how the cashback/miles are calculated */}
      {card.calculation && <CalculationSection calc={card.calculation} />}

      {/* Linked account — pair the card with a UOB account for bonus interest */}
      {card.linkedProduct && <LinkedProduct product={card.linkedProduct} />}

      {/* Contextual cross-sell — ONE related promo, only if relevant */}
      {/* Product factsheet — a real, downloadable PDF (not an in-app page) */}
      {FACTSHEETS[card.slug] && (
        <section className="px-5 pt-7">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">Fees &amp; full terms</h2>
          <a
            href={`${import.meta.env.BASE_URL}${FACTSHEETS[card.slug]}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="surface flex items-center gap-3 p-3.5"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-tile bg-uobred/10 text-uobred">
              <Icon.Doc size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-tight text-navy">Product factsheet (PDF)</p>
              <p className="text-[12px] leading-snug text-slatey">Fees, rates &amp; key terms — opens the full document</p>
            </div>
            <Icon.Download size={18} className="shrink-0 text-royal" />
          </a>
        </section>
      )}

      {/* FAQ accordion (sourced from top call-centre questions) */}
      <section className="px-5 pt-7">
        <h2 className="font-display text-[19px] font-bold text-navy">Common questions</h2>
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-card bg-white ring-1 ring-line/70">
          {card.faqs.map((f, i) => (
            <Faq key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* How to apply — online/Singpass primary route plus the SMS method */}
      <HowToApply card={card} />

      {/* Things you should know — disclosures & key terms */}
      <WhatYouShouldKnow items={card.disclosures} />

      {/* You may also consider — cross-sell cards shown inline (2.13) */}
      {crossSells.length > 0 && (
        <section className="px-5 pt-10">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">You may also consider</h2>
          <div className="space-y-3">
            {crossSells.map((cs) => (
              <Link key={cs.slug} to={`/cards/${cs.slug}`} className="surface flex items-center gap-3 p-3">
                <div className="w-[28%]"><CardArt card={cs} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-navy">{cs.name}</p>
                  <p className="text-[12px] leading-snug text-slatey">{cs.bestFor}</p>
                  <p className="mt-0.5 text-[12px] font-semibold text-royal">{cs.headline}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    // Comparing a cross-sell implies comparing it against the
                    // card you're viewing — auto-add this page's card too.
                    if (!has(cs.slug)) add(card.slug)
                    toggle(cs.slug)
                  }}
                  aria-label={`Compare ${cs.name}`}
                  className={`btn btn-md border ${has(cs.slug) ? 'border-royal bg-sky-soft text-royal' : 'border-line text-slatey'}`}
                >
                  {has(cs.slug) ? <Icon.Check size={16} /> : <Icon.Scales size={16} />}
                </button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sticky apply (Alexa #4) — appears once the hero CTA scrolls away */}
      <StickyApply card={card} show={showSticky} />
    </div>
  )
}

// Hero reward carousel — mirrors the application flow's rolling reward strip.
// Auto-rotates through the welcome offer/gift and the card's category-cashback
// tiles (brand logos), with a persistent "Learn more" link below.
function HeroRewardCarousel({ reward, card, excludeKey, onReward }) {
  const navigate = useNavigate()
  // "Learn more": on a product page it opens the reward-first hero variant for
  // that category. On a reward/campaign page it scrolls down to the benefits
  // section instead (hashtag-style in-page jump).
  const learnMore = (s) => {
    if (onReward) {
      const el = document.getElementById('benefits')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const q = s.kind === 'tile' ? `?from=offer&offer=${offerSlug(s.tile.category)}` : '?from=offer'
    navigate(`/cards/${card.slug}${q}`)
    window.scrollTo(0, 0)
  }
  // Every category tile becomes a slide; tiles with partner logos show them,
  // the rest fall back to a category-emoji tile so all cards stay populated.
  // Skip the category the user is already viewing (excludeKey) to avoid repeating it.
  const tiles = (card.applyTiles || []).filter((t) => offerSlug(t.category) !== excludeKey)
  // The welcome-offer slide only when the card has a reward; every card with
  // category tiles still gets the rolling carousel from those tiles alone.
  const slides = [
    ...(reward ? [{ key: 'reward', kind: 'reward' }] : []),
    ...tiles.map((t, idx) => ({ key: `t${idx}`, kind: 'tile', tile: t })),
  ]
  const [i, setI] = useState(0)
  useEffect(() => {
    if (slides.length <= 1) return undefined
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 2800)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null
  const slide = slides[Math.min(i, slides.length - 1)]
  const emoji = reward ? ({ airpods: '🎧', miles: '✈️', luggage: '🧳', cash: '💰' }[reward.rewardImage] || '🎁') : '🎁'

  return (
    <div className="mt-7 overflow-hidden rounded-card bg-white/[0.06] text-left ring-1 ring-white/10">
      <div className="relative h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center gap-3.5 p-3.5"
          >
            {slide.kind === 'reward' ? (
              <>
                {(() => {
                  // Prefer a reward photo; for cash rewards use the cashback icon
                  // (brand-cashback.png) on a clean light tile instead of an emoji.
                  const art = rewardPhoto(reward.rewardImage) || (reward.rewardImage === 'cash' ? brandImg('cashback') : null)
                  return (
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-tile p-1.5" style={{ background: art ? '#eef3fb' : (REWARD_BG[reward.rewardImage] || REWARD_BG.cash) }}>
                      {art
                        ? <img src={art} alt={reward.big} className="max-h-full max-w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]" />
                        : <span className="text-[30px] leading-none">{emoji}</span>}
                    </div>
                  )
                })()}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffc499]">{reward.eyebrow}</p>
                  <h2 className="mt-0.5 font-display text-[17px] font-extrabold leading-tight text-white line-clamp-2">{reward.big}</h2>
                  {reward.sub && <p className="mt-0.5 truncate text-[11.5px] leading-snug text-white/60">{reward.sub}</p>}
                </div>
              </>
            ) : (
              <>
                {(() => {
                  const logos = (slide.tile.brands || []).map((b) => ({ b, src: brandImg(b) })).filter((x) => x.src)
                  return logos.length ? (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-tile bg-white/90 px-2">
                      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                        {logos.map(({ b, src }) => (
                          <img key={b} src={src} alt={b} className="h-5 w-auto max-w-[44px] object-contain" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-tile" style={{ background: CATEGORY_TILE_BG }}>
                      <span className="text-[30px] leading-none">{categoryEmoji(slide.tile.category)}</span>
                    </div>
                  )
                })()}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffc499]">{slide.tile.category}</p>
                  <h2 className="mt-0.5 font-display text-[17px] font-extrabold leading-tight text-white">{slide.tile.value} {slide.tile.metric}</h2>
                  {slide.tile.at && <p className="mt-0.5 truncate text-[11.5px] leading-snug text-white/60">{slide.tile.at}</p>}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-0.5">
        {slides.length > 1 ? (
          <div className="flex gap-1.5">
            {slides.map((s, d) => (
              <span key={s.key} className={`h-1.5 rounded-full transition-all ${d === i ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        ) : <span />}
        <button
          onClick={() => learnMore(slide)}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-sky hover:text-white"
        >
          Learn more <Icon.Chevron size={14} className={onReward ? '' : '-rotate-90'} />
        </button>
      </div>
    </div>
  )
}

// Derive each glance row's "Learn more" target from its label so every card
// gets the deep links: fee rows → fees, income rows → eligibility, and every
// earn row (cashback / rewards / miles / rebates / privileges) → benefits.
const glanceLinkFor = (label) => {
  const l = (label || '').toLowerCase()
  if (l.includes('fee')) return 'fees'
  if (l.includes('income') || l.includes('eligib')) return 'eligibility'
  return 'benefits'
}

// 2.7 — "Card at a glance" as a mobile accordion. First (most important) row
// open by default; the rest collapse with a smooth height transition.
function GlanceTable({ glance }) {
  const [open, setOpen] = useState(0)
  return (
    <section id="glance" className="scroll-mt-20 px-5 pt-10">
      <h2 className="font-display text-[20px] font-bold leading-tight text-navy">{glance.heading}</h2>
      <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-card bg-white ring-1 ring-line/70">
        {glance.rows.map((row, i) => {
          const isOpen = open === i
          return (
            <div key={row.label}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-[14px] font-bold text-navy">{row.label}</span>
                <Icon.Chevron size={18} className={`shrink-0 text-royal transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <ul className="space-y-2">
                        {row.points.map((p) => (
                          <li key={p} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink">
                            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-royal" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      {row.note && <p className="mt-2 text-[11.5px] text-slatey">{row.note}</p>}
                      <button
                        onClick={() => {
                          const el = document.getElementById(row.link || glanceLinkFor(row.label))
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-royal hover:text-royal-600"
                      >
                        Learn more <Icon.Chevron size={13} className="-rotate-90" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Secondary benefits — a second tier of value below the headline earn story.
// Rendered as labelled tiles so each perk reads as its own scannable item.
// 2.10 — richer treatment than a flat icon grid: each perk gets a gradient
// "image" band (a stand-in for lifestyle photography) with the icon, then copy.
const PERK_GRADIENTS = [
  'linear-gradient(135deg,#0a2240,#1f4f8f)',
  'linear-gradient(135deg,#0f7a4f,#16a35c)',
  'linear-gradient(135deg,#7a2150,#b0306b)',
  'linear-gradient(135deg,#b9842b,#e0aa3e)',
]
function SecondaryBenefits({ items, heading }) {
  return (
    <section className="px-5 pt-10">
      <h2 className="font-display text-[20px] font-bold leading-tight text-navy">
        {heading || 'More reasons to love this card'}
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {items.map((it, i) => {
          const ItIcon = (it.icon && Icon[it.icon]) || Icon.Spark
          const photo = perkImg(PERK_KEY[it.title])
          return (
            <div key={it.title} className="overflow-hidden rounded-card bg-white ring-1 ring-line/70">
              {photo ? (
                <div className="h-20 overflow-hidden">
                  <img src={photo} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="grid h-20 place-items-center" style={{ background: PERK_GRADIENTS[i % PERK_GRADIENTS.length] }}>
                  <ItIcon size={26} className="text-white/90" />
                </div>
              )}
              <div className="p-3.5">
                <p className="text-[13.5px] font-bold leading-tight text-navy">{it.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-slatey">{it.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Eligibility & documents — the upfront "can I get this card" answer.
function EligibilitySection({ card }) {
  const e = card.eligibility
  const rows = [
    { label: 'Minimum age', value: `${e.age} years old` },
    { label: 'Min. income (Singaporean / PR)', value: `S$${Number(e.income.replace(/[^0-9]/g, '')).toLocaleString()} per year` },
    { label: 'Min. income (foreigner)', value: `S$${(e.incomeForeigner || 40000).toLocaleString()} per year` },
    { label: 'Documents needed', value: e.documents || 'NRIC / passport, latest income proof (or Singpass Myinfo)' },
  ]
  return (
    <section id="eligibility" className="scroll-mt-3 px-5 pt-10">
      <h2 className="font-display text-[20px] font-bold leading-tight text-navy">Eligibility &amp; documents</h2>
      <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-card bg-white ring-1 ring-line/70">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-4 px-5 py-4">
            <p className="w-[42%] shrink-0 text-[13px] font-bold text-navy">{r.label}</p>
            <p className="min-w-0 flex-1 text-[13.5px] leading-relaxed text-ink">{r.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Fees — annual fee & charges. Pulls from the card's own fee data with the
// standard UOB consumer-card charges shared across the family.
function FeesSection({ card }) {
  const f = card.fees
  const rows = [
    { label: 'Annual fee (principal)', value: `${f.annual} per year`, note: f.waiver },
    { label: 'Supplementary card', value: f.supplementary || '1st card free · S$98.10 each thereafter' },
    { label: 'Foreign currency fee', value: f.fx || '3.25% of transaction amount' },
    { label: 'Late payment fee', value: f.latePayment || 'S$100' },
    { label: 'Minimum monthly payment', value: f.minPayment || 'S$50 or 3% of balance, whichever is higher' },
  ]
  return (
    <section id="fees" className="scroll-mt-3 px-5 pt-10">
      <h2 className="font-display text-[20px] font-bold leading-tight text-navy">Annual fee &amp; charges</h2>
      <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-card bg-white ring-1 ring-line/70">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-4 px-5 py-4">
            <p className="w-[42%] shrink-0 text-[13px] font-bold text-navy">{r.label}</p>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] leading-relaxed text-ink">{r.value}</p>
              {r.note && <p className="mt-0.5 text-[12px] font-semibold text-royal">{r.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Is this card right for you? — comparison-site candour brought onto the
// product page: a one-line verdict, a green "great fit if" column and an amber
// "think twice if" column so people can self-qualify (and self-disqualify).
function FitCheck({ fit, withinStory }) {
  return (
    <div className={withinStory ? 'mt-5' : ''}>
      <div className="rounded-card bg-[#f0f8f3] p-4 ring-1 ring-[#cfe9da]">
        <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#0f7a4f]">
          <Icon.CheckCircle size={17} /> This card is right for you if…
        </p>
        <ul className="mt-3 space-y-2.5">
          {fit.goodFor.map((g) => (
            <li key={g} className="flex gap-2.5 text-[13.5px] leading-snug text-ink">
              <Icon.Check size={16} className="mt-0.5 shrink-0 text-[#0f7a4f]" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// How it works — a plain-language explainer plus a worked example that tallies
// up a single month/quarter's earn (mirrors the content designer's S$60+S$20+S$2
// = S$82 panel). Numbers come from each card's own `calculation` data.
function CalculationSection({ calc }) {
  const ex = calc.example
  return (
    <section className="px-5 pt-10">
      <p className="eyebrow">How it works</p>
      <h2 className="mt-1.5 font-display text-[20px] font-bold leading-tight text-navy">{calc.heading}</h2>
      {calc.intro && <p className="mt-3 text-[14px] leading-relaxed text-ink">{calc.intro}</p>}
      {ex && (
        <div className="mt-5 overflow-hidden rounded-card ring-1 ring-line/70">
          {ex.caption && (
            <div className="bg-navy px-4 py-3">
              <p className="text-[12px] font-bold uppercase tracking-wide text-white/90">{ex.caption}</p>
            </div>
          )}
          <div className="divide-y divide-line/70 bg-white">
            {ex.parts.map((p) => (
              <div key={p.amount + p.note} className="flex items-baseline gap-3 px-4 py-3.5">
                <p className="w-[34%] shrink-0 font-display text-[17px] font-extrabold leading-tight text-royal">{p.amount}</p>
                <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-slatey">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="grid place-items-center bg-royal px-4 py-3.5">
            <p className="font-display text-[22px] font-extrabold text-white">{ex.total}</p>
          </div>
        </div>
      )}
      {calc.cta && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-card bg-sky-soft p-4 ring-1 ring-royal/10">
          <p className="text-[13px] leading-snug text-ink">Estimate what you could earn each quarter and year.</p>
          <button className="inline-flex shrink-0 items-center gap-1.5 text-[13.5px] font-bold text-royal">
            {calc.cta} <Icon.Arrow size={15} />
          </button>
        </div>
      )}
    </section>
  )
}

// Linked account — cross-sell the paired UOB account that boosts deposit
// interest when the card is used (e.g. UOB One Account up to 3.4% p.a.).
function LinkedProduct({ product }) {
  return (
    <section className="px-5 pt-10">
      <p className="eyebrow">{product.eyebrow || 'Linked account'}</p>
      <h2 className="mt-1.5 font-display text-[20px] font-bold leading-tight text-navy">{product.heading}</h2>
      <div className="mt-4 rounded-card bg-gradient-to-br from-sky-soft to-white p-5 ring-1 ring-royal/10">
        {product.body && <p className="text-[14px] leading-relaxed text-ink">{product.body}</p>}
        {product.points && (
          <ul className="mt-3 space-y-2.5">
            {product.points.map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[13.5px] leading-snug text-ink">
                <Icon.Check size={18} className="mt-0.5 shrink-0 text-royal" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
        {product.cta && (
          <button className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-royal">
            {product.cta} <Icon.Arrow size={16} />
          </button>
        )}
      </div>
    </section>
  )
}

// How to apply — primary online/Singpass route with the existing-cardholder
// SMS shortcut, mirroring the content designer's "apply in minutes" block.
function HowToApply({ card }) {
  const shortName = card.name.replace('UOB ', '')
  return (
    <section className="px-5 pt-10">
      <p className="eyebrow">How to apply</p>
      <h2 className="mt-1.5 font-display text-[20px] font-bold leading-tight text-navy">Apply for {shortName} in minutes</h2>
      <p className="mt-3 text-[14px] leading-relaxed text-ink">
        Apply via UOB Personal Internet Banking or Singpass (Myinfo). It only takes a few minutes.
      </p>
      <Link to={`/apply/${card.slug}`} className="btn-primary btn-lg mt-4 flex w-full bg-uobred hover:bg-uobred-600">
        Apply now
      </Link>
      <div className="mt-4 rounded-card bg-white p-4 ring-1 ring-line/70">
        <p className="text-[13.5px] font-bold text-navy">Already a UOB principal cardholder?</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
          Apply by SMS: type <span className="font-semibold text-navy">YES&lt;space&gt;last 4 digits of your UOB card&lt;space&gt;NRIC</span>, then send to <span className="font-semibold text-navy">77672</span>.
        </p>
        <p className="mt-2 text-[11.5px] text-slatey">SMS T&amp;Cs apply.</p>
      </div>
    </section>
  )
}

// Things you should know — disclosures, eligibility caveats and key terms.
// Falls back to family-wide defaults when a card supplies none of its own.
const DEFAULT_DISCLOSURES = [
  'Rewards, rates and caps shown are illustrative — refer to the product factsheet for the full terms.',
  'SGD deposits in a linked UOB account are insured up to S$100,000 by SDIC.',
  'Subject to qualifying criteria. Terms and conditions apply.',
]

function WhatYouShouldKnow({ items }) {
  const list = items && items.length ? items : DEFAULT_DISCLOSURES
  return (
    <section id="terms" className="scroll-mt-16 px-5 pt-10">
      <h2 className="font-display text-[19px] font-bold text-navy">What you should know</h2>
      <ul className="mt-3 space-y-2.5">
        {list.map((d) => (
          <li key={d} className="flex gap-2.5 text-[12.5px] leading-relaxed text-slatey">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slatey" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Glance({ icon: I, label, value, sub, accent }) {
  return (
    <div className={`rounded-tile p-3.5 ring-1 ${accent ? 'bg-royal text-white ring-royal' : 'bg-white text-ink ring-line/70'}`}>
      <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${accent ? 'text-white/75' : 'text-slatey'}`}>
        <I size={15} /> {label}
      </div>
      <p className={`mt-1.5 font-display text-[19px] font-extrabold leading-none ${accent ? 'text-white' : 'text-navy'}`}>{value}</p>
      <p className={`mt-1 text-[11.5px] leading-snug ${accent ? 'text-white/80' : 'text-slatey'}`}>{sub}</p>
    </div>
  )
}

function BenefitTabs({ tabs, tabKeys }) {
  const [active, setActive] = useState(tabKeys[0])
  return (
    <div className="mt-5">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {tabKeys.map((k) => (
          <button key={k} onClick={() => setActive(k)} className={`chip shrink-0 ${active === k ? 'chip-active' : ''}`}>{k}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.ul
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-3 space-y-2 rounded-card bg-white p-4 ring-1 ring-line/70"
        >
          {tabs[active].map((item) => (
            <li key={item} className="flex gap-2.5 text-[14px] leading-snug text-ink">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
              {item}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

// Benefits restructured into category tabs. Cashback leads; each tab holds
// labelled tiles. A collapsible "how you earn" accordion carries the long detail.
function BenefitsSection({ benefits, active, onActive }) {
  const tab = benefits.tabs[active] || benefits.tabs[0]
  return (
    <section id="benefits" className="scroll-mt-20 px-5 pt-8">
      <p className="eyebrow">{benefits.eyebrow}</p>
      <h2 className="mt-1.5 font-display text-[22px] font-bold leading-tight text-navy">{benefits.heading}</h2>

      {/* Category tabs */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {benefits.tabs.map((t, i) => (
          <button key={t.label} onClick={() => onActive(i)} className={`chip shrink-0 ${active === i ? 'chip-active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-4 space-y-3"
        >
          {/* 2.9 — benefit value leads (primary), category is a small label. */}
          {tab.tiles.map((tile) => (
            <div key={tile.title} className="rounded-card bg-white p-4 ring-1 ring-line/70">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slatey">{tile.title}</p>
              <p className="mt-1.5 text-[15px] font-bold leading-snug text-navy">{tile.body}</p>
            </div>
          ))}
          {/* How-it-works accordion sits below the cashback tiles (under Fuel) */}
          {active === 0 && benefits.howItWorks && <HowItWorks how={benefits.howItWorks} />}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function HowItWorks({ how }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-card bg-sky-soft ring-1 ring-royal/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
        <span className="text-[14px] font-bold text-navy">{how.title}</span>
        <Icon.Chevron size={18} className={`shrink-0 text-royal transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <ol className="space-y-3">
                {how.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[13.5px] leading-relaxed text-ink">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal text-[12px] font-bold text-white">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              {how.note && <p className="mt-3.5 border-t border-royal/10 pt-3 text-[12.5px] leading-relaxed text-slatey">{how.note}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Faq({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
        <span className="text-[14px] font-semibold text-navy">{q}</span>
        <Icon.Chevron size={18} className={`shrink-0 text-royal transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-slatey">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Sticky footer (2.5): card face (left) · two key benefits (centre) · Apply
// (right). No full card name — the face already identifies the card.
// "Already have this card?" — the existing-customer servicing lane (Stage 2 Q2).
// Not a single task: existing cardholders arrive with a range of top questions
// (VOC: rewards mechanics, caps & exclusions, balances, the One Account unlock).
// So the component is a floating card of quick actions, card-aware, each one
// deep-linking to the answer on the page or the task in UOB TMRW.
function servicingOptions(card, { goToRewards, scrollToId }) {
  const toBenefits = () => scrollToId('benefits')
  const toFees = () => scrollToId('fees')
  if (card.slug === 'ladys-card') {
    return [
      { icon: 'Spark', label: 'Change your rewards category', value: 'Now: Dining', onClick: goToRewards },
      { icon: 'Info', label: 'How your UNI$ are earned — caps & limits', onClick: toBenefits },
      { icon: 'Coin', label: 'Check your UNI$ balance', hint: 'TMRW', onClick: goToRewards },
      { icon: 'Phone', label: 'Manage card, PIN & limits', hint: 'TMRW', onClick: goToRewards },
    ]
  }
  if (card.slug === 'one-card') {
    return [
      { icon: 'Info', label: 'How your cashback is calculated — caps & exclusions', onClick: toBenefits },
      { icon: 'Wallet', label: 'Add a One Account to unlock the full rate', value: 'Up to 3.4% p.a.', onClick: toBenefits },
      { icon: 'Coin', label: 'Check your cashback this quarter', hint: 'TMRW', onClick: goToRewards },
      { icon: 'Phone', label: 'Manage card, PIN & limits', hint: 'TMRW', onClick: goToRewards },
    ]
  }
  // Generic existing-cardholder tasks for every other card.
  return [
    { icon: 'Info', label: 'How your rewards are calculated — caps & limits', onClick: toBenefits },
    { icon: 'Coin', label: 'Check your rewards balance', hint: 'TMRW', onClick: goToRewards },
    { icon: 'Wallet', label: 'View fees & charges', onClick: toFees },
    { icon: 'Phone', label: 'Manage card, PIN & limits', hint: 'TMRW', onClick: goToRewards },
  ]
}

function AlreadyHaveCard({ card, goToRewards, scrollToId }) {
  const items = servicingOptions(card, { goToRewards, scrollToId })
  // Collapsed by default so the existing-customer lane is present and recognisable
  // without adding a second tall block beneath "at a glance". Tap the banner to
  // reveal the quick actions — same accordion behaviour as the glance table.
  const [open, setOpen] = useState(false)
  return (
    <section className="px-5 pt-5">
      <div className="overflow-hidden rounded-card shadow-tile ring-1 ring-royal/15">
        {/* Dark-blue banner — also the accordion toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="relative flex w-full items-center gap-3 overflow-hidden bg-[linear-gradient(120deg,#00237b_0%,#004585_58%,#005eb8_100%)] px-4 py-3.5 text-left text-white"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{ background: 'radial-gradient(120% 130% at 92% -25%, rgba(0,132,255,0.45), transparent 60%)' }}
          />
          <div className="relative w-[40px] shrink-0">
            <CardArt card={card} floating />
          </div>
          <div className="relative min-w-0 flex-1">
            <h3 className="font-display text-[15px] font-extrabold leading-tight">Already have this card?</h3>
            <p className="mt-0.5 text-[12.5px] font-semibold leading-snug text-sky-soft">Manage rewards, balance &amp; more.</p>
          </div>
          <Icon.Chevron size={20} className={`relative shrink-0 text-white/80 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {/* Light-blue body — quick actions as white tiles, revealed on expand */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 bg-sky-soft p-3">
                {items.map((it) => {
                  const ItIcon = (it.icon && Icon[it.icon]) || Icon.Spark
                  return (
                    <button
                      key={it.label}
                      onClick={it.onClick}
                      className="flex w-full items-center gap-3 rounded-tile bg-white px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(0,35,123,0.06)] ring-1 ring-line/60 transition-all hover:-translate-y-px hover:shadow-tile hover:ring-royal/40"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-soft text-royal">
                        <ItIcon size={17} />
                      </span>
                      <span className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug text-navy">{it.label}</span>
                      {it.value && (
                        <span className="shrink-0 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">{it.value}</span>
                      )}
                      {it.hint && <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-wide text-slatey">{it.hint}</span>}
                      <Icon.Chevron size={16} className="-rotate-90 shrink-0 text-royal" />
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function StickyApply({ card, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 lg:absolute"
        >
          <div className="phone-shell px-3 pb-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pl-3 shadow-sticky ring-1 ring-line backdrop-blur">
              <div className="flex h-11 w-16 shrink-0 items-center justify-center">
                <CardArt card={card} className="!aspect-auto h-full" />
              </div>
              <div className="min-w-0 flex-1">
                {/* Same benefit line as the listing tile — reads in full rather
                    than the terse "Up to 5%". */}
                <p className="line-clamp-2 text-[12.5px] font-bold leading-tight text-navy">{card.headline}</p>
              </div>
              <Link to={`/apply/${card.slug}`} className="btn-primary btn-lg bg-uobred px-7 hover:bg-uobred-600">Apply now</Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function RewardThumb({ id }) {
  const map = {
    airpods: { bg: '#F1F4F8', icon: '🎧' },
    cash: { bg: '#E7F6EE', icon: '💵' },
    miles: { bg: '#E8F0FB', icon: '✈️' },
    luggage: { bg: '#F6EEF2', icon: '🧳' },
  }
  const m = map[id] || map.cash
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-tile text-3xl" style={{ background: m.bg }}>
      {m.icon}
    </div>
  )
}

const fmt = (iso) => new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
