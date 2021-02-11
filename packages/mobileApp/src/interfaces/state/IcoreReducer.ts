import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import { ResultMessage } from "@mobileApp/interfaces/objects";

export interface ICoreData {
  core: IHypernetCore;
  loading: boolean;
  error: boolean;
  resultMessage: ResultMessage;
}

export enum CoreActionType {
  INITIATE_CORE = "INITIATE_CORE",
  ERROR_OCCURRED = "ERROR_OCCURRED",
  LOADING = "LOADING",
  DESTROY_CORE = "DESTROY_CORE",
}

export type CoreAction =
  | { type: CoreActionType.INITIATE_CORE; payload: IHypernetCore }
  | { type: CoreActionType.ERROR_OCCURRED; payload: string }
  | { type: CoreActionType.LOADING; payload: boolean }
  | { type: CoreActionType.DESTROY_CORE };
