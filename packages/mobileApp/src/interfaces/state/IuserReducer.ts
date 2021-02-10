export interface IUserData {
  name: string;
  id?: number;
}

export enum UserActionType {
  SET_USER_NAME = "SET_USER_NAME",
  SET_USER_ID = "SET_USER_ID",
}

export type UserAction =
  | { type: UserActionType.SET_USER_NAME; payload: string }
  | { type: UserActionType.SET_USER_ID; payload: number };
