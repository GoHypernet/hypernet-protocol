import { useEffect, useReducer, useContext } from "react";
import { StoreContext } from "../contexts";
import { ILinkList } from "@hypernetlabs/web-ui/src/interfaces";
import { HypernetLink, Balances } from "@hypernetlabs/hypernet-core";
import { LinkParams } from "../viewModel";

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

export function useLinks() {
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
        return { ...state, loading: false, balances: action.payload };
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
          .waitInitialized()
          .andThen(() => {
            return proxy.getPublicIdentifier();
          })
          .andThen((publicIdentifierRes) => {
            publicIdentifier = publicIdentifierRes;

            return proxy.getActiveLinks();
          })
          .map((links) => {
            dispatch({ type: EActionTypes.FETCHED, payload: [...links] });
          });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      }
    };

    fetchData();

    proxy.onPullPaymentProposed.subscribe({
      next: (payment) => {
        // Check if there is a link for this counterparty already
        const filteredLinks = [...state.links].filter((val) => {
          const counterPartyAccount = val.counterPartyAccount;
          return counterPartyAccount === payment.to || counterPartyAccount === payment.from;
        });

        if (filteredLinks.length === 0) {
          // We need to create a new link for the counterparty
          const counterPartyAccount = payment.to === publicIdentifier ? payment.from : payment.to;
          const link = new HypernetLink(counterPartyAccount, [payment], [], [payment], [], [payment]);
          dispatch({ type: EActionTypes.FETCHED, payload: [...state.links, link] });
        }
      },
    });

    proxy.onPullPaymentProposed.subscribe({
      next: (payment) => {
        // Check if there is a link for this counterparty already
        const links = [...state.links].filter((val) => {
          const counterPartyAccount = val.counterPartyAccount;
          return counterPartyAccount === payment.to || counterPartyAccount === payment.from;
        });

        if (links.length === 0) {
          // We need to create a new link for the counterparty
          const counterPartyAccount = payment.to === publicIdentifier ? payment.from : payment.to;
          const link = new HypernetLink(counterPartyAccount, [payment], [], [payment], [], [payment]);
          dispatch({ type: EActionTypes.FETCHED, payload: [...state.links, link] });
        } else {
          // update payments inside links
          /* proxy.onPullPaymentProposed.subscribe({
      next: (payment) => {
        if (payment.to === this.counterParty || payment.from === this.counterParty) {
          // It's for us, we'll need to add it to the payments for the link
          this.pullPayments.push(new PullPaymentParams(proxy, payment));
        }
      },
    }); */
        }
      },
    });

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  return state;
}
