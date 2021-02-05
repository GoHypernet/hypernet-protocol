import React from "react";
import AppContainer from "./containers/AppContainer/AppContainer";
/* import {IHypernetWebIntegration} from '@hypernetlabs/web-integration';
console.log('HypernetWebIntegration: ', IHypernetWebIntegration); */

declare const global: { HermesInternal: null | {} };

const App = () => {
  return <AppContainer />;
};

export default App;
