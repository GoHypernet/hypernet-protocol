import {
  ActiveStateChannel,
  Balances,
  BigNumberString,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { ITokenSelectorOption } from "@web-ui/interfaces";
import { PaymentTokenOptionViewModel } from "@web-ui/interfaces/objects";
import { ethers } from "ethers";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

import { ETHER_HEX_ADDRESS } from "@web-ui/constants";

enum EActionTypes {
  FETCHED = "FETCHED",
  TOKEN_SELECTED = "TOKEN_SELECTED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  AMOUNT_CHANGED = "AMOUNT_CHANGED",
  DESTINATION_ADDRESS_CHANGED = "DESTINATION_ADDRESS_CHANGED",
  FETCHED_STATE_CHANNELS = "FETCHED_STATE_CHANNELS",
  STATE_CHANNEL_SELECTED = "STATE_CHANNEL_SELECTED",
}

interface IReducerStateReducer {
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  amount: string;
  destinationAddress: EthereumAddress;
  setAmount: (amount: string) => void;
  setDestinationAddress: (destinationAddress: string) => void;
  mintTokens: () => void;
  depositFunds: (
    tokenAddress: EthereumAddress,
    amount: string,
    stateChannelAddress: EthereumAddress,
  ) => void;
  withdrawFunds: (
    tokenAddress: EthereumAddress,
    amount: string,
    stateChannelAddress: EthereumAddress,
  ) => void;
  activeStateChannels?: ActiveStateChannel[];
  selectedStateChennel?: ActiveStateChannel;
}

interface IReducerState {
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  amount: string;
  destinationAddress: EthereumAddress;
  selectedPaymentToken?: ITokenSelectorOption;
  activeStateChannels?: ActiveStateChannel[];
  selectedStateChennel?: ActiveStateChannel;
}

type Action =
  | { type: EActionTypes.FETCHED; payload: PaymentTokenOptionViewModel[] }
  | { type: EActionTypes.AMOUNT_CHANGED; payload: string }
  | { type: EActionTypes.FETCHED_STATE_CHANNELS; payload: ActiveStateChannel[] }
  | { type: EActionTypes.DESTINATION_ADDRESS_CHANGED; payload: EthereumAddress }
  | { type: EActionTypes.STATE_CHANNEL_SELECTED; payload: ActiveStateChannel }
  | { type: EActionTypes.SUCCESS }
  | { type: EActionTypes.ERROR }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

export function useFund(): IReducerStateReducer {
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const initialState: IReducerState = {
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
    amount: "1",
    destinationAddress: EthereumAddress(""),
    activeStateChannels: [],
  };

  const [state, dispatch] = useReducer(
    (state: IReducerState, action: Action) => {
      switch (action.type) {
        case EActionTypes.FETCHED:
          return {
            ...state,
            error: false,
            tokenSelectorOptions: action.payload,
          };
        case EActionTypes.TOKEN_SELECTED:
          return {
            ...state,
            error: false,
            selectedPaymentToken: action.payload,
          };
        case EActionTypes.AMOUNT_CHANGED:
          return {
            ...state,
            error: false,
            amount: action.payload,
          };
        case EActionTypes.DESTINATION_ADDRESS_CHANGED:
          return {
            ...state,
            error: false,
            destinationAddress: action.payload,
          };
        case EActionTypes.FETCHED_STATE_CHANNELS:
          return {
            ...state,
            error: false,
            activeStateChannels: action.payload,
          };
        case EActionTypes.STATE_CHANNEL_SELECTED:
          return {
            ...state,
            error: false,
            selectedStateChennel: action.payload,
          };
        case EActionTypes.ERROR:
          return {
            ...state,
            error: true,
          };
        case EActionTypes.SUCCESS:
          return {
            ...state,
            error: false,
          };
        default:
          return { ...state };
      }
    },
    initialState,
  );

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (cancelRequest) return;
        // get data from coreProxy
        coreProxy?.getBalances().map((balance: Balances) => {
          // prepare balances
          setLoading(false);
          dispatch({
            type: EActionTypes.FETCHED,
            payload: prepareTokenSelector(balance),
          });
        });

        coreProxy.getEthereumAccounts().match(
          (accounts) => {
            dispatch({
              type: EActionTypes.DESTINATION_ADDRESS_CHANGED,
              payload: accounts[0],
            });
          },
          (err) => {
            console.log("err: ", err);
          },
        );

        coreProxy.getActiveStateChannels().match(
          (stateChannels) => {
            dispatch({
              type: EActionTypes.FETCHED_STATE_CHANNELS,
              payload: stateChannels,
            });

            dispatch({
              type: EActionTypes.STATE_CHANNEL_SELECTED,
              payload: UIData.getSelectedStateChannel(),
            });
          },
          (err) => {
            console.log("err: ", err);
          },
        );
      } catch (error) {
        setLoading(false);
        if (cancelRequest) return;
        dispatch({ type: EActionTypes.ERROR });
      }
    };

    fetchData();

    coreProxy?.onBalancesChanged.subscribe({
      next: (balance) => {
        if (cancelRequest) return;
        dispatch({
          type: EActionTypes.FETCHED,
          payload: prepareTokenSelector(balance),
        });
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  const prepareTokenSelector = (
    balance: Balances,
  ): PaymentTokenOptionViewModel[] => {
    // TODO: this should be pulled from metamask available balances not the channel balances
    //if (balance.assets.length) {
    if (false) {
      return balance.assets.reduce(
        (acc: PaymentTokenOptionViewModel[], assetBalance) => {
          const tokenName =
            assetBalance.assetAddress === ETHER_HEX_ADDRESS
              ? "ETH"
              : "HypernetToken";
          acc.push(
            new PaymentTokenOptionViewModel(
              tokenName,
              assetBalance.assetAddress,
            ),
          );
          return acc;
        },
        new Array<PaymentTokenOptionViewModel>(),
      );
    } else {
      return [
        new PaymentTokenOptionViewModel(
          "Hypertoken",
          EthereumAddress("0xAa588d3737B611baFD7bD713445b314BD453a5C8"),
        ),
        new PaymentTokenOptionViewModel(
          "Test Token",
          EthereumAddress("0x9FBDa871d559710256a2502A2517b794B482Db40"),
        ),
        new PaymentTokenOptionViewModel(
          "ETH",
          EthereumAddress("0x0000000000000000000000000000000000000000"),
        ),
      ];
    }
  };

  const setSelectedPaymentToken = (selectedOption?: ITokenSelectorOption) => {
    dispatch({
      type: EActionTypes.TOKEN_SELECTED,
      payload: selectedOption,
    });
  };

  const setAmount = (enteredAmount: string) => {
    dispatch({
      type: EActionTypes.AMOUNT_CHANGED,
      payload: enteredAmount,
    });
  };

  const setDestinationAddress = (enteredAddress: string) => {
    dispatch({
      type: EActionTypes.AMOUNT_CHANGED,
      payload: EthereumAddress(enteredAddress),
    });
  };

  const depositFunds = (
    tokenAddress: EthereumAddress,
    amount: string,
    stateChannelAddress: EthereumAddress,
  ) => {
    setLoading(true);
    coreProxy
      .depositFunds(
        stateChannelAddress,
        tokenAddress,
        BigNumberString(ethers.utils.parseEther(amount || "1").toString()),
      )
      .match(
        (balances) => {
          alert.success("Your fund deposit has succeeded!");
          setLoading(false);
          dispatch({
            type: EActionTypes.SUCCESS,
          });
        },
        (err) => {
          alert.error(err.message || "Your fund deposit has failed");
          setLoading(false);
          dispatch({
            type: EActionTypes.ERROR,
          });
        },
      );
  };

  const withdrawFunds = (
    tokenAddress: EthereumAddress,
    amount: string,
    stateChannelAddress: EthereumAddress,
  ) => {
    setLoading(true);
    coreProxy
      .withdrawFunds(
        stateChannelAddress,
        tokenAddress,
        BigNumberString(ethers.utils.parseEther(amount).toString()),
        state.destinationAddress,
      )
      .match(
        () => {
          alert.success("Your funds withdrawl has succeeded!");
          setLoading(false);
        },
        (err) => {
          alert.error(err.message || "Your funds withdrawl has failed");
          setLoading(false);
        },
      );
  };

  const mintTokens = () => {
    setLoading(true);
    coreProxy
      .mintTestToken(
        BigNumberString(
          ethers.utils.parseEther(state.amount || "1").toString(),
        ),
      )
      .match(
        () => {
          alert.success("mint tokens has succeeded");
          setLoading(false);
          dispatch({
            type: EActionTypes.SUCCESS,
          });
        },
        (err) => {
          alert.error(err.message || "mint tokens has failed");
          setLoading(false);
          dispatch({
            type: EActionTypes.ERROR,
          });
        },
      );
  };

  return {
    ...state,
    setSelectedPaymentToken,
    setDestinationAddress,
    depositFunds,
    withdrawFunds,
    mintTokens,
    setAmount,
  };
}
