import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d631b",
        "primary-container": "#2e7d32",
        "on-primary": "#ffffff",
        "on-primary-container": "#cbffc2",
        "surface-tint": "#1b6d24",
        secondary: "#006e1c",
        "secondary-container": "#91f78e",
        "on-secondary-container": "#00731e",
        "on-surface": "#141b2b",
        "on-surface-variant": "#40493d",
        outline: "#707a6c",
        "outline-variant": "#bfcaba",
        background: "#f9f9ff",
        "background-sage": "#F8FAF7",
        surface: "#f9f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f3ff",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "success-soft": "#F0FDF4",
        
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#002204",
        "surface-glass": "rgba(255, 255, 255, 0.8)",
        "secondary-fixed-dim": "#78dc77",
        "surface-bright": "#f9f9ff",
        "tertiary-fixed": "#ffddb5",
        "surface-container-high": "#e1e8fd",
        "danger-burnt": "#C1440E",
        "on-tertiary-fixed-variant": "#643f00",
        "on-primary-fixed-variant": "#005312",
        "on-error": "#ffffff",
        "surface-container-highest": "#dce2f7",
        "on-tertiary-container": "#ffeede",
        "tertiary": "#774c00",
        "on-secondary-fixed-variant": "#005313",
        "on-tertiary-fixed": "#2a1800",
        "tertiary-container": "#986200",
        "tertiary-fixed-dim": "#ffb957",
        "primary-fixed-dim": "#88d982",
        "on-error-container": "#93000a",
        "surface-dim": "#d3daef",
        "primary-fixed": "#a3f69c",
        "secondary-fixed": "#94f990",
        "inverse-surface": "#293040",
        "on-primary-fixed": "#002204",
        "inverse-on-surface": "#edf0ff",
        "surface-container": "#e9edff",
        "on-background": "#141b2b",
        "inverse-primary": "#88d982"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "gutter": "20px",
        "unit": "4px",
        "margin-desktop": "32px",
        "margin-mobile": "12px",
        "container-max": "1440px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "headline-lg": ["28px", {"lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "600"}],
        "headline-lg-mobile": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "label-md": ["13px", {"lineHeight": "18px", "letterSpacing": "0.01em", "fontWeight": "500"}]
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
