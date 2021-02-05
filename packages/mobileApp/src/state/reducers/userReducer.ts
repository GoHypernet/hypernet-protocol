import { IUserData, UserActionType, UserAction } from "interfaces/state/IuserReducer";

export const userReducer = (state: IUserData, action: UserAction) => {
  switch (action.type) {
    case UserActionType.SET_USER_NAME:
      return { ...state, name: action.payload };
    case UserActionType.SET_USER_ID:
      return { ...state, id: action.payload };
    default:
      return { ...state };
  }
};

export const initialUserReducer: IUserData = { name: "ggg" };
