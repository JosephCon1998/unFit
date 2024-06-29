import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, {
  StyleProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Pressable, PressableText, ViewProps, useThemeColor } from "../Themed";

import { borderWidth, easings, radii, spacing, zIndex } from "@/constants/Vars";

interface DialogProps {
  opened: boolean;
  height?: StyleProps["height"];
  scrollable?: boolean;
  animation?: "default" | "translate";
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
  height = "auto",
  scrollable = false,
  animation = "default",
  style,
  onClose,
  onSave,
  options = {
    hideActionButtons: false,
  },
}: DialogProps & ViewProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(0);
  const borderColor = useThemeColor("text");

  const [rendered, setRendered] = useState(false);

  const { width, height: windowHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(1);

  const onLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: `${borderColor}20`,
    opacity: opacity.value,
    transform: [
      {
        scale: scale.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (opened) {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withTiming(1, { easing: easings.ease });
      if (animation === "translate") {
        translateY.value = withDelay(500, withSpring(-136));
      }
    } else {
      opacity.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(0.5, {
        duration: 250,
      });
      if (animation === "translate") {
        translateY.value = withTiming(0, {
          duration: 250,
        });
      }
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
        <BlurView
          style={[styles.blur, { height: height }, style]}
          tint="systemMaterial"
        >
          <ScrollView
            scrollEnabled={scrollable}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {!options.hideActionButtons && (
            <>
              <Pressable
                animation="opacity"
                style={{
                  padding: spacing.xs,
                  height: 70,
                  borderRadius: 0,
                  borderBottomRightRadius: radii.xl,
                  borderBottomLeftRadius: radii.xl,
                }}
                onPress={onSave}
                variant="tint"
              >
                <PressableText useTintColor>Save</PressableText>
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
