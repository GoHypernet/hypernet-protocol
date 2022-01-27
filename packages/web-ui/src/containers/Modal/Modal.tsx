import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";

import { GovernanceDialog, GovernanceTypography } from "@web-ui/components";
import { ModalHeader } from "@web-ui/containers/Modal/ModalHeader";
import { colors } from "@web-ui/theme";
import { useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/containers/Modal/Modal.style";
import { WEB_UI_MODAL_ID_SELECTOR } from "@web-ui/constants";

interface IModal {
  children: React.ReactNode;
  closeCallback?: () => void;
  modalStyle?: React.CSSProperties;
}

const Modal: React.FC<IModal> = (props: IModal) => {
  const { children, closeCallback = () => {}, modalStyle = {} } = props;
  const { modalWidth, modalStatus, modalHeader } = useLayoutContext();
  const classes = useStyles({
    modalWidth,
  });

  // element to which the modal will be rendered
  const elementRef = useRef<HTMLElement>(document.createElement("div"));
  const modalRootRef = useRef<HTMLElement>(document.createElement("div"));

  useEffect(() => {
    const modalElm = document.getElementById(WEB_UI_MODAL_ID_SELECTOR);
    //remove if there is already a modal opened
    if (modalElm) {
      modalElm.remove();
    }
    // initiate modal container
    modalRootRef.current.id = WEB_UI_MODAL_ID_SELECTOR;
    document.body.appendChild(modalRootRef.current);

    // append to root when the children of Modal are mounted
    modalRootRef.current.appendChild(elementRef.current);

    // do a cleanup
    return () => {
      modalRootRef.current.removeChild(elementRef.current);
    };
  }, [modalWidth, modalStatus]);

  const closeModal = () => {
    closeCallback();
    modalRootRef.current.removeChild(elementRef.current);
  };

  return (
    <GovernanceDialog
      container={elementRef.current}
      isOpen={true}
      content={
        <Box display="flex" flexDirection="column" my={2}>
          {children}
          <GovernanceTypography className={classes.bottomText} variant="body1">
            Powered by Hypernet Protocol
          </GovernanceTypography>
        </Box>
      }
      onClose={closeModal}
      maxWidth="md"
      title={<ModalHeader />}
    />
  );
};

export default Modal;
