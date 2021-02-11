import { ISomeReducerState } from "./IsomeReducer";
import { IUserData } from "./IuserReducer";
import { ICoreData } from "./IcoreReducer";

export interface IStore {
  state: RootState;
  dispatch: React.Dispatch<Action>;
}

export interface IStoreProvider {
  children: React.ReactNode;
}

export type RootState = {
  userReducer: IUserData;
  someReducer: ISomeReducerState;
  coreReducer: ICoreData;
};

export type Action = {
  type: string;
  payload?: any;
};

export type RootReducer = (state: RootState, action: Action) => RootState;
