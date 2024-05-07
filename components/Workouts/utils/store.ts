import uuid from "react-native-uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LibraryToggleEnum, UnitOfMeasurement } from "./enums";
import { Exercise, Set, Space, Workout } from "./types";

import Colors from "@/constants/Colors";

// Temporary state
interface TemporaryActions {
  updateSelected: (key: keyof TemporaryData["selected"], value: string) => void;
  updateToggles: (key: keyof TemporaryData["toggles"], value: any) => void;
  updateDialog: (key: keyof TemporaryData["dialogs"], value: boolean) => void;
  updateDialogData: (
    key: keyof TemporaryData["dialogData"],
    value: any,
  ) => void;
}

interface TemporaryData {
  selected: {
    spaceId: string;
    workoutId: string;
  };
  toggles: {
    library: LibraryToggleEnum;
  };
  dialogs: {
    notes: boolean;
    addEntry: boolean;
    steps: boolean;
  };
  dialogData: {
    notes: string;
    addEntry: any;
    steps: string[];
  };
}

type TemporaryState = TemporaryData & TemporaryActions;

const initialTemporaryState: TemporaryData = {
  selected: {
    spaceId: "",
    workoutId: "",
  },
  toggles: {
    library: LibraryToggleEnum.Exercises,
  },
  dialogs: {
    addEntry: false,
    steps: false,
    notes: false,
  },
  dialogData: {
    notes: "",
    addEntry: null,
    steps: [],
  },
};

export const useTemporaryStore = create<TemporaryState>()((set, get) => ({
  ...initialTemporaryState,
  updateSelected(key, value) {
    set({ selected: { ...get().selected, [key]: value } });
  },
  updateToggles(key, value) {
    set({ toggles: { ...get().toggles, [key]: value } });
  },
  updateDialog(key, value) {
    set({ dialogs: { ...get().dialogs, [key]: value } });
  },
  updateDialogData(key, value) {
    set({ dialogData: { ...get().dialogData, [key]: value } });
  },
}));

// Exercises

interface ExercisesActions {
  updateSet: ({
    exerciseId,
    setId,
    key,
    value,
  }: {
    exerciseId: string;
    setId: string;
    key: keyof Set;
    value: string;
  }) => void;
  addSet: (exerciseId: string, set: Partial<Set>) => void;
}

interface ExercisesData {
  exercises: Exercise[];
}

type ExercisesState = ExercisesData & ExercisesActions;

const initialExercisesState: ExercisesData = {
  exercises: [
    {
      name: "Air Squats",
      dateAdded: new Date().toISOString(),
      description:
        "A basic squat without weights to engage the legs and glutes.",
      steps: [
        "Stand with feet shoulder-width apart.",
        "Bend your knees and lower into a squat.",
        "Return to the starting position.",
      ],
      muscleGroups: ["Legs", "Glutes"],
      id: "Bicep Curl",
      entries: [
        {
          id: "Test",
          dateCreated: new Date().toISOString(),
          reps: "10",
          weight: "100",
          distance: "",
          time: "",
          note: "",
        },
      ],
    },
    {
      id: "Jumping jacks",
      name: "Alternating Lunges",
      dateAdded: new Date().toISOString(),
      description:
        "A lower-body exercise that alternates lunging with each leg.",
      steps: [
        "Stand with feet hip-width apart.",
        "Step forward with one leg and lower into a lunge.",
        "Return to the starting position and switch legs.",
      ],
      muscleGroups: ["Legs", "Glutes"],
      entries: [],
    },
  ],
};

export const useExercisesStore = create<ExercisesState>()(
  persist(
    (set, get) => ({
      ...initialExercisesState,
      addSet(exerciseId, newSet) {
        const { exercises } = get();
        const index = exercises.findIndex(
          (exercise) => exercise.id === exerciseId,
        );
        if (index === -1) return;
        const updatedExercises = exercises.map((exercise, idx) => {
          if (idx === index) {
            return {
              ...exercise,
              entries: [newSet, ...exercise.entries] as Set[],
            };
          }
          return exercise;
        });

        set({ exercises: updatedExercises });
      },
      updateSet({ exerciseId, setId, key, value }) {
        const { exercises } = get();
        const exerciseIndex = exercises.findIndex(
          (exercise) => exercise.id === exerciseId,
        );
        if (exerciseIndex === -1) return;
        const updatedExercises = exercises.map((exercise, idx) => {
          if (idx === exerciseIndex) {
            const updatedEntries = exercise.entries.map((entry) => {
              if (entry.id === setId) {
                return {
                  ...entry,
                  [key]: value,
                };
              }
              return entry;
            });
            return {
              ...exercise,
              entries: updatedEntries,
            };
          }
          return exercise;
        });
        set({ exercises: updatedExercises });
      },
    }),
    {
      name: "exercises-storage",
      version: 1,
    },
  ),
);

// Workouts

interface WorkoutsActions {
  addWorkout: ({ name, icon }: { name: string; icon: string }) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, partialWorkout: Partial<Workout>) => void;
}

interface WorkoutsData {
  workouts: Workout[];
}

type WorkoutsState = WorkoutsActions & WorkoutsData;

const initialWorkoutsState: WorkoutsData = {
  workouts: [
    {
      name: "Chest and abs",
      exercises: ["Bicep Curl", "Jumping jacks"],
      icon: "",
      id: "Chest and abs",
      dateCreated: new Date().toISOString(),
    },
    {
      name: "Pull ups",
      exercises: ["Jumping jacks"],
      icon: "",
      id: "Back and forearms",
      dateCreated: new Date().toISOString(),
    },
  ],
};

export const useWorkoutsStore = create<WorkoutsState>()(
  persist(
    (set, get) => ({
      ...initialWorkoutsState,
      addWorkout({ name, icon }) {
        const w: Workout = {
          name,
          icon,
          dateCreated: new Date().toISOString(),
          exercises: [],
          id: uuid.v4().toString(),
        };
        set({ workouts: [...get().workouts, w] });
      },
      deleteWorkout(id) {
        set({
          workouts: get().workouts.filter((workout) => workout.id !== id),
        });
      },
      updateWorkout(id, partialWorkout) {
        set({
          workouts: get().workouts.map((workout) =>
            workout.id === id ? { ...workout, ...partialWorkout } : workout,
          ),
        });
      },
    }),
    {
      name: "workouts-storage",
      version: 1,
    },
  ),
);

// Spaces

interface SpacesActions {
  addSpace: (name: string) => void;
  reorderSpaces: (updatedList: Space[]) => void;
  updateSpace: (
    id: string,
    updates: Exclude<Partial<Space>, { id: string }>,
  ) => void;
  deleteSpace: (id: string) => void;
}

interface SpacesData {
  spaces: Space[];
}

type SpacesState = SpacesActions & SpacesData;

const initialSpacesStore: SpacesData = {
  spaces: [
    {
      id: "Monday",
      name: "Monday",
      color: "#D0A2F7",
      workoutId: "Chest and abs",
    },
    {
      id: "Tuesday",
      name: "Tuesday",
      color: "#E8A0BF",
      workoutId: "Back and forearms",
    },
    {
      id: "Wednesday",
      name: "Wednesday",
      color: "#94FFD8",
      workoutId: "Test",
    },
    {
      id: "Thursday",
      name: "Thursday",
      color: "#A3D8FF",
      workoutId: "Test",
    },
    {
      id: "Friday",
      name: "Friday",
      color: "#F1F5A8",
      workoutId: "Test",
    },
    {
      id: "Saturday",
      name: "Saturday",
      color: "#FFBE98",
      workoutId: "Test",
    },
    {
      id: "Sunday",
      name: "Sunday",
      color: "#A8DF8E",
      workoutId: "Test",
    },
  ],
};

export const useSpacesStore = create<SpacesState>()(
  persist(
    (set, get) => ({
      ...initialSpacesStore,
      addSpace(name) {
        const space: Space = {
          color: Colors.dark_blue.tint,
          name,
          id: uuid.v4.toString(),
          workoutId: "",
        };
        const spaces = [...get().spaces, space];
        set({ spaces });
      },
      reorderSpaces(spaces) {
        set({ spaces });
      },
      updateSpace(id, updates) {
        const spaces = get().spaces.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              ...updates,
            };
          } else {
            return s;
          }
        });
        set({ spaces });
      },
      deleteSpace(id) {
        const spaces = get().spaces.filter((s) => s.id !== id);
        set({ spaces });
      },
    }),
    {
      name: "spaces-storage",
      version: 1,
    },
  ),
);

// Settings

interface SettingsActions {
  updateUnitOfMeasurement: (unitOfMeasurement: UnitOfMeasurement) => void;
}

interface SettingsData {
  unitOfMeasurement: UnitOfMeasurement;
}

type SettingsState = SettingsActions & SettingsData;

const initialSettingsStore: SettingsData = {
  unitOfMeasurement: UnitOfMeasurement.Imperial,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialSettingsStore,
      updateUnitOfMeasurement(unitOfMeasurement) {
        set({ unitOfMeasurement });
      },
    }),
    {
      name: "settings-storage",
      version: 1,
    },
  ),
);
