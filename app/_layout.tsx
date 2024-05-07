import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useThemeColor, useThemeSwitch } from "@/components/Themed";
import AddSetDialog from "@/components/Workouts/AddSetDialog";
import Celebration from "@/components/Workouts/Celebration";
import ExerciseHeaderRight from "@/components/Workouts/ExerciseHeaderRight";
import HeaderRight from "@/components/Workouts/HeaderRight";
import Library from "@/components/Workouts/Library";
import NotesDialog from "@/components/Workouts/NotesDialog";
import StepsDialog from "@/components/Workouts/StepsDialog";
import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { refresh } = useThemeSwitch();
  const colorScheme = useColorScheme();
  const isDarkMode = useColorScheme() === "dark";
  const backgroundColor = useThemeColor("background");
  const tint = useThemeColor("tint");

  useEffect(() => {
    refresh();
  }, [isDarkMode]);

  return (
    <>
      <StatusBar style="auto" />
      <GestureHandlerRootView>
        <View style={{ height: "100%", width: "100%" }}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Celebration />
            <AddSetDialog />
            <StepsDialog />
            <NotesDialog />

            <Stack
              screenOptions={{
                headerTintColor: tint,
                contentStyle: { backgroundColor },
                headerBlurEffect: "regular",
                headerTransparent: true,
                headerLargeTitle: true,
                headerLargeStyle: { backgroundColor },
              }}
            >
              <Stack.Screen
                name="welcome"
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="index"
                options={{
                  title: "Workouts",
                  headerRight: () => <HeaderRight />,
                }}
              />
              <Stack.Screen
                name="library"
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen name="settings" options={{ title: "Settings" }} />
              <Stack.Screen
                name="spaces"
                options={{ title: "Manage spaces" }}
              />
              <Stack.Screen
                name="exercise"
                // @ts-ignore
                options={({ route }) => ({
                  title: route.params.headerTitle,
                  headerRight: () => <ExerciseHeaderRight />,
                })}
              />
            </Stack>
            <Library />
          </ThemeProvider>
        </View>
      </GestureHandlerRootView>
    </>
  );
}
