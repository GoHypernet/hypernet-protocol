import React from "react";
import { BrowserRouter } from "react-router-dom";

import App from "@user-dashboard/containers/App";
import { LayoutProvider } from "@user-dashboard/contexts";

const MainContainer: React.FC = () => {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </BrowserRouter>
  );
};

export default MainContainer;
