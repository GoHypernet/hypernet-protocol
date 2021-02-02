import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const modalRoot: HTMLElement = document.createElement("div");
modalRoot.id = "__hypernet-protocol-modal-root__";
document.body.appendChild(modalRoot);

interface IModal {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<IModal> = (props: IModal) => {
  const { isOpen, children } = props;

  // element to which the modal will be rendered
  const el = document.createElement("div");

  useEffect(() => {
    // append to root when the children of Modal are mounted
    modalRoot.appendChild(el);

    // do a cleanup
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return (
    <>
      {isOpen &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 400,
                background: "white",
                padding: "30px 20px",
                textAlign: "center",
                top: "50%",
                left: "50%",
                display: "flex",
                justifyContent: "center",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginRight: 10,
                  cursor: "pointer",
                  top: 10,
                }}
                onClick={() => modalRoot.removeChild(el)}
              >
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
