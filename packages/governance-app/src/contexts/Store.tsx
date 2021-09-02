import { IConfigProvider } from "@governance-app/interfaces/utilities/IConfigProvider";
import { IGovernanceBlockchainProvider } from "@interfaces/utilities";
import React, { useState, useContext } from "react";

interface IStore {
  configProvider: IConfigProvider;
  governanceBlockchainProvider: IGovernanceBlockchainProvider;
}

interface IStoreProps extends IStore {
  children: any;
}

const StoreContext = React.createContext<IStore>(undefined!);

export function StoreProvider({
  children,
  configProvider,
  governanceBlockchainProvider,
}: IStoreProps) {
  const initialState: IStore = {
    configProvider,
    governanceBlockchainProvider,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
