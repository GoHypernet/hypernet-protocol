import { ChainId, IHypernetCore, IUIData } from "@hypernetlabs/objects";
import { IViewUtils, IDateUtils } from "@web-ui/interfaces";
import React, { createContext, useContext } from "react";

interface IStore {
  coreProxy: IHypernetCore;
  UIData: IUIData;
  viewUtils: IViewUtils;
  dateUtils: IDateUtils;
  widgetUniqueIdentifier: string;
  defaultGovernanceChainId: ChainId;
}

interface IStoreProps extends IStore {
  children: React.ReactNode;
}

const StoreContext = createContext<IStore>(undefined!);

export function StoreProvider({
  coreProxy,
  UIData,
  viewUtils,
  dateUtils,
  widgetUniqueIdentifier,
  defaultGovernanceChainId,
  children,
}: IStoreProps) {
  const initialState: IStore = {
    coreProxy,
    UIData,
    viewUtils,
    dateUtils,
    widgetUniqueIdentifier,
    defaultGovernanceChainId,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
