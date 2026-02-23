// Color design system for Construction Field App
export const COLORS = {
  // Primary & Secondary
  primary: "#E8601C", // Safety Orange
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

  // Neutral
  bg: "#F5F3EF", // Background
  card: "#FFFFFF", // Card
  white: "#FFFFFF", // White
  text: "#1A1A1A", // Primary Text
  textMid: "#5C5C5C", // Secondary Text
  textLight: "#9A9A9A", // Tertiary Text
  border: "#E8E5E0",

  // Semantic
  error: "#C4392B",
  errorLight: "#FFF0EE",
} as const;

export type ColorKey = keyof typeof COLORS;
