import { useThemeColor } from "@/components/Themed";

export const useBackgroundShades = () => {
  const backgroundColor = useThemeColor("text");

  return {
    none: "transparent",
    sm: `${backgroundColor}0A`,
    md: `${backgroundColor}10`,
    lg: `${backgroundColor}15`,
    xl: `${backgroundColor}25`,
  };
};
