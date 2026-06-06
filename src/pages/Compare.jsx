import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { CARDS, cardBySlug } from '../data/cards'
import { useCompare } from '../lib/compare'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'

// Compare view (Kamil 5.1–5.3): a strict 2-card comparison on mobile, driven by
// two labelled dropdown selectors (card face + name), always pre-populated so
// the table is never empty on arrival.
const ROWS = [
  { key: 'bestFor', label: 'Best for', get: (c) => c.bestFor },
  { key: 'earn', label: 'You earn', get: (c) => c.earn.rate, strong: true },
  { key: 'earnDetail', label: 'On what', get: (c) => c.earn.detail },
  { key: 'fee', label: 'Annual fee', get: (c) => c.fees.annual },
  { key: 'waiver', label: 'Fee waiver', get: (c) => c.fees.waiver },
  { key: 'income', label: 'Min. income', get: (c) => `${c.eligibility.income}/yr` },
  { key: 'age', label: 'Min. age', get: (c) => c.eligibility.age },
  { key: 'fx', label: 'Foreign currency fee', get: (c) => c.fees.fx },
]

// Cards we surface (matches the listing). Hidden cards stay out of compare.
const HIDDEN = ['absolute-cashback-card', 'lazada-uob-card', 'visa-infinite-metal-card']
const VISIBLE = CARDS.filter((c) => !HIDDEN.includes(c.slug))

// Choose two distinct, valid slugs — preferring any the user already picked,
// then sensible cashback defaults, then whatever's left.
function pickTwo(preferred) {
  const order = [...preferred, 'one-card', 'evol-card', ...VISIBLE.map((c) => c.slug)]
  const out = []
  for (const s of order) {
    if (s && VISIBLE.some((c) => c.slug === s) && !out.includes(s)) out.push(s)
    if (out.length === 2) break
  }
  return out
}

export default function Compare() {
  const { slugs } = useCompare()
  const [params] = useSearchParams()
  const fromUrl = (params.get('cards') || '').split(',').filter(Boolean)

  // Seed the two slots once, from any prior selection or the URL (5.3).
  const [slots, setSlots] = useState(() => pickTwo([...fromUrl, ...slugs]))

  const setSlot = (index, slug) => {
    setSlots((prev) => {
      const next = [...prev]
      const other = 1 - index
      // Picking the card already in the other slot swaps them, never duplicates.
      if (prev[other] === slug) next[other] = prev[index]
      next[index] = slug
      return next
    })
  }

  const selected = slots.map(cardBySlug)

  return (
    <div className="pb-10">
      <section className="px-5 pt-5">
        <p className="eyebrow">Compare cards</p>
        <h1 className="mt-1 font-display text-[24px] font-extrabold leading-[1.1] text-navy">
          Which card is right for you?
        </h1>
        <p className="mt-2 text-[14px] leading-snug text-slatey">
          Compare two cards side by side. Switch either card to see rewards, fees and eligibility update instantly.
        </p>
      </section>

      {/* Two dropdown selectors */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-5">
        <CardSelect label="Card 1" align="left" value={slots[0]} exclude={slots[1]} onChange={(s) => setSlot(0, s)} />
        <CardSelect label="Card 2" align="right" value={slots[1]} exclude={slots[0]} onChange={(s) => setSlot(1, s)} />
      </section>

      {/* Comparison table — exactly 2 columns, no horizontal scroll */}
      <section className="pt-6">
        <div className="px-5">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-[26%]" />
                {selected.map((c) => (
                  // Bottom-align so a landscape (short) card sits level with a
                  // portrait (tall) one instead of floating at the top.
                  <th key={c.slug} className="px-2 align-bottom">
                    <div className="mx-auto flex w-3/4 items-end justify-center"><CardArt card={c} /></div>
                    <p className="mt-2 text-[12px] font-bold leading-tight text-navy">{c.name.replace('UOB ', '')}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.key} className={ri % 2 ? 'bg-white' : ''}>
                  <td className={`py-3 pr-2 align-top text-[12px] font-semibold text-slatey ${ri % 2 ? 'bg-white' : 'bg-mist'}`}>
                    {row.label}
                  </td>
                  {selected.map((c) => (
                    <td key={c.slug} className={`px-2 py-3 align-top text-[13px] leading-snug ${row.strong ? 'font-extrabold text-royal' : 'text-ink'}`}>
                      {row.get(c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                {selected.map((c) => (
                  <td key={c.slug} className="px-2 pt-3">
                    <Link to={`/apply/${c.slug}`} className="btn-primary btn-md flex w-full bg-uobred hover:bg-uobred-600">Apply</Link>
                    <Link to={`/cards/${c.slug}`} className="btn-ghost btn-md mt-1.5 flex w-full text-[12px]">Details</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-5 pt-4 text-center text-[12px] text-slatey">Figures are illustrative.</p>
      </section>
    </div>
  )
}

// Labelled dropdown showing the card face beside each name (5.2).
function CardSelect({ label, value, exclude, onChange, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const sel = cardBySlug(value)
  return (
    <div className="relative">
      <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slatey">{label}</p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-tile border border-line bg-white p-2 text-left transition-colors hover:border-royal/50"
      >
        <span className="flex h-9 w-12 shrink-0 items-center justify-center"><CardArt card={sel} className="!aspect-auto !w-full h-full" /></span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy">{sel.name.replace('UOB ', '')}</span>
        <Icon.Chevron size={16} className={`shrink-0 text-royal transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setOpen(false)} />
          <div className={`absolute z-30 mt-1 w-max min-w-full max-w-[300px] overflow-hidden rounded-tile border border-line bg-white shadow-tile ${align === 'right' ? 'right-0' : 'left-0'}`}>
            {VISIBLE.map((c) => (
              <button
                key={c.slug}
                onClick={() => { onChange(c.slug); setOpen(false) }}
                className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-left hover:bg-sky-soft ${c.slug === value ? 'bg-sky-soft' : ''}`}
              >
                <span className="flex h-8 w-11 shrink-0 items-center justify-center"><CardArt card={c} className="!aspect-auto !w-full h-full" /></span>
                <span className="whitespace-nowrap text-[13px] font-semibold text-navy">{c.name.replace('UOB ', '')}</span>
                {c.slug === value && <Icon.Check size={15} className="ml-auto shrink-0 text-royal" />}
                {c.slug === exclude && c.slug !== value && (
                  <span className="ml-auto shrink-0 rounded-full bg-mist px-1.5 py-0.5 text-[9px] font-bold uppercase text-slatey">Other</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
