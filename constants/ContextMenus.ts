import { MenuConfig, MenuElementConfig } from "react-native-ios-context-menu";

const item_addSet: MenuElementConfig = {
  actionKey: "add-set",
  actionTitle: "Add set",
  icon: {
    iconType: "SYSTEM",
    iconValue: "plus",
  },
};

const item_deleteSets: MenuElementConfig = {
  actionKey: "delete-sets",
  menuAttributes: ["destructive"],
  actionTitle: "Delete sets",
  icon: {
    iconType: "SYSTEM",
    iconValue: "trash",
  },
};

const item_swapWorkout: MenuElementConfig = {
  actionKey: "swap-workout",
  actionTitle: "Swap workout",
  icon: {
    iconType: "SYSTEM",
    iconValue: "arrow.up.arrow.down",
  },
};

const item_addBlankExercise: MenuElementConfig = {
  actionKey: "add-blank-exercise",
  actionTitle: "Add exercise",
  icon: {
    iconType: "SYSTEM",
    iconValue: "plus",
  },
};

const item_addExerciseFromList: MenuElementConfig = {
  actionKey: "add-exercise-from-list",
  actionTitle: "Add exercise from list",
  icon: {
    iconType: "SYSTEM",
    iconValue: "plus",
  },
};

const item_addWorkout: MenuElementConfig = {
  actionKey: "add-workout",
  actionTitle: "Add workout",
  icon: {
    iconType: "SYSTEM",
    iconValue: "plus",
  },
};

const item_renameExercise: MenuElementConfig = {
  actionKey: "rename-exercise",
  actionTitle: "Rename exercise",
  icon: {
    iconType: "SYSTEM",
    iconValue: "character.cursor.ibeam",
  },
};

const item_deleteExercise: MenuElementConfig = {
  actionKey: "delete-exercise",
  menuAttributes: ["destructive"],
  actionTitle: "Delete exercise",
  icon: {
    iconType: "SYSTEM",
    iconValue: "trash",
  },
};

const item_renameWorkout: MenuElementConfig = {
  actionKey: "rename-workout",
  actionTitle: "Rename workout",
  icon: {
    iconType: "SYSTEM",
    iconValue: "character.cursor.ibeam",
  },
};

const item_deleteWorkout: MenuElementConfig = {
  actionKey: "delete-workout",
  actionTitle: "Delete workout",
  menuAttributes: ["destructive"],
  icon: {
    iconType: "SYSTEM",
    iconValue: "trash",
  },
};

const libraryWorkoutsContextMenuItems: MenuElementConfig[] = [
  item_renameWorkout,
  item_deleteWorkout,
];

const libraryExercisesContextMenuItems: MenuElementConfig[] = [
  item_renameExercise,
  item_deleteExercise,
];

const exerciseHeaderContextMenuItems: MenuElementConfig[] = [
  item_addSet,
  item_deleteSets,
];

export const libraryHeaderRightContextMenuItems_Exercises: MenuElementConfig[] =
  [item_addBlankExercise, item_addExerciseFromList];

export const libraryHeaderRightContextMenuItems_Workouts: MenuElementConfig[] =
  [item_addWorkout];

export const workoutsHeaderContextMenuItems: MenuElementConfig[] = [
  item_swapWorkout,
];

export const libraryWorkoutsContextMenuConfig: MenuConfig = {
  menuTitle: "",
  menuItems: libraryWorkoutsContextMenuItems,
};

export const libraryExercisesContextMenuConfig: MenuConfig = {
  menuTitle: "",
  menuItems: libraryExercisesContextMenuItems,
};

export const workoutsHeaderContextMenuConfig: MenuConfig = {
  menuTitle: "",
  menuItems: workoutsHeaderContextMenuItems,
};

export const exerciseHeaderContextMenuConfig: MenuConfig = {
  menuTitle: "",
  menuItems: exerciseHeaderContextMenuItems,
};
