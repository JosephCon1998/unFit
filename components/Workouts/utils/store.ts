import uuid from "react-native-uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LibraryToggleEnum, UnitOfMeasurement } from "./enums";
import { Exercise, Set, Space, Workout } from "./types";

import Colors from "@/constants/Colors";

// Persisted state

interface PersistedActions {
  updateShowWelcomeOnStartup: (value: boolean) => void;
}

interface PersistedData {
  showWelcomeOnStartup: boolean;
}

type PersistedState = PersistedData & PersistedActions;

const initialPersistedState: PersistedData = {
  showWelcomeOnStartup: true,
};

export const usePersistedStore = create<PersistedState>()(
  persist(
    (set, get) => ({
      ...initialPersistedState,
      updateShowWelcomeOnStartup(showWelcomeOnStartup) {
        set({ showWelcomeOnStartup });
      },
    }),
    {
      name: "persisted-storage",
      version: 1,
    }
  )
);

// Temporary state
interface TemporaryActions {
  updateSelected: (key: keyof TemporaryData["selected"], value: string) => void;
  updateToggles: (key: keyof TemporaryData["toggles"], value: any) => void;
  updateDialog: (key: keyof TemporaryData["dialogs"], value: boolean) => void;
  updateDialogData: (
    key: keyof TemporaryData["dialogData"],
    value: any
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
    notes: {
      setId: string;
      exerciseId: string;
    };
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
    library: LibraryToggleEnum.Workouts,
  },
  dialogs: {
    addEntry: false,
    steps: false,
    notes: false,
  },
  dialogData: {
    notes: {
      exerciseId: "",
      setId: "",
    },
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
  removeExercise: (id: string) => void;
  removeEntry: (exerciseId: string, setId: string) => void;
  clearSets: (exerciseId: string) => void;
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
  addExercise: (name: string) => void;
  renameExercise: (id: string, name: string) => void;
  addExercises: (exercises: Exercise[]) => void;
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
      addExercises(e) {
        const withIds = e.map((i) => ({
          ...i,
          id: uuid.v4().toString(),
          dateAdded: new Date().toISOString(),
        }));
        set({ exercises: [...get().exercises, ...withIds] });
      },
      addExercise(name) {
        const exercises: Exercise[] = [
          ...get().exercises,
          {
            name,
            entries: [],
            description: "",
            id: uuid.v4().toString(),
            muscleGroups: [],
            steps: [],
            dateAdded: new Date().toISOString(),
          },
        ];
        set({ exercises });
      },
      addSet(exerciseId, newSet) {
        const { exercises } = get();
        const index = exercises.findIndex(
          (exercise) => exercise.id === exerciseId
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
          (exercise) => exercise.id === exerciseId
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
      clearSets(exerciseId) {
        set({
          exercises: get().exercises.map((item) => {
            if (item.id === exerciseId) {
              return { ...item, entries: [] };
            } else {
              return { ...item };
            }
          }),
        });
      },
      removeEntry(exerciseId, entryId) {
        set({
          exercises: get().exercises.map((item) => {
            if (item.id === exerciseId) {
              const entries = item.entries.filter((i) => i.id !== entryId);
              return { ...item, entries };
            } else {
              return { ...item };
            }
          }),
        });
      },
      removeExercise(id) {
        set({ exercises: get().exercises.filter((e) => e.id !== id) });
      },
      renameExercise(id, name) {
        const exercises = get().exercises.map((e) => {
          if (e.id === id) {
            return {
              ...e,
              name,
            };
          }
          return e;
        });
        set({ exercises });
      },
    }),
    {
      name: "exercises-storage",
      version: 1,
    }
  )
);

// Workouts

interface WorkoutsActions {
  addWorkout: ({ name }: { name: string }) => void;
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
      addWorkout({ name }) {
        const w: Workout = {
          name,
          icon: "",
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
            workout.id === id ? { ...workout, ...partialWorkout } : workout
          ),
        });
      },
    }),
    {
      name: "workouts-storage",
      version: 1,
    }
  )
);

// Spaces

interface SpacesActions {
  addSpace: (name: string) => void;
  reorderSpaces: (updatedList: Space[]) => void;
  updateSpace: (
    id: string,
    updates: Exclude<Partial<Space>, { id: string }>
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
      workoutId: "",
    },
    {
      id: "Tuesday",
      name: "Tuesday",
      color: "#E8A0BF",
      workoutId: "",
    },
    {
      id: "Wednesday",
      name: "Wednesday",
      color: "#94FFD8",
      workoutId: "",
    },
    {
      id: "Thursday",
      name: "Thursday",
      color: "#A3D8FF",
      workoutId: "",
    },
    {
      id: "Friday",
      name: "Friday",
      color: "#F1F5A8",
      workoutId: "",
    },
    {
      id: "Saturday",
      name: "Saturday",
      color: "#FFBE98",
      workoutId: "",
    },
    {
      id: "Sunday",
      name: "Sunday",
      color: "#A8DF8E",
      workoutId: "",
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
    }
  )
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
    }
  )
);

// Add exercise

interface AddExerciseFromListActions {
  setExercises: (exercises: Exercise[]) => void;
}

interface AddExerciseFromListData {
  exercises: Exercise[];
}

type AddExerciseFromListState = AddExerciseFromListActions &
  AddExerciseFromListData;

const initialAddExerciseFromListState: AddExerciseFromListData = {
  exercises: [],
};

export const useAddExerciseFromListStore = create<AddExerciseFromListState>()(
  (set) => ({
    ...initialAddExerciseFromListState,
    setExercises(exercises) {
      set({ exercises });
    },
  })
);