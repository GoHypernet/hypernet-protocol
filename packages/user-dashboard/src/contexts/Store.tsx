import React, { useState, useContext } from "react";

import { IHypernetCore } from "@hypernetlabs/objects";

interface IStore {
  coreProxy?: IHypernetCore;
  setCoreProxy: (value: IHypernetCore) => void;
}

interface IStoreProps {
  children: any;
}

const StoreContext = React.createContext<IStore>(undefined!);

export function StoreProvider({ children }: IStoreProps) {
  const [coreProxy, setCoreProxy] = useState<IHypernetCore>();

  const initialState: IStore = {
    coreProxy,
    setCoreProxy,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
