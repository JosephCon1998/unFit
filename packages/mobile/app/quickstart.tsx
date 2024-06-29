import Divider from "@/components/Shared/Divider";
import {
  Icon,
  IconName,
  ScrollView,
  Spacer,
  Text,
  View,
} from "@/components/Themed";
import { globalStyles } from "@/constants/Styles";
import { fontSizes, iconSize, spacing } from "@/constants/Vars";
import React from "react";
import { StyleSheet } from "react-native";

const Li = ({
  iconName,
  title,
  description,
}: {
  iconName: IconName;
  title: string;
  description: string;
}) => {
  return (
    <View style={{ marginVertical: spacing.lg }}>
      <View style={globalStyles.hstack}>
        <Icon name={iconName} size={iconSize.md} useTintColor />
        <Spacer size="sm" horizontal />
        <Text style={styles.title}> {title}</Text>
      </View>
      <Spacer size="md" />
      <View style={{ opacity: 0.5 }}>
        <Text style-={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const QuickstartScreen = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollView}
    >
      <Li
        iconName={{ ios: "1.circle", android: "plus" }}
        title="Marking Your Set"
        description="To mark a set as completed, tap the “+” button next to your exercise."
      />
      <Divider />
      <Li
        iconName={{ ios: "2.circle", android: "plus" }}
        title="Organizing Your Workouts"
        description="Use Spaces to categorize your workouts. Each Space can represent a day of the week or any other label you choose. Adjust your Space labels in the settings."
      />
      <Divider />
      <Li
        iconName={{ ios: "3.circle", android: "plus" }}
        title="Accessing the Library"
        description="Swipe up on the bottom bar or tap it to open the Library. Here, you can manage your Workouts and Exercises."
      />
      <Divider />
      <Li
        iconName={{ ios: "4.circle", android: "plus" }}
        title="Managing Workouts"
        description="In the Library, tapping on a workout will replace the currently displayed workout in the Workouts tab with the one selected."
      />
      <Divider />
      <Li
        iconName={{ ios: "5.circle", android: "plus" }}
        title="Adding Exercises to Workouts"
        description="Tap on an exercise in the Library to add it directly to the workout you have currently selected in the Workouts tab."
      />
    </ScrollView>
  );
};

export default QuickstartScreen;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSizes.lg,
  },
  description: {},
});
