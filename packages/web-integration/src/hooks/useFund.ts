import { useEffect, useReducer, useContext } from "react";
import { StoreContext } from "../contexts";
import { ITokenSelectorOption } from "@hypernetlabs/web-ui/src/interfaces";
import { Balances } from "@hypernetlabs/hypernet-core";
import { ethers } from "ethers";
import { errAsync, ResultAsync } from "neverthrow";
import { PaymentTokenOptionViewModel } from "../viewModel";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
  TOKEN_SELECTED = "TOKEN_SELECTED",
}

interface IReducerStateReducer {
  loading: boolean;
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  depositFunds: () => ResultAsync<Balances, Error>;
}

interface IReducerState {
  loading: boolean;
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
}

export function useFund(): IReducerStateReducer {
  const { proxy } = useContext(StoreContext);

  const initialState: IReducerState = {
    loading: true,
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
  };

  const [state, dispatch] = useReducer((state: IReducerState, action: any) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return { ...state, loading: true };
        break;
      case EActionTypes.FETCHED:
        return { ...state, loading: false, tokenSelectorOptions: action.payload };
        break;
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
        break;
      case EActionTypes.TOKEN_SELECTED:
        return { ...state, loading: false, selectedPaymentToken: action.payload };
        break;
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
          dispatch({ type: EActionTypes.FETCHED, payload: prepareTokenSelector(balance) });
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
        dispatch({ type: EActionTypes.FETCHED, payload: prepareTokenSelector(balance) });
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  const prepareTokenSelector = (balance: Balances) => {
    return balance.assets.reduce((acc: PaymentTokenOptionViewModel[], assetBalance) => {
      acc.push(new PaymentTokenOptionViewModel(assetBalance.assetAddresss, assetBalance.assetAddresss));
      return acc;
    }, new Array<PaymentTokenOptionViewModel>());
  };

  const setSelectedPaymentToken = (selectedOption?: ITokenSelectorOption) => {
    dispatch({
      type: EActionTypes.TOKEN_SELECTED,
      payload: selectedOption,
    });
  };

  const depositFunds: () => ResultAsync<Balances, Error> = () => {
    if (state.selectedPaymentToken?.address) {
      return proxy.depositFunds(state.selectedPaymentToken?.address, ethers.utils.parseEther("1"));
    } else {
      return errAsync(new Error("address not fownd"));
    }
  };

  return { ...state, setSelectedPaymentToken, depositFunds };
}
