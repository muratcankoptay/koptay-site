/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bick Law inspired color palette
        lawPrimary: '#2D3748',     // Dark slate gray-blue - ana renk
        lawSecondary: '#548c8d',   // Teal - ikincil renk
        lawGreen: '#899868',       // Sage green - vurgu
        lawGray: '#7f786f',        // Warm gray - nötr
        lawDark: '#353441',        // Dark purple-gray - koyu
        lawLight: '#F8F9FA',       // Light gray - açık
        
        // Legacy support
        lawBlue: "#0D1B2A",
        primary: "#8d1b54",
        secondary: "#548c8d",
        textPrimary: "#ffffff",
        textSecondary: "#cbd5e1",
        accent: "#548c8d",
        accentHover: "#467276",
        grayIcon: "#94a3b8",
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Open Sans', 'sans-serif'],
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