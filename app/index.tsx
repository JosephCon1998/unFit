import { useRouter } from "expo-router";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import { ScrollView } from "react-native";

import Ad from "@/components/Workouts/Ad";
import SpacesFlatlist from "@/components/Workouts/SpacesFlatlist";
import {
  usePersistedStore,
  useSpacesStore,
  useTemporaryStore,
  useWorkoutsStore,
} from "@/components/Workouts/utils/store";
import { wait } from "@/utils";

export default function WorkoutsScreen() {
  const { navigate } = useRouter();
  const { updateSelected } = useTemporaryStore();
  const { spaces } = useSpacesStore();
  const { workouts } = useWorkoutsStore();
  const { showWelcomeOnStartup } = usePersistedStore();

  useEffect(() => {
    if (showWelcomeOnStartup) {
      wait(1000).then(() => {
        navigate("/welcome");
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Yay! I have user permission to track data");
      }
    })();
  }, []);

  useEffect(() => {
    if (spaces.length > 0 && workouts.length > 0) {
      updateSelected("spaceId", spaces[0].id);
      updateSelected("workoutId", workouts[0].id);
    }
  }, []);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Ad />
        <SpacesFlatlist />
      </ScrollView>
    </>
  );
}
