import React from "react";

import LoadingSpinner from "@web-ui/components/LoadingSpinner";
import Modal from "@web-ui/containers/Modal";

interface IMainContainer {
  children: React.ReactNode;
  withModal?: boolean;
  closeCallback?: () => void;
  modalStyle?: React.CSSProperties;
}

const MainContainer: React.FC<IMainContainer> = ({
  children,
  withModal,
  closeCallback,
  modalStyle,
}: IMainContainer) => {
  return (
    <>
      <LoadingSpinner />
      {withModal ? (
        <Modal closeCallback={closeCallback} modalStyle={modalStyle}>
          {children}
        </Modal>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default MainContainer;
