const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      purple: "#111827",
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.blue.500"),
              "&:hover": {
                color: theme("colors.blue.700"),
              },
            },
            h1: {
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme("colors.gray.900"),
            },
            h2: {
              fontSize: "2rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
            },
            h3: {
              fontSize: "1.75rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
            },
            h4: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
            },
            ul: {
              marginLeft: "1.5rem",
              listStyleType: "disc",
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              borderRadius: "0.25rem",
              padding: "0.2rem 0.4rem",
              fontSize: "0.875rem",
            },
          },
        },
      }),
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("@tailwindcss/typography")],
};
