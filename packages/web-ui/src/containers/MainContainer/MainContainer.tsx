import { Box } from "@material-ui/core";
import LoadingSpinner from "@web-ui/components/LoadingSpinner";
import React from "react";

import { useStyles } from "@web-ui/containers/MainContainer/MainContainer.style";
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
  const classes = useStyles();

  return (
    <>
      <LoadingSpinner />
      {withModal ? (
        <Modal closeCallback={closeCallback} modalStyle={modalStyle}>
          {children}
        </Modal>
      ) : (
        <Box className={classes.wrapper}>{children}</Box>
      )}
    </>
  );
};

export default MainContainer;
