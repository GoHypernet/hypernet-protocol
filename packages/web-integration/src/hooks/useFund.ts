import { Balances } from "@hypernetlabs/objects";
import { ITokenSelectorOption } from "@hypernetlabs/web-ui/src/interfaces";
import { ethers } from "ethers";
import { useEffect, useReducer, useContext } from "react";

import { StoreContext } from "@web-integration/contexts";
import {
  PaymentTokenOptionViewModel,
  EResultStatus,
  ResultMessage,
} from "@web-integration/interfaces/objects";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  TOKEN_SELECTED = "TOKEN_SELECTED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  AMOUNT_CHANGED = "AMOUNT_CHANGED",
}

interface IReducerStateReducer {
  loading: boolean;
  error: any;
  resultMessage: ResultMessage;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  amount: string;
  setAmount: (amount: string) => void;
  depositFunds: () => void;
  mintTokens: () => void;
}

interface IReducerState {
  loading: boolean;
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  amount: string;
  selectedPaymentToken?: ITokenSelectorOption;
  resultMessage: ResultMessage;
}

export function useFund(): IReducerStateReducer {
  const { proxy } = useContext(StoreContext);

  const initialState: IReducerState = {
    loading: true,
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
    resultMessage: new ResultMessage(EResultStatus.IDLE, ""),
    amount: "1",
  };

  const [state, dispatch] = useReducer((state: IReducerState, action: any) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return { ...state, loading: true };
      case EActionTypes.FETCHED:
        return {
          ...state,
          loading: false,
          tokenSelectorOptions: action.payload,
        };
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
      case EActionTypes.TOKEN_SELECTED:
        return {
          ...state,
          loading: false,
          selectedPaymentToken: action.payload,
        };
      case EActionTypes.AMOUNT_CHANGED:
        return { ...state, loading: false, amount: action.payload };
      case EActionTypes.ERROR:
        return {
          ...state,
          loading: false,
          error: true,
          resultMessage: new ResultMessage(
            EResultStatus.FAILURE,
            action.payload,
          ),
        };
      case EActionTypes.SUCCESS:
        return {
          ...state,
          loading: false,
          error: false,
          resultMessage: new ResultMessage(
            EResultStatus.SUCCESS,
            action.payload,
          ),
        };
      default:
        return { ...state };
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
          dispatch({
            type: EActionTypes.FETCHED,
            payload: prepareTokenSelector(balance),
          });
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

  const prepareTokenSelector = (balance: Balances) => {
    return balance.assets.reduce(
      (acc: PaymentTokenOptionViewModel[], assetBalance) => {
        acc.push(
          new PaymentTokenOptionViewModel(
            assetBalance.assetAddress,
            assetBalance.assetAddress,
          ),
        );
        return acc;
      },
      new Array<PaymentTokenOptionViewModel>(),
    );
  };

  const setSelectedPaymentToken = (selectedOption?: ITokenSelectorOption) => {
    dispatch({
      type: EActionTypes.TOKEN_SELECTED,
      payload: selectedOption,
    });
  };

  const setAmount = (enteredAmount?: string) => {
    dispatch({
      type: EActionTypes.AMOUNT_CHANGED,
      payload: enteredAmount,
    });
  };

  const depositFunds = () => {
    if (!state.selectedPaymentToken?.address) {
      dispatch({
        type: EActionTypes.ERROR,
        payload: "Token address not selected",
      });
    }
    proxy
      .depositFunds(
        state.selectedPaymentToken?.address,
        ethers.utils.parseEther("1"),
      )
      .match(
        (balances) => {
          dispatch({
            type: EActionTypes.SUCCESS,
            payload: "your deposit has succeeded",
          });
        },
        (err) => {
          dispatch({
            type: EActionTypes.ERROR,
            payload: err.message || "your deposit has failed",
          });
        },
      );
  };

  const mintTokens = () => {
    proxy.mintTestToken(ethers.utils.parseEther(state.amount || "1")).match(
      () => {
        dispatch({
          type: EActionTypes.SUCCESS,
          payload: "mint tokens has succeeded",
        });
      },
      (err) => {
        dispatch({
          type: EActionTypes.ERROR,
          payload: err.message || "mint tokens has failed",
        });
      },
    );
  };

  return {
    ...state,
    setSelectedPaymentToken,
    depositFunds,
    mintTokens,
    setAmount,
  };
}
