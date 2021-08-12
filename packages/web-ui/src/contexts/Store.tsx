import { IHypernetCore, IUIEvents } from "@hypernetlabs/objects";
import { IViewUtils, IDateUtils } from "@web-ui/interfaces";
import React, { createContext, useContext } from "react";

interface IStore {
  coreProxy: IHypernetCore;
  UIEvents: IUIEvents;
  viewUtils: IViewUtils;
  dateUtils: IDateUtils;
}

interface IStoreProps extends IStore {
  children: React.ReactNode;
}

const StoreContext = createContext<IStore>(undefined!);

export function StoreProvider({
  coreProxy,
  UIEvents,
  viewUtils,
  dateUtils,
  children,
}: IStoreProps) {
  const initialState: IStore = {
    coreProxy,
    UIEvents,
    viewUtils,
    dateUtils,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
