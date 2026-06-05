import { useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBySlug } from '../data/cards'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'
import uobLogo from '../assets/uob-logo.png'

// Application form (Kamil + Alexa + Jat Leng):
// - Hero states what the form is for at first glance
// - Step indicator with steps left + time estimate (set expectations early)
// - Qualify-before-the-form gate so users self-qualify & gather documents
// - Singpass MyInfo path, inline validation, plain-English copy
// - Cross-sell is SKIPPABLE and arrives only when the application is nearly done
// - Distraction-reduced layout (trimmed header/footer, no competing nav)
const STEPS = ['Eligibility', 'How to apply', 'Your details', 'Review']
const TIME_PER_STEP = [1, 1, 2, 1] // minutes

export default function Apply() {
  const { slug } = useParams()
  const card = cardBySlug(slug)
  const [step, setStep] = useState(0)
  if (!card) return <Navigate to="/" replace />

  const minsLeft = TIME_PER_STEP.slice(step).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-mist">
      {/* Trimmed header — wordmark, secure badge, exit. No competing nav. */}
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <Link to={`/cards/${slug}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-slatey hover:text-navy">
            <Icon.ArrowLeft size={16} /> Back
          </Link>
          <img src={uobLogo} alt="UOB" className="h-[22px] w-auto" />
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slatey">
            <Icon.Lock size={14} className="text-royal" /> Secure
          </span>
        </div>

        {/* Progress + expectations */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-navy">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
            <span className="flex items-center gap-1 text-slatey"><Icon.Clock size={13} /> ~{minsLeft} min left</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <motion.div className="h-full rounded-full bg-royal" initial={false} animate={{ width: i <= step ? '100%' : '0%' }} transition={{ duration: 0.35 }} />
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            {step === 0 && <StepEligibility card={card} onNext={() => setStep(1)} />}
            {step === 1 && <StepMethod card={card} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
            {step === 2 && <StepDetails onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <StepReview card={card} onBack={() => setStep(2)} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Step 1: Qualify before the form ---------- */
function StepEligibility({ card, onNext }) {
  const checks = [
    { label: `You earn at least ${card.eligibility.income} a year`, sub: 'Annual income before CPF' },
    { label: `You are aged ${card.eligibility.age} or above`, sub: null },
    { label: `You are a ${card.eligibility.residency}`, sub: 'Foreigners need a different form' },
  ]
  const docs = ['NRIC (front & back)', 'Latest income proof or CPF statement', 'Singpass login']
  const [ok, setOk] = useState([false, false, false])
  const allOk = ok.every(Boolean)

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto w-[15%] max-w-[58px]"><CardArt card={card} bare /></div>
        <h1 className="mt-4 font-display text-[22px] font-extrabold leading-tight text-navy">Apply for the {card.name.replace('UOB ', '')}</h1>
        <p className="mt-1.5 text-[14px] text-slatey">Takes about 5 minutes. Let's first check you qualify.</p>
      </div>

      <section className="surface p-5">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-slatey">Confirm you qualify</h2>
        <div className="mt-4 space-y-3">
          {checks.map((c, i) => (
            <button
              key={i}
              onClick={() => setOk((cur) => cur.map((v, idx) => (idx === i ? !v : v)))}
              className={`flex w-full items-start gap-3 rounded-tile border p-3.5 text-left transition-colors ${ok[i] ? 'border-royal bg-sky-soft' : 'border-line bg-white'}`}
            >
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${ok[i] ? 'border-royal bg-royal text-white' : 'border-line'}`}>
                {ok[i] && <Icon.Check size={13} />}
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-navy">{c.label}</span>
                {c.sub && <span className="block text-[12px] text-slatey">{c.sub}</span>}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-card bg-white p-5 ring-1 ring-line/70">
        <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-slatey">
          <Icon.Doc size={16} /> Have these ready
        </h2>
        <ul className="mt-3 space-y-2.5">
          {docs.map((d) => (
            <li key={d} className="flex items-center gap-2.5 text-[14px] text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-royal" /> {d}
            </li>
          ))}
        </ul>
      </section>

      <button disabled={!allOk} onClick={onNext} className="btn-primary btn-lg w-full disabled:opacity-50">
        {allOk ? 'Continue' : 'Confirm all three to continue'}
        {allOk && <Icon.Arrow size={18} />}
      </button>
      <p className="text-center text-[12px] text-slatey">Next: choose how you’d like to apply.</p>
    </div>
  )
}

/* ---------- Step 2: How would you like to apply? ---------- */
function StepMethod({ card, onBack, onNext }) {
  const [method, setMethod] = useState(null)
  const [fatca, setFatca] = useState(false)
  const [showFine, setShowFine] = useState(false)
  const ready = method && fatca

  const groups = [
    {
      name: 'Singpass',
      time: '3–5 min',
      note: 'For Singaporeans & PRs',
      recommended: true,
      items: [
        { id: 'myinfo', label: 'Retrieve my details with Myinfo', sub: 'Fastest — we fill in the form for you' },
      ],
    },
    {
      name: 'UOB internet banking',
      time: '2–3 min',
      note: 'For existing UOB customers',
      items: [
        { id: 'ib-user', label: 'Log in with username & password' },
        { id: 'ib-card', label: 'Log in with card number & PIN' },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {/* You're applying for */}
      <section className="rounded-card bg-sky-soft p-4 ring-1 ring-royal/15">
        <p className="text-[11px] font-bold uppercase tracking-wide text-royal">You’re applying for</p>
        <div className="mt-2 flex items-center gap-3.5">
          <div className="w-[34%] max-w-[110px] shrink-0"><CardArt card={card} /></div>
          <div className="min-w-0">
            <h1 className="font-display text-[16px] font-extrabold leading-tight text-navy">{card.name}</h1>
            <p className="mt-0.5 text-[13px] leading-snug text-slatey">{card.headline}</p>
          </div>
        </div>
      </section>

      <div>
        <h2 className="font-display text-[18px] font-extrabold text-navy">How would you like to apply?</h2>
        <p className="mt-1 text-[13.5px] text-slatey">Pick the option that fits — we’ll take it from there.</p>
      </div>

      <div className="space-y-3">
        {groups.map((g) => (
          <section key={g.name} className="surface overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-line/70 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-bold text-navy">{g.name}</span>
                {g.recommended && (
                  <span className="chip border-royal/20 bg-sky-soft text-[10px] text-royal">Recommended</span>
                )}
              </div>
              <span className="flex items-center gap-1 whitespace-nowrap text-[11.5px] text-slatey"><Icon.Clock size={12} /> {g.time}</span>
            </div>
            <p className="px-4 pt-2 text-[12px] text-slatey">{g.note}</p>
            <div className="space-y-2 p-3">
              {g.items.map((it) => {
                const on = method === it.id
                return (
                  <button
                    key={it.id}
                    onClick={() => setMethod(it.id)}
                    className={`flex w-full items-start gap-3 rounded-tile border p-3 text-left transition-colors ${on ? 'border-royal bg-sky-soft' : 'border-line bg-white hover:border-royal/40'}`}
                  >
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-royal' : 'border-line'}`}>
                      {on && <span className="h-2.5 w-2.5 rounded-full bg-royal" />}
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-navy">{it.label}</span>
                      {it.sub && <span className="block text-[12px] text-slatey">{it.sub}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* FATCA declaration */}
      <button
        onClick={() => setFatca((v) => !v)}
        className={`flex w-full items-start gap-3 rounded-card border p-3.5 text-left transition-colors ${fatca ? 'border-royal bg-sky-soft' : 'border-line bg-white'}`}
      >
        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${fatca ? 'border-royal bg-royal text-white' : 'border-line'}`}>
          {fatca && <Icon.Check size={13} />}
        </span>
        <span className="text-[13px] leading-snug text-navy">
          I confirm I am not a U.S. citizen, U.S. resident or U.S. green card holder, and have not spent a significant number of days in the U.S. each year.{' '}
          <span className="font-semibold text-royal underline underline-offset-2">What is FATCA?</span>
        </span>
      </button>

      {/* Fine print / other routes — available but tucked away (distraction-reduced) */}
      <div className="rounded-card border border-line/70 bg-white">
        <button onClick={() => setShowFine((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-left">
          <span className="text-[13px] font-semibold text-navy">Other ways to apply &amp; the fine print</span>
          <Icon.Chevron size={18} className={`text-slatey transition-transform ${showFine ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {showFine && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="space-y-3 border-t border-line/70 px-4 py-3.5 text-[12.5px] leading-relaxed text-slatey">
                <p>Cards are approved instantly if you apply between <span className="font-semibold text-navy">7am–8pm</span> and meet our <span className="underline">instant approval eligibility</span>.</p>
                <p><span className="font-semibold text-navy">Using CPF LIFE payouts as proof of income?</span> Complete the <span className="underline">application form</span> and submit it with the <span className="underline">required documents</span> by mail or at any UOB branch.</p>
                <p><span className="font-semibold text-navy">Foreigner without UOB internet banking?</span> Use our <span className="underline">online form</span> (7–9 min).</p>
                <p>Manual applications take 3–5 working days to process.</p>
                <p>We may update our terms from time to time and will notify you in advance where possible. Full details at <span className="underline">go.uob.com/fairdealing</span>.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="btn-secondary btn-lg flex-1">Back</button>
        <button disabled={!ready} onClick={onNext} className="btn-primary btn-lg flex-[2] disabled:opacity-50">
          {!method ? 'Choose a method' : !fatca ? 'Confirm the declaration' : 'Continue'}
          {ready && <Icon.Arrow size={18} />}
        </button>
      </div>
    </div>
  )
}

/* ---------- Step 2: Your details (inline validation) ---------- */
function StepDetails({ onBack, onNext }) {
  const [form, setForm] = useState({ name: 'TAN WEI MING', nric: '', income: '', email: '', mobile: '' })
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => validate(form), [form])
  const valid = Object.keys(errors).length === 0
  const mark = (k) => setTouched((t) => ({ ...t, [k]: true }))
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="rounded-card bg-sky-soft p-3.5 text-[13px] leading-snug text-navy ring-1 ring-royal/15">
        <span className="font-semibold">Retrieved from Singpass MyInfo.</span> Check your details and add the rest.
      </div>

      <Field label="Full name (as per NRIC)" value={form.name} onChange={(v) => set('name', v)} readOnly badge="MyInfo" />
      <Field label="NRIC / FIN" value={form.nric} placeholder="S1234567A" onChange={(v) => set('nric', v.toUpperCase())} onBlur={() => mark('nric')} error={touched.nric && errors.nric} />
      <Field label="Annual income (S$)" value={form.income} placeholder="e.g. 48000" inputMode="numeric" onChange={(v) => set('income', v.replace(/[^\d]/g, ''))} onBlur={() => mark('income')} error={touched.income && errors.income} hint="Before CPF deductions" />
      <Field label="Email" value={form.email} placeholder="you@email.com" inputMode="email" onChange={(v) => set('email', v)} onBlur={() => mark('email')} error={touched.email && errors.email} />
      <Field label="Mobile number" value={form.mobile} placeholder="9123 4567" inputMode="tel" prefix="+65" onChange={(v) => set('mobile', v.replace(/[^\d]/g, '').slice(0, 8))} onBlur={() => mark('mobile')} error={touched.mobile && errors.mobile} />

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="btn-secondary btn-lg flex-1">Back</button>
        <button
          onClick={() => { setTouched({ nric: true, income: true, email: true, mobile: true }); if (valid) onNext() }}
          className="btn-primary btn-lg flex-[2]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

/* ---------- Step 4: Review & submit ---------- */
function StepReview({ card, onBack }) {
  const [done, setDone] = useState(false)
  if (done) return <Success card={card} />
  return (
    <div className="space-y-5">
      <h1 className="font-display text-[20px] font-extrabold text-navy">Review & submit</h1>
      <div className="surface divide-y divide-line">
        <Row label="Card" value={card.name} />
        <Row label="Annual fee" value={`${card.fees.annual} · ${card.fees.waiver}`} />
        <Row label="Applicant" value="Tan Wei Ming" />
        <Row label="Approval" value="Instant for most applicants" />
      </div>
      <label className="flex items-start gap-3 text-[13px] leading-snug text-slatey">
        <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 accent-royal" />
        I agree to the Cardmember’s Agreement and consent to UOB processing my application.
      </label>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary btn-lg flex-1">Back</button>
        <button onClick={() => setDone(true)} className="btn-primary btn-lg flex-[2]">Submit application</button>
      </div>
    </div>
  )
}

function Success({ card }) {
  // Cross-sell lives here — AFTER submission — so it never interrupts the
  // application (slide: "moved to after submission. Today it interrupts 11%").
  const [added, setAdded] = useState(null) // null = undecided, true/false = chosen
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 pt-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-royal text-white">
          <Icon.Check size={34} />
        </span>
        <h1 className="mt-4 font-display text-[22px] font-extrabold text-navy">Application submitted</h1>
        <p className="mt-1.5 text-[14px] leading-snug text-slatey">
          Your {card.name.replace('UOB ', '')} application is in. Most applicants are approved instantly — we’ll email you at the address on file.
        </p>
      </div>

      <div className="surface p-4 text-left text-[13px]">
        <p className="font-semibold text-navy">What happens next</p>
        <ol className="mt-2 space-y-1.5 text-slatey">
          <li>1. Instant decision in most cases</li>
          <li>2. Card delivered in 5–7 working days</li>
          <li>3. Activate in the UOB TMRW app</li>
        </ol>
      </div>

      {/* Optional add-on — skippable, post-submission */}
      <div className={`surface p-4 text-left transition-colors ${added ? 'ring-2 ring-royal' : ''}`}>
        <span className="chip border-gold/30 bg-gold-soft text-gold">Optional add-on</span>
        <h2 className="mt-2 font-display text-[16px] font-bold text-navy">Protect your card balance</h2>
        <p className="mt-1 text-[13px] leading-snug text-slatey">
          Covers your outstanding balance if you lose your income unexpectedly. From S$0.30 per S$100 of balance — cancel anytime.
        </p>
        {added ? (
          <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-royal"><Icon.CheckCircle size={16} /> Added — we’ll confirm by email.</p>
        ) : (
          <div className="mt-3 flex gap-3">
            <button onClick={() => setAdded(false)} className={`btn-secondary btn-md flex-1 ${added === false ? 'opacity-60' : ''}`}>No thanks</button>
            <button onClick={() => setAdded(true)} className="btn-primary btn-md flex-[1.4]"><Icon.Plus size={16} /> Add to my card</button>
          </div>
        )}
      </div>

      <Link to="/" className="btn-primary btn-lg w-full">Back to cards</Link>
    </motion.div>
  )
}

/* ---------- shared field ---------- */
function Field({ label, value, onChange, onBlur, placeholder, error, hint, readOnly, badge, prefix, inputMode }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="field-label">{label}</label>
        {badge && <span className="mb-1.5 rounded-full bg-sky-soft px-2 py-0.5 text-[10px] font-bold text-royal">{badge}</span>}
      </div>
      <div className="relative flex items-center">
        {prefix && <span className="pointer-events-none absolute left-4 text-[15px] text-slatey">{prefix}</span>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          readOnly={readOnly}
          inputMode={inputMode}
          className={`field ${prefix ? 'pl-12' : ''} ${error ? 'field-error' : ''} ${readOnly ? 'bg-mist text-slatey' : ''}`}
        />
      </div>
      {error ? (
        <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-uobred"><Icon.Info size={13} /> {error}</p>
      ) : hint ? (
        <p className="mt-1 text-[12px] text-slatey">{hint}</p>
      ) : null}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-[14px]">
      <span className="text-slatey">{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  )
}

function validate(f) {
  const e = {}
  if (!/^[STFG]\d{7}[A-Z]$/.test(f.nric)) e.nric = 'Enter a valid NRIC/FIN, e.g. S1234567A'
  if (!f.income || Number(f.income) < 30000) e.income = 'Minimum income for this card is S$30,000'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = 'Enter a valid email address'
  if (f.mobile.length !== 8) e.mobile = 'Enter your 8-digit Singapore mobile number'
  return e
}
