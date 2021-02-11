import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ENavigatorType, RouterProps } from "@mobileApp/interfaces/containers/IRouter";

import { cardStyleInterpolator } from "./Router.utils";
import { navigationTheme } from "@mobileApp/constants/theme";
import { NAVIGATION_SCREENS } from "@mobileApp/constants/router";
import CustomBottomTabBar from "@mobileApp/components/CustomBottomTabBar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Router: React.FC<RouterProps> = (props: RouterProps) => {
  const tabScreens = NAVIGATION_SCREENS.filter((screen) => screen.type === ENavigatorType.TAB);
  const stackScreens = NAVIGATION_SCREENS.filter((screen) => screen.type === ENavigatorType.STACK);

  const TabNavigator = () => {
    return (
      <Tab.Navigator tabBar={(props) => <CustomBottomTabBar {...props} />} lazy>
        {tabScreens.map(({ name, component, tabBarIcon }) => {
          return (
            <Tab.Screen
              key={name}
              name={name}
              component={component}
              options={
                tabBarIcon && {
                  tabBarIcon,
                }
              }
            />
          );
        })}
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={props?.initialRouteName}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator,
        }}
      >
        {stackScreens.map(({ name, component, disableAnimation }) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            options={{
              animationEnabled: !disableAnimation,
            }}
          />
        ))}
        <Stack.Screen name={tabScreens[0].name} component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
