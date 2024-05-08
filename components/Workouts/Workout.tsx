import { Link } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Pressable as DefaultPressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  FlatList,
  Icon,
  Pressable,
  Spacer,
  Text,
  View,
  ViewProps,
  useThemeColor,
} from "../Themed";
import {
  useExercisesStore,
  useTemporaryStore,
  useWorkoutsStore,
} from "./utils/store";
import { Exercise as ExerciseType } from "./utils/types";

import { globalStyles } from "@/constants/Styles";
import {
  borderWidth,
  easings,
  fontSizes,
  fontWeights,
  radii,
  spacing,
} from "@/constants/Vars";
import { useSortedArray } from "@/hooks";
import { formatNumberWithCommas } from "@/utils";

export const useAddSet = () => {
  const { updateDialog, updateDialogData } = useTemporaryStore();

  function run(name: string, id: string) {
    updateDialogData("addEntry", { name, id });
    updateDialog("addEntry", true);
  }

  return run;
};

interface LiProps extends ExerciseType {
  index: number;
}
const Li = ({
  index,
  entries,
  name,
  steps,
  description,
  id,
}: ViewProps & LiProps) => {
  const color = useThemeColor("tint");
  const borderColor = useThemeColor("border");

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const addSet = useAddSet();

  const config = {
    duration: (index + 1) * 1000,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  function onPressIn() {
    scale.value = withTiming(0.95, { duration: 250, easing: easings.ease });
  }

  function onPressOut() {
    scale.value = withTiming(1, { duration: 250, easing: easings.ease });
  }

  useEffect(() => {
    opacity.value = withTiming(1, config);
    scale.value = withTiming(1, {
      duration: config.duration - 100,
      easing: easings.ease,
    });
  });

  return (
    <Animated.View style={[animatedStyle, styles.li, { borderColor }]}>
      <Link
        href={{
          pathname: "/exercise",
          params: {
            id,
            headerTitle: name,
            headerDescription: description,
            headerSteps: JSON.stringify(steps),
          },
        }}
        asChild
      >
        <DefaultPressable onPressIn={onPressIn} onPressOut={onPressOut}>
          <View style={globalStyles.hstack}>
            <View style={globalStyles.vstack}>
              <Text style={[styles.li_title, { color }]}>
                {formatNumberWithCommas(entries.length)}
              </Text>
              <Spacer size="xs" />
              <Text style={styles.exercise_name}>{name}</Text>
            </View>
            <Spacer />
            <Pressable
              animation="scale-out"
              style={{
                padding: spacing.sm,
                borderRadius: radii.xl,
              }}
              variant="tint"
              onPress={() => addSet(name, id)}
            >
              <Icon useTintColor name="plus" />
            </Pressable>
          </View>
        </DefaultPressable>
      </Link>
    </Animated.View>
  );
};

interface WorkoutProps {
  workoutId: string;
}
const Workout = ({ workoutId }: WorkoutProps) => {
  const { exercises: rawExercises } = useExercisesStore();
  const { workouts } = useWorkoutsStore();
  const workout = workouts.find((w) => w.id === workoutId);
  const flatlistRef = useRef(null);

  const exercises: ExerciseType[] = useMemo(() => {
    if (!workout?.exercises) return [];
    const idSet = new Set(workout.exercises);
    const filtered = rawExercises.filter((re) => idSet.has(re.id));
    return filtered;
  }, [rawExercises, workout]);

  const sortedExercises = useSortedArray(exercises, "name");

  return (
    <View style={styles.content}>
      <FlatList
        ref={flatlistRef}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        keyExtractor={(d) => d.id}
        data={sortedExercises}
        renderItem={({ item, index }) => <Li {...item} index={index} />}
        ItemSeparatorComponent={Spacer}
      />
    </View>
  );
};

export default Workout;

const styles = StyleSheet.create({
  content: {},
  li: {
    borderWidth: borderWidth.thin,
    borderRadius: radii.lg,
    padding: spacing.lg,
    paddingVertical: spacing.md,
  },
  li_title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  },
  exercise_name: {
    fontWeight: fontWeights.medium,
  },
});
