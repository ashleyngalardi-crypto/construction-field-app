// Typography system
export const FONTS = {
  // Font family
  body: "DM Sans", // Default: system fonts
  mono: "JetBrains Mono",

  // Weights
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
} as const;

// Text styles
export const TEXT_STYLES = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: "800" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: "800" as const,
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: "800" as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "700" as const,
    lineHeight: 28,
  },

  // Body text
  body16: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  body14: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  body13: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  body12: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
  body11: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  body10: {
    fontSize: 10,
    fontWeight: "400" as const,
    lineHeight: 14,
  },

  // Semantic styles
  label: {
    fontSize: 13,
    fontWeight: "700" as const,
    lineHeight: 18,
    textTransform: "uppercase" as const,
    letterSpacing: 0.06,
  },
  label13: {
    fontSize: 13,
    fontWeight: "700" as const,
    lineHeight: 18,
  },
  label12: {
    fontSize: 12,
    fontWeight: "700" as const,
    lineHeight: 16,
  },
  label11: {
    fontSize: 11,
    fontWeight: "700" as const,
    lineHeight: 14,
  },
  label10: {
    fontSize: 10,
    fontWeight: "700" as const,
    lineHeight: 12,
  },
  button: {
    fontSize: 15,
    fontWeight: "800" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    fontWeight: "600" as const,
    lineHeight: 16,
  },
} as const;
