import { UnitOfMeasurement } from "./enums";
import { useSettingsStore } from "./store";

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
