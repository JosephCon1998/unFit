import { FlatList, SafeAreaView, StyleSheet } from "react-native";

import exercisesJSON from "../../exercises.json";

import {
  Pressable,
  PressableText,
  ScrollView,
  Spacer,
  Text,
  TextInput,
  View,
} from "@/components/Themed";
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

const exercises = exercisesJSON.exercises;

export default function AddExerciseScreen() {
  const { lg: backgroundColor } = useBackgroundShades();

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Spacer size="xs" />
        <View style={styles.header}>
          <Text style={{ opacity: opacity.md }}>
            Choose an exercise from the list below to add to your library
          </Text>
        </View>
        <FlatList
          ListHeaderComponent={() => (
            <View style={{ margin: spacing.md }}>
              <TextInput
                keyboardType="ascii-capable"
                textAlign="left"
                style={{
                  width: "100%",
                  height: 60,
                  paddingHorizontal: spacing.md,
                }}
                placeholder="Search..."
              />
            </View>
          )}
          contentContainerStyle={{ paddingTop: spacing.sm }}
          scrollEnabled={false}
          data={exercises}
          renderItem={({ item }) => (
            <View style={[styles.li]}>
              <Text
                style={{
                  marginRight: "auto",
                  fontWeight: fontWeights.semibold,
                }}
              >
                {item.name}
              </Text>
              <Spacer />
              <View style={globalStyles.hstack}>
                {item.muscleGroups.map((mg) => (
                  <>
                    <Pressable
                      style={{
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.md,
                      }}
                      variant="border"
                    >
                      <PressableText
                        style={{
                          fontWeight: fontWeights.regular,
                          fontSize: fontSizes.sm,
                          opacity: 0.5,
                        }}
                        key={mg}
                      >
                        {mg}
                      </PressableText>
                    </Pressable>
                    <Spacer horizontal />
                  </>
                ))}
              </View>
            </View>
          )}
        />
      </ScrollView>
      <SafeAreaView>
        <View style={styles.footer}>
          <FlatList
            horizontal
            ItemSeparatorComponent={() => <Spacer horizontal />}
            data={[{}, {}]}
            renderItem={({ item, index }) => (
              <View style={[styles.selected, { backgroundColor }]}>
                <Text>Air squats</Text>
              </View>
            )}
          />
          <Text
            style={{
              opacity: opacity.sm,
              textAlign: "center",
              fontSize: fontSizes.xs,
              marginTop: spacing.sm,
            }}
          >
            Hold to remove
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  li: {
    borderBottomWidth: borderWidth.thin,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.md,
  },
  footer: {
    borderTopWidth: borderWidth.thin,
    padding: spacing.md,
  },
  selected: {
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderWidth: borderWidth.thin,
  },
});
