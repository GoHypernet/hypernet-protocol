import React from "react";

import App from "@user-dashboard/containers/App";
import { LayoutProvider } from "@user-dashboard/contexts";

const MainContainer: React.FC = () => {
  return (
    <LayoutProvider>
      <App />
    </LayoutProvider>
  );
};

export default MainContainer;
