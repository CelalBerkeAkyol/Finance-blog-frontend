// tailwind.config.js

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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.blue.600"),
              "&:hover": {
                color: theme("colors.blue.800"),
              },
            },
            h1: {
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme("colors.gray.900"),
              marginBottom: "0.75rem", // Boşluğu azalttık
              scrollMarginTop: "4rem",
            },
            h2: {
              fontSize: "2 rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "0.5rem", // Boşluğu azalttık
              scrollMarginTop: "4rem",
            },
            h3: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "0.5rem",
              scrollMarginTop: "4rem",
            },
            p: {
              fontSize: "1rem",
              marginTop: "0.25rem",
              marginBottom: "0.25rem", // Paragraf boşluklarını küçülttük
            },
            ul: {
              marginLeft: "1rem",
              listStyleType: "disc",
              paddingLeft: "1rem",
              marginBottom: "0.5rem", // Liste boşluklarını küçülttük
            },
            ol: {
              marginLeft: "1rem",
              listStyleType: "decimal",
              paddingLeft: "1rem",
              marginBottom: "0.5rem",
            },
            li: {
              fontSize: "1rem",
              marginBottom: "0.25rem", // Liste öğeleri arasındaki boşluğu azalttık
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              borderRadius: "0.25rem",
              padding: "0.2rem 0.4rem",
              fontSize: "0.5rem",
            },
            blockquote: {
              borderLeftColor: theme("colors.gray.300"),
              paddingLeft: "1rem",
              fontStyle: "italic",
            },
            table: {
              width: "100%",
              maxWidth: "100%",
              display: "block",
              overflowX: "auto",
              borderCollapse: "collapse",
            },
          },
        },
      }),
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("@tailwindcss/typography")],
};
