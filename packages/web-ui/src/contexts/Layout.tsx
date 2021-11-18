import React, { ReactNode, useState, createContext, useContext } from "react";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { WEB_UI_MODAL_ID_SELECTOR } from "@web-ui/constants";
import { EStatusColor } from "@web-ui/theme";

interface ILayout {
  setModalWidth: (width: number) => void;
  modalWidth: number;
  setModalStatus: (status: EStatusColor) => void;
  modalStatus: EStatusColor;
  closeModal: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface ILayoutProps {
  children: ReactNode;
}

const LayoutContext = createContext<ILayout>({} as ILayout);

export function LayoutProvider({ children }: ILayoutProps) {
  const [modalWidth, setModalWidth] = useState<number>(900);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<EStatusColor>(
    EStatusColor.IDLE,
  );

  const closeModal = () => {
    const modalRoot = document.getElementById(WEB_UI_MODAL_ID_SELECTOR);
    if (modalRoot != null) {
      modalRoot.innerHTML = "";
    }
  };

  const initialState: ILayout = {
    setModalWidth,
    modalWidth,
    setModalStatus,
    modalStatus,
    closeModal,
    loading,
    setLoading,
  };

  const alertOptions = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
  };

  return (
    <LayoutContext.Provider value={initialState}>
      <Provider template={AlertTemplate} {...alertOptions}>
        {children}
      </Provider>
    </LayoutContext.Provider>
  );
}

export const useLayoutContext = () => useContext(LayoutContext);
