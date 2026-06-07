import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CardArt from './CardArt'
import { Icon } from '../lib/icons'
import { useCompare } from '../lib/compare'

// Simple category label above the card (client: "CASHBACK / TRAVEL & MILES").
// Eyebrow CSS uppercases, so casing here is just for readability.
const TIER_LABEL = {
  Cashback: 'Cashback',
  Rewards: 'Rewards',
  Travel: 'Travel & Miles',
}
// A couple of cards read better with a bespoke label.
const SLUG_LABEL = {
  'lazada-uob-card': 'Cashback & Rebates',
  'evol-card': 'Cashback',
}

// Card-led decision tile, modelled on how SG banks present their grid cards
// (Citi/OCBC/DBS): category label → card + name → value prop → key value-prop
// bullets ("the 3rd points") → a prominent "find out more" → Apply.
export default function DecisionTile({ card, index = 0 }) {
  const { has, toggle } = useCompare()
  const selected = has(card.slug)
  const label = SLUG_LABEL[card.slug] || TIER_LABEL[card.tier] || card.tier
  const bullets = (card.hero?.body || card.highlights || []).slice(0, 3)

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="surface overflow-hidden"
    >
      {/* Popular — full-width banner across the top, gold-foil glimmer. */}
      {card.popular && (
        <div
          className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4a3500]"
          style={{ background: 'linear-gradient(105deg,#a9781f 0%,#e3c25e 28%,#fbf1cd 50%,#e3c25e 72%,#a9781f 100%)' }}
        >
          <Icon.Spark size={12} /> Popular
        </div>
      )}

      {/* The whole upper area is the "more" affordance — taps through to the
          full card detail page. */}
      <Link to={`/cards/${card.slug}`} className="block p-4">
        <div className="flex gap-4">
          <div className="w-[40%] shrink-0">
            <CardArt card={card} className="!aspect-[1.586/1] !w-full" />
          </div>
          <div className="min-w-0 flex-1">
            {/* Category label (quiet grey) sits directly above the card name. */}
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <h3 className="mt-1 font-display text-[16px] font-bold leading-tight text-navy">{card.name}</h3>
            <p className="mt-1 text-[13px] font-semibold leading-snug text-royal">{card.headline}</p>
          </div>
        </div>

        {/* Key value props — the bullet detail other banks put on grid cards. */}
        {bullets.length > 0 && (
          <ul className="mt-5 space-y-1">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2 text-[12.5px] leading-snug text-ink">
                <Icon.Check size={15} className="mt-0.5 shrink-0 text-royal" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-royal">
          Find out more <Icon.Arrow size={14} />
        </span>
      </Link>

      {/* CTAs — Apply is primary; Compare is a quieter secondary action. */}
      <div className="flex items-center gap-2.5 border-t border-line/70 px-4 py-3">
        <button
          onClick={() => toggle(card.slug)}
          className={`btn btn-md shrink-0 border ${selected ? 'border-royal bg-royal text-white' : 'border-royal text-royal hover:bg-sky-soft'}`}
        >
          {selected ? <><Icon.Check size={15} /> Added</> : 'Compare'}
        </button>
        <Link to={`/apply/${card.slug}`} className="btn btn-md flex-1 bg-uobred text-white hover:bg-uobred-600">
          Apply now
        </Link>
      </div>
    </motion.article>
  )
}
