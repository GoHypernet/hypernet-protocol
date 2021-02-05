import React from "react";
import { Text, View } from "react-native";
import { useStateContext } from "state/store";
import { SomeActionType } from "interfaces/state/IsomeReducer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationProps } from "interfaces/containers/IRouter";

interface MainHomeProps {
  navigation: NavigationProps;
}

const MainHome: React.FC<MainHomeProps> = (props: MainHomeProps) => {
  const { navigation } = props;
  const { state, dispatch } = useStateContext();
  const {
    someReducer: { contacts },
    userReducer: { name, id } = {},
  } = state;

  return (
    <View>
      <Text>MainHome state: {contacts} </Text>
      <Text>MainHome state: {contacts} </Text>
      <Text>MainHome state: {contacts} </Text>
      <Text>MainHome state: {contacts} </Text>
      <Text>MainHome state: {contacts} </Text>
      <Text>MainHome state: {contacts} </Text>
      <Text>MainHome state: ----</Text>
      <Text>
        MainHome name: {name}, id: {id}
      </Text>
      <Text>
        MainHome name: {name}, id: {id}
      </Text>
      <Text>
        MainHome name: {name}, id: {id}
      </Text>
      <TouchableOpacity
        onPress={() => {
          dispatch({ type: SomeActionType.ADD_CONTACT, payload: "ffff MainHome" });
        }}
      >
        <Text>change store state</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text>go to login screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainHome;
