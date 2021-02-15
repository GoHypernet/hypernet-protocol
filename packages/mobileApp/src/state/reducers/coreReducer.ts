import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import { EResultStatus, ResultMessage } from "@mobileApp/interfaces/objects";
import { ICoreData, CoreActionType, CoreAction } from "@mobileApp/interfaces/state/IcoreReducer";

export const coreReducer = (state: ICoreData, action: CoreAction) => {
  switch (action.type) {
    case CoreActionType.LOADING:
      return { ...state, loading: action.payload };
    case CoreActionType.DESTROY_CORE:
      return { ...state, core: {} };
    case CoreActionType.INITIATE_CORE:
      return { ...state, core: action.payload };
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
  core: {} as IHypernetCore,
  loading: true,
  error: false,
  resultMessage: new ResultMessage(EResultStatus.IDLE, ""),
};
