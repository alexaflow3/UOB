import { useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Lightweight, client-side access gate for the shared prototype.
 * This is a soft gate for a private pitch preview — not real security
 * (the passphrase ships in the bundle). It only keeps the link from being
 * casually browsable by anyone who stumbles on the URL.
 *
 * The `/demo` and `/reel` routes are exempt so the auto-play reel embedded
 * in the responses document keeps working without prompting.
 */
const PASSPHRASE = 'UOBform-three2026'
const STORE_KEY = 'uob-simple-access'

function isUnlocked() {
  try {
    return localStorage.getItem(STORE_KEY) === 'granted'
  } catch {
    return false
  }
}

// Running inside an iframe means we're being showcased, not browsed directly:
// the review reel embeds the real app, and the responses document embeds the
// reel. Those stay open so the demo plays without a prompt. Casual top-level
// visits to the URL are still gated.
function isEmbedded() {
  try {
    return window.self !== window.top
  } catch {
    return true // cross-origin framing throws — treat as embedded
  }
}

export default function PasswordGate({ children }) {
  const { pathname } = useLocation()
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  // Passive reel + any embedded (iframe) context stays open — no gate.
  const exempt = pathname === '/demo' || pathname === '/reel' || isEmbedded()
  if (exempt || unlocked) return children

  function submit(e) {
    e.preventDefault()
    if (value.trim() === PASSPHRASE) {
      try {
        localStorage.setItem(STORE_KEY, 'granted')
      } catch {
        /* private mode — session-only unlock still works */
      }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-navy px-6">
      {/* atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(900px 500px at 15% -10%, rgba(0,94,184,.55), transparent 60%), radial-gradient(700px 500px at 100% 110%, rgba(251,0,44,.28), transparent 55%)',
        }}
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-[380px] rounded-[20px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)]"
      >
        <div className="mb-6 flex items-center gap-2 text-white">
          <span className="text-[17px] font-extrabold tracking-tight">form&#8288;-&#8288;three</span>
          <span className="text-uobred">×</span>
          <span className="text-[17px] font-extrabold tracking-tight">UOB</span>
        </div>

        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7fb3ff]">
          Private preview
        </div>
        <h1 className="mb-1 font-display text-[22px] font-extrabold text-white">
          Project Simple
        </h1>
        <p className="mb-6 text-[13.5px] leading-relaxed text-white/60">
          This prototype is a confidential work-in-progress. Enter the passphrase to continue.
        </p>

        <label className="mb-1.5 block text-[12px] font-semibold text-white/80">
          Passphrase
        </label>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(false)
          }}
          placeholder="Enter passphrase"
          className={`h-12 w-full rounded-[8px] border bg-white/95 px-4 text-[15px] text-ink outline-none transition-colors focus:ring-4 ${
            error
              ? 'border-uobred focus:ring-uobred/20'
              : 'border-transparent focus:border-royal focus:ring-royal/25'
          }`}
        />
        {error && (
          <div className="mt-2 text-[12.5px] font-medium text-red-300">
            That passphrase isn’t right. Try again.
          </div>
        )}

        <button
          type="submit"
          className="mt-5 flex h-12 w-full items-center justify-center rounded-[8px] bg-uobred text-[15px] font-bold text-white transition-transform active:scale-[0.99]"
        >
          Unlock preview
        </button>

        <p className="mt-5 text-center text-[11.5px] text-white/40">
          Strictly confidential · form-three · 2026
        </p>
      </form>
    </div>
  )
}
