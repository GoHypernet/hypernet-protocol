import { EStatusColor } from "@web-ui/theme";
import React, { ReactNode, useState } from "react";

interface ILayout {
  setModalWidth: (width: number) => void;
  modalWidth: number;
  setModalStatus: (status: EStatusColor) => void;
  modalStatus: EStatusColor;
  closeModal: () => void;
}

interface ILayoutProps {
  children: ReactNode;
}

const LayoutContext = React.createContext<ILayout>({} as ILayout);

function LayoutProvider({ children }: ILayoutProps) {
  const [modalWidth, setModalWidth] = useState<number>(373);
  const [modalStatus, setModalStatus] = useState<EStatusColor>(
    EStatusColor.IDLE,
  );

  const closeModal = () => {
    const modalRoot = document.getElementById(
      "__hypernet-protocol-modal-root__",
    );
    if (modalRoot != null) {
      modalRoot.innerHTML = "";
    }
  };

  const initialState: unknown = {
    setModalWidth,
    modalWidth,
    setModalStatus,
    modalStatus,
    closeModal,
  };

  return (
    <LayoutContext.Provider value={initialState as ILayout}>
      {children}
    </LayoutContext.Provider>
  );
}

export { LayoutContext, LayoutProvider };
