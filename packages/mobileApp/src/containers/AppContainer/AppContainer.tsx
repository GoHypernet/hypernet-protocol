import React from "react";
import Router from "../Router";
import { StoreProvider } from "state/store";

interface AppContainerProps {}

const AppContainer: React.FC<AppContainerProps> = (props: AppContainerProps) => {
  return (
    <StoreProvider>
      <Router initialRouteName="MainHome" />
    </StoreProvider>
  );
};

export default AppContainer;
