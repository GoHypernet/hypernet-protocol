import React, { useEffect, useContext } from "react";
import { createPortal } from "react-dom";

import useStyles from "./Modal.style";

import { LayoutContext } from "@web-integration-contexts";

interface IModal {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<IModal> = (props: IModal) => {
  const { isOpen, children } = props;
  const { modalWidth, modalStatus } = useContext(LayoutContext);
  const classes = useStyles({
    modalWidth,
  });

  // element to which the modal will be rendered
  const modalId = "__hypernet-protocol-modal-root__";
  const el = document.createElement("div");
  let modalRoot: HTMLElement;

  useEffect(() => {
    const modalElm = document.getElementById(modalId);
    //remove if there is already a modal opened
    if (modalElm) {
      modalElm.remove();
    }
    // initiate modal container
    modalRoot = document.createElement("div");
    modalRoot.id = modalId;
    document.body.appendChild(modalRoot);
  }, [modalWidth, modalStatus]);

  useEffect(() => {
    // append to root when the children of Modal are mounted
    modalRoot.appendChild(el);

    // do a cleanup
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalWidth, modalStatus]);

  return (
    <>
      {isOpen &&
        createPortal(
          <div className={classes.container}>
            <div className={classes.wrapper}>
              <div className={classes.closeIcon} onClick={() => modalRoot.removeChild(el)}>
                <img
                  src="https://res.cloudinary.com/dqueufbs7/image/upload/v1611371438/images/Close-512.png"
                  width="20"
                />
              </div>
              {children}
            </div>
          </div>,
          el,
        )}
    </>
  );
};

export default Modal;
