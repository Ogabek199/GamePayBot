module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#020D2B',
        card: '#1E2746',
        primary: {
          DEFAULT: '#FFC400',
          dark: '#D4A017',
        },
        secondary: '#D4A017',
        success: '#00C853',
        danger: '#FF5252',
        muted: '#A5A9B5',
        border: 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFC400 0%, #D4A017 100%)',
        'premium-card': 'linear-gradient(135deg, #1E2746 0%, #020D2B 100%)',
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'gold': '0 4px 14px 0 rgba(255, 196, 0, 0.39)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
