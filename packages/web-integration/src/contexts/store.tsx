import * as React from "react";

interface IStore {
  someData: any;
  setSomeData: () => void;
  etherAddress: any;
}

interface IStoreProps {
  children: any;
  initialData?: any;
}

const StoreContext = React.createContext<IStore>(undefined!);

function StoreProvider({ initialData, children }: IStoreProps) {
  console.log("initialData in StoreProvider: ", initialData);
  const [someData, setSomeData] = React.useState<string>("asdasd");
  const [etherAddress, setEtherAddress] = React.useState<string>(initialData?.ethAddress);

  const initialState: any = {
    someData,
    setSomeData,
    etherAddress,
  };

  return <StoreContext.Provider value={initialState as IStore}>{children}</StoreContext.Provider>;
}

export { StoreContext, StoreProvider };
