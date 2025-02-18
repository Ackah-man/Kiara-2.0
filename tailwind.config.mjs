/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            h2: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            h3: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            h4: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            h5: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            h6: {
              color: "var(--foreground)",
              fontWeight: "bold",
            },
            p: {
              color: "var(--foreground)",
            },
            a: {
              color: "var(--foreground)",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
