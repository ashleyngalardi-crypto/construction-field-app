// Color design system for Gravel Log Construction
export const COLORS = {
  // Brand - Orange
  brand: "#E8601C",
  brandDark: "#C44E15",
  brandLight: "#F4845F",
  brandTint: "#FFF3ED",

  // Aliases for existing code
  primary: "#E8601C",
  primaryLight: "#FFF0E8",
  primaryDark: "#C44E15",

  // Admin (Purple)
  admin: "#7C3AED",
  adminLight: "#F3EEFF",

  // Status Colors
  success: "#2D8A4E", // Green
  successLight: "#EAFAF0",
  warning: "#D4930D", // Amber
  warningLight: "#FFF8E8",
  danger: "#C4392B", // Red
  dangerLight: "#FFF0EE",
  blue: "#2B6CB0",
  blueLight: "#EBF4FF",
  info: "#2B6CB0", // Alias for blue

  // Neutral - Gravel Log
  black: "#1A1A1A",
  charcoal: "#2C2A26",
  gray: "#9A9A9A",
  sand: "#E8E5E0",
  cream: "#F5F3EF",

  // Aliases for existing code
  bg: "#F5F3EF",
  card: "#FFFFFF",
  white: "#FFFFFF",
  text: "#1A1A1A",
  textMid: "#5C5C5C",
  textLight: "#9A9A9A",
  border: "#E8E5E0",

  // Semantic
  error: "#C4392B",
  errorLight: "#FFF0EE",
} as const;

export type ColorKey = keyof typeof COLORS;
