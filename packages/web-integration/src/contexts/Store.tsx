import React from "react";
import { HypernetIFrameProxy } from "@web-integration-implementations/proxy/HypernetIFrameProxy";

interface IStore {
  proxy: HypernetIFrameProxy;
}

interface IStoreProps {
  children: any;
  proxy: HypernetIFrameProxy;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ proxy, children }: IStoreProps) {
  const initialState: any = {
    proxy,
  };

  return <StoreContext.Provider value={initialState as IStore}>{children}</StoreContext.Provider>;
}

export { StoreContext, StoreProvider };
