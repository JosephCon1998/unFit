import uuid from "react-native-uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { LibraryToggleEnum, UnitOfMeasurement } from "./enums";
import { Exercise, Set, Space, Workout } from "./types";

import Colors from "@/constants/Colors";

// Persisted state

interface PersistedActions {
  updateShowWelcomeOnStartup: (value: boolean) => void;
  updateAdFree: (value: boolean) => void;
}

interface PersistedData {
  showWelcomeOnStartup: boolean;
  adFree: boolean;
}

type PersistedState = PersistedData & PersistedActions;

const initialPersistedState: PersistedData = {
  showWelcomeOnStartup: true,
  adFree: false,
};

export const usePersistedStore = create<PersistedState>()(
  persist(
    (set, get) => ({
      ...initialPersistedState,
      updateShowWelcomeOnStartup(showWelcomeOnStartup) {
        set({ showWelcomeOnStartup });
      },
      updateAdFree(adFree) {
        set({ adFree });
      },
    }),
    {
      name: "persisted-storage",
      storage: createJSONStorage(() => AsyncStorage),
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
  reset: () => void;
}

interface ExercisesData {
  exercises: Exercise[];
}

type ExercisesState = ExercisesData & ExercisesActions;

const initialExercisesState: ExercisesData = {
  exercises: [
    {
      name: "Barbell Bench Press",
      dateAdded: new Date().toISOString(),
      description: "An exercise targeting the chest using a barbell.",
      steps: [
        "Lie back on a flat bench with a barbell.",
        "Lower the barbell to your chest.",
        "Press the barbell upwards, extending your arms.",
      ],
      muscleGroups: ["Chest", "Triceps"],
      id: "Barbell Bench Press",
      entries: [],
    },
    {
      name: "Incline Dumbbell Press",
      dateAdded: new Date().toISOString(),
      description: "A dumbbell chest press on an inclined bench.",
      steps: [
        "Sit on an incline bench with a dumbbell in each hand.",
        "Press the dumbbells upward, extending your arms.",
        "Lower the dumbbells back to starting position.",
      ],
      muscleGroups: ["Chest", "Shoulders"],
      id: "Incline Dumbbell Press",
      entries: [],
    },
    {
      name: "Cable Flys",
      dateAdded: new Date().toISOString(),
      description: "A chest exercise performed using a cable machine.",
      steps: [
        "Stand between two cable stations with the pulleys set to chest height.",
        "Hold the handles with your arms extended.",
        "Bring your hands together in front of your chest.",
      ],
      muscleGroups: ["Chest"],
      id: "Cable Flys",
      entries: [],
    },
    {
      name: "Push-ups",
      dateAdded: new Date().toISOString(),
      description: "A bodyweight exercise to strengthen the upper body.",
      steps: [
        "Place your hands on the ground shoulder-width apart.",
        "Lower your body until your chest nearly touches the ground.",
        "Push your body back up to the starting position.",
      ],
      muscleGroups: ["Chest", "Arms", "Core"],
      id: "Push-ups",
      entries: [],
    },
    {
      name: "Hanging Leg Raises",
      dateAdded: new Date().toISOString(),
      description:
        "A core exercise performed by hanging from a bar and raising legs.",
      steps: [
        "Hang from a pull-up bar with your legs straight down.",
        "Raise your legs to make a 90-degree angle with your torso.",
        "Lower your legs back to the starting position.",
      ],
      muscleGroups: ["Core"],
      id: "Hanging Leg Raises",
      entries: [],
    },
    {
      name: "Plank",
      dateAdded: new Date().toISOString(),
      description:
        "A core strengthening exercise that involves maintaining a position similar to a push-up.",
      steps: [
        "Position yourself on your forearms and toes.",
        "Keep your body in a straight line from head to heels.",
        "Hold this position.",
      ],
      muscleGroups: ["Core"],
      id: "Plank",
      entries: [],
    },
    {
      name: "Pull-ups",
      dateAdded: new Date().toISOString(),
      description:
        "An upper-body strength exercise performed by pulling oneself up on a bar.",
      steps: [
        "Grab the pull-up bar with an overhand grip.",
        "Pull your body up until your chin is above the bar.",
        "Lower yourself back to the starting position.",
      ],
      muscleGroups: ["Back", "Arms"],
      id: "Pull-ups",
      entries: [],
    },
    {
      name: "Barbell Deadlift",
      dateAdded: new Date().toISOString(),
      description:
        "A weight lifting exercise where a loaded barbell is lifted off the ground to the level of the hips, then lowered back to the ground.",
      steps: [
        "Stand with your feet hip-width apart, with the barbell over your feet.",
        "Bend at your hips and knees, grab the bar with both hands.",
        "Lift the bar by straightening your hips and knees to a full standing position, then lower the bar to the ground.",
      ],
      muscleGroups: ["Back", "Legs", "Glutes"],
      id: "Barbell Deadlift",
      entries: [],
    },
    {
      name: "Bent Over Rows",
      dateAdded: new Date().toISOString(),
      description:
        "A bodybuilding exercise where the lifter bends over and pulls a weight towards their torso.",
      steps: [
        "Bend over at the waist with knees slightly bent while holding a barbell.",
        "Pull the barbell towards your stomach, keeping your elbows close to your body.",
        "Extend your arms and lower the barbell back to the starting position.",
      ],
      muscleGroups: ["Back", "Biceps"],
      id: "Bent Over Rows",
      entries: [],
    },
    {
      name: "Seated Cable Row",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise that targets the back muscles by pulling a weighted handle towards the body while seated.",
      steps: [
        "Sit on the machine with your feet on the footrest and knees slightly bent.",
        "Grab the handle using both hands.",
        "Pull the handle towards your waist, then slowly let it return to the starting position.",
      ],
      muscleGroups: ["Back"],
      id: "Seated Cable Row",
      entries: [],
    },
    {
      name: "Wrist Curls",
      dateAdded: new Date().toISOString(),
      description: "An exercise targeting the wrist flexors.",
      steps: [
        "Sit on a bench and hold a barbell with your palms facing up.",
        "Rest your forearms on your thighs with your wrists hanging over the edge.",
        "Curl your wrists upwards and then lower them back down.",
      ],
      muscleGroups: ["Forearms"],
      id: "Wrist Curls",
      entries: [],
    },
    {
      name: "Reverse Wrist Curls",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise that focuses on the extensor muscles of the forearm.",
      steps: [
        "Sit on a bench, hold a barbell with your palms facing down.",
        "Rest your forearms on your thighs with wrists hanging over the edge.",
        "Lift your hands up by curling your wrists and then lower them back.",
      ],
      muscleGroups: ["Forearms"],
      id: "Reverse Wrist Curls",
      entries: [],
    },
    {
      name: "Squats",
      dateAdded: new Date().toISOString(),
      description:
        "A compound exercise targeting the lower body, involving bending the knees and lowering the body into a squat position.",
      steps: [
        "Stand with your feet shoulder-width apart.",
        "Lower your body by bending your knees and pushing your hips back as if sitting in a chair.",
        "Return to the starting position by pushing through your heels.",
      ],
      muscleGroups: ["Legs", "Glutes"],
      id: "Squats",
      entries: [],
    },
    {
      name: "Leg Press",
      dateAdded: new Date().toISOString(),
      description:
        "A weight training exercise in which the individual pushes a weight or resistance away from them using their legs.",
      steps: [
        "Sit down on a leg press machine with your back against the pad.",
        "Place your feet on the sled in front of you at shoulder-width.",
        "Push the sled away by extending your knees and hips, then return after a brief pause.",
      ],
      muscleGroups: ["Legs"],
      id: "Leg Press",
      entries: [],
    },
    {
      name: "Lunges",
      dateAdded: new Date().toISOString(),
      description:
        "A single-leg bodyweight exercise that works the legs and improves flexibility.",
      steps: [
        "Stand with your feet hip-width apart.",
        "Step forward with one leg and lower your hips until both knees are bent at about a 90-degree angle.",
        "Return to the starting position and repeat with the other leg.",
      ],
      muscleGroups: ["Legs", "Glutes"],
      id: "Lunges",
      entries: [],
    },
    {
      name: "Leg Curls",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise that primarily targets the hamstrings by curling the legs towards the buttocks.",
      steps: [
        "Lie face down on a leg curl machine with your ankles under the padded bar.",
        "Curl your legs up towards your buttocks by contracting your hamstrings.",
        "Slowly lower the weight back to the starting position.",
      ],
      muscleGroups: ["Hamstrings"],
      id: "Leg Curls",
      entries: [],
    },
    {
      name: "Calf Raises",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise that targets the calf muscles by raising the heels off the ground.",
      steps: [
        "Stand upright and push through the balls of your feet and raise your heel until you are standing on your toes.",
        "Slowly lower back to the start position.",
      ],
      muscleGroups: ["Calves"],
      id: "Calf Raises",
      entries: [],
    },
    {
      name: "Back Extensions",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise that strengthens the lower back muscles by extending the spine against resistance.",
      steps: [
        "Lie face down on a hyperextension bench, tucking your ankles securely under the footpads.",
        "Cross your arms over your chest, bend at the waist, and slowly raise your upper body until your body forms a straight line.",
        "Lower your body back to the initial position.",
      ],
      muscleGroups: ["Lower back"],
      id: "Back Extensions",
      entries: [],
    },
    {
      name: "Overhead Press",
      dateAdded: new Date().toISOString(),
      description:
        "A compound exercise that targets the shoulders and arms by pressing weights overhead from a standing or seated position.",
      steps: [
        "Stand with your feet shoulder-width apart and hold a barbell at shoulder height.",
        "Press the barbell upwards until your arms are fully extended overhead.",
        "Lower the barbell back to shoulder height.",
      ],
      muscleGroups: ["Shoulders", "Arms"],
      id: "Overhead Press",
      entries: [],
    },
    {
      name: "Lateral Raise",
      dateAdded: new Date().toISOString(),
      description:
        "An isolation exercise that targets the shoulder muscles by lifting weights out to the sides.",
      steps: [
        "Stand with your feet shoulder-width apart, holding a dumbbell in each hand at your sides.",
        "Lift the dumbbells out to the sides until they reach shoulder height, then lower them back down.",
      ],
      muscleGroups: ["Shoulders"],
      id: "Lateral Raise",
      entries: [],
    },
    {
      name: "Front Raise",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise that targets the anterior deltoids by raising weights directly in front of you.",
      steps: [
        "Stand with your feet shoulder-width apart, holding a dumbbell in each hand in front of your thighs.",
        "Raise the dumbbells straight in front of you to shoulder height, then lower them back down.",
      ],
      muscleGroups: ["Shoulders"],
      id: "Front Raise",
      entries: [],
    },
    {
      name: "Shrugs",
      dateAdded: new Date().toISOString(),
      description:
        "An exercise focusing on the trapezius muscles by shrugging the shoulders to lift weights held at the sides.",
      steps: [
        "Stand with your feet shoulder-width apart, holding a dumbbell in each hand at your sides.",
        "Raise your shoulders as high as you can, then lower them back down.",
      ],
      muscleGroups: ["Upper back", "Neck"],
      id: "Shrugs",
      entries: [],
    },
    {
      name: "Cable Woodchoppers",
      dateAdded: new Date().toISOString(),
      description:
        "A dynamic exercise that targets the obliques and entire core, mimicking a chopping motion using a cable machine.",
      steps: [
        "Stand with your side to the cable machine, feet shoulder-width apart.",
        "Hold the cable handle with both hands. Start with the handle next to your upper thigh on one side, then pull it diagonally across your body to the opposite shoulder.",
        "Return to the start position and repeat.",
      ],
      muscleGroups: ["Core", "Obliques"],
      id: "Cable Woodchoppers",
      entries: [],
    },
    {
      name: "Russian Twists",
      dateAdded: new Date().toISOString(),
      description:
        "A core exercise that involves twisting the torso with weight in hand while sitting on the floor.",
      steps: [
        "Sit on the floor with your knees bent and feet flat, leaning slightly backward.",
        "Hold a weight with both hands in front of your chest, and rotate your torso from side to side.",
      ],
      muscleGroups: ["Core", "Obliques"],
      id: "Russian Twists",
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
      reset() {
        set(initialExercisesState);
      },
    }),
    {
      name: "exercises-storage",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Workouts

interface WorkoutsActions {
  addWorkout: ({ name }: { name: string }) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, partialWorkout: Partial<Workout>) => void;
  reset: () => void;
}

interface WorkoutsData {
  workouts: Workout[];
}

type WorkoutsState = WorkoutsActions & WorkoutsData;

const initialWorkoutsState: WorkoutsData = {
  workouts: [
    {
      id: "Chest and abs",
      name: "Chest and abs",
      exercises: [
        "Barbell Bench Press",
        "Incline Dumbbell Press",
        "Cable Flys",
        "Push-ups",
        "Hanging Leg Raises",
        "Plank",
      ],
      dateCreated: new Date().toISOString(),
      icon: "",
    },
    {
      id: "Back and forearms",
      name: "Back and forearms",
      exercises: [
        "Pull-ups",
        "Barbell Deadlift",
        "Bent Over Rows",
        "Seated Cable Row",
        "Wrist Curls",
        "Reverse Wrist Curls",
      ],
      dateCreated: new Date().toISOString(),
      icon: "",
    },
    {
      id: "Legs and lower back",
      name: "Legs and lower back",
      exercises: [
        "Squats",
        "Leg Press",
        "Lunges",
        "Leg Curls",
        "Calf Raises",
        "Back Extensions",
      ],
      dateCreated: new Date().toISOString(),
      icon: "",
    },
    {
      id: "Shoulders and abs",
      name: "Shoulders and abs",
      exercises: [
        "Overhead Press",
        "Lateral Raise",
        "Front Raise",
        "Shrugs",
        "Cable Woodchoppers",
        "Russian Twists",
      ],
      dateCreated: new Date().toISOString(),
      icon: "",
    },
    {
      id: "Arms",
      name: "Arms",
      exercises: [
        "Barbell Curl",
        "Tricep Dip",
        "Hammer Curl",
        "Skull Crusher",
        "Concentration Curl",
        "Overhead Tricep Extension",
      ],
      dateCreated: new Date().toISOString(),
      icon: "",
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
      reset() {
        set(initialWorkoutsState);
      },
    }),
    {
      name: "workouts-storage",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
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
  reset: () => void;
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
      workoutId: "Legs and lower back",
    },
    {
      id: "Thursday",
      name: "Thursday",
      color: "#A3D8FF",
      workoutId: "Shoulders and abs",
    },
    {
      id: "Friday",
      name: "Friday",
      color: "#F1F5A8",
      workoutId: "Arms",
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
      reset() {
        set(initialSpacesStore);
      },
    }),
    {
      name: "spaces-storage",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Settings

interface SettingsActions {
  updateUnitOfMeasurement: (unitOfMeasurement: UnitOfMeasurement) => void;
  reset: () => void;
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
    (set) => ({
      ...initialSettingsStore,
      updateUnitOfMeasurement(unitOfMeasurement) {
        set({ unitOfMeasurement });
      },
      reset() {
        set(initialSettingsStore);
      },
    }),
    {
      name: "settings-storage",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
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

export const useResetAppData = () => {
  const { reset: resetWorkoutStore } = useWorkoutsStore();
  const { reset: resetExercisesStore } = useExercisesStore();
  const { reset: resetSpacesStore } = useSpacesStore();
  const { reset: resetSettingsStore } = useSettingsStore();

  function run() {
    resetWorkoutStore();
    resetExercisesStore();
    resetSpacesStore();
    resetSettingsStore();
  }

  return run;
};
