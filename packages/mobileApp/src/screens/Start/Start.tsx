import React, { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, Easing, Dimensions } from "react-native";
import { Button, CheckBox, Text } from "react-native-elements";

import HypernetLogo from "@mobileApp/components/HypernetLogo";
import {
  ENavigationScreenName,
  NavigationProps,
} from "@mobileApp/interfaces/containers/IRouter";

const moveTop = (value: Animated.Value) => {
  Animated.timing(value, {
    toValue: 1,
    duration: 300,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();
};

const fadeIn = (value: Animated.Value) => {
  Animated.timing(value, {
    toValue: 1,
    duration: 2000,
    useNativeDriver: true,
  }).start();
};

interface StartProps {
  navigation: NavigationProps;
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const { navigation } = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [moveAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = setTimeout(() => {
      moveTop(moveAnim);
      fadeIn(fadeAnim);
    }, 500);

    return () => {
      clearTimeout(animate);
    };
  }, []);

  const paddingBottom = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ paddingBottom, ...styles.iconContainer }}>
        <HypernetLogo />
      </Animated.View>
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            ...styles.bottomContainer,
          },
        ]}
      >
        <Button
          title="Start"
          type="outline"
          titleStyle={styles.text}
          buttonStyle={styles.startButton}
          onPress={() => navigation.navigate(ENavigationScreenName.BALANCE)}
        />
        <CheckBox
          title={
            <Fragment>
              <Text style={styles.text}>I agree to the </Text>
              <Text style={styles.checkboxSecondaryText}>Privacy Policy </Text>
              <Text style={styles.text}>& </Text>
              <Text style={styles.checkboxSecondaryText}>Terms of Service</Text>
            </Fragment>
          }
          checked={false}
          uncheckedColor="#6D778B"
          containerStyle={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            marginTop: 24,
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
    position: "absolute",
    bottom: Dimensions.get("window").height / 6,
    display: "flex",
    alignItems: "center",
  },
  // TODO: add theme provider
  startButton: {
    backgroundColor: "#6D778B",
    // TODO: create style provider for this kind of values
    width: Dimensions.get("window").width - 100,
    height: 50,
    borderRadius: 26,
    borderColor: "#6D778B",
  },
  text: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  checkboxSecondaryText: {
    color: "#6D778B",
    fontWeight: "900",
    fontSize: 14,
  },
});

export default Start;
