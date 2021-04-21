import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import AppContainer from "./containers/AppContainer/AppContainer";

declare const global: { HermesInternal: null | {} };

Icon.loadFont();

const App = () => {
  return <AppContainer />;
};

export default App;
