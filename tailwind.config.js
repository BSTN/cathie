/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./modules/**/*.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    fontFamily: {
      mono: [
        '"DejaVu sans code", Menlo, Monaco, Consolas, "Courier New", monospace',
      ],
      main: [
        "Inter, ...defaultTheme.fontFamily.sans",
        {
          fontFeatureSettings: '"cv11", "ss01"',
          fontVariationSettings: '"opsz" 32',
        },
      ],
    },
    letterSpacing: {
      extra: "var(--letterspacing, 0.02em)",
    },
    fontWeight: {
      normal: 200,
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      gridTemplateColumns: {
        12: "repeat(auto-fill, minmax(12rem, 1fr))",
      },
      colors: {
        f: "var(--f)",
        fg: "var(--fg)",
        fg1: "var(--fg1)",
        fg2: "var(--fg2)",
        fg3: "var(--fg3)",
        bg: "var(--bg)",
        bg1: "var(--bg1)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        bc: "var(--bc)",
      },
    },
    plugins: [
      require("@tailwindcss/line-clamp"),
      require("@tailwindcss/typography"),
    ],
  },
  plugins: [],
};
