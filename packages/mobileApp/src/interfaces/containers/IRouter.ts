import { StackNavigationProp } from "@react-navigation/stack";

export enum ENavigatorType {
  STACK,
  TAB,
}

export enum ENavigationScreenName {
  SPLASH = "Splash",
  START = "Start",
  BALANCE = "Balance",
  SERVICE = "Service",
}

export interface INavigationScreens {
  name: ENavigationScreenName;
  component: React.FC<any>;
  type: ENavigatorType;
  disableAnimation?: boolean;
  icon?: any;
  isFirstTab?: boolean;
}

export interface RouterProps {
  initialRouteName?: any;
}

export type NavigationProps = StackNavigationProp<any>;
