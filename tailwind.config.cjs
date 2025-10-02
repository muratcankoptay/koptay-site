/** @type {import('tailwindcss').Config} *//** @type {import('tailwindcss').Config} */

module.exports = {module.exports = {

  content: [  content: [

    "./index.html",    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",    "./src/**/*.{js,ts,jsx,tsx}",

  ],  ],

  theme: {  theme: {

    extend: {    extend: {

      colors: {      colors: {

        primary: {        // Bick Law inspired color palette

          50: '#f0f9ff',        lawPrimary: '#2D3748',     // Dark slate gray-blue - ana renk

          500: '#3b82f6',        lawSecondary: '#548c8d',   // Teal - ikincil renk

          600: '#2563eb',        lawGreen: '#899868',       // Sage green - vurgu

          700: '#1d4ed8',        lawGray: '#7f786f',        // Warm gray - nötr

          800: '#1e40af',        lawDark: '#353441',        // Dark purple-gray - koyu

          900: '#1e3a8a',        lawLight: '#F8F9FA',       // Light gray - açık

        },        

        gold: {        // Legacy support

          400: '#fbbf24',        lawBlue: "#0D1B2A",

          500: '#f59e0b',        primary: "#8d1b54",

          600: '#d97706',        secondary: "#548c8d",

        }        textPrimary: "#ffffff",

      },        textSecondary: "#cbd5e1",

      fontFamily: {        accent: "#548c8d",

        'serif': ['Georgia', 'serif'],        accentHover: "#467276",

      }        grayIcon: "#94a3b8",

    },      },

  },      fontFamily: {

  plugins: [],        serif: ['Merriweather', 'serif'],

}        sans: ['Open Sans', 'sans-serif'],
        heading: ["Merriweather", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.15)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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