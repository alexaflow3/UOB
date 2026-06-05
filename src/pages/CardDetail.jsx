import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBySlug, CARDS, PROMOS } from '../data/cards'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'
import { useCompare } from '../lib/compare'

// Hero banner images (card floating with category labels), keyed by card
const HERO_BANNERS = import.meta.glob('../assets/hero-*.png', { eager: true, import: 'default' })
const heroBanner = (key) => HERO_BANNERS[`../assets/hero-${key}.png`]

// Story / value-prop lifestyle images, keyed by card
const STORY_IMAGES = import.meta.glob('../assets/story-*.png', { eager: true, import: 'default' })
const storyImage = (key) => STORY_IMAGES[`../assets/story-${key}.png`]

// Card Product Page — the main decision-making surface.
// Implements: at-a-glance summary above the fold (earnings/fees/eligibility/
// next steps), card-first hero, eligibility upfront, tabbed benefits, sticky
// Apply, FAQ accordion, and ONE contextual cross-sell (not 7-8 stacked blocks).
export default function CardDetail() {
  const { slug } = useParams()
  const card = cardBySlug(slug)
  const { has, toggle } = useCompare()
  if (!card) return <Navigate to="/" replace />

  const tabKeys = Object.keys(card.benefitTabs)
  const relatedPromo = PROMOS.find((p) => p.cards.includes(card.slug))
  const crossSell = CARDS.find((c) => c.slug !== card.slug && c.tier === card.tier) || CARDS.find((c) => c.slug !== card.slug)

  return (
    <div className="pb-20">
      {/* Soft blue field matching the hero image's own background, fading into
          the page so the banner blends seamlessly (no rectangular seam). */}
      <div className={card.heroBanner ? 'bg-[linear-gradient(180deg,#edf1f9_0%,#eef2f9_30%,#eef2f9_52%,#f5f5f5_100%)]' : ''}>
        <div className="px-5 pt-3">
          <Link to="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-royal">
            <Icon.ArrowLeft size={16} /> All cards
          </Link>
        </div>

        {/* Card-first hero: the card + its core benefit lead (not a promotion).
            Benefit headline above the fold, card name as eyebrow, key earn rates,
            eligibility + Apply right beside it. */}
        <section className="px-5 pt-4">
        {card.heroBanner && heroBanner(card.heroBanner) ? (
          <motion.img
            src={heroBanner(card.heroBanner)}
            alt={`${card.name} — earn on everyday spend`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="-mx-5 w-[calc(100%+2.5rem)] max-w-none [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_7%,#000_84%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_7%,#000_84%,transparent_100%)]"
          />
        ) : (
          <div className="mx-auto w-[64%] max-w-[230px]">
            <motion.div initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <CardArt card={card} floating />
            </motion.div>
          </div>
        )}
        {card.hero ? (
          <div className="mt-7">
            <p className="eyebrow">{card.hero.eyebrow}</p>
            <h1 className="mt-2 font-display text-[24px] font-bold leading-[1.2] text-navy">{card.hero.headline}</h1>
            <ul className="mt-5 space-y-3">
              {card.hero.body.map((b) => (
                <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-ink">
                  <Icon.Check size={16} className="mt-1 shrink-0 text-royal" />
                  {b}
                </li>
              ))}
            </ul>
            {card.hero.footnote && <p className="mt-4 text-[12px] text-slatey">{card.hero.footnote}</p>}
          </div>
        ) : (
          <div className="mt-5 text-center">
            <span className="chip mx-auto w-fit border-royal/20 bg-sky-soft text-royal">{card.tier}</span>
            <h1 className="mt-2 font-display text-[24px] font-extrabold leading-tight text-navy">{card.name}</h1>
            <p className="mx-auto mt-1.5 max-w-[300px] text-[14px] font-medium leading-snug text-ink">{card.valueProp}</p>
          </div>
        )}
        </section>
      </div>

      {/* UDS promotion-banner — full-bleed blue band, 28px white icon, inline link */}
      {card.promoBanner && <PromotionBanner banner={card.promoBanner} href={`/apply/${card.slug}`} />}

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

      {/* Value prop — why this fits how you spend */}
      {card.story && (
        <>
          <div className="px-5 pt-10">
            <hr className="border-t border-line" />
          </div>
          <section className="px-5 pt-8">
            {card.story.image && storyImage(card.story.image) && (
              <img
                src={storyImage(card.story.image)}
                alt={`${card.name} — everyday spending categories`}
                className="mb-5 w-full rounded-card object-cover"
              />
            )}
            <h2 className="font-display text-[20px] font-bold leading-tight text-navy">{card.story.heading}</h2>
            <div className="mt-4 space-y-3.5 text-[14px] leading-relaxed text-ink">
              {card.story.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
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

      {/* Contextual cross-sell — ONE related promo, only if relevant */}
      {relatedPromo && (
        <section className="px-5 pt-7">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">Current offer</h2>
          <Link to="/promotions" className="surface flex items-center gap-3 overflow-hidden p-3">
            <RewardThumb id={relatedPromo.rewardImage} />
            <div className="min-w-0 flex-1">
              {relatedPromo.endsSoon && (
                <span className="inline-flex items-center gap-1 rounded-full bg-uobred/10 px-2 py-0.5 text-[10px] font-bold text-uobred">
                  <Icon.Clock size={11} /> Ends {fmt(relatedPromo.validUntil)}
                </span>
              )}
              <p className="mt-1 text-[14px] font-bold leading-tight text-navy">{relatedPromo.benefit}</p>
              <p className="text-[12px] text-slatey">{relatedPromo.condition}</p>
            </div>
            <Icon.Arrow size={18} className="shrink-0 text-royal" />
          </Link>
        </section>
      )}

      {/* Product document — buried PDF reimagined as a readable HTML page */}
      <section className="px-5 pt-7">
        <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">Fees &amp; full terms</h2>
        <Link to={`/cards/${card.slug}/document`} className="surface flex items-center gap-3 p-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-tile bg-uobred/10 text-uobred">
            <Icon.Doc size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold leading-tight text-navy">Product factsheet</p>
            <p className="text-[12px] leading-snug text-slatey">Fees, rates &amp; key terms — answers up top, full legal text below</p>
          </div>
          <Icon.Arrow size={18} className="shrink-0 text-royal" />
        </Link>
      </section>

      {/* FAQ accordion (sourced from top call-centre questions) */}
      <section className="px-5 pt-7">
        <h2 className="font-display text-[19px] font-bold text-navy">Common questions</h2>
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-card bg-white ring-1 ring-line/70">
          {card.faqs.map((f, i) => (
            <Faq key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* Single contextual related card (recommended-product tile) */}
      {crossSell && (
        <section className="px-5 pt-7">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">You might also compare</h2>
          <Link to={`/cards/${crossSell.slug}`} className="surface flex items-center gap-3 p-3">
            <div className="w-[28%]"><CardArt card={crossSell} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-navy">{crossSell.name}</p>
              <p className="text-[12px] leading-snug text-slatey">{crossSell.bestFor}</p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); toggle(crossSell.slug) }}
              className={`btn btn-md border ${has(crossSell.slug) ? 'border-royal bg-sky-soft text-royal' : 'border-line text-slatey'}`}
            >
              {has(crossSell.slug) ? <Icon.Check size={16} /> : <Icon.Scales size={16} />}
            </button>
          </Link>
        </section>
      )}

      {/* Sticky apply (Alexa #4) — always one click from applying */}
      <StickyApply card={card} />
    </div>
  )
}

// UDS promotion-banner: full-bleed UOB-blue band, 28px white icon at left,
// white body copy with an inline underlined link. Copy capped at 100 chars.
function PromotionBanner({ banner, href }) {
  return (
    <section className="mt-10 bg-royal">
      <div className="flex items-start gap-3.5 px-5 py-4 text-white">
        <Icon.Coin size={28} className="mt-0.5 shrink-0" />
        <p className="text-[14px] leading-relaxed">
          {banner.text}{' '}
          <Link to={href} className="font-semibold underline underline-offset-2 decoration-1 hover:opacity-90">
            {banner.cta}
          </Link>
        </p>
      </div>
    </section>
  )
}

function GlanceTable({ glance }) {
  return (
    <section id="glance" className="scroll-mt-20 px-5 pt-10">
      <h2 className="font-display text-[20px] font-bold leading-tight text-navy">{glance.heading}</h2>
      <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-card bg-white ring-1 ring-line/70">
        {glance.rows.map((row) => (
          <div key={row.label} className="flex gap-4 px-5 py-5">
            <p className="w-[32%] shrink-0 text-[13px] font-bold text-navy">{row.label}</p>
            <div className="min-w-0 flex-1">
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
          </div>
        ))}
      </div>
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
function BenefitsSection({ benefits }) {
  const [active, setActive] = useState(0)
  const tab = benefits.tabs[active]
  return (
    <section id="benefits" className="scroll-mt-20 px-5 pt-8">
      <p className="eyebrow">{benefits.eyebrow}</p>
      <h2 className="mt-1.5 font-display text-[22px] font-bold leading-tight text-navy">{benefits.heading}</h2>

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
          {tab.tiles.map((tile) => (
            <div key={tile.title} className="rounded-card bg-white p-4 ring-1 ring-line/70">
              <p className="text-[14px] font-bold text-navy">{tile.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{tile.body}</p>
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

function StickyApply({ card }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:absolute">
      <div className="phone-shell px-3 pb-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pl-4 shadow-sticky ring-1 ring-line backdrop-blur">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-slatey">{card.name}</p>
            <p className="text-[13px] font-bold text-navy">{card.earn.rate} · {card.fees.waiver}</p>
          </div>
          <Link to={`/apply/${card.slug}`} className="btn-primary btn-lg bg-uobred px-7 hover:bg-uobred-600">Apply now</Link>
        </div>
      </div>
    </div>
  )
}

function RewardThumb({ id }) {
  const map = {
    airpods: { bg: '#F1F4F8', icon: '🎧' },
    cash: { bg: '#E7F6EE', icon: '💵' },
    miles: { bg: '#E8F0FB', icon: '✈️' },
    dyson: { bg: '#F6EEF2', icon: '💨' },
  }
  const m = map[id] || map.cash
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-tile text-3xl" style={{ background: m.bg }}>
      {m.icon}
    </div>
  )
}

const fmt = (iso) => new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
