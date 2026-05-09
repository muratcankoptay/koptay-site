/** @type {import('tailwindcss').Config} */
// NOT: Aktif Tailwind config tailwind.config.js dosyasidir (Vite onu kullanir).
// Bu .cjs sadece geriye donuk uyumluluk icin paralel tutulur.
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lawPrimary: '#2D3748',
        lawSecondary: '#548c8d',
        lawDark: '#1F2937',
        lawLight: '#F8F9FA',
        lawGreen: '#899868',
        lawGray: '#7f786f',
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
        secondary: '#548c8d',
        accent: '#548c8d',
        accentHover: '#467276',
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
