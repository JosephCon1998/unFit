import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";

import Divider from "@/components/Shared/Divider";
import {
  Icon,
  Pressable,
  PressableText,
  ScrollView,
  Spacer,
  Text,
  View,
} from "@/components/Themed";
import { usePersistedStore } from "@/components/Workouts/utils/store";
import { globalStyles } from "@/constants/Styles";
import {
  borderWidth,
  fontSizes,
  fontWeights,
  opacity,
  radii,
  spacing,
} from "@/constants/Vars";
import { useBackgroundShades } from "@/hooks";

const WelcomeScreen = () => {
  const { navigate } = useRouter();
  const { md: backgroundColor } = useBackgroundShades();
  const { updateShowWelcomeOnStartup } = usePersistedStore();

  /**
   * Immediately set flag for never showing this screen again
   */
  useEffect(() => {
    updateShowWelcomeOnStartup(false);
  }, []);

  return (
    <>
      <ScrollView>
        <View style={styles.welcome}>
          <Text style={{ fontSize: fontSizes.lg, opacity: opacity.md }}>
            Welcome
          </Text>

          <Spacer size="lg" noFlex />

          <View style={[styles.appIcon, { backgroundColor }]}>
            <Image
              style={{ width: 150, height: 150, borderRadius: radii.xl + 8 }}
              source={require("../assets/images/icon.png")}
            />
          </View>

          <Spacer size="lg" noFlex />

          <Text
            style={{ fontSize: fontSizes.xxl, fontWeight: fontWeights.bold }}
          >
            unFit
          </Text>

          <Spacer size="lg" noFlex />

          <Text style={{ textAlign: "center", opacity: opacity.md }}>
            unFit is a lightweight workout tracker designed to record your
            progress as quick as you can open the app.
          </Text>

          <Divider margin />

          <Text style={{ textAlign: "center", opacity: opacity.md }}>
            To learn how to use the app, open the quickstart guide
          </Text>

          <Spacer size="lg" noFlex />

          <Link href="/quickstart" asChild>
            <Pressable variant="border" style={globalStyles.hstack}>
              <PressableText>Quickstart guide</PressableText>
              <Spacer horizontal />
              <Icon name={{ ios: "questionmark.circle", android: "help" }} />
            </Pressable>
          </Link>
        </View>
      </ScrollView>
      <SafeAreaView style={styles.footer}>
        <Divider style={{ marginBottom: spacing.xs }} />
        <View
          style={{ padding: spacing.md, width: "100%", alignItems: "center" }}
        >
          <Pressable
            onPress={() => navigate("/")}
            variant="tint"
            style={{ width: "100%" }}
          >
            <PressableText>Get started</PressableText>
          </Pressable>

          <Text style={{ opacity: opacity.sm, marginTop: spacing.md }}>
            Thanks for using the app, enjoy!
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    padding: spacing.xl,
    alignItems: "center",
  },
  appIcon: {
    borderRadius: radii.xl + 8,
    borderWidth: borderWidth.thin,
  },
  footer: {
    alignItems: "center",
  },
});
