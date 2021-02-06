import React from "react";
import AppContainer from "./containers/AppContainer/AppContainer";

declare const global: { HermesInternal: null | {} };

const App = () => {
  return <AppContainer />;
};

export default App;
