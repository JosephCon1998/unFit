import React from "react";

import { useTemporaryStore } from "./utils/store";
import Dialog from "../Shared/Dialog";
import Divider from "../Shared/Divider";
import { Spacer, Text, View } from "../Themed";

import { globalStyles } from "@/constants/Styles";
import { fontSizes, fontWeights, opacity } from "@/constants/Vars";

const StepsDialog = () => {
  const { updateDialog, dialogs, dialogData } = useTemporaryStore();

  return (
    <Dialog
      height={256}
      options={{ hideActionButtons: true }}
      opened={dialogs.steps}
      onClose={() => {
        updateDialog("steps", false);
      }}
    >
      <Text style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold }}>
        Steps
      </Text>

      <Spacer size="md" />

      {dialogData?.steps?.map((step, i) => (
        <React.Fragment key={step}>
          <View style={[globalStyles.hstack]}>
            <Text>{i + 1}</Text>
            <Spacer horizontal />
            <Text key={step} style={{ opacity: opacity.md, flex: 1 }}>
              {step}
            </Text>
          </View>
          <Spacer size="md" />
          {i !== dialogData.steps.length - 1 && <Divider />}
          {i !== dialogData.steps.length - 1 && <Spacer size="md" />}
        </React.Fragment>
      ))}
    </Dialog>
  );
};

export default StepsDialog;
