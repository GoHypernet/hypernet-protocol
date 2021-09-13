import { IConfigProvider } from "@governance-app/interfaces/utilities/IConfigProvider";
import { IGovernanceBlockchainProvider } from "@interfaces/utilities";
import React, { useState, useContext } from "react";
import { BigNumber } from "ethers";

interface IStore {
  configProvider: IConfigProvider;
  governanceBlockchainProvider: IGovernanceBlockchainProvider;

  // State
  balance?: BigNumber;
  setBalance: (balance: BigNumber) => void;
  account: string;
  setAccount: (account: string) => void;
  tokenSymbol: string;
  setTokenSymbol: (symbol: string) => void;
}

interface IStoreProps {
  configProvider: IConfigProvider;
  governanceBlockchainProvider: IGovernanceBlockchainProvider;
  children: any;
}

const StoreContext = React.createContext<IStore>(undefined!);

export function StoreProvider({
  children,
  configProvider,
  governanceBlockchainProvider,
}: IStoreProps) {
  const [account, setAccount] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [balance, setBalance] = useState<BigNumber>();

  const initialState: IStore = {
    configProvider,
    governanceBlockchainProvider,
    setBalance,
    setAccount,
    setTokenSymbol,
    account,
    balance,
    tokenSymbol,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
