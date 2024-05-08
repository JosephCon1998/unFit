import { LayoutAnimation, SafeAreaView, StyleSheet } from "react-native";

import exercisesJSON from "../../exercises.json";

import Divider from "@/components/Shared/Divider";

import { Haptics } from "@/utils";

import {
  FlatList,
  Pressable,
  PressableText,
  Spacer,
  Text,
  TextInput,
  View,
} from "@/components/Themed";
import { useAddExerciseFromListStore } from "@/components/Workouts/utils/store";
import { Exercise } from "@/components/Workouts/utils/types";
import { globalStyles } from "@/constants/Styles";
import {
  borderWidth,
  fontSizes,
  fontWeights,
  opacity,
  radii,
  spacing,
} from "@/constants/Vars";
import { useBackgroundShades } from "@/hooks";
import React, { useMemo, useState } from "react";

const SearchInput = ({ search, setSearch }: any) => {
  return (
    <TextInput
      value={search}
      onChangeText={(text) => setSearch(text)}
      keyboardType="ascii-capable"
      textAlign="left"
      style={{
        width: "100%",
        height: 60,
        paddingHorizontal: spacing.md,
      }}
      placeholder="Search..."
    />
  );
};

const ExerciseLi = ({
  item,
}: {
  item: Exercise;
  index: number;
  setSelectedExercise: any;
  selectedExercises: Exercise[];
}) => {
  const { lg: backgroundColor } = useBackgroundShades();

  const { exercises: selectedExercises, setExercises: setSelectedExercise } =
    useAddExerciseFromListStore();

  function onPress() {
    LayoutAnimation.easeInEaseOut();
    if (isAdded) {
      setSelectedExercise(selectedExercises.filter((e) => e.id !== item.id));
    } else {
      setSelectedExercise([item, ...selectedExercises]);
    }
  }

  const isAdded = useMemo(() => {
    return selectedExercises.includes(item);
  }, [selectedExercises]);

  return (
    <Pressable
      style={[
        styles.li,
        { backgroundColor: isAdded ? backgroundColor : "transparent" },
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          marginRight: "auto",
          fontWeight: fontWeights.semibold,
        }}
      >
        {item.name}
      </Text>
      <Spacer />
      <View style={globalStyles.hstack}>
        {item.muscleGroups.map((mg: string, i) => (
          <React.Fragment key={i}>
            <Pressable
              style={{
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.md,
              }}
              variant="border"
            >
              <PressableText
                style={{
                  fontWeight: fontWeights.regular,
                  fontSize: fontSizes.sm,
                  opacity: 0.5,
                }}
                key={mg}
              >
                {mg}
              </PressableText>
            </Pressable>
            <Spacer horizontal />
          </React.Fragment>
        ))}
      </View>
    </Pressable>
  );
};

export default function AddExerciseScreen() {
  const { lg: backgroundColor } = useBackgroundShades();

  const { exercises: selectedExercises, setExercises: setSelectedExercise } =
    useAddExerciseFromListStore();

  const [search, setSearch] = useState("");

  const exercises: Exercise[] = useMemo(() => {
    return exercisesJSON.exercises.map((e) => ({
      ...e,
      id: e.name,
      entries: [],
    }));
  }, []);

  const filteredExercises: Exercise[] = useMemo(() => {
    if (search.length === 0) return exercises;
    return exercises.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  function onRemove(id: string) {
    LayoutAnimation.easeInEaseOut();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedExercise(selectedExercises.filter((e) => e.id !== id));
  }

  return (
    <>
      <FlatList
        ItemSeparatorComponent={Divider}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(e: Exercise) => e.id}
        ListHeaderComponent={
          <View style={{ marginHorizontal: spacing.md }}>
            <Spacer size="xs" />
            <Text style={{ opacity: opacity.md }}>
              Choose an exercise from the list below to add to your library
            </Text>
            <Spacer />
            <SearchInput search={search} setSearch={setSearch} />
            <Spacer size="sm" />
          </View>
        }
        data={filteredExercises}
        renderItem={({ item, index }) => (
          <ExerciseLi
            item={item}
            index={index}
            selectedExercises={selectedExercises}
            setSelectedExercise={setSelectedExercise}
          />
        )}
      />
      <SafeAreaView>
        <View style={styles.footer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <Spacer horizontal />}
            data={selectedExercises}
            renderItem={({
              item,
              index,
            }: {
              item: Exercise;
              index: number;
            }) => (
              <Pressable
                onLongPress={() => onRemove(item.id)}
                style={[styles.selected, { backgroundColor }]}
              >
                <Text>{item.name}</Text>
              </Pressable>
            )}
          />
          {selectedExercises.length > 0 && (
            <Text
              style={{
                opacity: opacity.sm,
                textAlign: "center",
                fontSize: fontSizes.xs,
                marginTop: spacing.sm,
              }}
            >
              Hold to remove
            </Text>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  li: {
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 0,
  },
  header: {},
  footer: {
    borderTopWidth: borderWidth.thin,
    padding: spacing.md,
  },
  selected: {
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderWidth: borderWidth.thin,
  },
});
