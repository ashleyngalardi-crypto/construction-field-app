export { COLORS } from "./colors";
export type { ColorKey } from "./colors";
export { SPACING, RADIUS, TOUCH_TARGET, ELEVATION } from "./spacing";
export { FONTS, TEXT_STYLES } from "./typography";

// Combined theme
export const THEME = {
  colors: require("./colors").COLORS,
  spacing: require("./spacing").SPACING,
  radius: require("./spacing").RADIUS,
  touchTarget: require("./spacing").TOUCH_TARGET,
  elevation: require("./spacing").ELEVATION,
  fonts: require("./typography").FONTS,
  textStyles: require("./typography").TEXT_STYLES,
};
