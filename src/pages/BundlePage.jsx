import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { bundleBySlug } from '../data/bundles'
import { cardBySlug } from '../data/cards'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'

// Bundle landing page — a dedicated, crawlable page for a card + account pair
// (e.g. UOB One Card + One Account). Reached from the bundle block on the card
// product page, and directly from search/AI (answer-first summary up top).
export default function BundlePage() {
  const { slug } = useParams()
  const bundle = bundleBySlug(slug)
  if (!bundle) return <Navigate to="/" replace />
  const card = cardBySlug(bundle.cardSlug)

  return (
    <div className="pb-20">
      {/* Hero — navy field, the two products shown together */}
      <div className="bg-[linear-gradient(180deg,#0a2240_0%,#0a2240_60%,#0c2647_100%)] text-white">
        <div className="px-5 pt-3">
          <Link to={`/cards/${bundle.cardSlug}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-white/80 hover:text-white">
            <Icon.ArrowLeft size={16} /> Back to {card.name.replace('UOB ', '')}
          </Link>
        </div>

        <section className="px-5 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky">Bundle · Better together</p>
          <h1 className="mt-2 font-display text-[24px] font-bold leading-[1.2] text-white">{bundle.name}</h1>
          <p className="mt-2.5 text-[14px] leading-snug text-white/70">{bundle.tagline}</p>

          {/* Two-product visual: card + account, joined by a plus */}
          <div className="mx-auto mt-8 flex w-full max-w-[320px] items-center justify-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-[46%]"
            >
              <CardArt card={card} bare floating />
            </motion.div>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Icon.Plus size={18} className="text-white" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="grid aspect-[1.586/1] w-[46%] place-items-center rounded-[12px] bg-gradient-to-br from-[#1f4f8f] to-[#0a2240] p-3 text-center shadow-[0_16px_28px_-12px_rgba(0,6,22,0.7)] ring-1 ring-white/15"
            >
              <div>
                <Icon.Wallet size={22} className="mx-auto text-sky" />
                <p className="mt-1.5 text-[11px] font-bold leading-tight text-white">{bundle.accountName}</p>
              </div>
            </motion.div>
          </div>

          {/* Combined value — the two halves side by side */}
          <div className="mt-9 grid grid-cols-2 gap-2.5">
            {bundle.combined.map((c) => (
              <div key={c.k} className="rounded-card bg-white/[0.07] p-3.5 ring-1 ring-white/10">
                <p className="font-display text-[19px] font-extrabold leading-tight text-white">{c.k}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-white/70">{c.v}</p>
                <p className="mt-1 text-[11px] font-semibold text-sky">{c.src}</p>
              </div>
            ))}
          </div>

          <Link to={`/apply/${bundle.cardSlug}`} className="btn-primary btn-lg mt-7 flex w-full bg-uobred hover:bg-uobred-600">
            Apply for both
          </Link>
          <p className="mt-3 pb-8 text-center text-[12px] text-white/55">
            One Singpass-verified flow · details shared across both products
          </p>
        </section>
      </div>

      {/* Answer-first summary (GEO/SEO) */}
      <section className="px-5 pt-8">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-slatey">Why apply for both</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink">{bundle.summary}</p>
      </section>

      {/* Reasons */}
      <section className="px-5 pt-8">
        <div className="space-y-3">
          {bundle.reasons.map((r) => {
            const RIcon = (r.icon && Icon[r.icon]) || Icon.Spark
            return (
              <div key={r.title} className="surface flex gap-3.5 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-tile bg-sky-soft text-royal">
                  <RIcon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-bold leading-tight text-navy">{r.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slatey">{r.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How the bundle works */}
      <section className="px-5 pt-10">
        <h2 className="font-display text-[20px] font-bold leading-tight text-navy">How the bundle works</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slatey">
          Unlock the up to 3.4% p.a. bonus interest each month by meeting both conditions:
        </p>
        <ol className="mt-4 space-y-3">
          {bundle.unlock.map((u, i) => (
            <li key={u} className="flex gap-3 rounded-card bg-white p-4 ring-1 ring-line/70">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-royal text-[13px] font-bold text-white">{i + 1}</span>
              <p className="pt-0.5 text-[13.5px] leading-snug text-ink">{u}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bundle FAQ (question-led, answer-first — GEO-ready) */}
      <section className="px-5 pt-10">
        <h2 className="font-display text-[19px] font-bold text-navy">Common questions</h2>
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-card bg-white ring-1 ring-line/70">
          {bundle.faqs.map((f, i) => (
            <BundleFaq key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-5 pt-10">
        <div className="rounded-card bg-gradient-to-br from-sky-soft to-white p-5 text-center ring-1 ring-royal/10">
          <p className="font-display text-[17px] font-bold text-navy">Ready to make your money work twice?</p>
          <p className="mx-auto mt-1.5 max-w-[280px] text-[13px] leading-snug text-slatey">
            Apply for the {card.name.replace('UOB ', '')} and open a {bundle.accountName} together.
          </p>
          <Link to={`/apply/${bundle.cardSlug}`} className="btn-primary btn-lg mt-4 flex w-full bg-uobred hover:bg-uobred-600">
            Apply for both
          </Link>
          <Link to={`/cards/${bundle.cardSlug}`} className="mt-3 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-royal hover:text-royal-600">
            See the {card.name.replace('UOB ', '')} on its own <Icon.Chevron size={15} className="-rotate-90" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function BundleFaq({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="text-[14px] font-bold leading-snug text-navy">{q}</span>
        <Icon.Chevron size={18} className={`shrink-0 text-royal transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 text-[13.5px] leading-relaxed text-ink">{a}</div>}
    </div>
  )
}
