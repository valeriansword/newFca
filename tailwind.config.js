/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'profile-pattern':"url('./src/assets/back1.PNG')"
      }
    },
  },
  plugins: [],
}

