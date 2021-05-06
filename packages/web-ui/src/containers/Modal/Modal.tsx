import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import useStyles from "./Modal.style";

import { WEB_UI_MODAL_ID_SELECTOR } from "@web-ui/constants";
import { useLayoutContext } from "@web-ui/contexts";

interface IModal {
  children: React.ReactNode;
}

const Modal: React.FC<IModal> = (props: IModal) => {
  const { children } = props;
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

  return createPortal(
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div
          className={classes.closeIcon}
          onClick={() => modalRootRef.current.removeChild(elementRef.current)}
        >
          <img
            src="https://res.cloudinary.com/dqueufbs7/image/upload/v1611371438/images/Close-512.png"
            width="20"
          />
        </div>
        {children}
      </div>
    </div>,
    elementRef.current,
  );
};

export default Modal;
