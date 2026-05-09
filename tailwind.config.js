/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Marka paleti (Koptay Hukuk Bürosu) ===
        lawPrimary: '#2D3748',
        lawSecondary: '#548c8d',
        lawDark: '#1F2937',
        lawLight: '#F8F9FA',
        lawGreen: '#899868',
        lawGray: '#7f786f',

        // === Tailwind-tarz primary skala (teal aile) ===
        primary: {
          50:  '#f1f7f7',
          100: '#dcebec',
          200: '#bcd8d9',
          300: '#90bbbd',
          400: '#7aabad',
          500: '#548c8d',
          600: '#467276',
          700: '#395d61',
          800: '#2f4b4d',
          900: '#1f3032',
        },

        // === Geriye dönük uyumluluk ===
        secondary: '#548c8d',
        accent: '#548c8d',
        accentHover: '#467276',
        darkBg: '#0f172a',
        cardBg: '#1e293b',
      },
      fontFamily: {
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-light': 'bounce 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
