import { GatewayUrl } from "@hypernetlabs/objects";
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
  merchantsMap: Map<GatewayUrl, boolean>;
  openGatewayIFrame: (gatewayUrl: GatewayUrl) => void;
  deauthorizeGateway: (gatewayUrl: GatewayUrl) => void;
  authorizeGateway: (gatewayUrl: GatewayUrl) => void;
}

type Action =
  | { type: EActionTypes.FETCHING }
  | { type: EActionTypes.FETCHED; payload: Map<GatewayUrl, boolean> }
  | { type: EActionTypes.ERROR; payload: string };

export function useGateways(): IState {
  const { coreProxy } = useStoreContext();
  const alert = useAlert();

  const initialState: IState = {
    loading: true,
    error: null,
    merchantsMap: new Map(),
    openGatewayIFrame,
    deauthorizeGateway,
    authorizeGateway,
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

    coreProxy.onGatewayAuthorized.subscribe({
      next: (gatewayUrl) => {
        const merchantsMap = state.merchantsMap;
        merchantsMap.set(gatewayUrl, true);
        dispatch({
          type: EActionTypes.FETCHED,
          payload: merchantsMap,
        });
      },
    });

    coreProxy.onAuthorizedGatewayActivationFailed.subscribe({
      next: (gatewayUrl) => {
        const merchantsMap = state.merchantsMap;
        merchantsMap.set(gatewayUrl, false);
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
      .getAuthorizedGatewaysConnectorsStatus()
      .map((merchantsStatusMap) => {
        dispatch({
          type: EActionTypes.FETCHED,
          payload: merchantsStatusMap,
        });
      })
      .mapErr((error) => {
        alert.error(
          error.message || "An error had happened while pulling gateway list",
        );
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      });
  }

  function openGatewayIFrame(gatewayUrl: GatewayUrl) {
    coreProxy.displayGatewayIFrame(gatewayUrl).mapErr((error) => {
      alert.error(
        error.message || "An error had happened while pulling gateway list",
      );
      dispatch({ type: EActionTypes.ERROR, payload: error.message });
    });
  }

  function deauthorizeGateway(gatewayUrl: GatewayUrl) {
    dispatch({ type: EActionTypes.FETCHING });
    coreProxy
      .deauthorizeGateway(gatewayUrl)
      .map(() => {
        alert.success(`Gateway ${gatewayUrl} deauthorized successfully`);
        fetchData();
      })
      .mapErr((error) => {
        alert.error(
          error.message || "An error had happened while deauthorizing gateway",
        );
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      });
  }

  function authorizeGateway(gatewayUrl: GatewayUrl) {
    dispatch({ type: EActionTypes.FETCHING });
    coreProxy
      .authorizeGateway(gatewayUrl)
      .map(() => {
        alert.success(`Gateway ${gatewayUrl} authorized successfully`);
        fetchData();
      })
      .mapErr((error) => {
        alert.error(
          error.message || "An error had happened while authorizing gateway",
        );
        dispatch({ type: EActionTypes.ERROR, payload: error.message });
      });
  }

  return {
    ...state,
  };
}
