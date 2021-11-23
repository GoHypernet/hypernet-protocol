import { EResultStatus, ResultMessage } from "@mobileApp/interfaces/objects";
import {
  ICoreViewData,
  ICoreData,
  CoreActionType,
  CoreAction,
  ECoreViewDataKeys,
} from "@mobileApp/interfaces/state/IcoreReducer";

export const coreReducer = (state: ICoreData, action: CoreAction) => {
  switch (action.type) {
    case CoreActionType.LOADING:
      return { ...state, loading: action.payload };
    case CoreActionType.DESTROY_CORE:
      return { ...state, core: {} };
    case CoreActionType.SET_ACCOUNTS:
      return {
        ...state,
        core: {
          ...state.core,
          [ECoreViewDataKeys.accounts]: action.payload,
        },
      };
    case CoreActionType.SET_BALANCES:
      return {
        ...state,
        core: {
          ...state.core,
          [ECoreViewDataKeys.balances]: action.payload,
        },
      };
    case CoreActionType.SET_LINKS:
      return {
        ...state,
        core: {
          ...state.core,
          [ECoreViewDataKeys.links]: action.payload,
        },
      };
    case CoreActionType.SET_ACTIVE_LINKS:
      return {
        ...state,
        core: {
          ...state.core,
          [ECoreViewDataKeys.activeLinks]: action.payload,
        },
      };
    case CoreActionType.SET_AUTHERIZED_MERCHANTS:
      return {
        ...state,
        core: {
          ...state.core,
          [ECoreViewDataKeys.authorizedGateways]: action.payload,
        },
      };
    case CoreActionType.ERROR_OCCURRED:
      return {
        ...state,
        loading: false,
        error: true,
        resultMessage: new ResultMessage(EResultStatus.FAILURE, action.payload),
      };
    default:
      return { ...state };
  }
};

export const initialCoreReducer: ICoreData = {
  core: {} as ICoreViewData,
  loading: true,
  error: false,
  resultMessage: new ResultMessage(EResultStatus.IDLE, ""),
};
