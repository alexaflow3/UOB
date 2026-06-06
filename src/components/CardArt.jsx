// Real UOB card-face artwork.
// Cards are always rendered BARE — the transparent-edge PNG floats on whatever
// surface it sits on, with at most a light card-shaped shadow. No white tile,
// frame or ring around the card anywhere in the app.
const FILES = import.meta.glob('../assets/card-*.{jpg,png}', { eager: true, import: 'default' })

// PNG = tight-cropped, transparent-edge card (preferred everywhere so it floats
// bare). JPG = landscape product shot on white — only a last-resort fallback.
const jpgArt = (key) => FILES[`../assets/card-${key}.jpg`]
const pngArt = (key) => FILES[`../assets/card-${key}.png`]

// True when the card has a transparent-edge PNG.
export const hasBareArt = (card) => Boolean(pngArt(card?.image))

// Portrait card faces (vertical) want a narrower/taller box than landscape ones.
const PORTRAIT_KEYS = new Set(['one', 'evol', 'absolute', 'lazada'])
export const isPortraitArt = (card) => PORTRAIT_KEYS.has(card?.image)

export default function CardArt({ card, className = '', floating = false, bare = false }) {
  const name = card?.name?.replace('UOB ', '') || 'Card'
  // Always prefer the transparent PNG so the card renders bare (no white box).
  const src = pngArt(card?.image) || jpgArt(card?.image)

  // Hero / large floating use — full-bleed card with a soft drop shadow.
  if (bare && src) {
    return (
      <img
        src={src}
        alt={`${name} card`}
        loading="lazy"
        className={`w-full object-contain drop-shadow-[0_18px_32px_rgba(10,34,64,0.28)] ${className}`}
      />
    )
  }

  // Everywhere else — the card floats inside a transparent, orientation-aware
  // box with a light card-shaped shadow. No container, no ring, no white.
  // Portrait faces render at ~75% width (centered) so they don't tower over the
  // landscape cards.
  const portrait = isPortraitArt(card)
  const ratio = portrait ? 'aspect-[7/10]' : 'aspect-[1.586/1]'
  const sizing = portrait ? 'mx-auto w-3/4' : 'w-full'
  const shadow = floating
    ? 'drop-shadow-[0_14px_26px_rgba(10,34,64,0.26)]'
    : 'drop-shadow-[0_5px_12px_rgba(10,34,64,0.18)]'

  return (
    <div className={`relative ${sizing} ${ratio} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={`${name} card`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-contain ${shadow}`}
        />
      ) : (
        /* No product shot — a bare, navy card-shaped placeholder (never a broken
           image), still with no white container. */
        <div className={`flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#0a2240] to-[#143a6b] p-2.5 text-white ${shadow}`}>
          <span className="font-display text-[12px] font-extrabold tracking-tight">UOB</span>
          <span className="text-[9px] font-semibold leading-tight text-white/85">{name}</span>
        </div>
      )}
    </div>
  )
}
