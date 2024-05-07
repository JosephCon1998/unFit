import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  FlatList,
  PlatformColor,
  StyleSheet,
  useColorScheme,
} from "react-native";
import SwipeableDefault from "react-native-gesture-handler/Swipeable";
import Animated from "react-native-reanimated";

import { useUnitOfMeasurements } from "./utils/hooks";
import { useExercisesStore, useTemporaryStore } from "./utils/store";
import { Set } from "./utils/types";
import {
  Icon,
  Pressable,
  Spacer,
  Text,
  TextInput,
  View,
  ViewProps,
  useThemeColor,
} from "../Themed";

import { globalStyles } from "@/constants/Styles";
import {
  borderWidth,
  fontSizes,
  opacity,
  radii,
  spacing,
} from "@/constants/Vars";
import { useBackgroundShades } from "@/hooks";
import { formatDateToNow } from "@/utils";

const Swipeable = ({
  children,
  onPress,
}: ViewProps & { onPress: () => void }) => {
  const ref = useRef(null);

  const renderRightActions = (progress: any, dragX: any) => {
    return (
      <Animated.View style={styles.rightActions}>
        <Pressable
          onPress={() => {
            onPress?.();
            // @ts-ignore
            ref?.current?.close();
          }}
        >
          <Text>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SwipeableDefault ref={ref} renderRightActions={renderRightActions}>
      {children}
    </SwipeableDefault>
  );
};

const LiValue = ({
  label,
  value,
  exerciseId,
  setId,
}: {
  label: "R" | "W" | "T" | "D";
  exerciseId: string;
  setId: string;
  value: string;
}) => {
  const tint = useThemeColor("tint");
  const { xl, lg } = useBackgroundShades();
  const { updateSet } = useExercisesStore();
  const backgroundColor = useColorScheme() === "dark" ? xl : lg;
  const { distance, weight } = useUnitOfMeasurements();

  function onChangeText(value: string) {
    switch (label) {
      case "R": {
        updateSet({ exerciseId, setId, key: "reps", value });
        break;
      }
      case "W": {
        updateSet({ exerciseId, setId, key: "weight", value });
        break;
      }
      case "T": {
        updateSet({ exerciseId, setId, key: "time", value });
        break;
      }
      case "D": {
        updateSet({ exerciseId, setId, key: "distance", value });
        break;
      }
    }
  }

  const unit =
    label === "R"
      ? "--"
      : label === "W"
        ? weight
        : label === "T"
          ? "--"
          : distance;

  return (
    <View style={[globalStyles.hstack]}>
      <View
        style={{
          flex: 1,
          marginRight: spacing.lg + 5,
        }}
      >
        <Text style={{ textAlign: "center" }}>{label}</Text>
      </View>
      <Spacer />
      <View
        style={{
          borderRadius: radii.sm / 2,
          paddingHorizontal: spacing.xs,
          backgroundColor,
          position: "absolute",
          right: spacing.md,
        }}
      >
        <TextInput
          maxLength={5}
          onChangeText={onChangeText}
          value={value}
          textAlign="right"
          style={{
            textAlign: "right",
            color: tint,
            padding: spacing.none,
            height: "auto",
            width: "auto",
            backgroundColor: "transparent",
            borderWidth: borderWidth.none,
          }}
        />
      </View>
      <Text style={{ opacity: opacity.md, fontSize: fontSizes.sm }}>
        {unit}
      </Text>
    </View>
  );
};

interface LiProps extends Set {
  index: number;
  exerciseId: string;
}
const Li = ({
  id,
  time,
  reps,
  dateCreated,
  distance,
  exerciseId,
  note,
  weight,
}: LiProps & ViewProps) => {
  const backgroundColor = useThemeColor("background");
  const relativeDateCreated = formatDateToNow(dateCreated);

  const { updateDialog, updateDialogData } = useTemporaryStore();

  function onDelete() {
    alert("Deleted");
  }

  // If any value in reps / weight OR showDT and showRW are both empty
  const showRW =
    reps.length > 0 ||
    weight.length > 0 ||
    (distance.length === 0 && time.length === 0);

  const showDT = distance.length > 0 || time.length > 0;

  return (
    <Swipeable onPress={onDelete}>
      <View style={[globalStyles.hstack, styles.li, { backgroundColor }]}>
        <View style={[globalStyles.hstack, { flex: 0.75 }]}>
          <View style={{ marginRight: "auto" }}>
            <Text>{new Date(dateCreated).toLocaleString()}</Text>
            <Text style={styles.relativeDateCreated}>
              {relativeDateCreated}
            </Text>
          </View>
          <Pressable
            style={styles.noteButton}
            onPress={() => {
              updateDialogData("notes", note);
              updateDialog("notes", true);
            }}
          >
            <Icon
              style={{ marginRight: spacing.lg }}
              name={{ android: "file-lines", ios: "note.text" }}
              useTintColor
            />
          </Pressable>
        </View>
        <View
          style={{
            flex: 0.25,
            alignItems: "flex-end",
          }}
        >
          {showRW && (
            <>
              <LiValue
                label="R"
                value={reps}
                setId={id}
                exerciseId={exerciseId}
              />
              <Spacer size="sm" />
              <LiValue
                label="W"
                value={weight}
                setId={id}
                exerciseId={exerciseId}
              />
              {showDT && <Spacer size="sm" />}
            </>
          )}

          {showDT && (
            <>
              <LiValue
                label="D"
                value={distance}
                setId={id}
                exerciseId={exerciseId}
              />
              <Spacer size="sm" />
              <LiValue
                label="T"
                value={time}
                setId={id}
                exerciseId={exerciseId}
              />
            </>
          )}
        </View>
      </View>
    </Swipeable>
  );
};

const SetsFlatlist = () => {
  const { exercises: rawExercises } = useExercisesStore();
  const { id: exerciseId }: { id: string } = useLocalSearchParams();

  const exercise = useMemo(() => {
    return rawExercises.find((re) => re.id === exerciseId);
  }, [rawExercises, exerciseId]);

  const entries = exercise?.entries ?? [];

  return (
    <FlatList
      scrollEnabled={false}
      data={entries}
      contentContainerStyle={styles.flatlist}
      renderItem={({ item, index }) => (
        <Li {...item} index={index} exerciseId={exerciseId} />
      )}
    />
  );
};

export default SetsFlatlist;

const styles = StyleSheet.create({
  flatlist: {
    paddingBottom: spacing.sm * 4.5,
    marginLeft: 10, // this is so the user can swipe back and the list doesn't stop the gesture
  },
  rightActions: {
    backgroundColor: PlatformColor("systemRed"),
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  li: {
    padding: spacing.md,
    paddingLeft: spacing.md - 10, // this is so the user can swipe back and the list doesn't stop the gesture
    borderBottomWidth: borderWidth.thin,
  },
  relativeDateCreated: {
    fontSize: fontSizes.sm,
    marginTop: spacing.sm / 2,
    opacity: 0.5,
  },
  noteButton: {
    margin: 0,
    padding: 0,
  },
});
