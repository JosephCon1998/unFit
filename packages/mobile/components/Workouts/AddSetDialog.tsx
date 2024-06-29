import React, { useEffect, useRef, useState } from "react";
import {
  TextInput as DefaultTextInput,
  DeviceEventEmitter,
  LayoutAnimation,
} from "react-native";
import uuid from "react-native-uuid";

import Dialog from "../Shared/Dialog";
import {
  Icon,
  Pressable,
  PressableText,
  Spacer,
  Text,
  TextInput,
  View,
} from "../Themed";
import { useUnitOfMeasurements } from "./utils/hooks";
import { useExercisesStore, useTemporaryStore } from "./utils/store";
import { Set } from "./utils/types";

import { emptyString } from "@/constants/Misc";
import { globalStyles } from "@/constants/Styles";
import { fontSizes, fontWeights, opacity, spacing } from "@/constants/Vars";
import { Haptics, wait } from "@/utils";
import { ImpactFeedbackStyle } from "expo-haptics";
import { atom, useAtom, useAtomValue } from "jotai";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { selectedExerciseAtom } from "./utils/atoms";

const REPS_WEIGHT = "R / W";
const DISTANCE_TIME = "D / T";
const DECIMAL_REGEX = /(?=.*\..*\.)^.*$/;

type PartialSet = Partial<Set>;

const showNotesAtom = atom(false);

type SetViewType = typeof DISTANCE_TIME | typeof REPS_WEIGHT;

const setTypeAtom = atom<SetViewType>(REPS_WEIGHT);

const initialSet: PartialSet = {
  distance: "",
  time: "",
  weight: "",
  reps: "",
  note: "",
};

const AddSetDialog = () => {
  const { updateDialog, dialogs, dialogData } = useTemporaryStore();
  const [set, setSet] = useState<PartialSet>(initialSet);
  const selectedExercise = useAtomValue(selectedExerciseAtom);

  const [setType, setSetType] = useAtom(setTypeAtom);

  const [notes, setNotes] = useAtom(showNotesAtom);

  const rotate = useSharedValue(0);

  const { distance, weight } = useUnitOfMeasurements();
  const { addSet } = useExercisesStore();

  const repsRef = useRef<DefaultTextInput>(null);

  const height = 388;

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  function createSet(): PartialSet {
    const lastExerciseData = selectedExercise?.entries?.[0] || [];

    return {
      ...initialSet,
      ...lastExerciseData,
      id: uuid.v4().toString(),
      dateCreated: new Date().toISOString(),
    };
  }

  function haptics() {
    Haptics.impactAsync(ImpactFeedbackStyle.Light).then(() => {
      wait(250).then(() =>
        Haptics.impactAsync(ImpactFeedbackStyle.Light).then(() => {
          wait(250).then(() =>
            Haptics.impactAsync(ImpactFeedbackStyle.Light).then(() => {
              wait(250).then(() =>
                Haptics.impactAsync(ImpactFeedbackStyle.Heavy)
              );
            })
          );
        })
      );
    });
  }

  useEffect(() => {
    if (dialogs.addEntry) {
      rotate.value = 0;
      setSet(createSet());
      wait(500).then(() => {
        repsRef.current?.focus();
      });
    }
  }, [dialogs.addEntry]);

  return (
    <Dialog
      animation="translate"
      height={height}
      style={{ padding: 0 }}
      opened={dialogs.addEntry}
      onSave={() => {
        LayoutAnimation.easeInEaseOut();
        addSet(dialogData.addEntry.id, set);
        updateDialog("addEntry", false);
        wait(1000).then(() => {
          haptics();
          DeviceEventEmitter.emit("set-added");
        });
      }}
      onClose={() => {
        updateDialog("addEntry", false);
      }}
    >
      <View style={{ padding: spacing.md }}>
        <View
          style={[
            globalStyles.hstack,
            { borderBottomWidth: 1, paddingBottom: spacing.md },
          ]}
        >
          <View>
            <Text style={{ opacity: opacity.sm, fontSize: fontSizes.sm }}>
              {dialogData.addEntry?.name ?? emptyString}
            </Text>

            <Text
              style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}
            >
              Add set
            </Text>
          </View>

          <Spacer />

          <Text>{setType}</Text>
          <Pressable
            animation="scale-out"
            variant="border"
            onPress={() => {
              if (setType === DISTANCE_TIME) {
                rotate.value = withSpring(rotate.value + 360);
                setSetType(REPS_WEIGHT);
              } else {
                rotate.value = withSpring(rotate.value - 360);
                setSetType(DISTANCE_TIME);
              }
            }}
            style={{ padding: spacing.sm, marginLeft: spacing.sm }}
          >
            <Animated.View style={animatedStyles}>
              <Icon name={{ ios: "togglepower", android: "togglepower" }} />
            </Animated.View>
          </Pressable>
        </View>

        <Spacer size="lg" />

        <>
          {!notes && (
            <>
              <View style={globalStyles.hstack}>
                <Text>
                  {setType === DISTANCE_TIME
                    ? `Distance (${distance})`
                    : `Reps`}
                </Text>
                <Spacer />
                <TextInput
                  ref={repsRef}
                  selectTextOnFocus
                  placeholder="0"
                  value={setType === DISTANCE_TIME ? set.distance : set.reps}
                  onChangeText={(text) =>
                    setSet((current) => {
                      if (setType === DISTANCE_TIME) {
                        return {
                          ...current,
                          distance: text,
                        };
                      } else {
                        if (DECIMAL_REGEX.test(text)) {
                          return current;
                        }
                        return {
                          ...current,
                          reps: text.length > 0 ? text : undefined,
                        };
                      }
                    })
                  }
                />
              </View>

              <Spacer size="lg" />

              <View style={globalStyles.hstack}>
                <Text>
                  {setType === DISTANCE_TIME
                    ? `Time (m.ss)`
                    : `Weight (${weight})`}
                </Text>
                <Spacer />
                <TextInput
                  selectTextOnFocus
                  placeholder="0"
                  value={setType === DISTANCE_TIME ? set.time : set.weight}
                  onChangeText={(text) =>
                    setSet((current) => {
                      if (setType === DISTANCE_TIME) {
                        return {
                          ...current,
                          time: text,
                        };
                      } else {
                        if (DECIMAL_REGEX.test(text)) {
                          return current;
                        }
                        return {
                          ...current,
                          weight: text.length > 0 ? text : undefined,
                        };
                      }
                    })
                  }
                />
              </View>

              <Spacer size="lg" />
            </>
          )}
        </>

        {notes && (
          <>
            <TextInput
              multiline
              keyboardType="ascii-capable"
              value={set.note}
              onChangeText={(note) =>
                setSet((current) => ({
                  ...current,
                  note,
                }))
              }
              placeholder="Notes"
              style={{
                width: "100%",
                textAlign: "left",
                minHeight: 116,
              }}
            />
          </>
        )}
        <Pressable
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setNotes(!notes);
          }}
          style={{
            marginLeft: "auto",
            padding: spacing.sm,
            marginTop: notes ? spacing.md : 0,
            marginBottom: notes ? 160 : 0,
            paddingHorizontal: spacing.md,
          }}
          variant="border"
        >
          <PressableText>{notes ? "Done" : "Add notes +"}</PressableText>
        </Pressable>
      </View>
    </Dialog>
  );
};

export default AddSetDialog;
