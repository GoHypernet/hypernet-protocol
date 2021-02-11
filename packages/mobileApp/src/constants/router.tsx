import React from "react";

import Login from "@mobileApp/screens/Login";
import Balance from "@mobileApp/screens/Balance";
import Splash from "@mobileApp/screens/Splash";
import Start from "@mobileApp/screens/Start";
import { ENavigationScreenName, ENavigatorType, INavigationScreens } from "@mobileApp/interfaces/containers/IRouter";
import Icon from "react-native-vector-icons/FontAwesome";

export const NAVIGATION_SCREENS: INavigationScreens[] = [
  {
    name: ENavigationScreenName.SPLASH,
    component: Splash,
    type: ENavigatorType.STACK,
  },
  {
    name: ENavigationScreenName.START,
    component: Start,
    disableAnimation: true,
    type: ENavigatorType.STACK,
  },
  {
    name: ENavigationScreenName.BALANCE,
    component: Balance,
    type: ENavigatorType.TAB,
    tabBarIcon: ({ color }) => <Icon name="google-wallet" color={color} />,
  },
  {
    name: ENavigationScreenName.SERVICE,
    component: Start,
    type: ENavigatorType.TAB,
    tabBarIcon: ({ color }) => <Icon name="key" color={color} />,
  },
  {
    name: ENavigationScreenName.SUMMARY,
    component: Login,
    type: ENavigatorType.TAB,
    tabBarIcon: ({ color }) => <Icon name="file" color={color} />,
  },
];
