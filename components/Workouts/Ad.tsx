import React, { useEffect, useRef, useState } from "react";
import { LayoutAnimation, StyleSheet } from "react-native";
import NativeAdView, {
  AdManager,
  CallToActionView,
  HeadlineView,
  IconView,
  PriceView,
  StoreView,
  TaglineView,
} from "react-native-admob-native-ads";

import Divider from "../Shared/Divider";
import { Spacer, View, useThemeColor } from "../Themed";

import { globalStyles } from "@/constants/Styles";
import {
  borderWidth,
  fontSizes,
  fontWeights,
  radii,
  spacing,
} from "@/constants/Vars";
import { usePersistedStore } from "./utils/store";

const testAdUnit = "ca-app-pub-3940256099942544/2247696110";
const realAdUnit = "ca-app-pub-7062726887382498/6867069675";

const Ad = () => {
  const { adFree } = usePersistedStore();
  const nativeAdViewRef = useRef(null);

  const [render, setRender] = useState(false);
  const [adUnitID, setAdUnitID] = useState("");

  const tint = useThemeColor("tint");
  const color = useThemeColor("text");
  const backgroundColor = useThemeColor("background");

  const fetchAdUnitID = async () => {
    const isTestDevice = await AdManager.isTestDevice();
    const unitID = isTestDevice
      ? testAdUnit
      : __DEV__
        ? testAdUnit
        : realAdUnit;
    setAdUnitID(unitID);
  };

  useEffect(() => {
    fetchAdUnitID().then(() => {
      // @ts-ignore
      nativeAdViewRef.current?.loadAd();
    });
  }, []);

  if (__DEV__) return null;

  if (adFree) return null;

  return (
    <NativeAdView
      ref={nativeAdViewRef}
      adUnitID={adUnitID}
      onAdLoaded={() => {
        LayoutAnimation.easeInEaseOut();
        setRender(true);
      }}
    >
      {render && (
        <View style={styles.root}>
          <View style={styles.ad}>
            <View style={globalStyles.hstack}>
              <IconView
                style={{
                  width: 40,
                  height: 40,
                }}
              />
              <Spacer horizontal />
              <View style={{ flex: 1 }}>
                <HeadlineView
                  style={{
                    color,
                    fontWeight: fontWeights.bold,
                    fontSize: fontSizes.xs,
                  }}
                />
                <TaglineView
                  style={{
                    color,
                    opacity: 0.5,
                    marginTop: spacing.xs / 2,
                    fontWeight: fontWeights.medium,
                    fontSize: fontSizes.xs,
                  }}
                />
              </View>
            </View>
            <Divider style={{ marginVertical: spacing.sm }} />
            <View style={globalStyles.hstack}>
              <StoreView
                style={{
                  color,
                  fontWeight: fontWeights.medium,
                  fontSize: fontSizes.sm,
                }}
              />
              <Spacer />
              <PriceView
                style={{
                  color,
                  opacity: 0.5,
                  fontWeight: fontWeights.regular,
                  fontSize: fontSizes.xs,
                }}
              />
              <Spacer horizontal />
              <CallToActionView
                style={{
                  height: 40,
                  paddingHorizontal: spacing.md,
                  backgroundColor: tint,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: radii.sm,
                  elevation: 10,
                }}
                textStyle={{
                  color: backgroundColor,
                  fontSize: fontSizes.xs,
                  fontWeight: fontWeights.bold,
                }}
              />
            </View>
          </View>
        </View>
      )}
    </NativeAdView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ad: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: borderWidth.thin,
  },
});
export default Ad;
