import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { useCallback, useMemo } from "react";
import { Alert, LayoutAnimation, StyleSheet } from "react-native";
import {
  ContextMenuButton,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";

import Divider from "@/components/Shared/Divider";

import {
  FlatList,
  Icon,
  Pressable,
  ScrollView,
  Spacer,
  Text,
  TextInput,
  View,
} from "@/components/Themed";

import { LibraryToggleEnum } from "@/components/Workouts/utils/enums";

import {
  useExercisesStore,
  useSpacesStore,
  useTemporaryStore,
  useWorkoutsStore,
} from "@/components/Workouts/utils/store";

import {
  libraryExercisesContextMenuConfig,
  libraryWorkoutsContextMenuConfig,
} from "@/config/ContextMenus";

import { Exercise, Workout } from "@/components/Workouts/utils/types";
import { emptyString } from "@/constants/Misc";
import { globalStyles } from "@/constants/Styles";
import { fontSizes, opacity, spacing } from "@/constants/Vars";
import { useSortedArray } from "@/hooks";
import { formatDateToNow, noOp } from "@/utils";

const WorkoutsFlatlist = () => {
  const { workouts, deleteWorkout, updateWorkout } = useWorkoutsStore();

  const { updateSpace } = useSpacesStore();

  const { selected, updateSelected } = useTemporaryStore();

  const sortedWorkouts = useSortedArray(workouts, "name");

  function showDeleteWorkoutWarning(id: string) {
    Alert.alert(
      "Delete workout",
      "Are you sure you want to delete this workout? No exercises will be deleted, only the workout.",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.easeInEaseOut();
            deleteWorkout(id);
          },
        },
        {
          text: "Cancel",
          onPress: noOp,
        },
      ]
    );
  }

  function showRenameWorkoutPrompt(id: string, name: string) {
    Alert.prompt(
      "Rename workout",
      undefined,
      [
        {
          text: "Rename",
          onPress: (t) => updateWorkout(id, { name: t }),
        },
        {
          text: "Cancel",
          onPress: noOp,
          style: "cancel",
        },
      ],
      "plain-text",
      name
    );
  }

  function onPressMenuItem(
    e: OnPressMenuItemEventObject,
    id: string,
    name: string
  ) {
    switch (e.nativeEvent.actionKey) {
      case "delete-workout": {
        showDeleteWorkoutWarning(id);
        break;
      }
      case "rename-workout": {
        showRenameWorkoutPrompt(id, name);
        break;
      }
    }
  }

  function onPress(workoutId: string) {
    updateSelected("workoutId", workoutId);
    updateSpace(selected.spaceId, { workoutId });
  }

  const isInSpace = useCallback(
    (id: string) => {
      return selected.workoutId === id;
    },
    [selected]
  );

  return (
    <FlatList
      scrollEnabled={false}
      data={sortedWorkouts}
      ItemSeparatorComponent={Divider}
      keyExtractor={(e) => e.id}
      renderItem={({ item, index }: { item: Workout; index: number }) => {
        return (
          <View style={[globalStyles.hstack, styles.li]}>
            <Pressable
              style={{
                padding: spacing.none,
                alignItems: "flex-start",
                borderRadius: 0,
                flex: 1,
              }}
              onPress={() => onPress(item.id)}
            >
              <Text>{item.name}</Text>
              <Spacer size="xs" />
              <Text style={{ fontSize: fontSizes.xs, opacity: opacity.md }}>
                You created this {formatDateToNow(item.dateCreated)}
              </Text>
            </Pressable>
            <Spacer horizontal />
            {isInSpace(item.id) && (
              <>
                <Icon
                  useTintColor
                  name={{
                    ios: "checkmark",
                    android: "check",
                  }}
                />
                <Spacer size="md" horizontal />
              </>
            )}
            <ContextMenuButton
              onPressMenuItem={(e) => onPressMenuItem(e, item.id, item.name)}
              menuConfig={libraryWorkoutsContextMenuConfig}
            >
              <Icon
                style={{ opacity: opacity.md }}
                name={{
                  ios: "ellipsis",
                  android: "ellipsis",
                }}
              />
            </ContextMenuButton>
          </View>
        );
      }}
    />
  );
};

const ExercisesFlatlist = () => {
  const { exercises, removeExercise, renameExercise } = useExercisesStore();

  const { selected } = useTemporaryStore();

  const { workouts, updateWorkout } = useWorkoutsStore();

  const sortedExercises = useSortedArray(exercises, "name");

  function onPress(exerciseId: string) {
    const index = workouts.findIndex((w) => w.id === selected.workoutId);

    if (isAdded(exerciseId)) {
      const exercises = workouts[index].exercises.filter(
        (e) => e !== exerciseId
      );
      updateWorkout(selected.workoutId, {
        exercises,
      });
    } else {
      const exercises = [...workouts[index].exercises, exerciseId];
      updateWorkout(selected.workoutId, {
        exercises,
      });
    }
  }

  function showRemoveExerciseWarning(id: string) {
    Alert.alert(
      "Delete exercise",
      "Are you sure you want to delete this exercise? All the sets recorded will be lost.",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.easeInEaseOut();
            removeExercise(id);
          },
        },
        {
          text: "Cancel",
          onPress: noOp,
        },
      ]
    );
  }

  function showRenameExercisePrompt(id: string, name: string) {
    Alert.prompt(
      "Rename exercise",
      undefined,
      [
        {
          text: "Rename",
          onPress: (t) => renameExercise(id, t ?? emptyString),
        },
        {
          text: "Cancel",
          onPress: noOp,
          style: "cancel",
        },
      ],
      "plain-text",
      name
    );
  }

  function onPressMenuItem(
    e: OnPressMenuItemEventObject,
    id: string,
    name: string
  ) {
    switch (e.nativeEvent.actionKey) {
      case "delete-exercise": {
        showRemoveExerciseWarning(id);
        break;
      }
      case "rename-exercise": {
        showRenameExercisePrompt(id, name);
        break;
      }
    }
  }

  const isAdded = useCallback(
    (id: string) => {
      const derived = workouts.find((w) => w.id === selected.workoutId);
      return derived?.exercises.includes(id);
    },
    [selected, workouts]
  );

  const doesSpaceIncludeWorkout = useMemo(() => {
    return !!workouts.find((w) => w.id === selected.workoutId);
  }, [workouts, selected]);

  if (!doesSpaceIncludeWorkout) {
    return (
      <View style={{ paddingHorizontal: spacing.md }}>
        <Text style={{ opacity: opacity.md }}>
          You must have a workout added to your space to add exercises to it.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      scrollEnabled={false}
      data={sortedExercises}
      ItemSeparatorComponent={Divider}
      keyExtractor={(e) => e.id}
      renderItem={({ item, index }: { item: Exercise; index: number }) => (
        <View style={[globalStyles.hstack, styles.li]}>
          <Pressable
            style={{
              padding: spacing.none,
              alignItems: "flex-start",
              borderRadius: 0,
              flex: 1,
            }}
            onPress={() => onPress(item.id)}
          >
            <TextInput
              keyboardType="ascii-capable"
              editable={false}
              textAlign="left"
              minimal
              value={item.name}
            />
            <Spacer size="xs" />
            <Text style={{ fontSize: fontSizes.xs, opacity: opacity.md }}>
              You added this{" "}
              {formatDateToNow(item.dateAdded ?? new Date().toISOString())}, it
              has {item.entries.length} entr
              {item.entries.length > 1 || item.entries.length === 0
                ? "ies"
                : "y"}
            </Text>
          </Pressable>
          <Spacer horizontal />
          {isAdded(item.id) && (
            <>
              <Icon
                useTintColor
                name={{
                  ios: "checkmark",
                  android: "check",
                }}
              />
              <Spacer size="md" horizontal />
            </>
          )}
          <ContextMenuButton
            onPressMenuItem={(e) => onPressMenuItem(e, item.id, item.name)}
            menuConfig={libraryExercisesContextMenuConfig}
          >
            <Icon
              style={{ opacity: opacity.md }}
              name={{
                ios: "ellipsis",
                android: "ellipsis",
              }}
            />
          </ContextMenuButton>
        </View>
      )}
    />
  );
};

export default function LibraryScreen() {
  const { toggles, updateToggles } = useTemporaryStore();

  const { spaces } = useSpacesStore();

  const { workouts } = useWorkoutsStore();

  const { selected } = useTemporaryStore();

  const workoutName =
    workouts.find((w) => w.id === selected.workoutId)?.name ?? emptyString;

  const spaceName =
    spaces.find((w) => w.id === selected.spaceId)?.name ?? emptyString;

  const title =
    toggles.library === LibraryToggleEnum.Exercises
      ? `Tap an exercise to add it your "${workoutName}" workout.`
      : `Tap a workout in your list to make it the workout for your "${spaceName}" space`;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={{ opacity: opacity.md }}>{title}</Text>
            <Spacer />
            <SegmentedControl
              values={["Workouts", "Exercises"]}
              selectedIndex={toggles.library}
              onChange={(event) => {
                updateToggles(
                  "library",
                  event.nativeEvent.selectedSegmentIndex
                );
              }}
            />
          </View>
          <Spacer />
          {toggles.library === LibraryToggleEnum.Exercises ? (
            <ExercisesFlatlist />
          ) : (
            <WorkoutsFlatlist />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
  },
  li: {
    padding: spacing.md,
  },
});
