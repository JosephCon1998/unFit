import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "../Themed";

import {
  easings,
  fontSizes,
  fontWeights,
  spacing,
  zIndex,
} from "@/constants/Vars";
import { wait } from "@/utils";

export default function Celebration() {
  const animation = useRef(null);

  const { height, width } = useWindowDimensions();

  const [render, setRender] = useState(false);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(100);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const listener = DeviceEventEmitter.addListener("set-added", () => {
    setRender(true);
  });

  useEffect(() => {
    return () => listener.remove();
  });

  useEffect(() => {
    if (render) {
      scale.value = withTiming(1, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500, easing: easings.ease });
      opacity.value = withTiming(1, { duration: 500, easing: easings.ease });
      // @ts-ignore
      animation.current?.play();
      wait(2000).then(() => {
        scale.value = withTiming(0.5, { duration: 500, easing: easings.ease });
        opacity.value = withTiming(0, { duration: 500, easing: easings.ease });
        wait(1000).then(() => {
          setRender(false);
        });
      });
    }
  }, [render]);

  if (!render) return null;

  return (
    <>
      <Animated.View style={[animatedStyles, styles.animationContainer]}>
        <LottieView
          speed={0.75}
          ref={animation}
          style={{
            width: 200,
            height: 200,
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../assets/animations/thumbsup.json")}
        />
        <LottieView
          speed={1}
          autoPlay
          resizeMode="cover"
          style={{
            position: "absolute",
            zIndex: zIndex.backSm,
            width: width,
            height: height,
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../assets/animations/confetti.json")}
        />
      </Animated.View>
      <Animated.View style={[animatedStyles, styles.textContainer, { height }]}>
        <Text
          style={{
            fontSize: fontSizes.xl,
            fontWeight: fontWeights.heavy,
            marginTop: 150 + spacing.lg,
          }}
        >
          Set complete!
        </Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    pointerEvents: "none",
    position: "absolute",
    zIndex: zIndex.forwardSm,
    top: "45%",
    bottom: "55%",
    right: "50%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    pointerEvents: "none",
    position: "absolute",
    zIndex: zIndex.forwardSm,
  },
});
