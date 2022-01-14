import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { ViewUtils, IViewUtils } from "@hypernetlabs/web-ui";
import React, { useContext } from "react";

interface IStore {
  viewUtils: IViewUtils;
  hypernetWebIntegration: IHypernetWebIntegration;
}

interface IStoreProps {
  children: any;
  hypernetWebIntegration: IHypernetWebIntegration;
}

const StoreContext = React.createContext<IStore>(undefined!);

export function StoreProvider({
  children,
  hypernetWebIntegration,
}: IStoreProps) {
  const initialState: IStore = {
    viewUtils: new ViewUtils(),
    hypernetWebIntegration,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
