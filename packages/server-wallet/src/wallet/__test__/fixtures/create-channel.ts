import {BN} from '@statechannels/wallet-core';
import {constants} from 'ethers';

import {CreateChannelParams} from '../..';

import {alice, bob} from './participants';
import {fixture} from './utils';

const defaultVars: CreateChannelParams = {
  appData: '0x0abc',
  participants: [alice(), bob()],
  appDefinition: constants.AddressZero,
  fundingStrategy: 'Direct',
  allocations: [
    {
      token: '0x00',
      allocationItems: [
        {destination: alice().destination, amount: BN.from(1)},
        {destination: bob().destination, amount: BN.from(3)},
      ],
    },
  ],
};

export const createChannelArgs = fixture(defaultVars);
