import React, { createContext, useContext } from "react";

import { IHypernetCore } from "@hypernetlabs/objects";

interface IStore {
  proxy: IHypernetCore;
}

interface IStoreProps {
  children: React.ReactNode;
  proxy: IHypernetCore;
}

const StoreContext = createContext<IStore>(undefined!);

export function StoreProvider({ proxy, children }: IStoreProps) {
  const initialState: IStore = {
    proxy,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
