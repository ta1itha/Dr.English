import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f4f7f4',
          100: '#e8f0e8',
          500: '#6b8f71',
          600: '#5a7a60',
          700: '#4a6550',
        },
      },
    },
  },
  plugins: [],
}

export default config
