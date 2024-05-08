/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { FontAwesome6 } from "@expo/vector-icons";
import {
  FlatList as DefaultFlatList,
  Pressable as DefaultPressable,
  ScrollView as DefaultScrollView,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  FlatListProps,
  Platform,
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  ViewStyle,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SFSymbol from "sweet-sfsymbols";
import { create } from "zustand";

import Colors from "@/constants/Colors";
import {
  borderWidth,
  easings,
  fontSizes,
  fontWeights,
  iconSize,
  radii,
  spacing,
} from "@/constants/Vars";
import React, { forwardRef } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(DefaultPressable);

type ColorKeys = keyof typeof Colors;

// Theme state
interface ThemeActions {
  updateTint: (value: ColorKeys) => void;
}

interface ThemeData {
  tint: ColorKeys;
}

type ThemeState = ThemeData & ThemeActions;

const initialThemeStore: ThemeData = {
  tint: "dark_blue",
};

export const useThemeStore = create<ThemeState>()((set, get) => ({
  ...initialThemeStore,
  updateTint(value) {
    set({ tint: value });
  },
}));

export const useThemeSwitch = () => {
  const { updateTint, tint } = useThemeStore();

  const isDarkMode = useColorScheme() === "dark";

  function refresh() {
    // Either gonna be light_COLOR or dark_COLOR
    const offset = tint.includes("dark") ? 5 : 6;
    const theme = isDarkMode ? "dark" : "light";
    let updatedTint = tint.substring(offset);
    updatedTint = `${theme}_${updatedTint}`;
    updateTint(updatedTint as ColorKeys);
  }

  // blue brown cyan green indigo mint orange pink purple red teal yellow
  function next() {
    if (isDarkMode) {
      switch (tint) {
        case "dark_blue":
          updateTint("dark_brown");
          break;
        case "dark_brown":
          updateTint("dark_cyan");
          break;
        case "dark_cyan":
          updateTint("dark_green");
          break;
        case "dark_green":
          updateTint("dark_indigo");
          break;
        case "dark_indigo":
          updateTint("dark_mint");
          break;
        case "dark_mint":
          updateTint("dark_orange");
          break;
        case "dark_orange":
          updateTint("dark_pink");
          break;
        case "dark_pink":
          updateTint("dark_purple");
          break;
        case "dark_purple":
          updateTint("dark_red");
          break;
        case "dark_red":
          updateTint("dark_teal");
          break;
        case "dark_teal":
          updateTint("dark_yellow");
          break;
        case "dark_yellow":
          updateTint("dark_blue");
          break;
        default:
          updateTint("dark_blue");
          break;
      }
    } else {
      switch (tint) {
        case "light_blue":
          updateTint("light_brown");
          break;
        case "light_brown":
          updateTint("light_cyan");
          break;
        case "light_cyan":
          updateTint("light_green");
          break;
        case "light_green":
          updateTint("light_indigo");
          break;
        case "light_indigo":
          updateTint("light_mint");
          break;
        case "light_mint":
          updateTint("light_orange");
          break;
        case "light_orange":
          updateTint("light_pink");
          break;
        case "light_pink":
          updateTint("light_purple");
          break;
        case "light_purple":
          updateTint("light_red");
          break;
        case "light_red":
          updateTint("light_teal");
          break;
        case "light_teal":
          updateTint("light_yellow");
          break;
        case "light_yellow":
          updateTint("light_blue");
          break;
        default:
          updateTint("light_blue");
          break;
      }
    }
  }

  function previous() {
    if (isDarkMode) {
      switch (tint) {
        case "dark_blue":
          updateTint("dark_yellow");
          break;
        case "dark_brown":
          updateTint("dark_blue");
          break;
        case "dark_cyan":
          updateTint("dark_brown");
          break;
        case "dark_green":
          updateTint("dark_cyan");
          break;
        case "dark_indigo":
          updateTint("dark_green");
          break;
        case "dark_mint":
          updateTint("dark_indigo");
          break;
        case "dark_orange":
          updateTint("dark_mint");
          break;
        case "dark_pink":
          updateTint("dark_orange");
          break;
        case "dark_purple":
          updateTint("dark_pink");
          break;
        case "dark_red":
          updateTint("dark_purple");
          break;
        case "dark_teal":
          updateTint("dark_red");
          break;
        case "dark_yellow":
          updateTint("dark_teal");
          break;
        default:
          updateTint("dark_blue");
          break;
      }
    } else {
      switch (tint) {
        case "light_blue":
          updateTint("light_yellow");
          break;
        case "light_brown":
          updateTint("light_blue");
          break;
        case "light_cyan":
          updateTint("light_brown");
          break;
        case "light_green":
          updateTint("light_cyan");
          break;
        case "light_indigo":
          updateTint("light_green");
          break;
        case "light_mint":
          updateTint("light_indigo");
          break;
        case "light_orange":
          updateTint("light_mint");
          break;
        case "light_pink":
          updateTint("light_orange");
          break;
        case "light_purple":
          updateTint("light_pink");
          break;
        case "light_red":
          updateTint("light_purple");
          break;
        case "light_teal":
          updateTint("light_red");
          break;
        case "light_yellow":
          updateTint("light_teal");
          break;
        default:
          updateTint("light_blue");
          break;
      }
    }
  }

  return {
    next,
    previous,
    refresh,
  };
};

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(colorName: keyof typeof Colors.dark_blue) {
  const { tint } = useThemeStore();
  return Colors[tint][colorName];
}

interface CustomTextProps {
  useTintColor?: boolean;
}
export function Text(props: CustomTextProps & TextProps) {
  const { style, lightColor, useTintColor, darkColor, ...otherProps } = props;
  const color = useThemeColor("text");
  const tint = useThemeColor("tint");

  return (
    <DefaultText
      style={[
        { color: useTintColor ? tint : color, fontSize: fontSizes.md },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function PressableText(props: CustomTextProps & TextProps) {
  const { style, children, lightColor, useTintColor, darkColor, ...rest } =
    props;
  const color = useThemeColor("text");
  const tint = useThemeColor("tint");

  return (
    <Text
      style={[
        {
          color: useTintColor ? tint : color,
          fontSize: fontSizes.md,
          fontWeight: fontWeights.semibold,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export const FlatList = React.forwardRef<any, FlatListProps<any>>(
  (props, ref) => {
    // Spread all other props to pass them to DefaultFlatList
    const { ...otherProps } = props;

    return <DefaultFlatList {...otherProps} ref={ref} />;
  }
);

export function ScrollView(props: ViewProps & ScrollViewProps) {
  const {
    style,
    lightColor,
    darkColor,
    children,
    contentContainerStyle,
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor("background");

  return (
    <DefaultScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        {
          paddingBottom: spacing.xl * 2,
        },
        contentContainerStyle,
      ]}
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </DefaultScrollView>
  );
}

export function View(props: ViewProps & { useBgColor?: boolean }) {
  const { style, lightColor, darkColor, useBgColor, ...otherProps } = props;

  const borderColor = useThemeColor("border");

  const backgroundColor = useThemeColor("background");

  return (
    <DefaultView
      style={[
        {
          borderColor,
          backgroundColor: useBgColor ? backgroundColor : "transparent",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export type IconName =
  | string
  | {
      ios: string;
      android: string;
    };

export function Icon(
  props: ViewProps & {
    name: IconName;
    size?: number;
    color?: string;
    useTintColor?: boolean;
  }
) {
  const {
    style,
    color: rawColor,
    size,
    name,
    useTintColor,
    lightColor,
    darkColor,
    ...otherProps
  } = props;

  const tintColor = useThemeColor("tint");

  const textColor = useThemeColor("text");

  const color = useTintColor ? tintColor : rawColor ?? textColor;

  if (Platform.OS === "ios") {
    return (
      <SFSymbol
        name={typeof name === "string" ? (name as any) : name.ios}
        colors={[color]}
        size={size ?? iconSize.md}
        // @ts-ignore
        style={style}
      />
    );
  }

  return (
    <FontAwesome6
      color={color}
      style={style}
      size={size ?? iconSize.md}
      {...otherProps}
    />
  );
}

export function Spacer(
  props: ViewProps & {
    noFlex?: boolean;
    horizontal?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  }
) {
  const {
    style,
    size: rawSize,
    horizontal,
    noFlex,
    lightColor,
    darkColor,
    ...otherProps
  } = props;

  const size = rawSize ? spacing[rawSize] : spacing.md;

  const height = horizontal ? "auto" : size;

  const width = horizontal ? size : "auto";

  return (
    <DefaultView
      style={[{ height, width, flex: horizontal ? 0 : noFlex ? 0 : 1 }, style]}
      {...otherProps}
    />
  );
}

export const TextInput = forwardRef(
  (props: TextInputProps & ViewProps & { minimal?: boolean }, ref) => {
    const { style, minimal = false, ...otherProps } = props;

    const color = useThemeColor("text");
    const tint = useThemeColor("tint");

    const minimalStyles: ViewStyle = minimal
      ? {
          padding: spacing.none,
          backgroundColor: "transparent",
          borderWidth: borderWidth.none,
          height: "auto",
          width: "auto",
        }
      : {};

    return (
      <DefaultTextInput
        // @ts-ignore
        ref={ref}
        keyboardType="numeric"
        textAlign="center"
        selectionColor={tint}
        placeholderTextColor={`${color}50`}
        style={[
          {
            textAlignVertical: "top",
            color,
            padding: spacing.sm,
            borderWidth: borderWidth.thin,
            borderColor: `${color}20`,
            fontSize: fontSizes.md,
            backgroundColor: `${color}10`,
            height: 36,
            width: 64,
            borderRadius: radii.md,
          },
          minimalStyles,
          style,
        ]}
        {...otherProps}
      />
    );
  }
);

interface ThemedPressable {
  variant?: "default" | "tint" | "neutral" | "border" | "ghost";
  animation?: "none" | "scale-in" | "scale-out" | "opacity";
}
export function Pressable(props: PressableProps & ThemedPressable & ViewProps) {
  const {
    variant = "default",
    animation = "none",
    style,
    children,
    ...otherProps
  } = props;

  const textColor = useThemeColor("text");

  const tint = useThemeColor("tint");

  const borderColor =
    variant === "border"
      ? `${textColor}20`
      : variant === "tint"
        ? tint
        : variant === "ghost"
          ? "transparent"
          : variant === "neutral"
            ? `${textColor}20`
            : "transparent";

  const backgroundColor =
    variant === "border"
      ? "transparent"
      : variant === "tint"
        ? `${tint}50`
        : variant === "ghost"
          ? "transparent"
          : variant === "neutral"
            ? `${textColor}10`
            : "transparent";

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function onPressIn() {
    switch (animation) {
      case "none":
        return;
      case "opacity": {
        opacity.value = withTiming(0.75, {
          duration: 250,
          easing: easings.ease,
        });
        break;
      }
      case "scale-in": {
        scale.value = withTiming(0.9, { duration: 250, easing: easings.ease });
        break;
      }
      case "scale-out": {
        scale.value = withTiming(1.1, { duration: 250, easing: easings.ease });
        break;
      }
    }
  }

  function onPressOut() {
    switch (animation) {
      case "none":
        return;
      case "opacity": {
        opacity.value = withTiming(1, { duration: 250, easing: easings.ease });
        break;
      }
      case "scale-out":
      case "scale-in": {
        scale.value = withTiming(1, { duration: 250, easing: easings.ease });
        break;
      }
    }
  }

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        animatedStyles,
        pressableStyles,
        {
          borderColor,
          backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </AnimatedPressable>
  );
}

const pressableStyles: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  borderWidth: borderWidth.thin,
  borderRadius: radii.lg,
  padding: spacing.md,
};
