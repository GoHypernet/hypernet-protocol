import React from "react";
import { IHypernetCore } from "@hypernetlabs/objects";

interface IStore {
  proxy: IHypernetCore;
}

interface IStoreProps {
  children: any;
  proxy: IHypernetCore;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ proxy, children }: IStoreProps) {
  const initialState: any = {
    proxy,
  };

  return (
    <StoreContext.Provider value={initialState as IStore}>
      {children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreProvider };