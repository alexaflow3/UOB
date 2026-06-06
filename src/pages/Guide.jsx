import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBySlug } from '../data/cards'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'

// 1.1 — a real (if simple) 3-question guide that recommends a card, replacing
// the old button that wrongly pointed at the Compare page. Plain-language
// questions, no jargon; the answers map to one recommended card + a reason.
const QUESTIONS = [
  {
    key: 'spend',
    title: 'What do you spend the most on?',
    options: [
      { value: 'everyday', label: 'Everyday — groceries, transport, bills' },
      { value: 'online', label: 'Online shopping & mobile contactless' },
      { value: 'dining', label: 'Dining, beauty & lifestyle' },
      { value: 'travel', label: 'Travel & flights' },
    ],
  },
  {
    key: 'goal',
    title: 'What do you want to earn?',
    options: [
      { value: 'cashback', label: 'Cashback I can spend anywhere' },
      { value: 'miles', label: 'Air miles for travel' },
      { value: 'rewards', label: 'Reward points on my favourite categories' },
    ],
  },
  {
    key: 'style',
    title: 'How do you like your rewards?',
    options: [
      { value: 'max', label: 'Maximise it — I’ll track categories & spend' },
      { value: 'simple', label: 'Keep it simple — one flat, fuss-free rate' },
    ],
  },
]

// Map the 3 answers to a recommended card (among the surfaced six).
function recommend({ spend, goal, style }) {
  if (goal === 'miles' || spend === 'travel') {
    return spend === 'travel'
      ? { slug: 'prvi-miles-card', reason: 'Highest miles on travel spend, here and overseas — and your miles never expire.' }
      : { slug: 'krisflyer-card', reason: 'Earn KrisFlyer miles directly on everyday spend, with bonus miles on travel and dining.' }
  }
  if (spend === 'online') return { slug: 'evol-card', reason: 'Up to 8% cashback on online and mobile contactless spend — built for how you pay today.' }
  if (spend === 'dining' || goal === 'rewards') return { slug: 'ladys-card', reason: 'Earn 10X reward points on a category you choose — dining, beauty, fashion or travel.' }
  if (style === 'simple') return { slug: 'one-card', reason: 'A steady, fuss-free cashback workhorse for consistent everyday spenders.' }
  return { slug: 'one-card', reason: 'The highest cashback on the everyday categories you already spend on.' }
}

export default function Guide() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const choose = (key, value) => {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    setStep((s) => s + 1)
  }

  const done = step >= QUESTIONS.length
  const rec = done ? recommend(answers) : null
  const card = rec ? cardBySlug(rec.slug) : null

  return (
    <div className="pb-12">
      <section className="px-5 pt-4">
        <Link to="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-royal">
          <Icon.Chevron size={16} className="rotate-90" /> All cards
        </Link>
        <p className="eyebrow mt-3 text-slatey">Find your card</p>
        <h1 className="mt-2 font-display text-[24px] font-bold leading-[1.12] text-navy">
          Three questions to your card
        </h1>

        {/* Progress */}
        <div className="mt-4 flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < step || done ? 'bg-royal' : 'bg-line'}`}
            />
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.section
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 pt-7"
          >
            <p className="text-[13px] font-semibold text-slatey">Question {step + 1} of {QUESTIONS.length}</p>
            <h2 className="mt-1.5 font-display text-[20px] font-bold leading-tight text-navy">{QUESTIONS[step].title}</h2>
            <div className="mt-5 space-y-3">
              {QUESTIONS[step].options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => choose(QUESTIONS[step].key, o.value)}
                  className="flex w-full items-center justify-between gap-3 rounded-card bg-white px-4 py-4 text-left text-[14.5px] font-semibold text-navy ring-1 ring-line transition-colors hover:ring-royal"
                >
                  {o.label}
                  <Icon.Arrow size={18} className="shrink-0 text-royal" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slatey">
                <Icon.ArrowLeft size={15} /> Back
              </button>
            )}
          </motion.section>
        ) : (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pt-7"
          >
            <p className="eyebrow">Your match</p>
            <div className="mt-3 surface overflow-hidden">
              <div className="bg-[linear-gradient(180deg,#0a2240,#0c2647)] px-5 pb-6 pt-6">
                <div className="mx-auto w-[58%] max-w-[220px]">
                  <CardArt card={card} bare floating />
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-display text-[19px] font-bold leading-tight text-navy">{card.name}</h2>
                <p className="mt-1.5 text-[13.5px] font-semibold text-royal">{card.headline}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink">{rec.reason}</p>
                <Link to={`/cards/${card.slug}`} className="btn-secondary btn-lg mt-5 flex w-full">
                  See full details
                </Link>
                <Link to={`/apply/${card.slug}`} className="btn-primary btn-lg mt-3 flex w-full bg-uobred hover:bg-uobred-600">
                  Apply now
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
