import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PROMOS, cardBySlug } from '../data/cards'
import { Icon } from '../lib/icons'

// Campaign / Promotions page (Kamil + Alexa + Jat Leng):
// - The OFFER is the hero (e.g. "AirPods Pro"), not the card
// - Explicit expiry signalling (valid-until, 'ends soon')
// - Tile copy structure: category eyebrow → reward → benefit → valid-for → cards
// - Soonest-to-expire offers surface first
const REWARD = {
  airpods: { bg: 'linear-gradient(135deg,#1b2a3d,#39516f)', emoji: '🎧' },
  cash: { bg: 'linear-gradient(135deg,#0a7a43,#16a35c)', emoji: '💵' },
  miles: { bg: 'linear-gradient(135deg,#005eb8,#00237b)', emoji: '✈️' },
  luggage: { bg: 'linear-gradient(135deg,#7a2150,#b0306b)', emoji: '🧳' },
}

export default function Promotions() {
  const now = new Date()
  const sorted = [...PROMOS].sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil))

  return (
    <div className="pb-8">
      <section className="px-5 pt-5">
        <p className="eyebrow">Card offers</p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold leading-[1.08] text-navy">
          Apply now, get rewarded
        </h1>
        <p className="mt-2 text-[14px] leading-snug text-slatey">
          Limited-time welcome gifts when you apply for an eligible UOB card. Soonest to expire shown first.
        </p>
      </section>

      <section className="mt-5 space-y-4 px-5">
        {sorted.map((p, i) => {
          const r = REWARD[p.rewardImage] || REWARD.cash
          const days = Math.ceil((new Date(p.validUntil) - now) / 86400000)
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="surface overflow-hidden"
            >
              {/* Reward is the hero */}
              <div className="relative aspect-[2/1] w-full overflow-hidden" style={{ background: r.bg }}>
                <div className="absolute inset-0 grid place-items-center text-[68px]">{r.emoji}</div>
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy">{p.category}</span>
                  <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-gold">Official partner</span>
                </div>
                {(p.endsSoon || days <= 30) && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-uobred px-2.5 py-1 text-[11px] font-bold text-white">
                    <Icon.Clock size={12} /> {days <= 0 ? 'Last day' : `Ends in ${days} days`}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h2 className="font-display text-[19px] font-extrabold leading-tight text-navy">{p.reward}</h2>
                <p className="mt-1 text-[14px] leading-snug text-ink">{p.benefit}</p>
                <p className="mt-1 text-[13px] text-slatey">{p.condition}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line/70 pt-3 text-[12px]">
                  <span className="flex items-center gap-1.5 text-slatey">
                    <Icon.Clock size={14} className="text-royal" /> Valid until <b className="text-navy">{fmt(p.validUntil)}</b>
                  </span>
                  <span className="flex items-center gap-1.5 text-slatey">
                    <Icon.Wallet size={14} className="text-royal" /> {p.cards.length} eligible {p.cards.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>

                {/* Which cards — clear mapping (Kamil: promos should state the card they relate to) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.cards.map((slug) => {
                    const c = cardBySlug(slug)
                    return (
                      <Link key={slug} to={`/cards/${slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-navy transition-colors hover:border-royal hover:text-royal">
                        {c.name.replace('UOB ', '')}
                        <Icon.Arrow size={13} />
                      </Link>
                    )
                  })}
                </div>

                <Link to={`/apply/${p.cards[0]}`} className="btn-primary btn-lg mt-4 w-full">
                  Apply & claim this offer
                </Link>
              </div>
            </motion.article>
          )
        })}
      </section>

      <p className="px-5 pt-5 text-center text-[12px] leading-snug text-slatey">
        Offers shown are illustrative. Terms apply — eligibility, minimum spend and validity dates are stated on each offer.
      </p>
    </div>
  )
}

const fmt = (iso) => new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
