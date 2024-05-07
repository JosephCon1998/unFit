import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, StyleSheet } from "react-native";

import {
  Icon,
  Pressable,
  PressableText,
  Spacer,
  Text,
  View,
} from "@/components/Themed";
import SetsFlatlist from "@/components/Workouts/SetsFlatlist";
import { useTemporaryStore } from "@/components/Workouts/utils/store";
import { globalStyles } from "@/constants/Styles";
import { borderWidth, opacity, radii, spacing } from "@/constants/Vars";

export default function ExerciseScreen() {
  const { headerDescription, headerTitle, headerSteps } =
    useLocalSearchParams();

  const { updateDialogData, updateDialog } = useTemporaryStore();

  async function watchTutorial() {
    const query = (headerTitle as string).replace(" ", "+");
    const url = `https://www.youtube.com/results?search_query=easy+"${query}"+tutorial`;
    await WebBrowser.openBrowserAsync(url);
  }

  function showSteps() {
    updateDialogData("steps", JSON.parse(headerSteps as string));
    updateDialog("steps", true);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={{ opacity: opacity.md }}>{headerDescription}</Text>
        <Spacer />
        <View style={globalStyles.hstack}>
          <Pressable
            onPress={showSteps}
            variant="border"
            style={{
              width: 100,
              paddingVertical: spacing.sm,
              borderRadius: radii.xl,
            }}
          >
            <PressableText>Steps</PressableText>
          </Pressable>
          <Spacer horizontal />

          <Pressable
            onPress={watchTutorial}
            variant="tint"
            style={{
              paddingVertical: spacing.sm,
              borderRadius: radii.xl,
              flexDirection: "row",
            }}
          >
            <PressableText useTintColor>Watch tutorial</PressableText>
            <Spacer horizontal size="sm" />
            <Icon name={{ ios: "play.fill", android: "play" }} useTintColor />
          </Pressable>
        </View>
      </View>
      <SetsFlatlist />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: borderWidth.thin,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
