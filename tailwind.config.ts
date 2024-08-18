import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        genyo: "var(--font-genyo)",
      },
      backgroundImage: {
        "btn-gradient":
          "linear-gradient(to bottom, rgba(38, 38, 38, 0.8), #e6e6e6 25%, #ffffff 38%, #c5c5c5 63%, #f7f7f7 87%, rgba(38, 38, 38, 0.8))",
        "btn-gradient-webkit":
          "-webkit-linear-gradient(top, rgba(38, 38, 38, 0.5), #e6e6e6 25%, #ffffff 38%, rgba(0, 0, 0, 0.25) 63%, #e6e6e6 87%, rgba(38, 38, 38, 0.4))",
      },
      colors: {
        primary: "#EFC41D",
        secondary: "#4D4D4D",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
export default config;
