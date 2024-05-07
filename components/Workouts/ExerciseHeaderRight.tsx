import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";

import { useAddSet } from "./Workout";
import { Icon } from "../Themed";

import { exerciseHeaderContextMenuConfig } from "@/constants/ContextMenus";

const ExerciseHeaderRight = () => {
  const addSet = useAddSet();
  const { headerTitle: name, id }: { headerTitle: string; id: string } =
    useLocalSearchParams();

  const onPressMenuItem = (e: OnPressMenuItemEventObject) => {
    if (e.nativeEvent.actionKey === "add-set") {
      addSet(name, id);
    }
  };

  return (
    <ContextMenuButton
      onPressMenuItem={onPressMenuItem}
      menuConfig={exerciseHeaderContextMenuConfig}
    >
      <Icon
        name={{
          ios: "ellipsis.circle",
          android: "ellipsis",
        }}
      />
    </ContextMenuButton>
  );
};

export default ExerciseHeaderRight;
