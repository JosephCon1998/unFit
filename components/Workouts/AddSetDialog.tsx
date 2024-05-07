import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, LayoutAnimation } from "react-native";
import uuid from "react-native-uuid";

import { useUnitOfMeasurements } from "./utils/hooks";
import { useExercisesStore, useTemporaryStore } from "./utils/store";
import { Set } from "./utils/types";
import Dialog from "../Shared/Dialog";
import { Spacer, Text, TextInput, View } from "../Themed";

import { emptyString } from "@/constants/Misc";
import { globalStyles } from "@/constants/Styles";
import { fontSizes, fontWeights, opacity, spacing } from "@/constants/Vars";
import { wait } from "@/utils";

const REPS_WEIGHT = 0;
const DISTANCE_TIME = 1;
const DECIMAL_REGEX = /(?=.*\..*\.)^.*$/;

type PartialSet = Partial<Set>;

const initialSet: PartialSet = {
  distance: "",
  time: "",
  weight: "",
  reps: "",
  note: "",
};

const AddSetDialog = () => {
  const { updateDialog, dialogs, dialogData } = useTemporaryStore();
  const [setType, setSetType] = useState(REPS_WEIGHT);
  const [set, setSet] = useState<PartialSet>(initialSet);

  const { distance, weight } = useUnitOfMeasurements();
  const { addSet } = useExercisesStore();

  function createSet(): PartialSet {
    return {
      ...initialSet,
      id: uuid.v4().toString(),
      dateCreated: new Date().toISOString(),
    };
  }

  useEffect(() => {
    if (dialogs.addEntry) {
      setSet(createSet());
    }
  }, [dialogs.addEntry]);

  return (
    <Dialog
      height={550}
      opened={dialogs.addEntry}
      onSave={() => {
        LayoutAnimation.easeInEaseOut();
        addSet(dialogData.addEntry.id, set);
        updateDialog("addEntry", false);
        wait(1000).then(() => {
          DeviceEventEmitter.emit("set-added");
        });
      }}
      onClose={() => {
        updateDialog("addEntry", false);
      }}
    >
      <Text style={{ opacity: opacity.sm, fontSize: fontSizes.sm }}>
        {dialogData.addEntry?.name ?? emptyString}
      </Text>

      <Spacer size="xs" />

      <Text style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>
        Add set
      </Text>

      <SegmentedControl
        style={{ marginTop: spacing.md }}
        values={["R / W", "D / T"]}
        selectedIndex={setType}
        onChange={(event) => {
          switch (event.nativeEvent.selectedSegmentIndex) {
            case DISTANCE_TIME:
              setSetType(DISTANCE_TIME);
              break;
            case REPS_WEIGHT:
              setSetType(REPS_WEIGHT);
              break;
          }
        }}
      />

      <Spacer size="lg" />

      <View style={globalStyles.hstack}>
        <Text>
          {setType === DISTANCE_TIME ? `Distance (${distance})` : `Reps`}
        </Text>
        <Spacer />
        <TextInput
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
          {setType === DISTANCE_TIME ? `Time (m.ss)` : `Weight (${weight})`}
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
        style={{ width: "100%", textAlign: "left", minHeight: 100 }}
      />
    </Dialog>
  );
};

export default AddSetDialog;
