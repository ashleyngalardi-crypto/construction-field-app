// Spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Border radius scale
export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  round: 999,
} as const;

// Touch targets (minimum 44pt for accessibility)
export const TOUCH_TARGET = {
  min: 44,
  small: 48,
  medium: 56,
  large: 64,
} as const;

// Shadow elevation
export const ELEVATION = {
  subtle: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  high: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
