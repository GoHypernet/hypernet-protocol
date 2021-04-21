import { AssetBalance, Balances } from "@hypernetlabs/objects";
import { useEffect, useReducer, useContext } from "react";

import { StoreContext } from "@web-integration-contexts";
import { AssetBalanceParams, AssetBalanceViewModel } from "@web-integration-interfaces/objects";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

interface IState {
  loading: boolean;
  error: any;
  balances: AssetBalance[];
}

export function useBalances() {
  const { proxy } = useContext(StoreContext);

  const initialState: IState = {
    loading: true,
    error: null,
    balances: [],
  };

  const [state, dispatch] = useReducer((state: IState, action: any) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return { ...state, loading: true };
      case EActionTypes.FETCHED:
        return { ...state, loading: false, balances: action.payload };
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      dispatch({ type: EActionTypes.FETCHING });
      try {
        if (cancelRequest) return;
        // get data from proxy
        proxy?.getBalances().map((balance: Balances) => {
          // prepare balances
          dispatch({ type: EActionTypes.FETCHED, payload: prepareBalances(balance) });
        });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      }
    };

    fetchData();

    proxy?.onBalancesChanged.subscribe({
      next: (balance) => {
        if (cancelRequest) return;
        dispatch({ type: EActionTypes.FETCHED, payload: prepareBalances(balance) });
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  const prepareBalances = (balance: Balances) => {
    return balance.assets.reduce((acc: AssetBalanceViewModel[], assetBalance) => {
      acc.push(new AssetBalanceViewModel(new AssetBalanceParams(assetBalance)));
      return acc;
    }, []);
  };

  return state;
}
