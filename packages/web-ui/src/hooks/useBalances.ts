import {
  AssetBalance,
  Balances,
  EthereumAddress,
  AssetInfo,
} from "@hypernetlabs/objects";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { ITokenSelectorOption } from "@web-ui/interfaces";
import { PaymentTokenOptionViewModel } from "@web-ui/interfaces/objects";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

import { ETHER_HEX_ADDRESS } from "@web-ui/constants";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
  TOKEN_SELECTED = "TOKEN_SELECTED",
}

interface IState {
  error: boolean;
  loading: boolean;
  balances: AssetBalance[];
  channelTokenSelectorOptions: ITokenSelectorOption[];
  preferredPaymentToken?: ITokenSelectorOption;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: Balances }
  | { type: EActionTypes.ERROR; payload: string }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBalances() {
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      if (cancelRequest) return;
      dispatch({ type: EActionTypes.FETCHING });
      setLoading(true);
      coreProxy
        ?.getBalances()
        .map((balance: Balances) => {
          setLoading(false);
          dispatch({
            type: EActionTypes.FETCHED,
            payload: balance,
          });
        })
        .mapErr((error) => {
          setLoading(false);
          alert.error(
            error.message || "An error has happened while pulling balances",
          );
          dispatch({ type: EActionTypes.ERROR, payload: error.message });
        });
    };

    fetchData();

    coreProxy?.onBalancesChanged.subscribe({
      next: (balance) => {
        if (cancelRequest) return;
        dispatch({
          type: EActionTypes.FETCHED,
          payload: balance,
        });
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  const initialState: IState = {
    error: false,
    loading: true,
    balances: [],
    channelTokenSelectorOptions: [],
    preferredPaymentToken: undefined,
  };

  const [state, dispatch] = useReducer((state: IState, action: Action) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return {
          ...state,
          error: false,
          loading: true,
        };
      case EActionTypes.FETCHED:
        return {
          ...state,
          error: false,
          loading: false,
          balances: prepareBalances(action.payload),
          channelTokenSelectorOptions: prepareChannelTokenSelectorOptions(
            action.payload,
          ),
        };
      case EActionTypes.TOKEN_SELECTED:
        return {
          ...state,
          error: false,
          loading: false,
          preferredPaymentToken: action.payload,
        };
      case EActionTypes.ERROR:
        return {
          ...state,
          error: true,
          loading: false,
        };
      default:
        return state;
    }
  }, initialState);

  function prepareBalances(balance: Balances): AssetBalance[] {
    return balance.assets.reduce((acc: AssetBalance[], assetBalance) => {
      acc.push(assetBalance);
      return acc;
    }, []);
  }

  function prepareChannelTokenSelectorOptions(
    balance: Balances,
  ): ITokenSelectorOption[] {
    return balance.assets.reduce(
      (acc: ITokenSelectorOption[], assetBalance) => {
        const tokenName =
          assetBalance.assetAddress === ETHER_HEX_ADDRESS
            ? "ETH"
            : "HyperToken";
        acc.push(
          new PaymentTokenOptionViewModel(tokenName, assetBalance.assetAddress),
        );
        return acc;
      },
      [],
    );
  }

  return {
    ...state,
  };
}
