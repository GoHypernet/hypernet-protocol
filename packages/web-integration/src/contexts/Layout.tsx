import { EStatusColor } from "@hypernetlabs/web-ui/src/theme";
import React, { useState } from "react";

interface ILayout {
  setModalWidth: (width: number) => void;
  modalWidth: number;
  setModalStatus: (status: EStatusColor) => void;
  modalStatus: EStatusColor;
  closeModal: () => void;
}

interface ILayoutProps {
  children: any;
}

const LayoutContext = React.createContext<ILayout>(undefined!);

function LayoutProvider({ children }: ILayoutProps) {
  const [modalWidth, setModalWidth] = useState<number>(373);
  const [modalStatus, setModalStatus] = useState<EStatusColor>(EStatusColor.IDLE);

  const closeModal = () => {
    const modalRoot = document.getElementById("__hypernet-protocol-modal-root__");
    //@ts-ignore
    modalRoot.innerHTML = "";
  };

  const initialState: any = {
    setModalWidth,
    modalWidth,
    setModalStatus,
    modalStatus,
    closeModal,
  };

  return <LayoutContext.Provider value={initialState as ILayout}>{children}</LayoutContext.Provider>;
}

export { LayoutContext, LayoutProvider };
