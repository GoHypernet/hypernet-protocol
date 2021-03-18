import { Balances, HypernetLink } from "@objects";
import { ResultMessage } from "@mobileApp/interfaces/objects";

export enum ECoreViewDataKeys {
  accounts = "accounts",
  balances = "balances",
  links = "links",
  activeLinks = "activeLinks",
  authorizedMerchants = "authorizedMerchants",
}

export type TCoreViewData = string[] | Balances | HypernetLink[] | Map<URL, string>;

export interface ICoreViewData {
  [ECoreViewDataKeys.accounts]?: string[];
  [ECoreViewDataKeys.balances]?: Balances;
  [ECoreViewDataKeys.links]?: HypernetLink[];
  [ECoreViewDataKeys.activeLinks]?: HypernetLink[];
  [ECoreViewDataKeys.authorizedMerchants]?: Map<URL, string>;
}

export interface ICoreData {
  core: ICoreViewData;
  loading: boolean;
  error: boolean;
  resultMessage: ResultMessage;
}

export enum CoreActionType {
  SET_ACCOUNTS = "SET_ACCOUNTS",
  SET_BALANCES = "SET_BALANCES",
  SET_LINKS = "SET_LINKS",
  SET_ACTIVE_LINKS = "SET_ACTIVE_LINKS",
  SET_AUTHERIZED_MERCHANTS = "SET_AUTHERIZED_MERCHANTS",
  ERROR_OCCURRED = "ERROR_OCCURRED",
  LOADING = "LOADING",
  DESTROY_CORE = "DESTROY_CORE",
}

export type CoreAction =
  | { type: CoreActionType.SET_ACCOUNTS; payload: string[] }
  | { type: CoreActionType.SET_BALANCES; payload: Balances }
  | { type: CoreActionType.SET_LINKS; payload: HypernetLink[] }
  | { type: CoreActionType.SET_ACTIVE_LINKS; payload: HypernetLink[] }
  | { type: CoreActionType.SET_AUTHERIZED_MERCHANTS; payload: Map<URL, string> }
  | { type: CoreActionType.ERROR_OCCURRED; payload: string }
  | { type: CoreActionType.LOADING; payload: boolean }
  | { type: CoreActionType.DESTROY_CORE };
