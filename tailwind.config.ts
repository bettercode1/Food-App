import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Tech-friendly color extensions
        "tech-primary": "hsl(var(--chart-1))",
        "tech-success": "hsl(var(--chart-2))",
        "tech-warning": "hsl(var(--chart-3))",
        "tech-info": "hsl(var(--chart-1))",
        "tech-danger": "hsl(var(--destructive))",
        // Food-friendly color extensions
        "food-orange": "hsl(var(--chart-3))",
        "food-green": "hsl(var(--chart-2))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Tech-friendly animations
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.8",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out",
      },
      // Flat design spacing
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      // Flat design specific utilities
      boxShadow: {
        "none": "none",
        "flat": "0 0 0 1px hsl(var(--border))",
        "flat-focus": "0 0 0 2px hsl(var(--ring))",
      },
      backdropBlur: {
        "none": "none",
      },
      // Typography for tech-friendly interface
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      letterSpacing: {
        "tech": "0.025em",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for flat design utilities
    function({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        '.flat-card': {
          'border': '1px solid hsl(var(--border))',
          'background': 'hsl(var(--card))',
          'box-shadow': 'none',
          'border-radius': 'calc(var(--radius) + 2px)',
        },
        '.flat-button': {
          'transition': 'background-color 0.2s ease, filter 0.2s ease',
          'box-shadow': 'none',
          '&:hover': {
            'filter': 'brightness(1.05)',
          },
          '&:focus': {
            'outline': 'none',
            'ring': '2px solid hsl(var(--ring))',
            'ring-offset': '0',
          },
        },
        '.flat-input': {
          'box-shadow': 'none',
          'border': '1px solid hsl(var(--border))',
          'background': 'hsl(var(--input))',
          '&:focus': {
            'outline': 'none',
            'ring': '2px solid hsl(var(--ring))',
            'ring-offset': '0',
            'border-color': 'hsl(var(--ring))',
          },
        },
        '.tech-gradient': {
          'background': 'linear-gradient(135deg, hsl(var(--chart-1)), hsl(var(--chart-2)))',
        },
        '.food-gradient': {
          'background': 'linear-gradient(135deg, hsl(var(--chart-3)), hsl(var(--chart-2)))',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
