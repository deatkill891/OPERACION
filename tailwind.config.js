/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Infra', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta Oficial DEACERO
        deacero: {
          blue: '#002D6F',    // Pantone 288 C (Principal)
          orange: '#FF6B00',  // Pantone 1505 C (Acento)
          black: '#000000',   // Black 100%
          grey: {
            dark: '#4B4A4B',  // Gris Oscuro Texto
            medium: '#808081',// Gris Medio
            light: '#BFBFBF', // Gris Claro Bordes
          }
        }
      }
    },
  },
  plugins: [],
}