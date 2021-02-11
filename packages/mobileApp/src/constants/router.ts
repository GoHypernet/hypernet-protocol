import Login from "@mobileApp/screens/Login";
import Splash from "@mobileApp/screens/Splash";
import Start from "@mobileApp/screens/Start";
import {
  ENavigationScreenName,
  ENavigatorType,
  INavigationScreens,
} from "@mobileApp/interfaces/containers/IRouter";

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
    component: Login,
    type: ENavigatorType.TAB,
    icon: null,
    isFirstTab: true,
  },
  {
    name: ENavigationScreenName.SERVICE,
    component: Start,
    type: ENavigatorType.TAB,
    icon: null,
  },
];
