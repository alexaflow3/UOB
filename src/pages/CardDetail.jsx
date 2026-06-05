import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
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
  const crossSell = CARDS.find((c) => c.slug !== card.slug && c.tier === card.tier) || CARDS.find((c) => c.slug !== card.slug)

  return (
    <div className="pb-20">
      {/* Soft blue field matching the hero image's own background, fading into
          the page so the banner blends seamlessly (no rectangular seam). */}
      <div className="bg-[linear-gradient(180deg,#edf1f9_0%,#eef2f9_30%,#eef2f9_52%,#f5f5f5_100%)]">
        <div className="px-5 pt-3">
          <Link to="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-royal">
            <Icon.ArrowLeft size={16} /> All cards
          </Link>
        </div>

        {/* Card-first hero. Per head-of-design: the overline + headline always
            sit at the very top — above the card image — and the spend-category
            labels are rendered as legible HTML chips (not baked into the art). */}
        <section className="px-5 pt-4">
          {card.hero ? (
            <>
              <p className="eyebrow">{card.hero.eyebrow}</p>
              <h1 className="mt-2 font-display text-[24px] font-bold leading-[1.2] text-navy">{card.hero.headline}</h1>
            </>
          ) : (
            <>
              <span className="chip w-fit border-royal/20 bg-sky-soft text-royal">{card.tier}</span>
              <h1 className="mt-2 font-display text-[24px] font-extrabold leading-tight text-navy">{card.name}</h1>
              <p className="mt-1.5 max-w-[320px] text-[14px] font-medium leading-snug text-ink">{card.valueProp}</p>
            </>
          )}

          {/* Card image sits below the headline, floating on its own with a soft
              drop shadow and no framing container — every card now ships a
              transparent-edge PNG, so portrait and landscape faces alike float
              just like the One Card. Width follows the face's orientation. */}
          <div className={`mx-auto mt-6 ${isPortraitArt(card) ? 'w-[32%] max-w-[116px]' : 'w-[66%] max-w-[262px]'}`}>
            <motion.div initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <CardArt card={card} bare floating />
            </motion.div>
          </div>

          {/* Legible spend-category labels */}
          {card.heroLabels && (
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {card.heroLabels.map((l) => (
                <span key={l} className="rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-navy shadow-sm ring-1 ring-line">
                  {l}
                </span>
              ))}
            </div>
          )}

          {/* Benefit bullets */}
          {card.hero && (
            <>
              <ul className="mt-9 space-y-4">
                {card.hero.body.map((b) => (
                  <li key={b} className="flex gap-3 text-[15.5px] font-semibold leading-snug text-navy">
                    <Icon.Check size={19} className="mt-0.5 shrink-0 text-royal" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {card.hero.footnote && <p className="mt-4 text-[12px] text-slatey">{card.hero.footnote}</p>}
            </>
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

      {/* Value prop + fit — one consolidated section: the lifestyle hook flows
          straight into an honest "is this card right for you?" verdict and the
          good-fit / think-twice columns (comparison-site candour, merged in). */}
      {(card.story || card.fit) && (
        <>
          <div className="px-5 pt-10">
            <hr className="border-t border-line" />
          </div>
          <section className="px-5 pt-8">
            {card.story?.image && storyImage(card.story.image) && (
              <img
                src={storyImage(card.story.image)}
                alt={`${card.name} — everyday spending categories`}
                className="mb-5 w-full rounded-card object-cover"
              />
            )}
            {card.story && (
              <>
                <h2 className="font-display text-[20px] font-bold leading-tight text-navy">{card.story.heading}</h2>
                <div className="mt-4 space-y-3.5 text-[14px] leading-relaxed text-ink">
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

      {/* Single contextual related card (recommended-product tile) */}
      {crossSell && (
        <section className="px-5 pt-10">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slatey">You might also consider</h2>
          <Link to={`/cards/${crossSell.slug}`} className="surface flex items-center gap-3 p-3">
            <div className="w-[28%]"><CardArt card={crossSell} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-navy">{crossSell.name}</p>
              <p className="text-[12px] leading-snug text-slatey">{crossSell.bestFor}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                // Picking a cross-sell card to compare implies comparing it
                // against the card you're currently viewing — so auto-add this
                // page's card too (no-op if already selected).
                if (!has(crossSell.slug)) add(card.slug)
                toggle(crossSell.slug)
              }}
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

// Secondary benefits — a second tier of value below the headline earn story.
// Rendered as labelled tiles so each perk reads as its own scannable item.
function SecondaryBenefits({ items, heading }) {
  return (
    <section className="px-5 pt-10">
      <h2 className="font-display text-[20px] font-bold leading-tight text-navy">
        {heading || 'More reasons to love this card'}
      </h2>
      <div className="mt-4 grid gap-3">
        {items.map((it) => {
          const ItIcon = (it.icon && Icon[it.icon]) || Icon.Spark
          return (
          <div key={it.title} className="flex gap-3.5 rounded-card bg-white p-4 ring-1 ring-line/70">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-tile bg-sky-soft text-royal">
              <ItIcon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold leading-tight text-navy">{it.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink">{it.body}</p>
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
    <section className="px-5 pt-10">
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
    <section className="px-5 pt-10">
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
    <section className="px-5 pt-10">
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
