import React from "react";
import { View } from "react-native";

import { ViewProps } from "../Themed";

import { globalStyles } from "@/constants/Styles";
import { spacing } from "@/constants/Vars";
import { useBackgroundShades } from "@/hooks";

const Divider = ({
  margin = false,
  style,
  ...rest
}: { margin?: boolean } & ViewProps) => {
  const { xl: backgroundColor } = useBackgroundShades();

  return (
    <View
      style={[
        globalStyles.divider,
        { backgroundColor, marginVertical: margin ? spacing.lg : 0 },
        style,
      ]}
      {...rest}
    />
  );
};

export default Divider;
