import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  ENavigationScreenName,
  ENavigatorType,
  INavigationScreens,
} from "@mobileApp/interfaces/containers/IRouter";
import Balance from "@mobileApp/screens/Balance";
import Service from "@mobileApp/screens/Service";
import Splash from "@mobileApp/screens/Splash";
import Start from "@mobileApp/screens/Start";
import Summary from "@mobileApp/screens/Summary";

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
    tabBarIcon: ({ color }) => <Icon name="money" color={color} />,
  },
  {
    name: ENavigationScreenName.SERVICE,
    component: Service,
    type: ENavigatorType.TAB,
    tabBarIcon: ({ color }) => <Icon name="key" color={color} />,
  },
  {
    name: ENavigationScreenName.SUMMARY,
    component: Summary,
    type: ENavigatorType.TAB,
    tabBarIcon: ({ color }) => <Icon name="file" color={color} />,
  },
];
