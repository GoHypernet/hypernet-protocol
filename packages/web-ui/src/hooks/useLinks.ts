import { HypernetLink } from "@hypernetlabs/objects";
import { useEffect, useReducer, useContext } from "react";

import { StoreContext } from "@web-ui/contexts";
import { ILinkList } from "@web-ui/interfaces";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

interface IState {
  loading: boolean;
  error: any;
  links: ILinkList[];
}

export function useLinks(): IState {
  const { proxy } = useContext(StoreContext);

  const initialState: IState = {
    loading: true,
    error: null,
    links: [],
  };

  const [state, dispatch] = useReducer((state: IState, action: any) => {
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
    let cancelRequest = false;
    let publicIdentifier = "";

    const fetchData = async () => {
      dispatch({ type: EActionTypes.FETCHING });
      try {
        if (cancelRequest) return;
        // get data from proxy
        proxy
          .getPublicIdentifier()
          .andThen((publicIdentifierRes) => {
            publicIdentifier = publicIdentifierRes;
            return proxy.getLinks();
          })
          .map((links) => {
            console.log("links123: ", links);
            dispatch({ type: EActionTypes.FETCHED, payload: [...links] });
          });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      }
    };

    fetchData();

    proxy.onPullPaymentSent.subscribe({
      next: (payment) => {
        const linksArr = [...state.links];

        // Check if there is a link for this counterparty already
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
        }

        dispatch({ type: EActionTypes.FETCHED, payload: [...linksArr] });
      },
    });

    proxy.onPushPaymentSent.subscribe({
      next: (payment) => {
        const linksArr = [...state.links];

        // Check if there is a link for this counterparty already
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
        }

        dispatch({ type: EActionTypes.FETCHED, payload: [...linksArr] });
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  return state;
}
