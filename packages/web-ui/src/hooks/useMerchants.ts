import { MerchantUrl } from "@hypernetlabs/objects";
import { useStoreContext } from "@web-ui/contexts";
import { useEffect, useReducer } from "react";
import { useAlert } from "react-alert";

enum EActionTypes {
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

interface IState {
  loading: boolean;
  error: any;
  merchantsMap: Map<MerchantUrl, boolean>;
  openMerchantIFrame: (merchantUrl: MerchantUrl) => void;
  deauthorizeMerchant: (merchantUrl: MerchantUrl) => void;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: Map<MerchantUrl, boolean> }
  | { type: EActionTypes.ERROR; payload: string };

export function useMerchants(): IState {
  const { coreProxy } = useStoreContext();
  const alert = useAlert();

  const initialState: IState = {
    loading: true,
    error: null,
    merchantsMap: new Map(),
    openMerchantIFrame,
    deauthorizeMerchant,
  };

  const [state, dispatch] = useReducer((state: IState, action: Action) => {
    switch (action.type) {
      case EActionTypes.FETCHING:
        return { ...state, loading: true };
      case EActionTypes.FETCHED:
        return { ...state, loading: false, merchantsMap: action.payload };
      case EActionTypes.ERROR:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    fetchData();

    coreProxy.onMerchantAuthorized.subscribe({
      next: (merchantUrl) => {
        const merchantsMap = state.merchantsMap;
        merchantsMap.set(merchantUrl, true);
        dispatch({
          type: EActionTypes.FETCHED,
          payload: merchantsMap,
        });
      },
    });

    coreProxy.onAuthorizedMerchantActivationFailed.subscribe({
      next: (merchantUrl) => {
        const merchantsMap = state.merchantsMap;
        merchantsMap.set(merchantUrl, false);
        dispatch({
          type: EActionTypes.FETCHED,
          payload: merchantsMap,
        });
      },
    });
  }, []);

  async function fetchData() {
    dispatch({ type: EActionTypes.FETCHING });
    coreProxy
      .getAuthorizedMerchantsConnectorsStatus()
      .map((merchantsStatusMap) => {
        dispatch({
          type: EActionTypes.FETCHED,
          payload: merchantsStatusMap,
        });
      })
      .mapErr((error) => {
        alert.error(
          error.message || "An error had happened while pulling merchant list",
        );
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      });
  }

  function openMerchantIFrame(merchantUrl: MerchantUrl) {
    coreProxy.displayMerchantIFrame(merchantUrl).mapErr((error) => {
      alert.error(
        error.message || "An error had happened while pulling merchant list",
      );
      dispatch({ type: EActionTypes.ERROR, payload: error.message });
    });
  }

  function deauthorizeMerchant(merchantUrl: MerchantUrl) {
    dispatch({ type: EActionTypes.FETCHING });
    coreProxy
      .deauthorizeMerchant(merchantUrl)
      .map(() => {
        alert.success(`Merchant ${merchantUrl} deauthorized successfully`);
        fetchData();
      })
      .mapErr((error) => {
        alert.error(
          error.message || "An error had happened while deauthorizing merchant",
        );
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      });
  }

  return {
    ...state,
  };
}
