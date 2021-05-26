import { IHypernetCore } from "@hypernetlabs/objects";
import React, { createContext, useContext } from "react";

import { IViewUtils, IDateUtils } from "@web-ui/interfaces";

interface IStore {
  coreProxy: IHypernetCore;
  viewUtils: IViewUtils;
  dateUtils: IDateUtils;
}

interface IStoreProps {
  children: React.ReactNode;
  coreProxy: IHypernetCore;
  viewUtils: IViewUtils;
  dateUtils: IDateUtils;
}

const StoreContext = createContext<IStore>(undefined!);

export function StoreProvider({
  coreProxy,
  viewUtils,
  dateUtils,
  children,
}: IStoreProps) {
  const initialState: IStore = {
    coreProxy,
    viewUtils,
    dateUtils,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
