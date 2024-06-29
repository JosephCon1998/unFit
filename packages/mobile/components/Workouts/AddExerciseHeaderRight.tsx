import React from "react";

import { opacity } from "@/constants/Vars";
import { useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "../Themed";
import { useAddExerciseFromListStore, useExercisesStore } from "./utils/store";

const AddExerciseHeaderRight = () => {
  const { exercises: selectedExercises, setExercises } =
    useAddExerciseFromListStore();

  const { addExercises } = useExercisesStore();

  const { goBack } = useNavigation();

  function onPress() {
    addExercises(selectedExercises);
    setExercises([]);
    goBack();
  }

  return (
    <Pressable onPress={onPress} disabled={selectedExercises.length === 0}>
      <Text
        useTintColor
        style={{
          opacity: selectedExercises.length > 0 ? opacity.opaque : opacity.sm,
        }}
      >
        Add
      </Text>
    </Pressable>
  );
};

export default AddExerciseHeaderRight;
