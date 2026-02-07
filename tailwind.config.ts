import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        boutique: {
          cream: '#fbf7f0',
          sand: '#f1e6d6',
          ink: '#121212',
          charcoal: '#0f0f10',
          gold: '#c8a45a',
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
