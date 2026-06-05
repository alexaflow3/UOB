import { useSearchParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { CARDS, cardBySlug } from '../data/cards'
import { useCompare } from '../lib/compare'
import CardArt from '../components/CardArt'
import { Icon } from '../lib/icons'

// Compare view (Alexa #3 + DS gap):
// A phone-friendly comparison table that scrolls sideways with the row labels
// staying put — instead of collapsing into a stack you can't compare.
// Same categories, rewards and requirements mapped row-by-row.
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

export default function Compare() {
  const { slugs, toggle, add, clear, has } = useCompare()
  const [params] = useSearchParams()

  // Seed the compare set from the ?cards= query (deep-linkable from the compare
  // bar). Uses the idempotent `add` so it's safe under StrictMode double-invoke.
  const fromUrl = params.get('cards') || ''
  useEffect(() => {
    fromUrl.split(',').filter(Boolean).forEach((s) => {
      if (cardBySlug(s)) add(s)
    })
  }, [fromUrl, add])

  const selected = slugs.map(cardBySlug).filter(Boolean)

  return (
    <div className="pb-10">
      <section className="px-5 pt-5">
        <p className="eyebrow">Compare cards</p>
        <h1 className="mt-1 font-display text-[24px] font-extrabold leading-[1.1] text-navy">
          Which card is right for you?
        </h1>
        <p className="mt-2 text-[14px] leading-snug text-slatey">
          Pick up to 4 cards and see rewards, fees and eligibility side by side. Swipe the table to compare.
        </p>
      </section>

      {/* Card selector */}
      <section className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-slatey">
            Selected · {selected.length}/4
          </h2>
          {selected.length > 0 && (
            <button onClick={clear} className="text-[13px] font-semibold text-royal">Clear all</button>
          )}
        </div>
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {CARDS.map((c) => {
            const on = has(c.slug)
            const full = selected.length >= 4 && !on
            return (
              <button
                key={c.slug}
                disabled={full}
                onClick={() => toggle(c.slug)}
                className={`shrink-0 rounded-tile border p-2 text-left transition-all ${on ? 'border-royal bg-sky-soft' : 'border-line bg-white'} ${full ? 'opacity-40' : ''}`}
                style={{ width: 116 }}
              >
                <CardArt card={c} />
                <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold text-navy">{c.name.replace('UOB ', '')}</p>
                <span className={`mt-1 inline-flex items-center gap-1 text-[11px] font-bold ${on ? 'text-royal' : 'text-slatey'}`}>
                  {on ? <><Icon.Check size={13} /> Added</> : <><Icon.Plus size={13} /> Add</>}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Comparison table */}
      {selected.length < 2 ? (
        <section className="px-5 pt-8">
          <div className="surface flex flex-col items-center gap-3 p-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-sky-soft text-royal">
              <Icon.Scales size={28} />
            </span>
            <p className="text-[14px] font-semibold text-navy">Add at least 2 cards to compare</p>
            <p className="text-[13px] text-slatey">Tap the cards above, or browse all cards first.</p>
            <Link to="/" className="btn-secondary btn-md mt-1">Browse all cards</Link>
          </div>
        </section>
      ) : (
        <section className="pt-6">
          <div className="no-scrollbar overflow-x-auto px-5">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-mist" />
                  {selected.map((c) => (
                    <th key={c.slug} className="min-w-[150px] px-2 align-top">
                      <div className="relative">
                        <CardArt card={c} />
                        <button onClick={() => toggle(c.slug)} aria-label={`Remove ${c.name}`} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-navy shadow ring-1 ring-line">
                          <Icon.Close size={12} />
                        </button>
                      </div>
                      <p className="mt-2 text-[12px] font-bold leading-tight text-navy">{c.name.replace('UOB ', '')}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.key} className={ri % 2 ? 'bg-white' : ''}>
                    <td className={`sticky left-0 z-10 w-[112px] min-w-[112px] py-3 pr-2 align-top text-[12px] font-semibold text-slatey ${ri % 2 ? 'bg-white' : 'bg-mist'}`}>
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
                  <td className="sticky left-0 z-10 bg-mist" />
                  {selected.map((c) => (
                    <td key={c.slug} className="px-2 pt-3">
                      <Link to={`/apply/${c.slug}`} className="btn-primary btn-md w-full">Apply</Link>
                      <Link to={`/cards/${c.slug}`} className="btn-ghost btn-md mt-1.5 w-full text-[12px]">Details</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="px-5 pt-4 text-center text-[12px] text-slatey">
            Swipe sideways to see all cards. Figures are illustrative.
          </p>
        </section>
      )}
    </div>
  )
}
