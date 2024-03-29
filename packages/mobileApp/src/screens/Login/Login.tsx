import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { SomeActionType } from "@mobileApp/interfaces/state/IsomeReducer";
import { UserActionType } from "@mobileApp/interfaces/state/IuserReducer";
import { useStateContext } from "@mobileApp/state/store";

interface LoginProps {}

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const { state, dispatch } = useStateContext();
  const {
    someReducer: { contacts },
    userReducer: { id },
  } = state;

  return (
    <View>
      <Text>Login state: {contacts} </Text>
      <Text>Login state: {contacts} </Text>
      <Text>Login state: {contacts} </Text>
      <Text>Login state: {contacts} </Text>
      <Text>Login state: {contacts} </Text>
      <Text>Login state: {contacts} </Text>
      <TouchableOpacity
        onPress={() => {
          dispatch({ type: SomeActionType.ADD_CONTACT, payload: "ffff Login" });
        }}
      >
        <Text>change store state</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          dispatch({
            type: UserActionType.SET_USER_NAME,
            payload: "muhammed altinci",
          });
        }}
      >
        <Text>change user state</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          dispatch({
            type: UserActionType.SET_USER_ID,
            payload: id ? id + 1 : 1,
          });
        }}
      >
        <Text>increase id</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
