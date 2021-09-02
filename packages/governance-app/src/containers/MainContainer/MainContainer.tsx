import React from "react";

import App from "@governance-app/containers/App";
import { LayoutProvider } from "@governance-app/contexts";

const MainContainer: React.FC = () => {
  return (
    <LayoutProvider>
      <App />
    </LayoutProvider>
  );
};

export default MainContainer;
