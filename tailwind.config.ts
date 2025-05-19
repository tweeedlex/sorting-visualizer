/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        element: "var(--color-element)",
        sub: "var(--color-sub)",
      }
    },
  },
  plugins: [],
}

