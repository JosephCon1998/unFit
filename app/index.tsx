import { useRouter } from "expo-router";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import { ScrollView } from "react-native";

import Ad from "@/components/Workouts/Ad";
import SpacesFlatlist from "@/components/Workouts/SpacesFlatlist";
import { wait } from "@/utils";

export default function WorkoutsScreen() {
  const { navigate } = useRouter();

  useEffect(() => {
    wait(1000).then(() => {
      navigate("/welcome");
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Yay! I have user permission to track data");
      }
    })();
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
