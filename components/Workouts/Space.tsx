import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import {
  ContextMenuButton,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";

import Workout from "./Workout";
import { LibraryToggleEnum } from "./utils/enums";
import { useTemporaryStore, useWorkoutsStore } from "./utils/store";
import type { Space as SpaceType } from "./utils/types";
import { Icon, Spacer, Text, View } from "../Themed";

import { workoutsHeaderContextMenuConfig } from "@/constants/ContextMenus";
import { emptyString } from "@/constants/Misc";
import { globalStyles } from "@/constants/Styles";
import {
  fontSizes,
  fontWeights,
  iconSize,
  opacity,
  spacing,
} from "@/constants/Vars";
import { darkenHexColor, lightenHexColor } from "@/utils";

interface SpaceProps {
  item: SpaceType;
  index: number;
}
const Space = ({ index, item }: SpaceProps) => {
  const { width } = useWindowDimensions();
  const { name, workoutId, color: backgroundColor } = item;
  const colorScheme = useColorScheme();

  const { navigate } = useRouter();

  const color = useMemo(() => {
    return colorScheme === "dark"
      ? lightenHexColor(backgroundColor)
      : darkenHexColor(backgroundColor);
  }, [colorScheme, backgroundColor]);

  const { updateToggles } = useTemporaryStore();
  const { workouts } = useWorkoutsStore();

  const workoutName = useMemo(() => {
    return workouts.find((w) => w.id === workoutId)?.name ?? "";
  }, [workouts, workoutId]);

  function onPressMenuItem(e: OnPressMenuItemEventObject) {
    if (e.nativeEvent.actionKey === "swap-workout") {
      updateToggles("library", LibraryToggleEnum.Workouts);
      navigate("/library");
    }
  }

  return (
    <View style={[styles.space, { width }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: `${backgroundColor}50`,
            borderColor: `${color}40`,
          },
        ]}
      >
        <View style={globalStyles.vstack}>
          <Text style={[styles.name, { color }]}>{name}</Text>
          <Spacer size="sm" />
          <View style={styles.workoutName}>
            <Text style={[styles.workoutTitle, { color }]}>
              {workoutName || emptyString}
            </Text>
            <Icon color={color} size={iconSize.sm} name="dumbbell" />
          </View>
        </View>
        <ContextMenuButton
          onPressMenuItem={onPressMenuItem}
          style={{
            marginLeft: "auto",
            paddingLeft: spacing.md,
          }}
          menuConfig={workoutsHeaderContextMenuConfig}
        >
          <Icon color={color} style={{ opacity: opacity.md }} name="ellipsis" />
        </ContextMenuButton>
      </View>
      <View style={styles.content}>
        <Workout workoutId={workoutId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workoutTitle: {
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    marginRight: spacing.sm,
  },
  space: {
    flex: 1,
    marginTop: spacing.sm,
  },
  workoutName: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 0.5,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
});

export default Space;
