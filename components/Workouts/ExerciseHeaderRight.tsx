import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";

import { Icon } from "../Themed";
import { useAddSet } from "./Workout";

import { exerciseHeaderContextMenuConfig } from "@/constants/ContextMenus";
import { Alert } from "react-native";
import { useExercisesStore } from "./utils/store";

const ExerciseHeaderRight = () => {
  const addSet = useAddSet();

  const { headerTitle: name, id }: { headerTitle: string; id: string } =
    useLocalSearchParams();

  const showDeleteSetWarning = () => {
    Alert.alert(
      "Delete sets",
      "Are you sure you want to delete all sets for this exercise?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => clearSets(id),
        },
      ]
    );
  };

  const onPressMenuItem = (e: OnPressMenuItemEventObject) => {
    switch (e.nativeEvent.actionKey) {
      case "add-set": {
        addSet(name, id);
        break;
      }
      case "delete-sets": {
        showDeleteSetWarning();
        break;
      }
    }
  };

  const { clearSets } = useExercisesStore();

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
