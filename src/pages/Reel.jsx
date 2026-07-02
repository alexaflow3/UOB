import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// Live-review reel (screen-record → GIF for the deck).
//
// Left:  the REAL app, embedded in an iframe, auto-piloted through a flow by a
//        ghost cursor (navigate · scroll · click) — nothing in the prototype
//        changes; this just drives it from the outside.
// Right: a Figma-style review thread where "Marcus" drops comments in sync with
//        the flow, each pinned to where the cursor is.
//
// Full-screen, outside the app chrome. Open at #/demo and record. It loops.
// ─────────────────────────────────────────────────────────────────────────────

const DEVICE_W = 390
const DEVICE_H = 780

// Types out its text once on mount.
function Typewriter({ text, speed = 18 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return <span>{text.slice(0, n)}</span>
}

export default function Reel() {
  const iframeRef = useRef(null)
  const [cursor, setCursor] = useState({ x: DEVICE_W / 2, y: DEVICE_H / 2 })
  const [clicking, setClicking] = useState(false)
  const [comments, setComments] = useState([])
  const [loop, setLoop] = useState(0)
  const [scale, setScale] = useState(1)

  // Auto-scale the stage so the whole reel fits any recording size (720p, 1080p,
  // fullscreen) and stays centred — cursor/pin coords live inside the scaled
  // subtree, so they stay aligned with the iframe.
  useEffect(() => {
    const STAGE_W = (DEVICE_W + 24) + 40 + 380 + 64 // device + gap + panel + padding
    const STAGE_H = DEVICE_H + 24 + 96 // device + top bar allowance
    const fit = () => {
      const s = Math.min(1, window.innerWidth / STAGE_W, window.innerHeight / STAGE_H)
      setScale(s)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    const { signal } = ac
    let cancelled = false

    const wait = (ms) =>
      new Promise((res, rej) => {
        const t = setTimeout(res, ms)
        signal.addEventListener('abort', () => {
          clearTimeout(t)
          rej(new Error('abort'))
        })
      })

    const cw = () => iframeRef.current?.contentWindow
    const doc = () => iframeRef.current?.contentDocument
    const scroller = () => {
      const m = doc()?.querySelector('main')
      return m && m.scrollHeight > m.clientHeight ? m : cw()
    }
    const go = (hash) => {
      if (cw()) cw().location.hash = hash
    }
    const find = (sel, text) =>
      [...(doc()?.querySelectorAll(sel) || [])].find((e) => (text ? e.textContent.includes(text) : true))
    const center = (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    const click = async (el) => {
      setClicking(true)
      await wait(190)
      setClicking(false)
      if (el) el.click()
      await wait(160)
    }
    const scrollToEl = async (el, offset = 130, ms = 950) => {
      if (!el) return
      const s = scroller()
      const cur = s === cw() ? cw().scrollY || cw().pageYOffset || 0 : s.scrollTop
      const top = el.getBoundingClientRect().top + cur - offset
      if (s === cw()) cw().scrollTo({ top, behavior: 'smooth' })
      else s.scrollTo({ top, behavior: 'smooth' })
      await wait(ms)
    }

    let pinSeq = 0
    // The cursor position is read live via a ref so pins land where the cursor
    // actually is (component state in this closure would be stale).
    const cursorRef = { current: cursor }
    const setCursorTracked = (v) => {
      cursorRef.current = typeof v === 'function' ? v(cursorRef.current) : v
      setCursor(cursorRef.current)
    }

    const reset = () => {
      setComments([])
      pinSeq = 0
    }

    // Re-point the helpers at the tracked cursor so pins land correctly.
    const moveTo2 = async (el, ms = 850) => {
      if (!el) return
      setCursorTracked(center(el))
      await wait(ms)
    }
    const moveXY2 = async (x, y, ms = 700) => {
      setCursorTracked({ x, y })
      await wait(ms)
    }
    const comment2 = async (text, hold = 1900) => {
      pinSeq += 1
      const n = pinSeq
      setComments((cs) => [...cs, { id: `${n}-${text.length}`, n, text }])
      await wait(hold)
    }

    const sequence = async () => {
      reset()
      setLoop((l) => l + 1)

      // 1 — Start on the card listing
      go('#/')
      await wait(1500)
      await moveXY2(DEVICE_W / 2, 300, 500)

      // 2 — Open the One Card
      const tile = find('a[href*="cards/one-card"]')
      await moveTo2(tile, 900)
      await click(tile)
      go('#/cards/one-card')
      await wait(1700)

      // 3 — Above the fold: apply CTA
      await moveXY2(DEVICE_W / 2, 250, 700)
      await comment2('Love that the answer + Apply sit above the fold. That’s the entry intent handled.')

      // 4 — At a glance
      const glance = doc()?.getElementById('glance') || find('h2', 'at a glance')
      await scrollToEl(glance, 130)
      await moveXY2(DEVICE_W / 2, 240, 600)
      await comment2('At-a-glance accordion is clean — base vs bonus split is exactly what the VOC asked for.')

      // 5 — Already have this card (expand)
      const banner = [...(doc()?.querySelectorAll('button') || [])].find(
        (b) => /Already have this card/.test(b.textContent) && b.querySelector('h3'),
      )
      await scrollToEl(banner, 150)
      await moveTo2(banner, 850)
      await click(banner)
      await wait(700)
      await comment2('This is the fix for existing customers — same spot on every card page.')

      // 6 — The One Account cross-sell living in the servicing lane
      const addAccount = [...(doc()?.querySelectorAll('button') || [])].find((b) =>
        /Add a One Account/.test(b.textContent),
      )
      if (addAccount) {
        await scrollToEl(addAccount, 200)
        await moveTo2(addAccount, 850)
        await comment2('And the One Account cross-sell lives here, not interrupting the apply flow. 👌')
      }

      // 7 — Scroll on; sticky apply follows
      await scrollToEl(find('h2', 'Common questions') || find('h2', 'cashback card'), 140)
      await moveXY2(DEVICE_W / 2, DEVICE_H - 70, 700)
      await comment2('Apply bar follows them all the way down. Approved — ship it. 🚀', 2600)

      await wait(900)
    }

    // Poll until the embedded app has actually rendered routes (more reliable
    // than the iframe 'load' event, which can fire before the effect attaches).
    const waitReady = async () => {
      for (let i = 0; i < 80; i += 1) {
        try {
          if (doc() && doc().querySelector('a[href*="cards/"]')) return true
        } catch (e) {
          /* cross-doc during navigation — retry */
        }
        await wait(100)
      }
      return false
    }

    const run = async () => {
      try {
        await waitReady()
      } catch (e) {
        return
      }
      while (!cancelled) {
        try {
          await sequence()
        } catch (e) {
          if (signal.aborted) return
        }
        if (cancelled) return
      }
    }

    run()
    return () => {
      cancelled = true
      ac.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const base = import.meta.env.BASE_URL

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a2240] font-sans text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(900px 520px at 82% -8%, #12386f 0%, transparent 60%), radial-gradient(700px 520px at 0% 108%, #0a2a54 0%, transparent 55%)' }}
      />
      <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      {/* top bar — recording aesthetic */}
      <div className="relative flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2.5 text-[14px] font-semibold tracking-wide text-white/70">
          <span className="font-display font-extrabold text-white">form-three</span>
          <span className="text-sky">×</span>
          <span className="font-display font-extrabold text-white">UOB</span>
          <span className="ml-3 text-white/45">Live prototype review</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80 ring-1 ring-white/15">
          <span className="h-2 w-2 animate-pulse rounded-full bg-uobred" /> Rec
        </div>
      </div>

      {/* stage */}
      <div className="relative mx-auto flex max-w-[1180px] items-center justify-center gap-10 px-8 pt-2">
        {/* LEFT — device running the real app */}
        <div className="relative shrink-0">
          <div
            className="relative overflow-hidden rounded-[44px] bg-black p-3 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
            style={{ width: DEVICE_W + 24 }}
          >
            <div className="relative overflow-hidden rounded-[32px] bg-mist" style={{ width: DEVICE_W, height: DEVICE_H }}>
              <iframe
                ref={iframeRef}
                title="UOB prototype"
                src={`${base}#/`}
                className="block rounded-[32px] border-0"
                style={{ width: DEVICE_W, height: DEVICE_H }}
              />

              {/* ghost cursor */}
              <motion.div
                className="pointer-events-none absolute z-30"
                animate={{ left: cursor.x, top: cursor.y }}
                transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.85 }}
                style={{ left: cursor.x, top: cursor.y }}
              >
                <div className="relative -translate-x-1 -translate-y-1">
                  {clicking && (
                    <motion.span
                      initial={{ scale: 0.2, opacity: 0.6 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="absolute -inset-3 rounded-full bg-sky/60"
                    />
                  )}
                  <svg width="26" height="26" viewBox="0 0 24 24" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    <path d="M4 2l6 16 2.5-6.5L19 9 4 2z" fill="#fff" stroke="#0a2240" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT — review thread */}
        <div className="w-[460px] shrink-0">
          <div className="mb-5 flex items-center gap-3.5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#0084ff] to-[#00237b] text-[19px] font-extrabold text-white ring-2 ring-white/15">
              MC
            </div>
            <div>
              <p className="text-[20px] font-bold text-white">Marcus Chew</p>
              <p className="text-[15px] text-white/55">Managing Director, Group Retail Marketing · reviewing</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <AnimatePresence>
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-3.5 rounded-2xl rounded-tl-sm bg-white/[0.08] p-4 ring-1 ring-white/12 backdrop-blur"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0084ff] to-[#00237b] text-[10px] font-bold text-white">
                    MC
                  </span>
                  <p className="text-[18px] leading-relaxed text-white/90">
                    <Typewriter text={c.text} />
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {comments.length === 0 && (
              <p className="rounded-2xl bg-white/[0.05] p-4 text-[17px] text-white/50 ring-1 ring-white/10">
                Walking through the UOB One Card journey…
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
