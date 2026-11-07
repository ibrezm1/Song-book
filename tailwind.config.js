/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['"Comic Sans MS"', '"Chalkboard SE"', '"Bubblegum Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounce 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 1.5s infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}

