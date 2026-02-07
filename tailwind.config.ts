import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        boutique: {
          offwhite: '#fcfaf6',
          olive: '#6b7756',
          'olive-dark': '#4d5a3f',
          ink: '#121212',
          charcoal: '#0f0f10',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(17, 17, 17, 0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
