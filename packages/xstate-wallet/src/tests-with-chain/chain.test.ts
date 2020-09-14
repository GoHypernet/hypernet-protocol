import {Contract} from 'ethers';
import {ContractArtifacts, randomChannelId} from '@statechannels/nitro-protocol';
import {first} from 'rxjs/operators';
import {parseUnits} from '@ethersproject/units';
import {JsonRpcProvider} from '@ethersproject/providers';
import {
  simpleEthAllocation,
  createSignatureEntry,
  SignedState,
  State,
  BN
} from '@statechannels/wallet-core';
import {hexZeroPad} from '@ethersproject/bytes';

import {Store} from '../store';
import {ChainWatcher, FakeChain} from '../chain';
import {Player} from '../integration-tests/helpers';
import {
  ETH_ASSET_HOLDER_ADDRESS,
  CHAIN_NETWORK_ID,
  CHALLENGE_DURATION,
  TRIVIAL_APP_ADDRESS
} from '../config';

jest.setTimeout(10_000);

const chain = new ChainWatcher();
const store = new Store(chain);

const provider = new JsonRpcProvider(`http://localhost:${process.env.GANACHE_PORT}`);

let ETHAssetHolder: Contract;

beforeAll(async () => {
  (window as any).ethereum = {enable: () => ['0xfec44e15328B7d1d8885a8226b0858964358F1D6']};
  chain.ethereumEnable();

  const signer = await provider.getSigner('0x28bF45680cA598708E5cDACc1414FCAc04a3F1ed');
  ETHAssetHolder = new Contract(
    ETH_ASSET_HOLDER_ADDRESS,
    ContractArtifacts.EthAssetHolderArtifact.abi,
    signer
  );
});

it('subscribes to chainUpdateFeed via a subscribeDepositEvent Observable, and sends correct event to xstate machine after a deposit', async () => {
  const channelId = randomChannelId();
  const updateEvent = store.chain
    .chainUpdatedFeed(channelId)
    .pipe(first(info => BN.eq(info.amount, 1)))
    .toPromise();

  ETHAssetHolder.deposit(
    channelId, // destination
    parseUnits('0', 'wei'), // expectedHeld
    parseUnits('1', 'wei'), // amount
    {value: parseUnits('1', 'wei')} // msgValue
  );

  expect(await updateEvent).toMatchObject({
    amount: '0x01',
    finalized: false,
    channelStorage: {finalizesAt: 0, turnNumRecord: 0}
  });
});

it('correctly crafts a forceMove transaction (1x double-signed state)', async () => {
  const fakeChain = new FakeChain();
  const playerA = await Player.createPlayer(
    '0x275a2e2cd9314f53b42246694034a80119963097e3adf495fbf6d821dc8b6c8e',
    'PlayerA',
    fakeChain
  );
  const playerB = await Player.createPlayer(
    '0x3341c348ea8ade1ba7c3b6f071bfe9635c544b7fb5501797eaa2f673169a7d0d',
    'PlayerB',
    fakeChain
  );

  const outcome = simpleEthAllocation([
    {
      destination: playerA.destination,
      amount: BN.from(hexZeroPad('0x06f05b59d3b20000', 32))
    },
    {
      destination: playerA.destination,
      amount: BN.from(hexZeroPad('0x06f05b59d3b20000', 32))
    }
  ]);

  const state: State = {
    outcome,
    turnNum: 5,
    appData: '0x00',
    isFinal: false,
    challengeDuration: CHALLENGE_DURATION,
    chainId: CHAIN_NETWORK_ID,
    channelNonce: 0,
    appDefinition: TRIVIAL_APP_ADDRESS, // TODO point at a deployed contract
    participants: [playerA.participant, playerB.participant]
  };

  const allSignState: SignedState = {
    ...state,
    signatures: [playerA, playerB].map(({privateKey}) => createSignatureEntry(state, privateKey))
  };
  const support = [allSignState];
  const result = await chain.challenge(support, playerA.privateKey);
  expect(result?.length).toBeGreaterThan(0);
});

it('correctly crafts a forceMove transaction (2x single-signed states)', async () => {
  const fakeChain = new FakeChain();
  const playerA = await Player.createPlayer(
    '0x275a2e2cd9314f53b42246694034a80119963097e3adf495fbf6d821dc8b6c8e',
    'PlayerA',
    fakeChain
  );
  const playerB = await Player.createPlayer(
    '0x3341c348ea8ade1ba7c3b6f071bfe9635c544b7fb5501797eaa2f673169a7d0d',
    'PlayerB',
    fakeChain
  );

  const outcome = simpleEthAllocation([
    {
      destination: playerA.destination,
      amount: BN.from(hexZeroPad('0x06f05b59d3b20000', 32))
    },
    {
      destination: playerA.destination,
      amount: BN.from(hexZeroPad('0x06f05b59d3b20000', 32))
    }
  ]);

  const state5: State = {
    outcome,
    turnNum: 4,
    appData: '0x00',
    isFinal: false,
    challengeDuration: CHALLENGE_DURATION,
    chainId: CHAIN_NETWORK_ID,
    channelNonce: 1,
    appDefinition: TRIVIAL_APP_ADDRESS, // TODO point at a deployed contract
    participants: [playerA.participant, playerB.participant]
  };
  const state5signature = createSignatureEntry(state5, playerA.privateKey);

  const state6: State = {
    outcome,
    turnNum: 5,
    appData: '0x00',
    isFinal: false,
    challengeDuration: CHALLENGE_DURATION,
    chainId: CHAIN_NETWORK_ID,
    channelNonce: 1,
    appDefinition: TRIVIAL_APP_ADDRESS,
    participants: [playerA.participant, playerB.participant]
  };

  const state6signature = createSignatureEntry(state6, playerB.privateKey);

  const support = [
    {...state5, signatures: [state5signature]},
    {...state6, signatures: [state6signature]}
  ];
  const result = await chain.challenge(support, playerA.privateKey);
  expect(result?.length).toBeGreaterThan(0);
});
