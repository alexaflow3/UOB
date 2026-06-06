import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CardArt from './CardArt'
import { Icon } from '../lib/icons'
import { useCompare } from '../lib/compare'

// Decision tile (Alexa #1 + Kamil 1.2/1.3): exactly three typographic levels —
// card name (primary), a single benefit-led descriptor, and the key reward.
// No "Best for" label, no repeated min-income row.
export default function DecisionTile({ card, index = 0 }) {
  const { has, toggle } = useCompare()
  const selected = has(card.slug)

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="surface overflow-hidden"
    >
      <Link to={`/cards/${card.slug}`} className="block">
        <div className="flex gap-4 p-4">
          <div className="w-[42%] shrink-0">
            {/* Force a uniform landscape box so portrait & landscape faces read
                at the same height; portrait cards sit centered within it. */}
            <CardArt card={card} className="!aspect-[1.586/1] !w-full" />
            {card.popular && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                <Icon.Spark size={11} /> Popular
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            {/* 1. Card name — primary */}
            <h3 className="font-display text-[17px] font-bold leading-tight text-navy">{card.name}</h3>
            {/* 2. Single benefit-led descriptor */}
            <p className="mt-1.5 text-[13px] leading-snug text-slatey">For {lowerFirst(card.bestFor)}</p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-line/70 px-4 py-3">
        {/* 3. Key reward — sits beside the CTAs */}
        <span className="min-w-0 flex-1 text-[12.5px] font-semibold leading-tight text-royal">{card.headline}</span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => toggle(card.slug)}
            className={`btn btn-md border ${selected ? 'border-royal bg-sky-soft text-royal' : 'border-line text-slatey hover:border-royal/40 hover:text-royal'}`}
          >
            {selected ? 'Added' : 'Compare'}
          </button>
          <Link to={`/apply/${card.slug}`} className="btn btn-md bg-uobred text-white hover:bg-uobred-600">
            Apply
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// Lowercase the first letter so "Everyday spenders…" reads as "For everyday
// spenders…" — but keep proper nouns/brands (KrisFlyer, PRVI) that carry an
// internal or all-caps letter.
const lowerFirst = (s = '') => {
  const first = s.split(' ')[0]
  if (/[A-Z].*[A-Z]/.test(first)) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}
