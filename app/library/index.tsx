import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useCallback, useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ContextMenuButton } from "react-native-ios-context-menu";

import Divider from "@/components/Shared/Divider";
import {
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
} from "@/constants/ContextMenus";
import { emptyString } from "@/constants/Misc";
import { globalStyles } from "@/constants/Styles";
import { fontSizes, opacity, spacing } from "@/constants/Vars";
import { formatDateToNow } from "@/utils";

// type MuscleGroups =
//   | "Quadriceps"
//   | "Core"
//   | "Glutes"
//   | "Shoulders"
//   | "Back"
//   | "Hamstrings"
//   | "Arms"
//   | "Legs"
//   | "Calves"
//   | "Chest"
//   | "Full Body"
//   | "Triceps"
//   | "Obliques"
//   | "Various"
//   | "Breathing"
//   | "Biceps";

const WorkoutsFlatlist = () => {
  const { workouts } = useWorkoutsStore();
  const { updateSpace } = useSpacesStore();
  const { selected, updateSelected } = useTemporaryStore();

  function onPressMenuItem() {}

  function onPress(workoutId: string) {
    updateSelected("workoutId", workoutId);
    updateSpace(selected.spaceId, { workoutId });
  }

  const isInSpace = useCallback(
    (id: string) => {
      return selected.workoutId === id;
    },
    [selected],
  );

  return (
    <FlatList
      scrollEnabled={false}
      data={workouts}
      ItemSeparatorComponent={Divider}
      keyExtractor={(e) => e.id}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() => onPress(item.id)}
            style={[globalStyles.hstack, styles.li]}
          >
            <View>
              <Text>{item.name}</Text>
              <Spacer size="xs" />
              <Text style={{ fontSize: fontSizes.xs, opacity: opacity.md }}>
                You created this {formatDateToNow(item.dateCreated!)}
              </Text>
            </View>
            <Spacer />
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
              onPressMenuItem={onPressMenuItem}
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
          </Pressable>
        );
      }}
    />
  );
};

const ExercisesFlatlist = () => {
  const { exercises } = useExercisesStore();

  const { selected } = useTemporaryStore();

  const { workouts, updateWorkout } = useWorkoutsStore();

  function onPress(exerciseId: string) {
    const index = workouts.findIndex((w) => w.id === selected.workoutId);

    if (isAdded(exerciseId)) {
      const exercises = workouts[index].exercises.filter(
        (e) => e !== exerciseId,
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

  function onPressMenuItem() {}

  const isAdded = useCallback(
    (id: string) => {
      const derived = workouts.find((w) => w.id === selected.workoutId);
      return derived?.exercises.includes(id);
    },
    [selected, workouts],
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
      data={exercises}
      ItemSeparatorComponent={Divider}
      keyExtractor={(e) => e.id}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => onPress(item.id)}
          style={[globalStyles.hstack, styles.li]}
        >
          <View>
            <TextInput
              keyboardType="ascii-capable"
              editable
              textAlign="left"
              minimal
              value={item.name}
            />
            <Spacer size="xs" />
            <Text style={{ fontSize: fontSizes.xs, opacity: opacity.md }}>
              You added this {formatDateToNow(item.dateAdded!)}, it has{" "}
              {item.entries.length} entr
              {item.entries.length > 1 || item.entries.length === 0
                ? "ies"
                : "y"}
            </Text>
          </View>
          <Spacer />
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
            onPressMenuItem={onPressMenuItem}
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
        </Pressable>
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
              values={["Exercises", "Workouts"]}
              selectedIndex={toggles.library}
              onChange={(event) => {
                updateToggles(
                  "library",
                  event.nativeEvent.selectedSegmentIndex,
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
