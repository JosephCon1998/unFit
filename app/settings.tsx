import { Haptics, noOp } from "@/utils";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable as DefaultPressable,
  PlatformColor,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  Icon,
  IconName,
  Pressable,
  PressableText,
  ScrollView,
  Spacer,
  Text,
  View,
  ViewProps,
  useThemeColor,
  useThemeSwitch,
} from "@/components/Themed";
import {
  usePersistedStore,
  useResetAppData,
  useSettingsStore,
} from "@/components/Workouts/utils/store";
import { globalStyles } from "@/constants/Styles";
import {
  borderWidth,
  fontSizes,
  fontWeights,
  iconSize,
  radii,
  spacing,
} from "@/constants/Vars";
import { lightenHexColor } from "@/utils";
import Purchases from "react-native-purchases";

const ENTITLEMENT_ID = "ad-free";

const RemoveAdsLi = () => {
  // - State for all available package
  const [packages, setPackages] = useState<any[]>([]);

  // - State for displaying an overlay view
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { updateAdFree, adFree } = usePersistedStore();

  const color = "#FF9F0A";
  const backgroundColor = color + "70";
  const borderColor = color;

  async function checkSubscription() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
      ) {
        updateAdFree(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    // Get current available packages
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        // @ts-ignore
        Alert.alert("Error getting offers", e.message);
      }
    };
    getPackages();
  }, []);

  const onSelection = async () => {
    setIsPurchasing(true);

    try {
      const { customerInfo } = await Purchases.purchasePackage(packages[0]);

      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
      ) {
        // Unlocked
        updateAdFree(true);
      }
    } catch (e) {
      // @ts-ignore
      if (!e.userCancelled) {
        // @ts-ignore
        Alert.alert("Error purchasing package", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  if (adFree) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          globalStyles.hstack,
          styles.li,
          {
            borderRadius: radii.lg,
            backgroundColor,
            borderColor,
            borderWidth: borderWidth.thin,
          },
        ]}
      >
        <Icon size={iconSize.lg} name="wand.and.stars" />
        <Spacer size="md" horizontal />
        <Text
          style={{
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.md,
          }}
        >
          Remove ads forever
        </Text>
        <Spacer />
        {isPurchasing ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Pressable
            onPress={onSelection}
            style={{ paddingVertical: spacing.sm, borderRadius: radii.xl }}
            variant="neutral"
          >
            <PressableText>$7.25</PressableText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const ThemeLi = () => {
  const { next } = useThemeSwitch();

  const tint = useThemeColor("tint");
  const borderColor = lightenHexColor(tint, 2);

  const rotate = useSharedValue(0);
  const [hardValue, setHardValue] = useState(0);

  const handlePress = () => {
    next();
    setHardValue((current) => current + 180);
  };

  useEffect(() => {
    rotate.value = withSpring(hardValue);
  }, [hardValue]);

  useEffect(() => {
    // 2160 = 180 * 12; 12 = theme count
    if (hardValue >= 2160) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setHardValue(0);
      rotate.value = withSpring(0);
    }
  }, [hardValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <DefaultPressable onPress={handlePress}>
      <View style={[globalStyles.hstack, styles.li]}>
        <Icon
          size={iconSize.md}
          useTintColor
          name={{ ios: "paintpalette.fill", android: "folder" }}
        />
        <Spacer size="md" horizontal />
        <Text
          style={{
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.md,
          }}
        >
          Theme
        </Text>
        <Spacer />
        <Animated.View
          style={[
            animatedStyle,
            {
              width: 36,
              height: 36,
              borderRadius: radii.md,
              borderColor,
              backgroundColor: tint,
              borderWidth: borderWidth.thick * 2,
            },
          ]}
        />
      </View>
    </DefaultPressable>
  );
};

const Li = ({
  dangerous = false,
  href,
  iconName,
  lastItem,
  onPress,
  label,
}: {
  dangerous?: boolean;
  index?: number;
  href?: any;
  onPress?: () => void;
  iconName: IconName;
  lastItem?: boolean;
  label: string;
} & ViewProps) => {
  const color = useThemeColor("text");
  const { navigate } = useRouter();

  function press() {
    if (href) {
      navigate(href);
    }
    onPress?.();
  }

  return (
    <DefaultPressable onPress={press}>
      <View
        style={[
          globalStyles.hstack,
          styles.li,
          {
            borderBottomWidth: lastItem ? borderWidth.none : borderWidth.thin,
          },
        ]}
      >
        <Icon
          size={iconSize.md}
          useTintColor={!dangerous}
          color={dangerous ? (PlatformColor("systemRed") as any) : "inherit"}
          name={iconName}
        />
        <Spacer size="md" horizontal />
        <Text
          style={{
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.md,
            color: dangerous ? PlatformColor("systemRed") : color,
          }}
        >
          {label}
        </Text>
        <Spacer />
        <Icon
          size={iconSize.sm}
          style={{ opacity: 0.5 }}
          name={{ ios: "chevron.right", android: "chevron" }}
        />
      </View>
    </DefaultPressable>
  );
};

const MeasurementUnitsLi = () => {
  const { updateUnitOfMeasurement, unitOfMeasurement } = useSettingsStore();

  return (
    <DefaultPressable>
      <View style={[globalStyles.hstack, styles.li]}>
        <Icon
          size={iconSize.md}
          useTintColor
          name={{ ios: "lines.measurement.horizontal", android: "folder" }}
        />
        <Spacer size="md" horizontal />
        <Text
          style={{
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.md,
          }}
        >
          Measurement Units
        </Text>
      </View>
      <SegmentedControl
        style={{ marginBottom: spacing.md, marginHorizontal: spacing.md }}
        values={["Imperial", "Metric"]}
        selectedIndex={unitOfMeasurement}
        onChange={(event) => {
          updateUnitOfMeasurement(event.nativeEvent.selectedSegmentIndex);
        }}
      />
    </DefaultPressable>
  );
};

export default function SettingsScreen() {
  const resetAppData = useResetAppData();
  const restorePurchases = async () => {
    try {
      await Purchases.restorePurchases();
    } catch (e: any) {
      Alert.alert("Error restoring purchases", e);
    }
  };

  const showResetAppDataWarning = () => {
    Alert.alert(
      "Reset app data",
      "This will reset all data to what it initially was when you downloaded the app. Are you sure you want to continue?",
      [
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetAppData();
            Alert.alert("App data reset");
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: noOp,
        },
      ]
    );
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <RemoveAdsLi />

      <View style={[styles.container]}>
        <Li
          label="Manage spaces"
          href="/spaces"
          iconName={{ ios: "folder.fill", android: "folder" }}
        />
        <Link href="/quickstart" asChild>
          <Li
            label="Open quickstart guide"
            iconName={{ ios: "questionmark.circle", android: "question" }}
          />
        </Link>
        <Li
          lastItem
          onPress={restorePurchases}
          label="Restore in-app purchases"
          iconName={{ ios: "dollarsign.arrow.circlepath", android: "question" }}
        />
      </View>

      <View style={[styles.container]}>
        <ThemeLi />
      </View>

      <View style={[styles.container]}>
        <MeasurementUnitsLi />
      </View>

      <Spacer size="md" horizontal />

      <View style={[styles.container]}>
        <Li
          lastItem
          dangerous
          onPress={showResetAppDataWarning}
          label="Reset app data"
          iconName={{ ios: "triangle.fill", android: "folder" }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    borderRadius: radii.lg,
    borderWidth: borderWidth.thin,
  },
  li: {
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
