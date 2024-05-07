import { useRouter } from "expo-router";
import React from "react";
import { ContextMenuButton } from "react-native-ios-context-menu";

import { LibraryToggleEnum } from "./utils/enums";
import { useTemporaryStore } from "./utils/store";
import { Icon } from "../Themed";

import {
  libraryHeaderRightContextMenuItems_Exercises,
  libraryHeaderRightContextMenuItems_Workouts,
} from "@/constants/ContextMenus";
import { spacing } from "@/constants/Vars";

const LibraryHeaderRight = () => {
  const { navigate } = useRouter();
  const { toggles } = useTemporaryStore();

  return (
    <ContextMenuButton
      onPressMenuItem={(e) => {
        if (e.nativeEvent.actionKey === "key-04") {
          navigate("/library/addExercise");
        }
      }}
      style={{ marginTop: 6, padding: 0, marginLeft: spacing.lg }}
      menuConfig={{
        menuTitle: "",
        menuItems:
          toggles.library === LibraryToggleEnum.Exercises
            ? libraryHeaderRightContextMenuItems_Exercises
            : libraryHeaderRightContextMenuItems_Workouts,
      }}
    >
      <Icon useTintColor name="plus" />
    </ContextMenuButton>
  );
};

export default LibraryHeaderRight;
