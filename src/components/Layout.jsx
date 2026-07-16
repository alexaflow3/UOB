import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../lib/icons'
import CompareBar from './CompareBar'
import uobLogo from '../assets/uob-logo.png'

// UOB logo — official brand asset (red abacus mark + blue "UOB" wordmark).
function Wordmark() {
  return (
    <Link to="/" className="flex items-center" aria-label="UOB home">
      <img src={uobLogo} alt="UOB" className="h-[26px] w-auto" />
    </Link>
  )
}

const tabs = [
  { to: '/', label: 'Cards', icon: Icon.Wallet, end: true },
  { to: '/promotions', label: 'Offers', icon: Icon.Spark },
  { to: '/compare', label: 'Compare', icon: Icon.Scales },
]

function Header() {
  // Fixed on both breakpoints (window scroll). Mobile shows the compact
  // wordmark + icons bar; desktop widens to the UOB.com header structure —
  // logo left, primary nav links inline, utility icons right — using the
  // same components and tokens (mobile markup is unchanged below lg).
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="bg-white/90 backdrop-blur-md lg:border-b lg:border-line/80">
        <div className="mx-auto flex h-14 w-full max-w-phone items-center justify-between border-b border-line/80 px-5 lg:max-w-[1180px] lg:px-8 lg:border-0">

          <div className="flex items-center gap-10">
            <Wordmark />
            {/* Desktop-only primary nav — same destinations as the mobile tab bar */}
            <nav className="hidden items-center gap-7 lg:flex">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `relative py-4 text-[14px] font-semibold transition-colors ${
                      isActive
                        ? 'text-royal after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-royal'
                        : 'text-navy hover:text-royal'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <button className="grid h-9 w-9 place-items-center rounded-full text-navy hover:bg-mist" aria-label="Search">
              <Icon.Search size={20} />
            </button>
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full text-navy hover:bg-mist" aria-label="Account">
              <Icon.User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 lg:hidden">
      <div className="phone-shell">
        <div className="mx-3 mb-3 flex items-center justify-around rounded-2xl border border-line bg-white/95 px-2 py-1.5 shadow-tile backdrop-blur">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-royal text-white shadow-[0_6px_16px_-6px_rgba(0,94,184,0.6)]'
                    : 'text-slatey hover:bg-mist hover:text-navy'
                }`
              }
            >
              <t.icon size={21} />
              {t.label}
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

  return (
    <div className="min-h-screen bg-mist">
      {!isApply && <Header />}
      {/* pt-14 clears the fixed header (h-14) whenever it's shown. */}
      <main className={`pb-28 ${!isApply ? 'pt-14' : ''}`}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
      {!isApply && pathname !== '/compare' && <CompareBar />}
    </div>
  )
}
