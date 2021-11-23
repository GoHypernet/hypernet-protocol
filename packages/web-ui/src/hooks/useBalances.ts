import {
  AssetBalance,
  Balances,
  ActiveStateChannel,
  EthereumContractAddress,
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
  balancesByChannelAddresses: Map<EthereumContractAddress, AssetBalance[]>;
  preferredPaymentToken?: ITokenSelectorOption;
}

interface IBalancesWithStateChannel {
  balances: Balances;
  activeStateChannel: ActiveStateChannel;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: Balances }
  | {
      type: EActionTypes.STATE_CHANNEL_CHANGED;
      payload: IBalancesWithStateChannel;
    }
  | { type: EActionTypes.ERROR; payload: string }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBalances() {
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const initialState: IState = {
    error: false,
    loading: true,
    balances: [],
    balancesByChannelAddress: [],
    balancesByChannelAddresses: new Map(),
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

  // useEffect(() => {
  //   console.log("STATE CHANNEL CHANGED !")
  // }, [UIData.getSelectedStateChannel().channelAddress]);

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      if (cancelRequest) return;
      dispatch({ type: EActionTypes.FETCHING });
      setLoading(true);
      coreProxy
        ?.getBalances()
        .map((_balances) => {
          setLoading(false);
          dispatch({
            type: EActionTypes.FETCHED,
            payload: _balances,
          });

          const selectedStateChannel = UIData.getSelectedStateChannel();

          if (
            selectedStateChannel == null ||
            selectedStateChannel.channelAddress == null
          ) {
            coreProxy.getActiveStateChannels().map((activeStateChannels) => {
              dispatch({
                type: EActionTypes.STATE_CHANNEL_CHANGED,
                payload: {
                  balances: _balances,
                  activeStateChannel: activeStateChannels[0],
                },
              });
            });
          } else {
            dispatch({
              type: EActionTypes.STATE_CHANNEL_CHANGED,
              payload: {
                balances: _balances,
                activeStateChannel: selectedStateChannel,
              },
            });
          }
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

        const selectedStateChannel = UIData.getSelectedStateChannel();

        dispatch({
          type: EActionTypes.STATE_CHANNEL_CHANGED,
          payload: {
            balances: balance,
            activeStateChannel: selectedStateChannel,
          },
        });
      },
    });

    UIData.onSelectedStateChannelChanged.subscribe({
      next: (activeStateChannel) => {
        if (cancelRequest) return;
        coreProxy?.getBalances().map((balances) => {
          setLoading(false);
          dispatch({
            type: EActionTypes.FETCHED,
            payload: balances,
          });

          dispatch({
            type: EActionTypes.STATE_CHANNEL_CHANGED,
            payload: {
              balances,
              activeStateChannel,
            },
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
  ): Map<EthereumContractAddress, AssetBalance[]> {
    return balance.assets.reduce(
      (acc: Map<EthereumContractAddress, AssetBalance[]>, assetBalance) => {
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
    balancesWithStateChannel: IBalancesWithStateChannel,
  ): AssetBalance[] {
    return balancesWithStateChannel.balances.assets.filter(
      (assetBalance) =>
        assetBalance.channelAddress ===
        balancesWithStateChannel.activeStateChannel.channelAddress,
    );
  }

  return {
    ...state,
  };
}
