import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { Pressable, PressableText, ViewProps, useThemeColor } from "../Themed";

import {
  borderWidth,
  easings,
  fontSizes,
  radii,
  spacing,
  zIndex,
} from "@/constants/Vars";

interface DialogProps {
  opened: boolean;
  height?: number;
  options?: {
    hideActionButtons?: boolean;
  };
  onSave?: () => void;
  onClose: () => void;
  children?: React.ReactNode | React.ReactNode[];
}
const Dialog = ({
  children,
  opened,
  height = 512,
  onClose,
  onSave,
  options = {
    hideActionButtons: false,
  },
}: DialogProps & ViewProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(100);
  const borderColor = useThemeColor("text");

  const [rendered, setRendered] = useState(false);

  const { width, height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(1);

  const onLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: `${borderColor}20`,
    opacity: withTiming(opacity.value, { duration: 500 }),
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 500 }),
  }));

  useEffect(() => {
    if (opened) {
      opacity.value = 1;
      translateY.value = withDelay(
        150,
        withTiming(0, {
          duration: 500,
          easing: easings.ease,
        })
      );
    } else {
      opacity.value = 0;
      translateY.value = withTiming(100, {
        duration: 500,
        easing: easings.ease,
      });
    }
  }, [opened]);

  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setRendered(false);
      }, 500);
    } else {
      setRendered(true);
    }
  }, [opened]);

  if (!rendered) return null;

  return (
    <>
      <Animated.View
        onLayout={onLayout}
        style={[
          contentAnimatedStyle,
          styles.wrapper,
          { top: windowHeight / 2 - contentHeight / 2 },
        ]}
      >
        <BlurView style={[styles.blur, { height }]} tint="systemMaterial">
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {!options.hideActionButtons && (
            <>
              <Pressable
                animation="scale-in"
                style={{
                  padding: spacing.xs,
                  marginTop: spacing.sm,
                  height: 60,
                  borderRadius: radii.md,
                }}
                onPress={onSave}
                variant="tint"
              >
                <PressableText useTintColor>Save</PressableText>
              </Pressable>

              <Pressable
                onPress={onClose}
                style={{
                  opacity: 0.5,
                  marginTop: spacing.md,
                  padding: spacing.xs,
                  borderWidth: borderWidth.none,
                  backgroundColor: "transparent",
                }}
              >
                <PressableText style={{ fontSize: fontSizes.sm, opacity: 0.5 }}>
                  Cancel
                </PressableText>
              </Pressable>
            </>
          )}
        </BlurView>
      </Animated.View>
      <Animated.View
        style={[
          styles.backdrop,
          backdropAnimatedStyle,
          {
            width,
            height: windowHeight,
          },
        ]}
      >
        <Pressable
          onPress={onClose}
          style={{ flex: 1, width, height: windowHeight }}
        >
          <BlurView style={{ flex: 1, width, height: windowHeight }} />
        </Pressable>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: zIndex.forwardMd,
  },
  wrapper: {
    position: "absolute",
    borderRadius: radii.xl,
    borderWidth: borderWidth.thin,
    overflow: "hidden",
    zIndex: zIndex.forwardLg,
    alignSelf: "center",
    width: "80%",
    maxWidth: 500,
  },
  blur: { padding: spacing.md },
});
export default Dialog;
