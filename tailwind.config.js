/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Law firm color palette
        lawPrimary: '#2D3748',     // Dark slate gray-blue
        lawSecondary: '#548c8d',   // Teal
        lawGreen: '#899868',       // Sage green
        lawGray: '#7f786f',        // Warm gray
        lawDark: '#353441',        // Dark purple-gray
        lawLight: '#F8F9FA',       // Light gray
        
        // Legacy support
        lawBlue: "#0D1B2A",
        primary: "#8d1b54",
        secondary: "#548c8d",
        textPrimary: "#ffffff",
        textSecondary: "#cbd5e1",
        accent: "#548c8d",
        accentHover: "#467276",
        darkBg: "#0f172a",
        cardBg: "#1e293b",
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
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