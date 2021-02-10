export interface ISomeReducerState {
  isAuthenticated: boolean;
  contacts: string;
}

export enum SomeActionType {
  ADD_CONTACT = "Add contact",
  SIGN_IN = "Sign in",
  SIGN_OUT = "Sign out",
}

export type SomeAction =
  | { type: SomeActionType.ADD_CONTACT; payload: string }
  | { type: SomeActionType.SIGN_IN; payload: boolean }
  | { type: SomeActionType.SIGN_OUT };
