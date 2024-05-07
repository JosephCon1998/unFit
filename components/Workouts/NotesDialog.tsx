import React from "react";

import { useTemporaryStore } from "./utils/store";
import Dialog from "../Shared/Dialog";
import { Spacer, Text, TextInput } from "../Themed";

import { emptyString } from "@/constants/Misc";
import { fontSizes, fontWeights } from "@/constants/Vars";

const NotesDialog = () => {
  const { updateDialog, dialogs, dialogData } = useTemporaryStore();

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
        value={dialogData.notes}
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
