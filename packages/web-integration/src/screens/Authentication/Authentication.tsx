import * as React from 'react';
import { StoreContext } from '../../contexts';

import { AuthenticationProps } from './Authentication.interface';

const Authentication: React.FC<AuthenticationProps> = (
  props: AuthenticationProps
) => {
  const {} = props;
  const { etherAddress } = React.useContext(StoreContext);
  return (
    <div>
      <h2>
        Authentication screen from web integration package, etherAddress from
        core: {etherAddress}
      </h2>
    </div>
  );
};

export default Authentication;
