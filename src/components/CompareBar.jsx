import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCompare } from '../lib/compare'
import { cardBySlug } from '../data/cards'
import CardArt from './CardArt'
import { Icon } from '../lib/icons'

// Persistent "Compare cards" bar (addresses Jat Leng's note: copy that motivates
// the user and explains the value of comparing). Mirrors the SingSaver/MoneyHero
// pattern called out in the brief — but kept light and dismissible.
export default function CompareBar() {
  const { slugs, remove, clear } = useCompare()
  const navigate = useNavigate()
  const cards = slugs.map(cardBySlug)

  return (
    <AnimatePresence>
      {slugs.length > 0 && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40"
        >
          <div className="phone-shell px-3 pb-3">
            <div className="rounded-2xl bg-navy text-white shadow-lift ring-1 ring-white/10">
              <div className="flex items-center justify-between px-4 pt-3">
                <div>
                  <p className="font-display text-[15px] font-bold">Which card is right for you?</p>
                  <p className="text-[12px] text-white/65">
                    Compare two cards — rewards, fees &amp; eligibility, side by side.
                  </p>
                </div>
                <button onClick={clear} aria-label="Clear comparison" className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
                  <Icon.Close size={18} />
                </button>
              </div>
              <div className="flex items-end gap-3 px-4 py-3">
                <div className="flex flex-1 gap-2">
                  {Array.from({ length: 2 }).map((_, i) => {
                    const c = cards[i]
                    return c ? (
                      <div key={c.slug} className="relative w-1/2">
                        <CardArt card={c} />
                        <button
                          onClick={() => remove(c.slug)}
                          aria-label={`Remove ${c.name}`}
                          className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-navy shadow"
                        >
                          <Icon.Close size={12} />
                        </button>
                      </div>
                    ) : (
                      <div key={i} className="grid aspect-[1.586/1] w-1/2 place-items-center rounded-2xl border border-dashed border-white/25 text-[11px] text-white/40">
                        Add a card
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  disabled={slugs.length < 2}
                  onClick={() => navigate(`/compare?cards=${slugs.join(',')}`)}
                  className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {slugs.length < 2 ? 'Add one more to compare' : 'Compare cards'}
                  <Icon.Scales size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
