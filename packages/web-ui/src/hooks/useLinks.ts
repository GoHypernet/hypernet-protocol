import { HypernetLink } from "@hypernetlabs/objects";
import { useEffect, useReducer } from "react";

import { useStoreContext } from "@web-ui/contexts";
import { useAlert } from "react-alert";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

interface IState {
  loading: boolean;
  error: any;
  links: HypernetLink[];
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: HypernetLink[] }
  | { type: EActionTypes.ERROR; payload: string };

export function useLinks(): IState {
  const { coreProxy } = useStoreContext();
  const alert = useAlert();

  const initialState: IState = {
    loading: true,
    error: null,
    links: [],
  };

  const [state, dispatch] = useReducer((state: IState, action: Action) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return { ...state, loading: true };
      case EActionTypes.FETCHED:
        return { ...state, loading: false, links: action.payload };
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    fetchData();

    coreProxy.onPullPaymentSent.subscribe({
      next: (payment) => {
        coreProxy.getPublicIdentifier().map((publicIdentifier) => {
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
              payment.to === publicIdentifier ? payment.from : payment.to;
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
        });
      },
    });

    coreProxy.onPushPaymentSent.subscribe({
      next: (payment) => {
        coreProxy.getPublicIdentifier().map((publicIdentifier) => {
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
              payment.to === publicIdentifier ? payment.from : payment.to;
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
        });
      },
    });
  }, []);

  const fetchData = async () => {
    dispatch({ type: EActionTypes.FETCHING });
    try {
      // get data from coreProxy
      coreProxy.getLinks().map((links) => {
        dispatch({ type: EActionTypes.FETCHED, payload: [...links] });
      });
    } catch (error) {
      alert.error(
        error.message || "An error had happened while pulling link list",
      );
      dispatch({ type: EActionTypes.ERROR, payload: error.message });
    }
  };

  return state;
}
