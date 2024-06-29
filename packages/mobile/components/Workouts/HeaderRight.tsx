import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import { Icon } from "../Themed";

const HeaderRight = () => {
  return (
    <View>
      <Link href="/settings" asChild>
        <Pressable
          style={{ padding: 0, margin: 0, height: "auto", width: "auto" }}
        >
          <Icon name={{ android: "sliders", ios: "gear" }} />
        </Pressable>
      </Link>
    </View>
  );
};

export default HeaderRight;
