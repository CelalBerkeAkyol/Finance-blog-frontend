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
      screens: {
        xs: "360px", // Ekstra küçük (telefon - mini)
        sm: "640px", // Küçük (telefon)
        md: "768px", // Orta (tablet)
        lg: "1024px", // Büyük (laptop)
        xl: "1280px", // Ekstra büyük (desktop)
        "2xl": "1536px", // 2x Ekstra büyük (geniş ekranlar)
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        tertiary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        quaternary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
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
