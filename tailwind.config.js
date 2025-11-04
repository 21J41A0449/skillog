/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111827',
        surface: '#1F2937',
        'surface-light': '#374151',
        border: '#374151',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
        'accent-primary': '#34D399',
        'accent-primary-dark': '#10B981',
        'accent-secondary': '#60A5FA',
      },
    },
  },
  plugins: [],
}
