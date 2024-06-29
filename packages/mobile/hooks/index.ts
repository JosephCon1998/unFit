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

import { useMemo } from "react";

export function useSortedArray(array: any[], sortBy: string) {
  const sortedArray = useMemo(() => {
    if (!array || !sortBy) return array;

    return [...array].sort((a, b) => {
      const itemA = a[sortBy].toUpperCase(); // convert to uppercase to ensure case-insensitive comparison
      const itemB = b[sortBy].toUpperCase(); // convert to uppercase to ensure case-insensitive comparison

      if (itemA < itemB) {
        return -1;
      }
      if (itemA > itemB) {
        return 1;
      }
      return 0;
    });
  }, [array, sortBy]);

  return sortedArray;
}
