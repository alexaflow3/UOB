import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cardBySlug } from '../data/cards'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'

// Celebratory confetti burst from the success check (slide 9). Deterministic
// pieces (no Math.random so it renders identically every time), looping so the
// moment stays capturable for the deck and lively in the reel.
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const palette = ['#fb002c', '#005eb8', '#0084ff', '#B68A3E', '#ffffff', '#33b1ff']
  const dir = i % 2 ? 1 : -1
  const spread = 34 + (i % 6) * 22
  return {
    x: dir * spread * (0.6 + (i % 4) * 0.2),
    up: 46 + ((i * 31) % 78),
    down: 150 + ((i * 53) % 90),
    rot: ((i * 71) % 360) + 240,
    color: palette[i % palette.length],
    round: i % 3 === 0,
    delay: (i % 7) * 0.05,
  }
})

function Confetti() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-0 w-0">
      {CONFETTI.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            width: p.round ? 8 : 6,
            height: p.round ? 8 : 11,
            background: p.color,
            borderRadius: p.round ? 9999 : 1,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
          animate={{ x: [0, p.x * 0.7, p.x], y: [0, -p.up, p.down], opacity: [0, 1, 1, 0], scale: [0.4, 1, 1], rotate: p.rot }}
          transition={{ duration: 1.7, delay: p.delay, repeat: Infinity, repeatDelay: 1.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Deck mockup screens (Stage 2 response, slides 3 / 4 / 8 / 9).
//
// These replace the crude "indicative mockup" wireframes in the slide deck with
// real, design-system-quality phone screens that can be screenshotted straight
// into the deck. Each one demonstrates a single concept from the FINAL response
// document:
//   servicing  — slide 3 — the "Already have this card" component (existing customer)
//   question   — slide 4 — question-led, answer-first card page (built for AI search)
//   prototype  — slide 8 — one real card page, three journeys (proof before rollout)
//   bundle     — slide 9 — CASA cross-sell: add a One Account to unlock the full rate
//
// Rendered OUTSIDE the app chrome (no global header / bottom nav) so a 375-wide
// screenshot is exactly the phone content the deck needs. Screenshot at the
// mobile preset (375×812).
// ─────────────────────────────────────────────────────────────────────────────

// Self-contained device screen.
function Screen({ children }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[420px] bg-mist font-sans text-ink">
      {children}
    </div>
  )
}

// Navy product header — the card identity bar that anchors every card page.
function ProductHeader({ card, kicker, title }) {
  return (
    <header className="relative overflow-hidden bg-navy px-5 pb-5 pt-6 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: 'radial-gradient(120% 90% at 85% -10%, #0e3a78 0%, transparent 60%)' }}
      />
      <div className="relative flex items-center gap-3.5">
        <div className="w-[68px] shrink-0">
          <CardArt card={card} className="!w-full" floating />
        </div>
        <div className="min-w-0">
          {kicker && <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky">{kicker}</p>}
          <h1 className="mt-0.5 font-display text-[19px] font-extrabold leading-tight">{title}</h1>
        </div>
      </div>
    </header>
  )
}

// A stacked component row. `tone`:
//   'primary'  — the highlighted, in-focus component (royal ring + sky tint)
//   'muted'    — present but lower-priority
//   'plain'    — neutral white card
function Row({ tone = 'plain', eyebrow, title, sub, cta, ctaTone = 'royal', children }) {
  const shell =
    tone === 'primary'
      ? 'border-2 border-royal bg-sky-soft shadow-[0_10px_30px_-14px_rgba(0,94,184,0.5)]'
      : tone === 'muted'
        ? 'border border-line bg-white/70'
        : 'border border-line bg-white'
  const ctaCls =
    ctaTone === 'red'
      ? 'bg-uobred text-white'
      : ctaTone === 'navy'
        ? 'bg-navy text-white'
        : 'bg-royal text-white'
  return (
    <div className={`rounded-card p-4 ${shell}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${tone === 'muted' ? 'text-slatey' : 'text-royal'}`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`font-display text-[15.5px] font-bold leading-tight ${tone === 'muted' ? 'text-slatey' : 'text-navy'}`}>
            {title}
          </h2>
          {sub && <p className="mt-1 text-[12.5px] leading-snug text-slatey">{sub}</p>}
        </div>
        {cta && (
          <span className={`shrink-0 rounded-btn px-4 py-2 text-[12.5px] font-bold ${ctaCls}`}>{cta}</span>
        )}
      </div>
      {children}
    </div>
  )
}

// ── Slide 3 — "Already have this card" ──────────────────────────────────────
function Servicing() {
  const card = cardBySlug('ladys-card')
  const cats = ['Beauty & Wellness', 'Dining', 'Fashion', 'Family', 'Transport', 'Travel']
  return (
    <Screen>
      <ProductHeader card={card} kicker="UOB Lady's Card" title="Rewards on the category you love" />
      <div className="space-y-3 px-5 py-5">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-royal">
          <Icon.CheckCircle size={15} /> Recognised as a cardholder — here's your card
        </p>

        <Row tone="muted" eyebrow="New here?" title="Apply for this card" sub="Eligibility · benefits · apply" cta="View" />

        <Row
          tone="primary"
          eyebrow="Already have this card?"
          title="Change your rewards category"
          sub="The same place on every card page — jump straight to your task."
          cta="Open"
        >
          <div className="mt-3.5 rounded-tile border border-royal/30 bg-white p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slatey">Your 10X category this quarter</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cats.map((c) => (
                <span
                  key={c}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    c === 'Dining' ? 'bg-royal text-white' : 'border border-line bg-mist text-slatey'
                  }`}
                >
                  {c === 'Dining' && '✓ '}
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-2.5 text-[12px] leading-snug text-ink">
              You're earning <b className="text-navy">10X UNI$ (4 miles / S$1)</b> on Dining. Switch any quarter in UOB&nbsp;TMRW.
            </p>
          </div>
        </Row>

        <Row tone="plain" title="Card details &amp; T&amp;Cs" sub="Full rates, fees and terms" cta="View" ctaTone="navy" />
      </div>
    </Screen>
  )
}

// ── Slide 4 — Question-led, answer-first ────────────────────────────────────
function Question() {
  const card = cardBySlug('one-card')
  return (
    <Screen>
      <ProductHeader card={card} kicker="UOB One Card" title="Get the highest cashback on your daily spend" />
      <div className="px-5 py-5">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-royal">
          <Icon.Spark size={15} /> Answer-first — built for AI search &amp; real questions
        </p>

        <div className="mt-3 space-y-3">
          <Row
            tone="primary"
            eyebrow="Is this card right for me?"
            title="Yes — if you spend across everyday categories."
            sub="Up to 5% cashback when you spend S$500+ a month, plus 0.3% on everything else with no cap."
            cta="Apply"
            ctaTone="red"
          />

          <Row
            tone="plain"
            eyebrow="Do I qualify?"
            title="Self-check your eligibility at a glance."
            sub="S$30,000/yr income (S$40,000 for non-residents), age 21+, Singaporean or PR. ~5 mins with Singpass."
          />

          <Row
            tone="plain"
            eyebrow="How is cashback calculated?"
            title="Up to 10% on selected categories, credited quarterly."
            sub="Grab, Shopee, McDonald's and SimplyGo, when you spend S$600–S$2,000 a month across at least 10 transactions."
          />
        </div>
      </div>
    </Screen>
  )
}

// ── Slide 8 — One real page, three journeys ─────────────────────────────────
function Prototype() {
  const card = cardBySlug('one-card')
  const journeys = [
    {
      tone: 'plain',
      eyebrow: 'New customer',
      title: 'Discover, compare, apply',
      sub: 'Value, eligibility and a one-tap path to Apply — for visitors who don’t have a card yet.',
      cta: 'Start',
      ctaTone: 'red',
    },
    {
      tone: 'primary',
      eyebrow: 'Existing cardholder',
      title: 'Find a task, change rewards category',
      sub: 'The “already have this card” lane — same spot on every page, straight to the task.',
      cta: 'Open',
      ctaTone: 'royal',
    },
    {
      tone: 'plain',
      eyebrow: 'Self-service',
      title: 'Ask a question, get the answer inline',
      sub: 'Answer-first content the assistant can cite — the hub catches what it can’t.',
      cta: 'Ask',
      ctaTone: 'navy',
    },
  ]
  return (
    <Screen>
      <ProductHeader card={card} kicker="Prototype — UOB One Card" title="One real page · three journeys" />
      <div className="px-5 py-5">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-royal">
          <Icon.Spark size={15} /> Live &amp; clickable, on your design system — shared via protected link
        </p>
        <div className="mt-3 space-y-3">
          {journeys.map((j) => (
            <Row key={j.eyebrow} {...j} />
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-slatey">
          No duplicate pages, no extra build per card — one template, three reading orders.
        </p>
      </div>
    </Screen>
  )
}

// ── Slide 9 — CASA cross-sell as the post-application confirmation page ──────
// The transaction just happened: the customer finished applying for the One
// Card. Now — and only now — the One Account is offered as the well-timed add-on
// to a decision already made (response doc Q3.3), not a mid-page interruption.
function Bundle() {
  const card = cardBySlug('one-card')
  return (
    <Screen>
      {/* Confirmation — the application just completed. Same hero gradient as the
          card pages, with a celebratory confetti burst from the success check. */}
      <header className="relative overflow-hidden bg-[linear-gradient(180deg,#0a2240_0%,#0a2240_60%,#0c2647_100%)] px-5 pb-10 pt-12 text-center text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(90% 70% at 50% 2%, rgba(0,132,255,0.30), transparent 62%)' }}
        />
        <div className="relative mx-auto h-20 w-20">
          <Confetti />
          <div className="absolute inset-0 rounded-full bg-sky/30 blur-2xl" />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
            className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#3aa8ff] to-[#005eb8] shadow-[0_14px_34px_-6px_rgba(0,132,255,0.7)] ring-4 ring-white/15"
          >
            <Icon.Check size={38} className="text-white" />
          </motion.div>
        </div>
        <p className="relative mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-sky">Application submitted</p>
        <h1 className="relative mt-1.5 font-display text-[24px] font-extrabold leading-tight">You’re all set, Tanya.</h1>
        <p className="relative mx-auto mt-2 max-w-[290px] text-[13px] leading-snug text-white/70">
          Your UOB One Card application is in — we’ll confirm within 3 working days.
        </p>
        <p className="relative mt-3.5 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/80">
          Ref · UOB-ONE-4827193
        </p>
      </header>

      <div className="px-5 pb-28 pt-7">
        {/* The well-timed add-on */}
        <p className="eyebrow">One last thing</p>
        <h2 className="mt-1.5 font-display text-[20px] font-extrabold leading-tight text-navy">
          Add a One Account to unlock the full rate
        </h2>

        {/* Now vs. both — the gap is the hook */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-tile bg-mist p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slatey">Card alone</p>
            <p className="mt-1.5 text-[16px] font-extrabold text-navy">Up to 5%</p>
            <p className="text-[12px] leading-snug text-slatey">cashback on everyday spend</p>
          </div>
          <div className="rounded-tile border border-royal/30 bg-sky-soft p-3.5 ring-1 ring-royal/10">
            <p className="text-[10px] font-bold uppercase tracking-wide text-royal">Card + account</p>
            <p className="mt-1.5 text-[16px] font-extrabold text-navy">5% + 3.4% p.a.</p>
            <p className="text-[12px] leading-snug text-slatey">cashback plus bonus interest</p>
          </div>
        </div>

        <p className="mt-3.5 text-[12.5px] leading-snug text-slatey">
          Earn the bonus interest when you spend min. S$500/month and credit your salary or make 3 GIRO payments.
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-royal">
          <Icon.Check size={15} /> Pre-filled from your application — no re-entering details.
        </p>
      </div>

      {/* Sticky CTA shelf — same pattern as the apply flow, two actions side by side */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-5 pb-4 pt-3 shadow-[0_-10px_28px_rgba(10,34,64,0.12)] backdrop-blur">
        <div className="mx-auto flex max-w-[420px] items-center gap-3">
          <button className="btn-secondary btn-lg flex-1">Maybe later</button>
          <button className="btn-primary btn-lg flex-1 bg-uobred hover:bg-uobred-600">Add account</button>
        </div>
      </div>
    </Screen>
  )
}

const SCREENS = {
  servicing: { label: 'Slide 3 · Already have this card', el: Servicing },
  question: { label: 'Slide 4 · Question-led page', el: Question },
  prototype: { label: 'Slide 8 · Three journeys', el: Prototype },
  bundle: { label: 'Slide 9 · Add a One Account', el: Bundle },
}

export default function Mockups() {
  const { kind } = useParams()
  const entry = SCREENS[kind]
  if (entry) {
    const El = entry.el
    return <El />
  }
  // Index — quick links to each screen.
  return (
    <div className="mx-auto min-h-screen max-w-[420px] bg-mist px-5 py-8 font-sans">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-royal">Stage 2 — deck mockups</p>
      <h1 className="mt-1 font-display text-[22px] font-extrabold text-navy">Screens for slides 3, 4, 8 &amp; 9</h1>
      <div className="mt-5 space-y-2.5">
        {Object.entries(SCREENS).map(([k, v]) => (
          <Link
            key={k}
            to={`/mockup/${k}`}
            className="flex items-center justify-between rounded-card border border-line bg-white p-4 text-[14px] font-semibold text-navy shadow-tile"
          >
            {v.label}
            <Icon.Arrow size={16} className="text-royal" />
          </Link>
        ))}
      </div>
    </div>
  )
}
