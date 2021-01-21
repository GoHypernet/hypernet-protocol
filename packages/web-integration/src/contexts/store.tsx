import React, { useEffect } from "react";
import { AssetBalanceParams, AssetBalanceViewModel } from "../viewModel";
import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";
import { Balances } from "@hypernetlabs/hypernet-core";
import { IBalanceList } from "@hypernetlabs/web-ui/src/interfaces";

interface IStore {
  balances: IBalanceList[];
}

interface IStoreProps {
  children: any;
  proxy?: IHypernetIFrameProxy;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ proxy, children }: IStoreProps) {
  const [balances, setBalances] = React.useState<IBalanceList[]>([]);

  useEffect(() => {
    // balances
    proxy?.getBalances().map((balance: Balances) => {
      updateBalances(balance);
    });

    proxy?.onBalancesChanged.subscribe({
      next: (balance) => {
        updateBalances(balance);
      },
    });
  }, []);

  const updateBalances = (balance: Balances) => {
    setBalances(
      balance.assets.reduce((acc: AssetBalanceViewModel[], assetBalance) => {
        acc.push(new AssetBalanceViewModel(new AssetBalanceParams(assetBalance)));
        return acc;
      }, []),
    );
  };

  const initialState: any = {
    balances,
  };

  return <StoreContext.Provider value={initialState as IStore}>{children}</StoreContext.Provider>;
}

export { StoreContext, StoreProvider };
