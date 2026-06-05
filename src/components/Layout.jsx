import { useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../lib/icons'
import CompareBar from './CompareBar'
import { useCompare } from '../lib/compare'
import uobLogo from '../assets/uob-logo.png'

// UOB logo — official brand asset (red abacus mark + blue "UOB" wordmark).
function Wordmark() {
  return (
    <Link to="/" className="flex items-center" aria-label="UOB home">
      <img src={uobLogo} alt="UOB" className="h-[26px] w-auto" />
    </Link>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-5">
        <Wordmark />
        <div className="flex items-center gap-1">
          <button className="grid h-9 w-9 place-items-center rounded-full text-navy hover:bg-mist" aria-label="Search">
            <Icon.Search size={20} />
          </button>
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full text-navy hover:bg-mist" aria-label="Account">
            <Icon.User size={20} />
          </Link>
        </div>
      </div>
    </header>
  )
}

const tabs = [
  { to: '/', label: 'Cards', icon: Icon.Wallet, end: true },
  { to: '/promotions', label: 'Offers', icon: Icon.Spark },
  { to: '/compare', label: 'Compare', icon: Icon.Scales },
]

function BottomNav() {
  const { slugs } = useCompare()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 lg:absolute">
      <div className="phone-shell">
        <div className="mx-3 mb-3 flex items-center justify-around rounded-2xl border border-line bg-white/95 px-2 py-1.5 shadow-tile backdrop-blur">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-royal' : 'text-slatey hover:text-navy'
                }`
              }
            >
              <t.icon size={21} />
              {t.label}
              {t.to === '/compare' && slugs.length > 0 && (
                <span className="absolute right-3 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-uobred px-1 text-[9px] font-bold text-white">
                  {slugs.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  // Apply flow hides the chrome for a distraction-reduced layout (Alexa #4).
  const isApply = pathname.startsWith('/apply')
  // Detail pages own a sticky Apply CTA, so the tab bar steps aside.
  const isDetail = pathname.startsWith('/cards/')
  const hideNav = isApply || isDetail

  // Forward wheel scrolling from anywhere on the desktop page into the phone's
  // screen — lets you scroll the demo (e.g. while screen-recording) without the
  // cursor ever entering the device frame. The screen itself still scrolls
  // natively when hovered, so we only forward events that land off-device.
  const screenRef = useRef(null)
  const handleWheel = (e) => {
    const el = screenRef.current
    if (!el) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    if (el.contains(e.target)) return
    el.scrollTop += e.deltaY
  }

  return (
    <div
      onWheel={handleWheel}
      className="min-h-screen lg:flex lg:h-screen lg:items-center lg:justify-center lg:overflow-hidden lg:py-4"
    >
      {/* Desktop backdrop — frames the phone-first demo */}
      <div className="pointer-events-none fixed inset-0 hidden lg:block">
        <div className="absolute inset-0 bg-navy" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              'radial-gradient(900px 500px at 80% -5%, #0e3a78 0%, transparent 60%), radial-gradient(700px 500px at 0% 100%, #06294f 0%, transparent 55%)',
          }}
        />
      </div>

      {/* The phone — iPhone 17 Pro Max footprint (440 × 956 pt); fixed-height
          device on desktop, only the screen scrolls. Caps to the viewport on
          shorter displays so it never clips. */}
      <div className="relative z-10 mx-auto w-full max-w-phone bg-mist lg:h-[956px] lg:max-h-[calc(100vh-2rem)] lg:rounded-[55px] lg:p-3 lg:shadow-[0_50px_120px_-40px_rgba(0,0,0,0.7)] lg:ring-1 lg:ring-white/10">
        <div className="relative min-h-screen overflow-hidden bg-mist lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:rounded-[46px]">
          {!isApply && <Header />}
          <main ref={screenRef} className="pb-28 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            <Outlet />
          </main>
          {!hideNav && <BottomNav />}
          {!isApply && pathname !== '/compare' && <CompareBar />}
        </div>
      </div>
    </div>
  )
}
