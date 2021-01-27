import { useEffect, useReducer, useContext } from "react";
import { StoreContext } from "../contexts";
import moment from "moment";
import { ITokenSelectorOption } from "@hypernetlabs/web-ui/src/interfaces";
import {
  Payment,
  Balances,
  PublicIdentifier,
  EthereumAddress,
  PublicKey,
  EPaymentType,
} from "@hypernetlabs/hypernet-core";
import { ResultAsync } from "neverthrow";
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
  counterPartyAccount: PublicIdentifier;
  setCounterPartyAccount: (counterPartyAccount?: PublicIdentifier) => void;
  amount: string;
  setAmount: (amount?: string) => void;
  expirationDate: string;
  setExpirationDate: (expirationDate?: string) => void;
  requiredStake: string;
  setRequiredStake: (requiredStake?: string) => void;
  paymentToken: EthereumAddress;
  setPaymentToken: (paymentToken?: EthereumAddress) => void;
  paymentType: EPaymentType;
  setPaymentType: (paymentType?: EPaymentType) => void;
  disputeMediator: PublicKey;
  sendFunds: () => ResultAsync<Payment, Error>;
}

interface IReducerState {
  loading: boolean;
  error: any;
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  counterPartyAccount: PublicIdentifier;
  amount: string;
  expirationDate: string;
  requiredStake: string;
  paymentToken: EthereumAddress;
  disputeMediator: PublicKey;
  paymentType: EPaymentType;
}

// export function usePayment(): IReducerStateReducer {
export function usePayment(): any {
  const { proxy } = useContext(StoreContext);

  const initialState: IReducerState = {
    loading: true,
    error: null,
    tokenSelectorOptions: [],
    selectedPaymentToken: undefined,
    counterPartyAccount: "",
    amount: "0",
    expirationDate: "",
    requiredStake: "0",
    paymentToken: "",
    disputeMediator: "0x0000000000000000000000000000000000000001", // @todo replace with an actual mediator address!,
    paymentType: EPaymentType.Push,
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

  const sendFunds: () => ResultAsync<Payment, Error> = () => {
    //const expirationDate = moment(this.expirationDate());
    //const amount = Web3.utils.toWei(this.amount());
    //const requiredStake = Web3.utils.toWei(this.requiredStake());
    return proxy.sendFunds(
      state.counterPartyAccount,
      state.amount,
      moment(state.expirationDate),
      state.requiredStake,
      state.paymentToken,
      state.disputeMediator,
    );
  };

  return { ...state, setSelectedPaymentToken, sendFunds };
}
