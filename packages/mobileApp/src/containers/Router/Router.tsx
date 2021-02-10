import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LinearGradient from "react-native-linear-gradient";
import MainHome from "@mobileApp/screens/MainHome";
import Login from "@mobileApp/screens/Login";
import Splash from "@mobileApp/screens/Splash";
import Start from "@mobileApp/screens/Start";
import { RootStackParamList, RouterProps } from "@mobileApp/interfaces/containers/IRouter";

const Stack = createStackNavigator<RootStackParamList>();

const mainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
    gradient: ["#262F3F", "#1B202A"],
  },
};

// TODO: map screens from an array
const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return (
    <LinearGradient
      colors={mainTheme.colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <NavigationContainer theme={mainTheme}>
        <Stack.Navigator
          initialRouteName={props?.initialRouteName}
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({ current: { progress }, next, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                  {
                    translateX: next
                      ? next.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -layouts.screen.width],
                        })
                      : 1,
                  },
                ],
              },
            }),
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen
            name="Start"
            component={Start}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen
            name="MainHome"
            component={MainHome}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Router;
