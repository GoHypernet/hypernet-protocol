import React, { useState, useContext } from "react";

import { IHypernetCore } from "@hypernetlabs/objects";
import { ViewUtils, IViewUtils } from "@hypernetlabs/web-ui";

interface IStore {
  coreProxy: IHypernetCore;
  viewUtils: IViewUtils;
}

interface IStoreProps {
  children: any;
  hypernetCore: IHypernetCore;
}

const StoreContext = React.createContext<IStore>(undefined!);

export function StoreProvider({ children, hypernetCore }: IStoreProps) {
  const initialState: IStore = {
    coreProxy: hypernetCore,
    viewUtils: new ViewUtils(),
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
