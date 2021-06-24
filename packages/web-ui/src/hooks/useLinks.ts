import {
  BigNumberString,
  HypernetLink,
  PaymentId,
  PublicIdentifier,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
import { useStoreContext } from "@web-ui/contexts";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  PUBLIC_IDENTIFIER_FETCHED = "PUBLIC_IDENTIFIER_FETCHED",
  ERROR = "ERROR",
}

interface IState {
  loading: boolean;
  error: any;
  links: HypernetLink[];
  publicIdentifier: PublicIdentifier;
  acceptPayment: (paymentId: PaymentId) => void;
  disputePayment: (paymentId: PaymentId) => void;
  pullFunds: (paymentId: PaymentId) => void;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: HypernetLink[] }
  | { type: EActionTypes.PUBLIC_IDENTIFIER_FETCHED; payload: PublicIdentifier }
  | { type: EActionTypes.ERROR; payload: string };

export function useLinks(): IState {
  const { coreProxy } = useStoreContext();
  const alert = useAlert();

  const initialState: IState = {
    loading: true,
    error: null,
    links: [],
    publicIdentifier: PublicIdentifier(""),
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
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    fetchData();

    coreProxy.onPullPaymentSent.subscribe({
      next: onPullPaymentSent,
    });

    coreProxy.onPushPaymentSent.subscribe({
      next: onPushPaymentSent,
    });
  }, []);

  function fetchData() {
    dispatch({ type: EActionTypes.FETCHING });
    coreProxy.getLinks().match((links) => {
      dispatch({ type: EActionTypes.FETCHED, payload: [...links] });
    }, handleError);

    coreProxy.getPublicIdentifier().match((publicIdentifier) => {
      dispatch({
        type: EActionTypes.PUBLIC_IDENTIFIER_FETCHED,
        payload: publicIdentifier,
      });
    }, handleError);
  }

  function onPullPaymentSent(payment: PullPayment) {
    const linksArr = [...state.links];

    // Check if there is already a link for the payment counterparty
    const paymentLinkIndex = linksArr.findIndex((val) => {
      const counterPartyAccount = val.counterPartyAccount;
      return (
        counterPartyAccount === payment.to ||
        counterPartyAccount === payment.from
      );
    });

    if (paymentLinkIndex === -1) {
      // We need to create a new link for the counterparty
      const counterPartyAccount =
        payment.to === state.publicIdentifier ? payment.from : payment.to;
      linksArr.push(
        new HypernetLink(
          counterPartyAccount,
          [payment],
          [],
          [payment],
          [],
          [payment],
        ),
      );
    } else {
      // It's for us, we'll need to add it to the payments for the link
      linksArr[paymentLinkIndex].pullPayments.push(payment);
      linksArr[paymentLinkIndex].payments.push(payment);
    }

    dispatch({ type: EActionTypes.FETCHED, payload: [...linksArr] });
  }

  function onPushPaymentSent(payment: PushPayment) {
    const linksArr = [...state.links];

    // Check if there is already a link for the payment counterparty
    const paymentLinkIndex = linksArr.findIndex((val) => {
      const counterPartyAccount = val.counterPartyAccount;
      return (
        counterPartyAccount === payment.to ||
        counterPartyAccount === payment.from
      );
    });

    if (paymentLinkIndex === -1) {
      // We need to create a new link for the counterparty
      const counterPartyAccount =
        payment.to === state.publicIdentifier ? payment.from : payment.to;
      linksArr.push(
        new HypernetLink(
          counterPartyAccount,
          [payment],
          [payment],
          [],
          [payment],
          [],
        ),
      );
    } else {
      // It's for us, we'll need to add it to the payments for the link
      linksArr[paymentLinkIndex].pushPayments.push(payment);
      linksArr[paymentLinkIndex].payments.push(payment);
    }

    dispatch({ type: EActionTypes.FETCHED, payload: [...linksArr] });
  }

  function acceptPayment(paymentId: PaymentId) {
    coreProxy.acceptOffers([paymentId]).match((results) => {
      try {
        results[0].match(() => {
          fetchData();
          alert.success("Payment accepted successfully!");
        }, handleError);
      } catch (err) {
        handleError();
      }
    }, handleError);
  }

  function disputePayment(paymentId: PaymentId) {
    coreProxy.initiateDispute(paymentId).match(() => {
      fetchData();
      alert.success("Payment disputed successfully!");
    }, handleError);
  }

  function pullFunds(paymentId: PaymentId) {
    coreProxy.pullFunds(paymentId, BigNumberString("1")).match(() => {
      fetchData();
      alert.success("Payment disputed successfully!");
    }, handleError);
  }

  function handleError(error?: Error) {
    const err = error?.message || "Something went wrong in payments!";
    alert.error(err);
    dispatch({ type: EActionTypes.ERROR, payload: err });
  }

  return state;
}
