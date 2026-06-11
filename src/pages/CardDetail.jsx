import { useState, useRef, useEffect } from 'react'
import { Link, useParams, Navigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBySlug, CARDS, PROMOS } from '../data/cards'
import CardArt, { isPortraitArt } from '../components/CardArt'
import { Icon } from '../lib/icons'
import { useCompare } from '../lib/compare'

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
      // Keep the headline rate AND its condition both legible (ONE Card caveat).
      condition: card.promoBanner.condition
        || 'New cardmembers only, for your first spend quarter. After that, earn the standard rate. T&Cs apply.',
      rewardImage: null,
    }
  }
  return null
}

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
    const el = heroCtaRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [slug])

  // Value-prop H1 + card-name eyebrow, whether or not a bespoke `hero` exists.
  const eyebrow = card.hero?.eyebrow || `${card.name.toUpperCase()} CREDIT CARD`
  const headline = card.hero?.headline || card.valueProp || card.headline
  const bullets = card.hero?.body || card.highlights?.slice(0, 3) || []

  // Two hero variants: product-first (organic / direct) vs reward-first (paid
  // entry, ?from=offer) where the offer leads above the fold.
  const [params] = useSearchParams()
  const reward = getReward(card)
  const rewardFirst = params.get('from') === 'offer' && Boolean(reward)

  // In-page scroll (HashRouter makes href="#id" navigate, so scroll via JS).
  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          <Link to="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-white/80 hover:text-white">
            <Icon.ArrowLeft size={16} /> All cards
          </Link>
        </div>

        {/* Card-first hero. Larger card face (key UOB brand asset). Two leads:
            product-first (organic) or reward-first (paid entry, ?from=offer). */}
        <section className="px-5 pt-4">
          {rewardFirst ? (
            <>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-[#F09252] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#3a1c00]">
                <Icon.Spark size={13} /> {reward.eyebrow}
              </p>
              <h1 className="mt-3 font-display text-[26px] font-extrabold leading-[1.15] text-white">{reward.big}</h1>
              <p className="mt-2.5 text-[13.5px] leading-snug text-white/65">{reward.condition}</p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky">{eyebrow}</p>
              <h1 className="mt-2 font-display text-[24px] font-bold leading-[1.2] text-white">{headline}</h1>
            </>
          )}

          {/* Floating card face — larger so the brand asset leads. */}
          <div className={`mx-auto mt-6 ${isPortraitArt(card) ? 'w-[44%] max-w-[164px]' : 'w-[80%] max-w-[300px]'}`}>
            <motion.div initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <CardArt card={card} bare floating />
            </motion.div>
          </div>

          {/* Product-first: spend-category chips + benefit bullets. */}
          {!rewardFirst && card.heroLabels && (
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {card.heroLabels.map((l) => (
                <span key={l} className="rounded-full bg-white/10 px-3.5 py-2 text-[12px] font-semibold text-white ring-1 ring-white/20">
                  {l}
                </span>
              ))}
            </div>
          )}
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

          {/* Reward teaser — product-first only; scrolls DOWN to the on-page
              reward module, never routes to the form (section 3). */}
          {!rewardFirst && reward && (
            <button
              onClick={() => scrollToId('reward')}
              className="mt-7 flex w-full items-center gap-3 rounded-card bg-white/10 px-4 py-3 text-left ring-1 ring-white/15 hover:bg-white/15"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F09252] text-[#3a1c00]">
                <Icon.Spark size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-[#ffc499]">{reward.eyebrow}</span>
                <span className="block truncate text-[14px] font-bold text-white">{reward.big}</span>
              </span>
              <Icon.Chevron size={18} className="shrink-0 text-white/70" />
            </button>
          )}

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

          {/* T&Cs apply → opens the product factsheet PDF (2.4). */}
          <p className="mt-4 text-[12px] text-white/55">
            <a
              href={tcHref}
              {...(factsheet ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="underline underline-offset-2 hover:text-white/80"
            >
              T&amp;Cs apply
            </a>
          </p>
        </section>

        {/* Anchor links — jump to the sections that matter. */}
        <div id="card-details" className="scroll-mt-4 px-5">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 pb-7 text-[12.5px] font-semibold text-sky">
            {reward && <button onClick={() => scrollToId('reward')} className="hover:text-white">Rewards</button>}
            <button onClick={() => scrollToId('eligibility')} className="hover:text-white">Eligibility</button>
            <button onClick={() => scrollToId('fees')} className="hover:text-white">Fees &amp; charges</button>
          </div>
        </div>
      </div>

      {/* Sign-up reward, ON the page — immediately after the hero (section 3). */}
      {reward && <RewardModule reward={reward} card={card} />}

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
        <BenefitsSection benefits={card.benefits} />
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

// On-page sign-up reward (section 3): the reward lives here on the page; the
// hero CTA scrolls to it instead of routing away to the form. Shows the reward
// AND its condition both legible (ONE Card "20% / first-quarter" caveat).
function RewardModule({ reward, card }) {
  const photo = rewardPhoto(reward.rewardImage)
  return (
    <section id="reward" className="scroll-mt-3 bg-[#0c2647] px-5 py-9 text-white">
      <p className="inline-flex items-center gap-1.5 rounded-full bg-[#F09252] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#3a1c00]">
        <Icon.Spark size={13} /> {reward.eyebrow}
      </p>

      <div className="mt-4 overflow-hidden rounded-card bg-white/[0.06] ring-1 ring-white/10">
        {reward.rewardImage && (
          <div className="grid aspect-[2.4/1] place-items-center overflow-hidden" style={{ background: REWARD_BG[reward.rewardImage] || REWARD_BG.cash }}>
            {photo
              ? <img src={photo} alt={reward.big} className="max-h-[80%] max-w-[55%] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.4)]" />
              : <span className="text-[56px]">{{ airpods: '🎧', miles: '✈️', luggage: '🧳', cash: '💵' }[reward.rewardImage] || '🎁'}</span>}
          </div>
        )}
        <div className="p-5">
          <h2 className="font-display text-[22px] font-extrabold leading-tight text-white">{reward.big}</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{reward.condition}</p>
          {reward.endsSoon && reward.validUntil && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-uobred/20 px-3 py-1 text-[12px] font-bold text-[#ff9a9a]">
              <Icon.Clock size={13} /> Ends {fmt(reward.validUntil)}
            </p>
          )}
          <Link to={`/apply/${card.slug}`} className="btn-primary btn-lg mt-5 flex w-full bg-uobred hover:bg-uobred-600">
            Apply &amp; claim this offer
          </Link>
        </div>
      </div>
    </section>
  )
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

// Auto-rotating feature highlights — the card's headline earn features rotate
// in a carousel (Jun-10: "use a carousel so the user sees benefits rotating,
// in the features section, not the hero").
function FeatureCarousel({ tiles }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (tiles.length <= 1) return undefined
    const id = setInterval(() => setI((p) => (p + 1) % tiles.length), 3200)
    return () => clearInterval(id)
  }, [tiles.length])
  if (!tiles.length) return null
  const t = tiles[Math.min(i, tiles.length - 1)]
  return (
    <div className="mt-5 overflow-hidden rounded-card bg-[linear-gradient(135deg,#0a2240,#143a6b)] text-white">
      <div className="relative h-[118px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col justify-center px-5"
          >
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-sky">{t.title}</p>
            <p className="mt-1.5 text-[16.5px] font-bold leading-snug text-white">{t.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {tiles.map((s, d) => (
          <span key={s.title} className={`h-1.5 rounded-full transition-all ${d === i ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`} />
        ))}
      </div>
    </div>
  )
}

// Benefits restructured into category tabs. Cashback leads; each tab holds
// labelled tiles. A collapsible "how you earn" accordion carries the long detail.
function BenefitsSection({ benefits }) {
  const [active, setActive] = useState(0)
  const tab = benefits.tabs[active]
  return (
    <section id="benefits" className="scroll-mt-20 px-5 pt-8">
      <p className="eyebrow">{benefits.eyebrow}</p>
      <h2 className="mt-1.5 font-display text-[22px] font-bold leading-tight text-navy">{benefits.heading}</h2>

      {/* Rotating highlights of the headline earn features. */}
      <FeatureCarousel tiles={benefits.tabs[0].tiles.slice(0, 6)} />

      {/* Category tabs */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {benefits.tabs.map((t, i) => (
          <button key={t.label} onClick={() => setActive(i)} className={`chip shrink-0 ${active === i ? 'chip-active' : ''}`}>
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
