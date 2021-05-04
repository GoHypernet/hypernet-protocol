import { IHypernetCore } from "@hypernetlabs/objects";
import React from "react";

interface IStore {
  proxy: IHypernetCore;
}

interface IStoreProps {
  children: React.ReactNode;
  proxy: IHypernetCore;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ proxy, children }: IStoreProps) {
  const initialState: IStore = {
    proxy,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreProvider };
