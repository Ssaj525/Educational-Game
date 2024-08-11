/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{html,js}'],
  theme: {
    screens:{
      sm:'480px',
      md:'768px',
      lg:'976px',
      xl:'1140px'
    },
    extend: {
      colors:{
        "b-bn-pri":'#1E293B',
        "b-bn-sec":'#334155',
        "b-black-200":'#3c3c3c',
        "b-ac":'#12C6B0',
        "icon":'#4B596D',
        "card-bg-4":'#5AB2FD',
        "b-white-200":'#f2f2f2',
      },
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

