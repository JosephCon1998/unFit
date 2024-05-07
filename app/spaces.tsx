import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";

import Divider from "@/components/Shared/Divider";
import {
  Icon,
  Spacer,
  Text,
  TextInput,
  useThemeColor,
} from "@/components/Themed";
import { useSpacesStore } from "@/components/Workouts/utils/store";
import { Space } from "@/components/Workouts/utils/types";
import { globalStyles } from "@/constants/Styles";
import { opacity, radii, spacing } from "@/constants/Vars";

const SpacesScreen = () => {
  const { updateSpace, spaces, reorderSpaces } = useSpacesStore();
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("border");

  const { height: minHeight } = useWindowDimensions();

  function renderItem(info: DragListRenderItemInfo<Space>) {
    const { item, onDragStart, onDragEnd } = info;

    return (
      <View
        style={[
          globalStyles.hstack,
          { paddingHorizontal: spacing.md, backgroundColor },
        ]}
      >
        <TextInput
          minimal
          textAlign="left"
          style={{
            flex: 1,
            paddingVertical: spacing.md,
          }}
          placeholder="Enter space name..."
          value={item.name}
          onChangeText={(name) => updateSpace(item.id, { name })}
          keyboardType="ascii-capable"
        />

        <Spacer />

        <TouchableOpacity
          key={item.id}
          onPressIn={onDragStart}
          onPressOut={onDragEnd}
        >
          <Icon
            name={{ ios: "line.3.horizontal", android: "bars" }}
            style={{ opacity: opacity.md }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...spaces]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    reorderSpaces(copy);
  }

  return (
    <SafeAreaView>
      <Text
        style={{
          marginLeft: spacing.md,
          opacity: opacity.md,
          marginBottom: spacing.md,
        }}
      >
        Rename a space by tapping on the name
      </Text>
      <DragList
        data={spaces}
        ItemSeparatorComponent={Divider}
        style={{ minHeight }}
        contentContainerStyle={[styles.flatlist, { borderColor }]}
        keyExtractor={(s) => s.id}
        onReordered={onReordered}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    borderRadius: radii.lg,
  },
});

export default SpacesScreen;
