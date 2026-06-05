import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CARDS, USE_CASES } from '../data/cards'
import { useCaseIcon, Icon } from '../lib/icons'
import DecisionTile from '../components/DecisionTile'

// Card Index / Listing (Kamil + Alexa + Jat Leng):
// - Cards are visible above the fold (not buried under promos)
// - Use-case-led filtering
// - Each tile carries a decision signal + two CTAs
// - Persistent "Not sure? Compare cards" router
export default function Listing() {
  const [params, setParams] = useSearchParams()
  const active = params.get('filter') || 'all'
  const [sort, setSort] = useState('popular')

  const setFilter = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('filter')
    else next.set('filter', id)
    setParams(next, { replace: true })
  }

  const cards = useMemo(() => {
    let list = active === 'all' ? CARDS : CARDS.filter((c) => c.tags.includes(active))
    if (sort === 'popular') list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    if (sort === 'income') list = [...list].sort((a, b) => num(a.eligibility.income) - num(b.eligibility.income))
    return list
  }, [active, sort])

  return (
    <div>
      {/* Compact hero — cards-led, not promo-led */}
      <section className="px-5 pt-6">
        <p className="eyebrow">UOB Credit Cards</p>
        <h1 className="mt-2 font-display text-[26px] font-bold leading-[1.08] text-navy">
          Find the card that fits how you spend
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-slatey">
          Narrow {CARDS.length} cards down to the right two or three. Filter by what
          you spend on, then compare side by side.
        </p>
      </section>

      {/* Use-case filters */}
      <section className="sticky top-14 z-20 mt-5 bg-mist/90 py-3 backdrop-blur lg:top-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
          <FilterChip id="all" label="All cards" active={active === 'all'} onClick={setFilter} />
          {USE_CASES.map((u) => (
            <FilterChip key={u.id} id={u.id} label={u.label} active={active === u.id} onClick={setFilter} />
          ))}
        </div>
      </section>

      {/* Not sure? router */}
      <section className="px-5 pt-3">
        <Link
          to="/compare"
          className="flex items-center justify-between rounded-tile border border-royal/20 bg-sky-soft px-4 py-3.5 transition-colors hover:border-royal/40"
        >
          <span className="flex items-center gap-2.5">
            <span>
              <span className="block text-[13px] font-bold text-navy">Not sure which to pick?</span>
              <span className="block text-[12px] text-slatey">Compare cards by what matters to you</span>
            </span>
          </span>
          <Icon.Arrow size={18} className="text-royal" />
        </Link>
      </section>

      {/* Results meta + sort */}
      <div className="flex items-center justify-between px-5 pb-3 pt-6">
        <p className="text-[13px] font-semibold text-navy">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          {active !== 'all' && <span className="font-normal text-slatey"> · {USE_CASES.find((u) => u.id === active)?.label}</span>}
        </p>
        <label className="flex items-center gap-1.5 text-[13px] text-slatey">
          <Icon.Filter size={15} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent font-semibold text-navy focus:outline-none"
          >
            <option value="popular">Most popular</option>
            <option value="income">Lowest income</option>
          </select>
        </label>
      </div>

      {/* Tiles */}
      <section className="space-y-4 px-5">
        {cards.map((c, i) => (
          <DecisionTile key={c.slug} card={c} index={i} />
        ))}
        {cards.length === 0 && (
          <div className="surface p-8 text-center text-slatey">
            No cards match that filter yet.
          </div>
        )}
      </section>

      {/* Undecided nurture (Jat Leng): educational, not third-party distractions */}
      <section className="px-5 pt-8">
        <div className="rounded-card bg-navy p-5 text-white">
          <p className="eyebrow text-sky">New to credit cards?</p>
          <h2 className="mt-1 font-display text-[18px] font-bold">How to choose your first card</h2>
          <p className="mt-1.5 text-[13px] leading-snug text-white/70">
            Three plain-language questions to find your fit — no jargon, no PDFs.
          </p>
          <Link to="/compare" className="btn-secondary btn-md mt-3 border-white/30 bg-white/10 text-white hover:bg-white/20">
            Start the 3-question guide
            <Icon.Arrow size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FilterChip({ id, label, active, onClick }) {
  const I = useCaseIcon[id]
  return (
    <button onClick={() => onClick(id)} className={`chip shrink-0 ${active ? 'chip-active' : ''}`}>
      {I && <I size={15} />}
      {label}
    </button>
  )
}

const num = (s) => parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0
