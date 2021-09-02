import {
  Balances,
  PublicIdentifier,
  EPaymentType,
  GatewayUrl,
  UnixTimestamp,
  BigNumberString,
} from "@hypernetlabs/objects";
import { useStoreContext } from "@web-ui/contexts";
import { ITokenSelectorOption } from "@web-ui/interfaces";
import {
  PaymentTokenOptionViewModel,
  EResultStatus,
  ResultMessage,
} from "@web-ui/interfaces/objects";
import { utils } from "ethers";
import { useEffect, useReducer } from "react";

class PaymentTypeOption {
  constructor(public typeName: string, public type: EPaymentType) {}
}

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
  TOKEN_SELECTED = "TOKEN_SELECTED",
  COUNTER_PARTY_CHANGED = "COUNTER_PARTY_CHANGED",
  AMOUNT_CHANGED = "AMOUNT_CHANGED",
  EXPIRATION_DATE_CHANGED = "EXPIRATION_DATE_CHANGED",
  REQUIRED_STACK_CHANGED = "REQUIRED_STACK_CHANGED",
  PAYMENT_TYPE_SELECTED = "PAYMENT_TYPE_SELECTED",
  SUCCESS = "SUCCESS",
}

interface IReducerStateReducer {
  loading: boolean;
  error: boolean;
  resultMessage: ResultMessage;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (param?: ITokenSelectorOption) => void;
  counterPartyAccount: PublicIdentifier;
  setCounterPartyAccount: (param?: PublicIdentifier) => void;
  amount: string;
  setAmount: (param?: string) => void;
  expirationDate: string;
  setExpirationDate: (param?: string) => void;
  requiredStake: string;
  setRequiredStake: (param?: string) => void;
  paymentType: EPaymentType;
  setPaymentType: (param?: EPaymentType) => void;
  gatewayUrl: GatewayUrl;
  paymentTypeOptions: PaymentTypeOption[];
}

interface IReducerState {
  loading: boolean;
  error: boolean;
  resultMessage: ResultMessage;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  counterPartyAccount: PublicIdentifier;
  amount: string;
  expirationDate: string;
  requiredStake: string;
  gatewayUrl: GatewayUrl;
  paymentType: EPaymentType;
  paymentTypeOptions: PaymentTypeOption[];
}

// export function usePayment(): IReducerStateReducer {
export function usePayment(initialParams: any): IReducerStateReducer {
  const { coreProxy } = useStoreContext();

  const initialState: IReducerState = {
    loading: true,
    error: false,
    resultMessage: new ResultMessage(EResultStatus.IDLE, ""),
    tokenSelectorOptions: initialParams?.tokenSelectorOptions || [],
    selectedPaymentToken:
      initialParams?.tokenSelectorOptions?.find(
        (option: any) => option?.address === initialParams?.paymentTokenAddress,
      )?.address || undefined,
    counterPartyAccount: initialParams?.counterPartyAccount || "",
    amount: initialParams?.amount || "0",
    expirationDate: initialParams?.expirationDate || "",
    requiredStake: initialParams?.requiredStake || "0",
    gatewayUrl: initialParams?.gatewayUrl || "http://localhost:5010/", // @todo replace with an actual mediator address!,
    paymentType: initialParams?.paymentType || EPaymentType.Push,
    paymentTypeOptions: [
      new PaymentTypeOption("Push", EPaymentType.Push),
      new PaymentTypeOption("Pull", EPaymentType.Pull),
    ],
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
      case EActionTypes.TOKEN_SELECTED:
        return {
          ...state,
          loading: false,
          selectedPaymentToken: action.payload,
        };
      case EActionTypes.COUNTER_PARTY_CHANGED:
        return {
          ...state,
          loading: false,
          counterPartyAccount: action.payload,
        };
      case EActionTypes.AMOUNT_CHANGED:
        return { ...state, loading: false, amount: action.payload };
      case EActionTypes.EXPIRATION_DATE_CHANGED:
        return { ...state, loading: false, expirationDate: action.payload };
      case EActionTypes.REQUIRED_STACK_CHANGED:
        return { ...state, loading: false, requiredStake: action.payload };
      case EActionTypes.PAYMENT_TYPE_SELECTED:
        return { ...state, loading: false, paymentType: action.payload };
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
        // get data from coreProxy
        coreProxy?.getBalances().map((balance: Balances) => {
          // prepare balances
          dispatch({
            type: EActionTypes.FETCHED,
            payload: prepareTokenSelector(balance),
          });
        });
      } catch (error) {
        if (cancelRequest) return;
        //dispatch({ type: EActionTypes.ERROR, payload: error.message });
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

  const setSelectedPaymentToken = (param?: ITokenSelectorOption) => {
    dispatch({
      type: EActionTypes.TOKEN_SELECTED,
      payload: param,
    });
  };

  const setCounterPartyAccount = (param?: PublicIdentifier) => {
    dispatch({
      type: EActionTypes.COUNTER_PARTY_CHANGED,
      payload: param,
    });
  };

  const setAmount = (param?: string) => {
    dispatch({
      type: EActionTypes.AMOUNT_CHANGED,
      payload: param,
    });
  };

  const setExpirationDate = (param?: string) => {
    dispatch({
      type: EActionTypes.EXPIRATION_DATE_CHANGED,
      payload: param,
    });
  };

  const setRequiredStake = (param?: string) => {
    dispatch({
      type: EActionTypes.REQUIRED_STACK_CHANGED,
      payload: param,
    });
  };

  const setPaymentType = (param?: EPaymentType) => {
    dispatch({
      type: EActionTypes.PAYMENT_TYPE_SELECTED,
      payload: param,
    });
  };

  // TODO: Determine if we can make this functionality work via the gateway
  // const sendFunds = () => {
  //   coreProxy
  //     .sendFunds(
  //       state.counterPartyAccount,
  //       BigNumberString(utils.parseUnits(state.amount, "wei").toString()),
  //       state.expirationDate,
  //       BigNumberString(
  //         utils.parseUnits(state.requiredStake, "wei").toString(),
  //       ),
  //       state.selectedPaymentToken?.address,
  //       state.gatewayUrl,
  //       null,
  //     )
  //     .match(
  //       (balances) => {
  //         dispatch({
  //           type: EActionTypes.SUCCESS,
  //           payload: "your fund has succeeded",
  //         });
  //       },
  //       (err) => {
  //         console.log("err: ", err);
  //         dispatch({
  //           type: EActionTypes.ERROR,
  //           payload: err.message || "your fund has failed",
  //         });
  //       },
  //     );
  // };

  return {
    ...state,
    setSelectedPaymentToken,
    setCounterPartyAccount,
    setAmount,
    setExpirationDate,
    setRequiredStake,
    setPaymentType,
  };
}
