import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Button } from "react-native-elements";

import HypernetLogo from "@mobileApp/components/HypernetLogo";
import { NavigationProps } from "@mobileApp/interfaces/containers/IRouter";

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
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ paddingBottom }}>
        <HypernetLogo />
      </Animated.View>

      <Animated.View
        style={[
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Button
          title="START"
          type="outline"
          titleStyle={styles.startButtonTitle}
          buttonStyle={styles.startButton}
          onPress={() => navigation.navigate("MainHome")}
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
  },
  startButton: { backgroundColor: "#25A3A8", width: 276, height: 50 },
  startButtonTitle: { color: "#1E2530" },
});

export default Start;
