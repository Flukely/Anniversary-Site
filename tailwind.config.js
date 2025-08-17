export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Thai","Inter","ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","Arial","sans-serif"],
      },
      colors: {
        base:"#FDFBFF",
        primary:"#7C3AED",     // violet-600
        secondary:"#F472B6",   // pink-400
        accent:"#E9D5FF",      // violet-200
        dark:"#4B5563",        // gray-600 (อ่านง่ายบนพื้นอ่อน)
      },
      boxShadow:{
        soft:"0 6px 20px rgba(124,58,237,.10)",
        "soft-hover":"0 10px 26px rgba(124,58,237,.14)",
      },
      borderRadius:{ xl:"1rem" },
    },
  },
  plugins: [],
};
