import React from "react";

import Dialog from "../Shared/Dialog";
import { Spacer, Text, TextInput } from "../Themed";
import { useExercisesStore, useTemporaryStore } from "./utils/store";

import { emptyString } from "@/constants/Misc";
import { fontSizes, fontWeights } from "@/constants/Vars";

const NotesDialog = () => {
  const { updateDialog, dialogs, dialogData } = useTemporaryStore();

  const { updateSet, exercises } = useExercisesStore();

  const { exerciseId, setId } = dialogData.notes;

  const exerciseIndex = exercises.findIndex((e) => e.id === exerciseId);

  const setIndex = exercises[exerciseIndex]?.entries.findIndex(
    (s) => s.id === setId
  );

  const value = exercises[exerciseIndex]?.entries[setIndex].note;

  return (
    <Dialog
      height={296}
      options={{ hideActionButtons: true }}
      opened={dialogs.notes}
      onClose={() => {
        updateDialog("notes", false);
      }}
    >
      <Text style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>
        Notes
      </Text>

      <Spacer size="md" />

      <TextInput
        keyboardType="ascii-capable"
        onChangeText={(text) =>
          updateSet({
            exerciseId: dialogData.notes.exerciseId,
            setId: dialogData.notes.setId,
            key: "note",
            value: text,
          })
        }
        value={value}
        placeholder={emptyString}
        multiline
        textAlignVertical="top"
        textAlign="left"
        style={{ width: "100%", height: 200 }}
      />
    </Dialog>
  );
};

export default NotesDialog;
