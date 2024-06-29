import { Stack } from "expo-router";

import { useThemeColor } from "@/components/Themed";
import AddExerciseHeaderRight from "@/components/Workouts/AddExerciseHeaderRight";
import LibraryHeaderRight from "@/components/Workouts/LibraryHeaderRight";

export default function Layout() {
  const color = useThemeColor("text");
  const background = useThemeColor("background");
  const tint = useThemeColor("tint");

  return (
    <Stack
      screenOptions={{
        headerTintColor: tint,
        headerTitleStyle: {
          color,
        },
        headerLargeTitleStyle: {
          color,
        },
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerStyle: {
          backgroundColor: background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Library",
          presentation: "modal",
          headerRight: () => <LibraryHeaderRight />,
        }}
      />
      <Stack.Screen
        name="addExercise"
        options={{
          title: "Add exercise",
          gestureEnabled: false,
          headerRight: () => <AddExerciseHeaderRight />,
        }}
      />
    </Stack>
  );
}
