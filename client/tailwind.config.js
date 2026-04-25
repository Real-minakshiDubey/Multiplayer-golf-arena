/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: { 950: '#020205', 900: '#05050A', 800: '#101018', 700: '#1a1a2e', 600: '#252540' },
        golf: { 400: '#00ffcc', 500: '#00ccaa', 600: '#009988' }, // Neon Cyan
        accent: { pink: '#ff0055', purple: '#bf00ff', yellow: '#fbbf24', cyan: '#00ffcc' } // Neon Pink
      },
      animation: {
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'glow-pink': 'glowPink 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-fast': 'pulse 1s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { textShadow: '0 0 10px rgba(0, 255, 204, 0.4), 0 0 20px rgba(0, 255, 204, 0.4)' },
          '100%': { textShadow: '0 0 20px rgba(0, 255, 204, 0.8), 0 0 30px rgba(0, 255, 204, 0.6)' }
        },
        glowPink: {
          '0%': { textShadow: '0 0 10px rgba(255, 0, 85, 0.4), 0 0 20px rgba(255, 0, 85, 0.4)' },
          '100%': { textShadow: '0 0 20px rgba(255, 0, 85, 0.8), 0 0 30px rgba(255, 0, 85, 0.6)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' } /* assumes duplicated content */
        }
      }
    },
  },
  plugins: [],
}