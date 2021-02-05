import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainHome from "@mobileApp/screens/MainHome";
import { RootStackParamList, RouterProps } from "@mobileApp/interfaces/containers/IRouter";
import Login from "@mobileApp/screens/Login";

const Stack = createStackNavigator<RootStackParamList>();

const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={props?.initialRouteName}>
        <Stack.Screen name="MainHome" component={MainHome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
