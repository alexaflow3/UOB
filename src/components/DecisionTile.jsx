import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CardArt from './CardArt'
import { Icon } from '../lib/icons'
import { useCompare } from '../lib/compare'

// Decision tile (Alexa #1): card image, one-line 'best for', headline benefit,
// min income, and TWO CTAs — Apply now + Compare. Carries a decision signal,
// not just "Find out more".
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
            <CardArt card={card} plain />
            {card.popular && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                <Icon.Spark size={11} /> Popular
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Best for</p>
            <p className="mt-0.5 text-[13px] font-semibold leading-snug text-navy">{card.bestFor}</p>
            <h3 className="mt-2 font-display text-[16px] font-bold leading-tight text-ink">{card.name}</h3>
            <p className="mt-1 text-[13px] leading-snug text-slatey">{card.headline}</p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-line/70 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] text-slatey">Min. income</p>
          <p className="whitespace-nowrap text-[13px] font-semibold text-navy">{card.eligibility.income}/yr</p>
        </div>
        <div className="flex items-center gap-2">
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
