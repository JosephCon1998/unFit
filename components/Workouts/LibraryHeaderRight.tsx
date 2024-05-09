import { useRouter } from "expo-router";
import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";

import { Icon } from "../Themed";
import { LibraryToggleEnum } from "./utils/enums";
import {
  useExercisesStore,
  useTemporaryStore,
  useWorkoutsStore,
} from "./utils/store";

import {
  libraryHeaderRightContextMenuItems_Exercises,
  libraryHeaderRightContextMenuItems_Workouts,
} from "@/config/ContextMenus";
import { spacing } from "@/constants/Vars";
import { Alert, LayoutAnimation } from "react-native";

const LibraryHeaderRight = () => {
  const { navigate } = useRouter();

  const { toggles } = useTemporaryStore();

  const { addWorkout: addWorkoutToStore } = useWorkoutsStore();

  const { addExercise: addExerciseToStore } = useExercisesStore();

  function addExercise() {
    Alert.prompt(
      "New exercise",
      "Enter a name for your exercise",
      [
        {
          onPress: (name) => {
            if (name) {
              LayoutAnimation.easeInEaseOut();
              addExerciseToStore(name);
            }
          },
          text: "Create",
        },
        {
          onPress: () => {},
          text: "Cancel",
          style: "cancel",
        },
      ],
      "plain-text"
    );
  }

  function addWorkout() {
    Alert.prompt(
      "New workout",
      "Enter a name for your workout",
      [
        {
          onPress: (name) => {
            if (name) {
              LayoutAnimation.easeInEaseOut();
              addWorkoutToStore({ name });
            }
          },
          text: "Create",
        },
        {
          onPress: () => {},
          text: "Cancel",
          style: "cancel",
        },
      ],
      "plain-text"
    );
  }

  function onPressMenuItem(e: OnPressMenuItemEventObject) {
    switch (e.nativeEvent.actionKey) {
      case "add-workout": {
        addWorkout();
        break;
      }
      case "add-exercise-from-list": {
        navigate("/library/addExercise");
        break;
      }
      case "add-blank-exercise": {
        addExercise();
        break;
      }
    }
  }

  return (
    <ContextMenuButton
      onPressMenuItem={onPressMenuItem}
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
