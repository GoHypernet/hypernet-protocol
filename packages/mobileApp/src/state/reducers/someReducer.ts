import { SomeActionType, ISomeReducerState, SomeAction } from "interfaces/state/IsomeReducer";

export const someReducer = (state: ISomeReducerState, action: SomeAction) => {
  switch (action.type) {
    case SomeActionType.ADD_CONTACT:
      return { ...state, contacts: action.payload };
    case SomeActionType.SIGN_IN:
      return { ...state, isAuthenticated: action.payload };
    case SomeActionType.SIGN_OUT:
      return { ...state, isAuthenticated: false };
    default:
      return { ...state };
  }
};

export const initialSomeReducer: ISomeReducerState = { isAuthenticated: false, contacts: "fgfgg" };
