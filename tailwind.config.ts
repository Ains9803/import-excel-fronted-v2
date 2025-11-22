import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Colores inspirados en Excel
        excel: {
          50: '#f0fdf4',    // Verde muy claro
          100: '#dcfce7',   // Verde claro
          200: '#bbf7d0',   // Verde pastel
          300: '#86efac',   // Verde suave
          400: '#4ade80',   // Verde medio
          500: '#22c55e',   // Verde Excel (principal)
          600: '#16a34a',   // Verde oscuro
          700: '#15803d',   // Verde muy oscuro
          800: '#166534',   // Verde profundo
          900: '#145231',   // Verde casi negro
        },
        
        primary: {
          DEFAULT: "#16a34a",      // Verde Excel
          foreground: "#ffffff",
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          DEFAULT: "#6b7280",      // Gris
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#1f2937",      // Gris oscuro
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f3f4f6",       // Gris muy claro
          foreground: "#6b7280",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        success: {
          500: '#22c55e',           // Verde Excel
          600: '#16a34a',
        },
        warning: {
          500: '#f59e0b',           // Naranja
          600: '#d97706',
        },
        error: {
          500: '#ef4444',           // Rojo
          600: '#dc2626',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config