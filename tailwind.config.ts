import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../app/styles/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        "sidebar-shadow": "5px 5px 10px #ededed",
        "dashboard-tile-shadow": "0px 0px 10px #e6e6e6  ",
      },
      colors: {
        "main-green": "#3BB77E",
        "custom-black": "#253D4E",
      },
    },
  },
  plugins: [],
};
export default config;
