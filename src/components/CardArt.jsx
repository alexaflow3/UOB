// Real UOB card-face artwork.
// CDN product shots are portrait cards on white. We present them on a clean
// light tile with a soft inner vignette so the tile reads as a framed product
// shot (works for every accent, unlike a blend over the brand gradient).
const FILES = import.meta.glob('../assets/card-*.{jpg,png}', { eager: true, import: 'default' })

// Two art variants per card:
//  - JPG: landscape product shot — used inside the framed tile (listing, compare,
//    cross-sell) so every thumbnail reads consistently.
//  - PNG: tight-cropped, transparent-edge card — used in `bare` mode for the
//    apply/detail heroes where the card floats on its own.
const jpgArt = (key) => FILES[`../assets/card-${key}.jpg`]
const pngArt = (key) => FILES[`../assets/card-${key}.png`]

export default function CardArt({ card, className = '', floating = false, bare = false, plain = false }) {
  const name = card?.name?.replace('UOB ', '') || 'Card'
  const src = bare
    ? pngArt(card?.image) || jpgArt(card?.image)
    : jpgArt(card?.image) || pngArt(card?.image)

  // Bare mode: render the card face on its own (no tile, ring or backdrop).
  // Works for the tight-cropped PNG art whose transparent edges let the card
  // float freely with just a soft drop shadow.
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

  return (
    <div
      className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl ${
        plain ? '' : 'bg-gradient-to-br from-white to-mist ring-1 ring-line'
      } ${className}`}
      style={
        plain
          ? undefined
          : {
              boxShadow: floating
                ? '0 24px 50px -20px rgba(10,34,64,0.45)'
                : '0 8px 22px -12px rgba(10,34,64,0.4)',
            }
      }
    >
      {src ? (
        <img
          src={src}
          alt={`${name} card`}
          loading="lazy"
          className="absolute left-1/2 top-1/2 h-[122%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_10px_18px_rgba(10,34,64,0.22)]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-slatey">
          <span className="font-display text-sm font-bold">{name}</span>
        </div>
      )}
    </div>
  )
}
