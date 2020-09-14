// @ts-ignore
import {Contract, Wallet} from 'ethers';

import ForceMoveArtifact from '../../../build/contracts/TESTForceMove.json';
import {getTestProvider, setupContracts} from '../../test-helpers';

const provider = getTestProvider();
let ForceMove: Contract;

const participants = ['', '', ''];
const wallets = new Array(3);

// Populate wallets and participants array
for (let i = 0; i < 3; i++) {
  wallets[i] = Wallet.createRandom();
  participants[i] = wallets[i].address;
}

beforeAll(async () => {
  ForceMove = await setupContracts(
    provider,
    ForceMoveArtifact,
    process.env.TEST_FORCE_MOVE_ADDRESS
  );
});

describe('_isAddressInArray', () => {
  let suspect;
  let addresses;

  beforeAll(() => {
    suspect = Wallet.createRandom().address;
    addresses = [
      Wallet.createRandom().address,
      Wallet.createRandom().address,
      Wallet.createRandom().address,
    ];
  });

  it('verifies absence of suspect', async () => {
    expect(await ForceMove.isAddressInArray(suspect, addresses)).toBe(false);
  });
  it('finds an address hiding in an array', async () => {
    addresses[1] = suspect;
    expect(await ForceMove.isAddressInArray(suspect, addresses)).toBe(true);
  });
});
