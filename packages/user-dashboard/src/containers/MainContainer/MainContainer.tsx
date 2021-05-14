import React from "react";
import { LayoutProvider, StoreProvider } from "@user-dashboard/contexts";

import App from "@user-dashboard/containers/App";

const MainContainer: React.FC = () => {
  return (
    <LayoutProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </LayoutProvider>
  );
};

export default MainContainer;
