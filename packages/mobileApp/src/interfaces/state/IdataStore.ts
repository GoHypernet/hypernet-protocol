import { ISomeReducerState } from "./IsomeReducer";
import { IUserData } from "./IuserReducer";

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
};

export type Action = {
  type: string;
  payload: any;
};

export type RootReducer = (state: RootState, action: Action) => RootState;
