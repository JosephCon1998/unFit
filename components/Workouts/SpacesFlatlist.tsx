import React, { useMemo } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import Space from "./Space";
import { useSpacesStore, useTemporaryStore } from "./utils/store";

const SpacesFlatlist = () => {
  const { height: rawHeight } = useWindowDimensions();

  const { updateSelected } = useTemporaryStore();

  const { spaces } = useSpacesStore();

  const minHeight = useMemo(() => rawHeight - 150, [rawHeight]);

  function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const index = Math.floor(contentOffset.x / viewSize.width);
    updateSelected("spaceId", spaces[index]?.id);
    updateSelected("workoutId", spaces[index]?.workoutId);
  }

  return (
    <FlatList
      onMomentumScrollEnd={onScrollEnd}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.flatlist, { minHeight }]}
      data={spaces}
      keyExtractor={(i) => i.id}
      showsHorizontalScrollIndicator={false}
      renderItem={(data) => <Space {...data} />}
      horizontal
      pagingEnabled
    />
  );
};

export default SpacesFlatlist;

const styles = StyleSheet.create({
  flatlist: {},
});
