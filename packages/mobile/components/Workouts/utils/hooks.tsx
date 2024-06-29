import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { selectedExerciseAtom } from "./atoms";
import { UnitOfMeasurement } from "./enums";
import { useExercisesStore, useSettingsStore } from "./store";

export const useUnitOfMeasurements = () => {
  const { unitOfMeasurement } = useSettingsStore();

  const weight = unitOfMeasurement === UnitOfMeasurement.Imperial ? "lb" : "kg";
  const distance =
    unitOfMeasurement === UnitOfMeasurement.Imperial ? "mi" : "ki";

  return {
    weight,
    distance,
  };
};

export const useExercise = () => {
  const { exercises } = useExercisesStore();

  const selectedExercise = useAtomValue(selectedExerciseAtom);

  const exercise = useMemo(() => {
    return exercises.find((re) => re.id === selectedExercise?.id);
  }, [exercises, selectedExercise]);

  return exercise;
};
