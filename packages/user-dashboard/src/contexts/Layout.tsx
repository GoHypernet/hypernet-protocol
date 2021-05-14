import React, { useContext, useState, useEffect, ReactNode } from "react";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { ResultMessage, EResultStatus } from "@hypernetlabs/web-ui";
import LoadingSpinner from "@user-dashboard/components/LoadingSpinner";

interface ILayout {
  closeModal: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  resultMessage: ResultMessage;
  setResultMessage: (resultMessage: ResultMessage) => void;
}

interface ILayoutProps {
  loading: boolean;
  resultMessage: ResultMessage;
  children: ReactNode;
}

const LayoutContext = React.createContext<ILayout>({} as ILayout);

export function LayoutProvider({
  children,
  loading: loadingProp,
  resultMessage: resultMessageProp,
}: ILayoutProps) {
  const [loading, setLoading] = useState<boolean>(loadingProp);
  const [resultMessage, setResultMessage] = useState<ResultMessage>(
    resultMessageProp,
  );

  useEffect(() => {
    if (resultMessage.status === EResultStatus.FAILURE) {
      // show failure alert
    }
    if (resultMessage.status === EResultStatus.SUCCESS) {
      // show success alert
    }
  }, [resultMessage]);

  const closeModal = () => {
    const modalRoot = document.getElementById(
      "__hypernet-protocol-modal-root__",
    );
    if (modalRoot != null) {
      modalRoot.innerHTML = "";
    }
  };

  const initialState: unknown = {
    closeModal,
    loading,
    setLoading,
    resultMessage,
    setResultMessage,
  };

  const alertOptions = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
  };

  return (
    <LayoutContext.Provider value={initialState as ILayout}>
      <LoadingSpinner />
      <Provider template={AlertTemplate} {...alertOptions}>
        {children}
      </Provider>
    </LayoutContext.Provider>
  );
}

export const useLayoutContext = () => useContext(LayoutContext);
