import {
  AssetBalance,
  Balances,
  EthereumAddress,
  AssetInfo,
} from "@hypernetlabs/objects";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

import { ETHER_HEX_ADDRESS } from "@web-ui/constants";
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
  //setPreferredPaymentTokenByAssetInfo?: (assetInfo?: AssetInfo) => void;
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

          proxy.getPreferredPaymentToken().map((assetInfo) => {
            console.log("AssetInfo token: ", assetInfo);
            const tokenName =
              assetInfo.assetId === ETHER_HEX_ADDRESS ? "ETH" : "HyperToken";
            dispatch({
              type: EActionTypes.TOKEN_SELECTED,
              payload: new PaymentTokenOptionViewModel(
                tokenName,
                assetInfo.assetId,
              ),
            });
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

  /* const setPreferredPaymentTokenByAssetInfo = (assetInfo: AssetInfo) => {
    if (!assetInfo) {
      alert.error("Token address most be provided!");
      return;
    }
    const tokenName =
      assetInfo.assetId === ETHER_HEX_ADDRESS ? "ETH" : "HyperToken";
    dispatch({
      type: EActionTypes.TOKEN_SELECTED,
      payload: new PaymentTokenOptionViewModel(tokenName, assetInfo.assetId),
    });
  }; */

  const setPreferredPaymentToken = (selectedOption?: ITokenSelectorOption) => {
    if (!selectedOption?.address) {
      alert.error("Token address most be provided!");
      return;
    }
    setLoading(true);
    proxy
      .setPreferredPaymentToken(EthereumAddress(selectedOption.address))
      .match(
        () => {
          setLoading(false);
          alert.success("Your default payment token has changed!");
          dispatch({
            type: EActionTypes.TOKEN_SELECTED,
            payload: selectedOption,
          });
        },
        (err) => {
          setLoading(false);
          alert.error(
            err.message || "An error occurred while saveing payment token",
          );
          dispatch({ type: EActionTypes.ERROR, payload: err.message });
        },
      );
  };

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
    setPreferredPaymentToken,
    //setPreferredPaymentTokenByAssetInfo,
  };
}
