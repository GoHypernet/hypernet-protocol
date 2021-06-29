import {
  BigNumberString,
  HypernetLink,
  PaymentId,
  PublicIdentifier,
} from "@hypernetlabs/objects";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  PUBLIC_IDENTIFIER_FETCHED = "PUBLIC_IDENTIFIER_FETCHED",
  PAYMENT_AUTO_ACCEPT_CHANGED = "PAYMENT_AUTO_ACCEPT_CHANGED",
  ERROR = "ERROR",
}

interface IState {
  loading: boolean;
  error: any;
  links: HypernetLink[];
  publicIdentifier: PublicIdentifier;
  paymentsAutoAccept: boolean;
  setPaymentsAutoAccept: (val: boolean) => void;
  acceptPayment: (paymentId: PaymentId) => void;
  disputePayment: (paymentId: PaymentId) => void;
  pullFunds: (paymentId: PaymentId) => void;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: HypernetLink[] }
  | { type: EActionTypes.PUBLIC_IDENTIFIER_FETCHED; payload: PublicIdentifier }
  | { type: EActionTypes.PAYMENT_AUTO_ACCEPT_CHANGED; payload: boolean }
  | { type: EActionTypes.ERROR; payload: string };

export function useLinks(): IState {
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const alert = useAlert();

  const setPaymentsAutoAccept = (val: boolean) => {
    dispatch({
      type: EActionTypes.PAYMENT_AUTO_ACCEPT_CHANGED,
      payload: val,
    });
    window.localStorage.setItem("PaymentsAutoAccept", JSON.stringify(val));
    alert.success("Payments auto accept changed successfully.");
  };

  const initialState: IState = {
    loading: true,
    error: null,
    links: [],
    publicIdentifier: PublicIdentifier(""),
    paymentsAutoAccept: false,
    setPaymentsAutoAccept,
    acceptPayment,
    disputePayment,
    pullFunds,
  };

  const [state, dispatch] = useReducer((state: IState, action: Action) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return { ...state, loading: true };
      case EActionTypes.FETCHED:
        return { ...state, loading: false, links: action.payload };
      case EActionTypes.PUBLIC_IDENTIFIER_FETCHED:
        return { ...state, loading: false, publicIdentifier: action.payload };
      case EActionTypes.PAYMENT_AUTO_ACCEPT_CHANGED:
        return { ...state, loading: false, paymentsAutoAccept: action.payload };
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    fetchData();

    coreProxy.onPullPaymentSent.subscribe(() => {
      alert.show("New pull payment sent.");
      fetchPayments();
    });

    coreProxy.onPushPaymentSent.subscribe(() => {
      alert.show("New push payment sent.");
      fetchPayments();
    });

    coreProxy.onPullPaymentReceived.subscribe((payment) => {
      alert.show("New pull payment received.");
      fetchPayments();
    });

    coreProxy.onPushPaymentReceived.subscribe((payment) => {
      alert.show("New push payment received.");
      fetchPayments();
    });
  }, []);

  function fetchData() {
    fetchPayments();

    coreProxy.getPublicIdentifier().match((publicIdentifier) => {
      dispatch({
        type: EActionTypes.PUBLIC_IDENTIFIER_FETCHED,
        payload: publicIdentifier,
      });
    }, handleError);

    const paymentsAutoAccept = window.localStorage.getItem(
      "PaymentsAutoAccept",
    );
    if (paymentsAutoAccept != null) {
      dispatch({
        type: EActionTypes.PAYMENT_AUTO_ACCEPT_CHANGED,
        payload: JSON.parse(paymentsAutoAccept),
      });
    }
  }

  function fetchPayments() {
    setLoading(true);
    dispatch({ type: EActionTypes.FETCHING });
    coreProxy.getLinks().match((links) => {
      dispatch({ type: EActionTypes.FETCHED, payload: [...links] });
      setLoading(false);
    }, handleError);
  }

  function acceptPayment(paymentId: PaymentId) {
    setLoading(true);
    coreProxy.acceptOffers([paymentId]).match((results) => {
      fetchPayments();
      alert.success("Payment accepted successfully.");
    }, handleError);
  }

  function disputePayment(paymentId: PaymentId) {
    setLoading(true);
    coreProxy.initiateDispute(paymentId).match(() => {
      fetchPayments();
      alert.success("Payment disputed successfully.");
    }, handleError);
  }

  function pullFunds(paymentId: PaymentId) {
    setLoading(true);
    coreProxy.pullFunds(paymentId, BigNumberString("1")).match(() => {
      fetchPayments();
      alert.success("Payment disputed successfully.");
    }, handleError);
  }

  function handleError(error?: Error) {
    const err = error?.message || "Something went wrong in payments!";
    alert.error(err);
    dispatch({ type: EActionTypes.ERROR, payload: err });
    setLoading(false);
  }

  return state;
}
