/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#001F3F",
          50: "#E6EBF0",
          100: "#B3C2D1",
          200: "#8099B3",
          300: "#4D7094",
          400: "#264D73",
          500: "#001F3F",
          600: "#001933",
          700: "#001326",
          800: "#000D1A",
          900: "#00060D",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FBF6E7",
          100: "#F3E6B8",
          200: "#EBD78A",
          300: "#E3C75B",
          400: "#DCBB49",
          500: "#D4AF37",
          600: "#B8962E",
          700: "#9C7D25",
          800: "#80641C",
          900: "#644B13",
        },
      },
      fontFamily: {
        heebo: ["Heebo"],
        "heebo-bold": ["Heebo-Bold"],
        "heebo-medium": ["Heebo-Medium"],
      },
    },
  },
  plugins: [],
};
