import { IHypernetCore } from "@hypernetlabs/objects";
import React, { createContext, useContext } from "react";

import { IViewUtils } from "@web-ui/interfaces";

interface IStore {
  coreProxy: IHypernetCore;
  viewUtils: IViewUtils;
}

interface IStoreProps {
  children: React.ReactNode;
  coreProxy: IHypernetCore;
  viewUtils: IViewUtils;
}

const StoreContext = createContext<IStore>(undefined!);

export function StoreProvider({ coreProxy, viewUtils, children }: IStoreProps) {
  const initialState: IStore = {
    coreProxy,
    viewUtils,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
