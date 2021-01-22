import React, { useEffect } from "react";
import { AssetBalanceParams, AssetBalanceViewModel, PaymentTokenOptionViewModel } from "../viewModel";
import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";
import { Balances } from "@hypernetlabs/hypernet-core";
import { IBalanceList, ITokenSelectorOption } from "@hypernetlabs/web-ui/src/interfaces";
import { ethers } from "ethers";
import { errAsync, ResultAsync } from "neverthrow";

interface IStore {
  balances: IBalanceList[];
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  depositFunds: () => ResultAsync<Balances, Error>;
}

interface IStoreProps {
  children: any;
  proxy: IHypernetIFrameProxy;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ proxy, children }: IStoreProps) {
  const [balances, setBalances] = React.useState<IBalanceList[]>([]);
  const [tokenSelectorOptions, setTokenSelectorOptions] = React.useState<ITokenSelectorOption[]>([]);
  const [selectedPaymentToken, setSelectedPaymentToken] = React.useState<ITokenSelectorOption>();

  useEffect(() => {
    proxy?.getBalances().map((balance: Balances) => {
      // prepare balances
      updateBalances(balance);

      // prepare  token selectors
      updateTokenSelectors(balance);
    });

    proxy?.onBalancesChanged.subscribe({
      next: (balance) => {
        updateBalances(balance);
        updateTokenSelectors(balance);
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

  const updateTokenSelectors = (balance: Balances) => {
    setTokenSelectorOptions(
      balance.assets.reduce((acc: PaymentTokenOptionViewModel[], assetBalance) => {
        acc.push(new PaymentTokenOptionViewModel(assetBalance.assetAddresss, assetBalance.assetAddresss));
        return acc;
      }, new Array<PaymentTokenOptionViewModel>()),
    );

    // manual set up
    /* const eth = new PaymentTokenOptionViewModel("ETH", "0x0000000000000000000000000000000000000000");
    const test = new PaymentTokenOptionViewModel("Test Token", "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0");
    setTokenSelectorOptions([eth, test]); */
  };

  const depositFunds: () => ResultAsync<Balances, Error> = () => {
    if (selectedPaymentToken?.address) {
      return proxy.depositFunds(selectedPaymentToken?.address, ethers.utils.parseEther("1"));
    } else {
      return errAsync(new Error("address not fownd"));
    }
  };

  const initialState: any = {
    balances,
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    depositFunds,
  };

  return <StoreContext.Provider value={initialState as IStore}>{children}</StoreContext.Provider>;
}

export { StoreContext, StoreProvider };
