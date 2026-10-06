/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBF9F5',
          subtle: '#F2EFE8',
          card: '#FFFFFF',
          dark: '#0F1012',
          darkCard: '#17191C',
        },
        ink: {
          DEFAULT: '#141413',
          secondary: '#4A4944',
          muted: '#7E7D77',
          faint: '#B8B6AD',
          inverse: '#FAF9F5',
        },
        accent: {
          DEFAULT: '#D84C24',
          hover: '#BD3D17',
          faint: 'rgba(216, 76, 36, 0.08)',
          glow: 'rgba(216, 76, 36, 0.2)',
        },
        border: {
          DEFAULT: 'rgba(20, 20, 19, 0.08)',
          strong: 'rgba(20, 20, 19, 0.16)',
          faint: 'rgba(20, 20, 19, 0.04)',
        }
      },
      fontFamily: {
        display: ['"Instrument Sans"', '"Satoshi"', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Instrument Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      letterSpacing: {
        'tight': '-0.015em',
        'tighter': '-0.025em',
        'normal': '0em',
        'wide': '0.04em',
        'wider': '0.08em',
        'widest': '0.14em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'marquee': 'marquee 32s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
