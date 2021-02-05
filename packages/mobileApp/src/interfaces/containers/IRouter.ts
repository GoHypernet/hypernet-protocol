import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  MainHome: any;
  Login: any;
};

export interface RouterProps {
  initialRouteName?: any;
}

export type NavigationProps = StackNavigationProp<RootStackParamList>;
