import { AssetBalance, Balances } from "@hypernetlabs/objects";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { ITokenSelectorOption } from "@web-ui/interfaces";
import { PaymentTokenOptionViewModel } from "@web-ui/interfaces/objects";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
  TOKEN_SELECTED = "TOKEN_SELECTED",
}

interface IState {
  error: boolean;
  balances: AssetBalance[];
  channelTokenSelectorOptions: ITokenSelectorOption[];
  preferredPaymentToken?: ITokenSelectorOption;
  setPreferredPaymentToken?: (selectedOption?: ITokenSelectorOption) => void;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: Balances }
  | { type: EActionTypes.ERROR; payload: string }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

export function useBalances() {
  const { proxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      if (cancelRequest) return;
      dispatch({ type: EActionTypes.FETCHING });
      setLoading(true);
      proxy
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

    proxy?.onBalancesChanged.subscribe({
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
    balances: [],
    channelTokenSelectorOptions: [],
    preferredPaymentToken: undefined,
  };

  const setPreferredPaymentToken = (selectedOption?: ITokenSelectorOption) => {
    // save preferred payment token in
    alert.success("Your default payment token has changed!");
    dispatch({
      type: EActionTypes.TOKEN_SELECTED,
      payload: selectedOption,
    });
  };

  const prepareBalances = (balance: Balances): AssetBalance[] => {
    return balance.assets.reduce((acc: AssetBalance[], assetBalance) => {
      acc.push(assetBalance);
      return acc;
    }, []);
  };

  const prepareChannelTokenSelectorOptions = (
    balance: Balances,
  ): ITokenSelectorOption[] => {
    return balance.assets.reduce(
      (acc: ITokenSelectorOption[], assetBalance) => {
        acc.push(
          new PaymentTokenOptionViewModel(
            assetBalance.name,
            assetBalance.assetAddress,
          ),
        );
        return acc;
      },
      [],
    );
  };

  const [state, dispatch] = useReducer((state: IState, action: Action) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return {
          ...state,
          error: false,
        };
      case EActionTypes.FETCHED:
        return {
          ...state,
          error: false,
          balances: prepareBalances(action.payload),
          channelTokenSelectorOptions: prepareChannelTokenSelectorOptions(
            action.payload,
          ),
        };
      case EActionTypes.TOKEN_SELECTED:
        return {
          ...state,
          error: false,
          preferredPaymentToken: action.payload,
        };
      case EActionTypes.ERROR:
        return {
          ...state,
          error: true,
        };
      default:
        return state;
    }
  }, initialState);

  return { ...state, setPreferredPaymentToken };
}
