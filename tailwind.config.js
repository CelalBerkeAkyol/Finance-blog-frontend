// tailwind.config.js

import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px", // Ekstra küçük (mini telefon)
        sm: "640px", // Küçük (telefon)
        md: "768px", // Orta (tablet)
        lg: "1024px", // Büyük (laptop)
        xl: "1280px", // Ekstra büyük (desktop)
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            colors: {
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
              fontSize: "1.875rem", // Mobil: 30px
              "@screen md": {
                fontSize: "2.25rem", // md ve üzeri: 36px
              },
              fontWeight: "bold",
              color: theme("colors.gray.900"),
              marginBottom: "1.5rem",
              marginTop: "2rem",
              lineHeight: "1.3",
              scrollMarginTop: "5rem",
            },
            h2: {
              fontSize: "1.6rem", // Mobil: 25.6px (yaklaşık)
              "@screen md": {
                fontSize: "1.8rem", // md ve üzeri: 28.8px
              },
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "1.25rem",
              marginTop: "1.75rem",
              lineHeight: "1.4",
              scrollMarginTop: "5rem",
            },
            h3: {
              fontSize: "1.4rem", // Mobil: 22.4px
              "@screen md": {
                fontSize: "1.6rem", // md ve üzeri: 25.6px
              },
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "1rem",
              marginTop: "1.5rem",
              lineHeight: "1.5",
              scrollMarginTop: "5rem",
            },
            h4: {
              fontSize: "1.35rem", // Mobil: 21.6px
              "@screen md": {
                fontSize: "1.5rem", // md ve üzeri: 24px
              },
              fontWeight: "bold",
              color: theme("colors.gray.800"),
              marginBottom: "0.85rem",
              marginTop: "1.25rem",
              lineHeight: "1.6",
              scrollMarginTop: "5rem",
            },
            h5: {
              fontSize: "1.15rem", // Mobil: 18.4px
              "@screen md": {
                fontSize: "1.25rem", // md ve üzeri: 20px
              },
              fontWeight: "600",
              color: theme("colors.gray.800"),
              marginBottom: "0.75rem",
              marginTop: "1rem",
              lineHeight: "1.6",
              scrollMarginTop: "5rem",
            },
            h6: {
              fontSize: "1rem", // Mobil: 16px (varsayılan)
              "@screen md": {
                fontSize: "1.125rem", // md ve üzeri: 18px
              },
              fontWeight: "600",
              color: theme("colors.gray.800"),
              marginBottom: "0.5rem",
              marginTop: "1rem",
              lineHeight: "1.6",
              scrollMarginTop: "5rem",
            },
            p: {
              fontSize: "1rem",
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
              fontSize: "1rem",
              marginBottom: "0.5rem",
              lineHeight: "1.6",
            },
            code: {
              color: theme("colors.pink.700"),
              backgroundColor: theme("colors.gray.100"),
              paddingLeft: theme("spacing.1"),
              paddingRight: theme("spacing.1"),
              paddingTop: theme("spacing.05"),
              paddingBottom: theme("spacing.05"),
              borderRadius: theme("borderRadius.md"),
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
        invert: {
          css: {
            color: theme("colors.gray.300"),
            "code::before": { content: "" },
            "code::after": { content: "" },
            code: {
              color: theme("colors.pink.400"),
              backgroundColor: theme("colors.gray.900"),
              paddingLeft: theme("spacing.1"),
              paddingRight: theme("spacing.1"),
              paddingTop: theme("spacing.05"),
              paddingBottom: theme("spacing.05"),
              borderRadius: theme("borderRadius.md"),
            },
          },
        },
      }),
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography"), nextui()],
};
