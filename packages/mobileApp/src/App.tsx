import React from "react";
import AppContainer from "./containers/AppContainer/AppContainer";
import Icon from 'react-native-vector-icons/FontAwesome'

declare const global: { HermesInternal: null | {} };

Icon.loadFont();

const App = () => {
  return <AppContainer />;
};

export default App;
