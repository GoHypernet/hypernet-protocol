import { Box } from "@material-ui/core";
import { useLayoutContext } from "@web-ui/contexts";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { WEB_UI_MODAL_ID_SELECTOR } from "@web-ui/constants";
import { useStyles } from "@web-ui/containers/Modal/Modal.style";
import { GovernanceDialog } from "@web-ui/components";
import { ModalHeader } from "@web-ui/containers/Modal/ModalHeader";

interface IModal {
  children: React.ReactNode;
  closeCallback?: () => void;
  modalStyle?: React.CSSProperties;
}

const Modal: React.FC<IModal> = (props: IModal) => {
  const { children, closeCallback = () => {}, modalStyle = {} } = props;
  const { modalWidth, modalStatus } = useLayoutContext();
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

  return createPortal(
    // <Box className={classes.container}>
    //   <Box className={classes.wrapper} style={modalStyle}>
    //     <Box className={classes.closeIcon} onClick={closeModal}>
    //       <img
    //         src="https://res.cloudinary.com/dqueufbs7/image/upload/v1611371438/images/Close-512.png"
    //         width="20"
    //       />
    //     </Box>
    //     {children}
    //   </Box>
    // </Box>
    <Box textAlign="center">
      <GovernanceDialog
        isOpen={true}
        content={children}
        onClose={closeModal}
        title={<ModalHeader />}
      />
    </Box>,
    elementRef.current,
  );
};

export default Modal;
