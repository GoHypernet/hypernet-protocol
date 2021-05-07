import React from "react";

import Modal from "@web-ui/containers/Modal";

interface IMainContainer {
  children: React.ReactNode;
  withModal?: boolean;
}

export function MainContainer({ children, withModal }: IMainContainer) {
  if (withModal) {
    return <Modal isOpen={true}>{children}</Modal>;
  }

  return <>{children}</>;
}
