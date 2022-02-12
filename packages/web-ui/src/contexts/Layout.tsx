import React, { ReactNode, useState, createContext, useContext } from "react";
import { useAlert } from "react-alert";

import { WEB_UI_MODAL_ID_SELECTOR } from "@web-ui/constants";
import { EStatusColor } from "@web-ui/theme";

interface ILayout {
  setModalWidth: (width: number) => void;
  modalWidth: number;
  setModalStatus: (status: EStatusColor) => void;
  modalStatus: EStatusColor;
  setModalHeader: (header: ReactNode) => void;
  modalHeader?: ReactNode;
  setHideModalWatermark: (hide: boolean) => void;
  hideModalWatermark?: boolean;
  closeModal: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handleCoreError: (err: any) => void;
}

interface ILayoutProps {
  children: ReactNode;
}

const LayoutContext = createContext<ILayout>({} as ILayout);

export function LayoutProvider({ children }: ILayoutProps) {
  const alert = useAlert();
  const [modalWidth, setModalWidth] = useState<number>(900);
  const [loading, setLoading] = useState<boolean>(false);
  const [hideModalWatermark, setHideModalWatermark] = useState<boolean>(false);

  const [modalHeader, setModalHeader] = useState<ReactNode>();
  const [modalStatus, setModalStatus] = useState<EStatusColor>(
    EStatusColor.IDLE,
  );

  const closeModal = () => {
    const modalRoot = document.getElementById(WEB_UI_MODAL_ID_SELECTOR);
    if (modalRoot != null) {
      modalRoot.innerHTML = "";
    }
  };

  const handleCoreError = (err) => {
    setLoading(false);

    let errorMessage = "";
    if (
      err?.message != null &&
      err?.message?.toLowerCase()?.includes("nonce too high")
    ) {
      errorMessage =
        "Nonce too high error, try to restart your metamask from the advanced option";
    } else if (err?.message != null) {
      errorMessage = err?.message;
    } else {
      errorMessage = "Something went wrong!";
    }

    alert.error(errorMessage);
  };

  const initialState: ILayout = {
    setModalWidth,
    modalWidth,
    setModalStatus,
    modalStatus,
    setModalHeader,
    modalHeader,
    setHideModalWatermark,
    hideModalWatermark,
    closeModal,
    loading,
    setLoading,
    handleCoreError,
  };

  return (
    <LayoutContext.Provider value={initialState}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayoutContext = () => useContext(LayoutContext);
