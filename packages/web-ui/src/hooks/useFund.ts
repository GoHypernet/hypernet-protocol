import {
  ActiveStateChannel,
  Balances,
  BigNumberString,
  EthereumAccountAddress,
  EthereumContractAddress,
  TokenInformation,
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
  tokenSelectorOptions: TokenInformation[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  amount: string;
  destinationAddress: EthereumAccountAddress;
  setAmount: (amount: string) => void;
  setDestinationAddress: (destinationAddress: string) => void;
  mintTokens: () => void;
  depositFunds: (
    tokenAddress: EthereumContractAddress,
    amount: string,
    stateChannelAddress: EthereumContractAddress,
  ) => void;
  withdrawFunds: (
    tokenAddress: EthereumContractAddress,
    amount: string,
    stateChannelAddress: EthereumContractAddress,
  ) => void;
  activeStateChannels?: ActiveStateChannel[];
  selectedStateChennel?: ActiveStateChannel;
}

interface IReducerState {
  error: any;
  tokenSelectorOptions: TokenInformation[];
  amount: string;
  destinationAddress: EthereumAccountAddress;
  selectedPaymentToken?: ITokenSelectorOption;
  activeStateChannels?: ActiveStateChannel[];
  selectedStateChennel?: ActiveStateChannel;
}

type Action =
  | { type: EActionTypes.FETCHED; payload: TokenInformation[] }
  | { type: EActionTypes.AMOUNT_CHANGED; payload: string }
  | { type: EActionTypes.FETCHED_STATE_CHANNELS; payload: ActiveStateChannel[] }
  | {
      type: EActionTypes.DESTINATION_ADDRESS_CHANGED;
      payload: EthereumAccountAddress;
    }
  | { type: EActionTypes.STATE_CHANNEL_SELECTED; payload: ActiveStateChannel }
  | { type: EActionTypes.SUCCESS }
  | { type: EActionTypes.ERROR }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

export function useFund(): IReducerStateReducer {
  const { coreProxy, UIData, governanceChainId } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const initialState: IReducerState = {
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
    amount: "1",
    destinationAddress: EthereumAccountAddress(""),
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
        coreProxy
          ?.getTokenInformation()
          .map((tokenInformation: TokenInformation[]) => {
            const tokenInformationList = tokenInformation.filter(
              (tokenInfo) => tokenInfo.chainId == governanceChainId,
            );
            // prepare balances
            setLoading(false);
            dispatch({
              type: EActionTypes.FETCHED,
              payload: tokenInformationList,
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

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

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
      payload: EthereumAccountAddress(enteredAddress),
    });
  };

  const depositFunds = (
    tokenAddress: EthereumContractAddress,
    amount: string,
    stateChannelAddress: EthereumContractAddress,
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
    tokenAddress: EthereumContractAddress,
    amount: string,
    stateChannelAddress: EthereumContractAddress,
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
