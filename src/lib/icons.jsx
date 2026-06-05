// Lightweight inline icon set — stroke-based, 1.6 weight, inherits currentColor.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ children, size = 20, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
    {children}
  </svg>
)

export const Icon = {
  Arrow: (p) => (<Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>),
  ArrowLeft: (p) => (<Svg {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Svg>),
  Check: (p) => (<Svg {...p}><path d="M5 13l4 4L19 7" /></Svg>),
  CheckCircle: (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.5 2.5L16 9" /></Svg>),
  Plus: (p) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>),
  Close: (p) => (<Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>),
  Chevron: (p) => (<Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>),
  Scales: (p) => (<Svg {...p}><path d="M12 4v16M7 8h10M5 8l-2 6h4l-2-6zM19 8l-2 6h4l-2-6zM8 20h8" /></Svg>),
  Search: (p) => (<Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></Svg>),
  Filter: (p) => (<Svg {...p}><path d="M4 6h16M7 12h10M10 18h4" /></Svg>),
  Clock: (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>),
  Shield: (p) => (<Svg {...p}><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" /></Svg>),
  Spark: (p) => (<Svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></Svg>),
  Wallet: (p) => (<Svg {...p}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M16 14h2" /></Svg>),
  User: (p) => (<Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></Svg>),
  Doc: (p) => (<Svg {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></Svg>),
  Plane: (p) => (<Svg {...p}><path d="M21 16l-8-3V6a1.5 1.5 0 0 0-3 0v7l-8 3v2l8-2v3l-2 1.5V21l3-1 3 1v-1.5L11 18v-3l8 2z" /></Svg>),
  Cart: (p) => (<Svg {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M3 4h2l2.5 12h11l2-8H6" /></Svg>),
  Fork: (p) => (<Svg {...p}><path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM16 16v5" /></Svg>),
  Coin: (p) => (<Svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 9.5h3.2a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3h3.2" /></Svg>),
  Lock: (p) => (<Svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>),
  Phone: (p) => (<Svg {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></Svg>),
  Info: (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>),
  Download: (p) => (<Svg {...p}><path d="M12 3v12M8 11l4 4 4-4M5 21h14" /></Svg>),
}

export const useCaseIcon = {
  everyday: Icon.Wallet,
  dining: Icon.Fork,
  travel: Icon.Plane,
  shopping: Icon.Cart,
  cashback: Icon.Coin,
  miles: Icon.Plane,
}
