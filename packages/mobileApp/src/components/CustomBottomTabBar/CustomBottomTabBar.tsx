import React from "react";
import { View, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// TODO: refactor style
const CustomBottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "##111622",
        height: hp(16),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderTopWidth: 1,
              borderTopColor: isFocused ? "#2852ff" : "transparent",
              paddingTop: 24,
            }}
          >
            {options?.tabBarIcon &&
              options.tabBarIcon({ focused: isFocused, color: isFocused ? "#FFFFFF" : "#6D778B", size: 24 })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomBottomTabBar;
