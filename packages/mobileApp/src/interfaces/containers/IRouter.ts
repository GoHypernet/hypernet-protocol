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
  SUMMARY = "Summary",
}

type TabBarIcon = (props: {
  focused: boolean;
  color: string;
  size: number;
}) => React.ReactNode | undefined;
export interface INavigationScreens {
  name: ENavigationScreenName;
  component: React.FC<any>;
  type: ENavigatorType;
  disableAnimation?: boolean;
  tabBarIcon?: TabBarIcon;
}

export interface RouterProps {
  initialRouteName?: any;
}

export type NavigationProps = StackNavigationProp<any>;
