import * as React from 'react';
import { StoreContext } from '../../contexts';

interface IMainContainer {
  children: React.ReactNode;
}

function MainContainer({ children }: IMainContainer) {
  const { etherAddress } = React.useContext(StoreContext);
  console.log('etherAddress from MainContainer: ', etherAddress);

  return <div id="fffff-f">{children}</div>;
}

export default MainContainer;
