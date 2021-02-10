import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainHome from "@mobileApp/screens/MainHome";
import Login from "@mobileApp/screens/Login";
import Splash from "@mobileApp/screens/Splash";
import { RootStackParamList, RouterProps } from "@mobileApp/interfaces/containers/IRouter";

const Stack = createStackNavigator<RootStackParamList>();

const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={props?.initialRouteName} headerMode="none">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="MainHome" component={MainHome} />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            animationEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
