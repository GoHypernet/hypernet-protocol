import {
  AssetBalance,
  Balances,
  EthereumAddress,
  AssetInfo,
  ActiveStateChannel,
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
  STATE_CHANNEL_CHANGED = "STATE_CHANNEL_CHANGED",
}

interface IState {
  error: boolean;
  loading: boolean;
  balances: AssetBalance[];
  balancesByChannelAddress: AssetBalance[];
  balancesByChannelAddresses: Map<EthereumAddress, AssetBalance[]>;
  channelTokenSelectorOptions: ITokenSelectorOption[];
  preferredPaymentToken?: ITokenSelectorOption;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: Balances }
  | { type: EActionTypes.STATE_CHANNEL_CHANGED; payload: ActiveStateChannel }
  | { type: EActionTypes.ERROR; payload: string }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBalances() {
  const { coreProxy, UIEvents } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const initialState: IState = {
    error: false,
    loading: true,
    balances: [],
    balancesByChannelAddress: [],
    balancesByChannelAddresses: new Map(),
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
          balancesByChannelAddresses: prepareBalancesByChannelAddresses(
            action.payload,
          ),
          channelTokenSelectorOptions: prepareChannelTokenSelectorOptions(
            action.payload,
          ),
        };
      case EActionTypes.STATE_CHANNEL_CHANGED:
        return {
          ...state,
          error: false,
          loading: false,
          balancesByChannelAddress: prepareBalancesByChannelAddress(
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

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      if (cancelRequest) return;
      dispatch({ type: EActionTypes.FETCHING });
      setLoading(true);
      coreProxy
        ?.getBalances()
        .map((balance) => {
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

    UIEvents.onSelectedStateChannelChanged.subscribe({
      next: (activeStateChannel) => {
        if (cancelRequest) return;
        coreProxy
          ?.getBalances()
          .map((balance) => {
            setLoading(false);
            dispatch({
              type: EActionTypes.FETCHED,
              payload: balance,
            });
          })
          .map(() => {
            dispatch({
              type: EActionTypes.STATE_CHANNEL_CHANGED,
              payload: activeStateChannel,
            });
          });
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  function prepareBalances(balance: Balances): AssetBalance[] {
    return balance.assets.reduce((acc: AssetBalance[], assetBalance) => {
      acc.push(assetBalance);
      return acc;
    }, []);
  }

  function prepareBalancesByChannelAddresses(
    balance: Balances,
  ): Map<EthereumAddress, AssetBalance[]> {
    return balance.assets.reduce(
      (acc: Map<EthereumAddress, AssetBalance[]>, assetBalance) => {
        acc.set(assetBalance.channelAddress, [
          ...(acc.get(assetBalance.channelAddress) || []),
          assetBalance,
        ]);
        return acc;
      },
      new Map(),
    );
  }

  function prepareBalancesByChannelAddress(
    stateChannel: ActiveStateChannel,
  ): AssetBalance[] {
    return state.balances.filter(
      (assetBalance) =>
        assetBalance.channelAddress === stateChannel.channelAddress,
    );
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
