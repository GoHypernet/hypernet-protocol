import * as React from "react";
import { AssetBalanceViewModel } from "../viewModel";

interface IStore {
  balances: AssetBalanceViewModel[];
  setBalances: () => void;
}

interface IStoreProps {
  children: any;
  initialData?: any;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ initialData, children }: IStoreProps) {
  console.log("initialData in StoreProvider: ", initialData);
  const [balances, setBalances] = React.useState<AssetBalanceViewModel[]>([]);

  const initialState: any = {
    balances,
    setBalances,
  };

  return <StoreContext.Provider value={initialState as IStore}>{children}</StoreContext.Provider>;
}

export { StoreContext, StoreProvider };
