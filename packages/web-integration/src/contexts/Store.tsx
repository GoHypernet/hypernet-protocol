import React from "react";

import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";

interface IStore {
  proxy: IHypernetIFrameProxy;
}

interface IStoreProps {
  children: any;
  proxy: IHypernetIFrameProxy;
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
