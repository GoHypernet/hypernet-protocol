import React from "react";
import { Modal } from "@hypernetlabs/web-ui";

interface IMainContainer {
  children: React.ReactNode;
  withModal?: boolean;
}

function MainContainer({ children, withModal }: IMainContainer) {
  if (withModal) {
    return (
      <Modal isOpen={true}>
        <div>{children}</div>
      </Modal>
    );
  }

  return <div>{children}</div>;
}

export default MainContainer;
