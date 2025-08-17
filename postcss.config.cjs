// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},   // ← ต้องเป็น 'tailwindcss' เท่านั้น (ห้าม @tailwindcss/postcss)
    autoprefixer: {},
  },
};