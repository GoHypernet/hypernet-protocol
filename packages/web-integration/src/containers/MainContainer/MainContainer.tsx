import React from "react";
interface IMainContainer {
  children: React.ReactNode;
}

function MainContainer({ children }: IMainContainer) {
  return <div id="fffff-f">{children}</div>;
}

export default MainContainer;
