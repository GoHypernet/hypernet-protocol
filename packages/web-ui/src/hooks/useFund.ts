import { Balances, EthereumAddress } from "@hypernetlabs/objects";
import { ITokenSelectorOption } from "@web-ui/interfaces";
import { PaymentTokenOptionViewModel } from "@web-ui/interfaces/objects";
import { ethers } from "ethers";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

import { ETHER_HEX_ADDRESS } from "@web-ui/constants";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";

enum EActionTypes {
  FETCHED = "FETCHED",
  TOKEN_SELECTED = "TOKEN_SELECTED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  AMOUNT_CHANGED = "AMOUNT_CHANGED",
}

interface IReducerStateReducer {
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  amount: string;
  setAmount: (amount: string) => void;
  depositFunds: () => void;
  mintTokens: () => void;
}

interface IReducerState {
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  amount: string;
  selectedPaymentToken?: ITokenSelectorOption;
}

export function useFund(): IReducerStateReducer {
  const { proxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const initialState: IReducerState = {
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
    amount: "1",
  };

  const [state, dispatch] = useReducer((state: IReducerState, action: any) => {
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
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (cancelRequest) return;
        // get data from proxy
        proxy?.getBalances().map((balance: Balances) => {
          // prepare balances
          setLoading(false);
          dispatch({
            type: EActionTypes.FETCHED,
            payload: prepareTokenSelector(balance),
          });
        });
      } catch (error) {
        setLoading(false);
        if (cancelRequest) return;
        dispatch({ type: EActionTypes.ERROR });
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
          "ETH",
          EthereumAddress("0x0000000000000000000000000000000000000000"),
        ),
        new PaymentTokenOptionViewModel(
          "HyperToken",
          EthereumAddress("0x9FBDa871d559710256a2502A2517b794B482Db40"),
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
      });
    }
    setLoading(true);
    proxy
      .depositFunds(
        state.selectedPaymentToken?.address,
        ethers.utils.parseEther("1"),
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

  const mintTokens = () => {
    setLoading(true);
    proxy.mintTestToken(ethers.utils.parseEther(state.amount || "1")).match(
      () => {
        alert.success("mint tokens has succeeded");
        setLoading(false);
        dispatch({
          type: EActionTypes.SUCCESS,
          payload: "mint tokens has succeeded",
        });
      },
      (err) => {
        alert.error(err.message || "mint tokens has failed");
        setLoading(false);
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
