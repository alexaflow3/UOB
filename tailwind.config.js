/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // UOB United Design System — tokens lifted from production CSS
        // (--primary-darker / --primary / --primary-light / --asean-red).
        navy: {
          DEFAULT: '#00237b', // --primary-darker
          900: '#001a5e',
          800: '#00237b',
          700: '#004585', // --primary-dark
        },
        royal: {
          DEFAULT: '#005eb8', // --primary (brand blue, text/borders/CTA)
          700: '#004585', // --primary-dark (hover)
          600: '#005eb8',
          500: '#0084ff', // --primary-light (bright accent)
          400: '#339bff',
        },
        sky: {
          DEFAULT: '#0084ff', // --primary-light
          soft: '#edf5ff', // --custom-6 light-blue surface
        },
        uobred: {
          DEFAULT: '#fb002c', // --asean-red (diamond accent)
          600: '#d50025',
        },
        gold: {
          DEFAULT: '#B68A3E', // premium tier accent (KrisFlyer/PRVI)
          soft: '#F3ECDD',
        },
        ink: '#333333', // --black-6 body text
        slatey: '#5f6670',
        mist: '#f5f5f5', // UOB grey surface
        line: '#e6e6e6', // UOB hairline border
      },
      fontFamily: {
        // UDS uses Noto Sans throughout (en-font.css), Arimo/Arial fallback.
        display: ['"Noto Sans"', 'Arimo', 'Arial', 'sans-serif'],
        sans: ['"Noto Sans"', 'Arimo', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        tile: '8px',
        btn: '5px', // UDS button radius
      },
      boxShadow: {
        tile: '0 1px 2px rgba(0,35,123,0.05), 0 8px 24px -14px rgba(0,35,123,0.16)',
        lift: '0 12px 40px -16px rgba(0,35,123,0.3)',
        sticky: '0 -4px 24px -8px rgba(0,35,123,0.15)',
      },
      maxWidth: {
        phone: '440px',
        shell: '1180px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
