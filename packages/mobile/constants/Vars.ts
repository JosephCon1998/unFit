import { TextStyle } from "react-native";
import { Easing } from "react-native-reanimated";

export const easings = {
  ease: Easing.bezier(0.25, 1, 0.5, 1),
};

export const zIndex = {
  default: 0,
  backSm: -1,
  backMd: -2,
  backLg: -3,
  forwardSm: 1,
  forwardMd: 2,
  forwardLg: 3,
};

export const borderWidth = {
  none: 0,
  thin: 1,
  thick: 2,
};

export const iconSize = {
  sm: 15,
  md: 20,
  lg: 30,
  xl: 40,
};

export const spacing = {
  none: 0,
  xs: 5,
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const fontSizes = {
  xxs: 8,
  xs: 10,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const opacity = {
  none: 0,
  sm: 0.25,
  md: 0.5,
  lg: 0.75,
  opaque: 1,
};

export const fontWeights = {
  thin: "200" as TextStyle["fontWeight"],
  light: "300" as TextStyle["fontWeight"],
  regular: "400" as TextStyle["fontWeight"],
  medium: "500" as TextStyle["fontWeight"],
  semibold: "600" as TextStyle["fontWeight"],
  bold: "700" as TextStyle["fontWeight"],
  heavy: "800" as TextStyle["fontWeight"],
};
