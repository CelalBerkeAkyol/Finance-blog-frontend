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
            colors: {
              primary: "#4F46E5",
              secondary: "#9333EA",
              success: "#10B981",
              warning: "#F59E0B",
              danger: "#EF4444",
              default: "#6B7280",
            },
            a: {
              color: theme("colors.blue.600"),
              fontWeight: "600",
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.blue.800"),
                textDecoration: "underline",
              },
            },
            h1: {
              fontSize: "2.5rem", // Büyük ve belirgin başlık
              fontWeight: "bold",
              color: theme("colors.gray.900"),
              marginBottom: "1.5rem",
              marginTop: "2rem",
              lineHeight: "1.3",
              scrollMarginTop: "5rem",
            },
            h2: {
              fontSize: "2rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "1.25rem",
              marginTop: "1.75rem",
              lineHeight: "1.4",
              scrollMarginTop: "5rem",
            },
            h3: {
              fontSize: "1.75rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "1rem",
              marginTop: "1.5rem",
              lineHeight: "1.5",
              scrollMarginTop: "5rem",
            },
            h4: {
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "0.85rem",
              marginTop: "1.25rem",
              lineHeight: "1.6",
              scrollMarginTop: "5rem",
            },
            h5: {
              fontSize: "1.25rem",
              fontWeight: "600",
              color: theme("colors.gray.800"),
              marginBottom: "0.75rem",
              marginTop: "1rem",
              lineHeight: "1.6",
              scrollMarginTop: "5rem",
            },
            h6: {
              fontSize: "1.125rem",
              fontWeight: "600",
              color: theme("colors.gray.800"),
              marginBottom: "0.5rem",
              marginTop: "1rem",
              lineHeight: "1.6",
              scrollMarginTop: "5rem",
            },
            p: {
              fontSize: "0.8 rem",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              lineHeight: "1.75",
            },
            ul: {
              marginLeft: "1rem",
              listStyleType: "disc",
              paddingLeft: "1rem",
              marginBottom: "1rem",
            },
            ol: {
              marginLeft: "1.5rem",
              listStyleType: "decimal",
              paddingLeft: "1rem",
              marginBottom: "1rem",
            },
            li: {
              fontSize: "1 rem",
              marginBottom: "0.5rem",
              lineHeight: "1.6",
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              borderRadius: "0.25rem",
              padding: "0.3rem 0.5rem",
              fontSize: "0.875rem",
              fontFamily: "monospace",
            },
            blockquote: {
              borderLeftColor: theme("colors.gray.300"),
              paddingLeft: "1.25rem",
              fontStyle: "italic",
              fontSize: "1.2rem",
              color: theme("colors.gray.600"),
              marginBottom: "1.5rem",
            },
            table: {
              width: "100%",
              maxWidth: "100%",
              display: "block",
              overflowX: "auto",
              borderCollapse: "collapse",
              marginBottom: "1.5rem",
            },
            strong: {
              fontWeight: "bold",
              color: theme("colors.gray.900"),
            },
          },
        },
      }),
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("@tailwindcss/typography")],
};
