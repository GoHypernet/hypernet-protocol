import React, { useContext, useReducer } from "react";
import combineReducers from "react-combine-reducers";
import { userReducer, initialUserReducer } from "@mobileApp/state/reducers/userReducer";
import { someReducer, initialSomeReducer } from "@mobileApp/state/reducers/someReducer";
import { coreReducer, initialCoreReducer } from "@mobileApp/state/reducers/coreReducer";
import { RootReducer, IStore, IStoreProvider } from "@mobileApp/interfaces/state/IdataStore";

const [rootReducer, initialState] = combineReducers<RootReducer>({
  userReducer: [userReducer, initialUserReducer],
  someReducer: [someReducer, initialSomeReducer],
  coreReducer: [coreReducer, initialCoreReducer],
});

const myContext = React.createContext<IStore>(undefined!);

export const StoreProvider = ({ children }: IStoreProvider) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return <myContext.Provider value={{ state, dispatch }} children={children} />;
};

export const useStateContext = () => useContext(myContext);
