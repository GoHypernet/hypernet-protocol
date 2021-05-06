import React from "react";

import Modal from "@web-ui/containers/Modal";
import LoadingSpinner from "@web-ui/components/LoadingSpinner";

interface IMainContainer {
  children: React.ReactNode;
  withModal?: boolean;
}

export function MainContainer({ children, withModal }: IMainContainer) {
  return (
    <>
      <LoadingSpinner />
      {withModal ? <Modal>{children}</Modal> : children}
    </>
  );
}
