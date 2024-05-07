import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { View, ViewProps, useThemeColor } from "../Themed";

import {
  borderWidth,
  easings,
  opacity,
  radii,
  spacing,
} from "@/constants/Vars";

const Library = ({ lightColor, darkColor }: ViewProps) => {
  const { width, height } = useWindowDimensions();

  const textColor = useThemeColor("text");

  const { navigate } = useRouter();

  const pathname = usePathname();

  const translateY = useSharedValue(height - 80);

  const scale = useSharedValue(1);

  const animatedTranslateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  async function vibrate() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedTranslateY.value, [0, -75], [0, 1], "clamp"),
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(vibrate)();
    runOnJS(navigate)("/library");
  });

  useEffect(() => {
    if (pathname === "/") {
      translateY.value = withTiming(height - 80, {
        duration: 500,
        easing: easings.ease,
      });
    } else {
      translateY.value = withTiming(height, {
        duration: 500,
        easing: easings.ease,
      });
    }
  }, [pathname]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      animatedTranslateY.value = e.translationY;
      if (e.translationY > -50) {
        translateY.value += e.y;
      }
    })
    .onEnd((e) => {
      animatedTranslateY.value = withTiming(0, {
        duration: 300,
      });
      translateY.value = withSpring(height - 80);
      if (e.translationY < -50) {
        runOnJS(vibrate)();
        runOnJS(navigate)("/library");
      }
    });

  const composed = Gesture.Race(pan, tap);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[animatedStyle, styles.library, { width, height }]}>
        <View style={styles.content} useBgColor>
          <View
            style={[
              styles.handle,
              {
                backgroundColor: textColor,
                opacity: opacity.sm,
                marginBottom: spacing.sm,
              },
            ]}
          />
          <Animated.Text style={[textAnimatedStyle, { color: textColor }]}>
            Open Library
          </Animated.Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Library;

const styles = StyleSheet.create({
  library: {
    position: "absolute",
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: radii.lg,
  },
  content: {
    padding: spacing.sm,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: borderWidth.thin,
  },
});
