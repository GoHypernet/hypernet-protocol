import {
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
  SET_DEFAULT_DESTINATION_ADDRESS = "SET_DEFAULT_DESTINATION_ADDRESS",
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
  setDefaultDestinationAddress: () => void;
  depositFunds: () => void;
  withdrawFunds: () => void;
  mintTokens: () => void;
}

interface IReducerState {
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  amount: string;
  destinationAddress: EthereumAddress;
  selectedPaymentToken?: ITokenSelectorOption;
}

type Action =
  | { type: EActionTypes.FETCHED; payload: PaymentTokenOptionViewModel[] }
  | { type: EActionTypes.AMOUNT_CHANGED; payload: string }
  | { type: EActionTypes.DESTINATION_ADDRESS_CHANGED; payload: EthereumAddress }
  | {
      type: EActionTypes.SET_DEFAULT_DESTINATION_ADDRESS;
      payload: EthereumAddress;
    }
  | { type: EActionTypes.SUCCESS }
  | { type: EActionTypes.ERROR }
  | {
      type: EActionTypes.TOKEN_SELECTED;
      payload: ITokenSelectorOption | undefined;
    };

export function useFund(): IReducerStateReducer {
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const initialState: IReducerState = {
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
    amount: "1",
    destinationAddress: EthereumAddress(""),
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
        case EActionTypes.SET_DEFAULT_DESTINATION_ADDRESS:
          return {
            ...state,
            error: false,
            destinationAddress: action.payload,
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
              type: EActionTypes.SET_DEFAULT_DESTINATION_ADDRESS,
              payload: accounts[0],
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
          "HyperToken",
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
      type: EActionTypes.DESTINATION_ADDRESS_CHANGED,
      payload: EthereumAddress(enteredAddress),
    });
  };

  const setDefaultDestinationAddress = () => {
    setLoading(true);
    coreProxy.getEthereumAccounts().match(
      (accounts) => {
        setLoading(false);
        dispatch({
          type: EActionTypes.SET_DEFAULT_DESTINATION_ADDRESS,
          payload: accounts[0],
        });
      },
      (err) => {
        setLoading(false);
        alert.error(
          err.message ||
            "Faild to set default metamask account as a destination address!",
        );
        dispatch({
          type: EActionTypes.ERROR,
        });
      },
    );
  };

  const depositFunds = () => {
    if (!state.selectedPaymentToken?.address) {
      dispatch({
        type: EActionTypes.ERROR,
      });
      return;
    }
    setLoading(true);
    coreProxy
      .depositFunds(
        EthereumAddress(state.selectedPaymentToken?.address),
        BigNumberString(
          ethers.utils.parseEther(state.amount || "1").toString(),
        ),
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

  const withdrawFunds = () => {
    console.log("state.destinationAddress", state.destinationAddress);
    return;
    if (!state.selectedPaymentToken?.address) {
      dispatch({
        type: EActionTypes.ERROR,
      });
      return;
    }
    /* setLoading(true);
    coreProxy
      .withdrawFunds(
        EthereumAddress(state.selectedPaymentToken?.address),
        BigNumberString(ethers.utils.parseEther(state.amount).toString()),
        state.destinationAddress,
      )
      .match(
        () => {
          alert.success("Your funds withdrawl has succeeded!");
          setLoading(false);
          dispatch({
            type: EActionTypes.SUCCESS,
          });
        },
        (err) => {
          alert.error(err.message || "Your funds withdrawl has failed");
          setLoading(false);
          dispatch({
            type: EActionTypes.ERROR,
          });
        },
      ); */
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
    setDefaultDestinationAddress,
    depositFunds,
    withdrawFunds,
    mintTokens,
    setAmount,
  };
}
