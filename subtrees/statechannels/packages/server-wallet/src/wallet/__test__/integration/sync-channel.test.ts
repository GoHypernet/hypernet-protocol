import {Channel} from '../../../models/channel';
import {Wallet} from '../..';
import {seedAlicesSigningWallet} from '../../../db/seeds/1_signing_wallet_seeds';
import {truncate} from '../../../db-admin/db-admin-connection';
import knex from '../../../db/connection';
import {stateWithHashSignedBy} from '../fixtures/states';
import {alice, bob, charlie} from '../fixtures/signing-wallets';
import * as participantFixtures from '../fixtures/participants';
import {channel} from '../../../models/__test__/fixtures/channel';

let w: Wallet;
beforeEach(async () => {
  await truncate(knex);
  w = new Wallet();
});

beforeEach(async () => seedAlicesSigningWallet(knex));

it('returns an outgoing message with the latest state', async () => {
  const appData = '0xf0';
  const turnNum = 7;
  const participants = [
    participantFixtures.alice(),
    participantFixtures.bob(),
    participantFixtures.charlie(),
  ];
  const runningState = {
    turnNum,
    appData,
    participants,
  };
  const nextState = {turnNum: turnNum + 1, appData};
  const c = channel({
    participants,
    vars: [
      stateWithHashSignedBy(alice(), bob(), charlie())(runningState),
      stateWithHashSignedBy(alice())(nextState),
    ],
  });

  const inserted = await Channel.query().insert(c);
  expect(inserted.vars).toMatchObject([runningState, nextState]);

  const channelId = c.channelId;

  await expect(w.syncChannel({channelId})).resolves.toMatchObject({
    outbox: [
      {
        method: 'MessageQueued',
        params: {
          recipient: 'bob',
          sender: 'alice',
          data: {
            signedStates: [runningState, nextState],
            requests: [{type: 'GetChannel', channelId}],
          },
        },
      },
      {
        method: 'MessageQueued',
        params: {
          recipient: 'charlie',
          sender: 'alice',
          data: {
            signedStates: [runningState, nextState],
            requests: [{type: 'GetChannel', channelId}],
          },
        },
      },
    ],
    channelResult: runningState,
  });

  const updated = await Channel.forId(channelId, undefined);
  expect(updated.protocolState).toMatchObject({latest: runningState, supported: runningState});
});

it('reject when the channel is not known', async () => {
  await expect(w.syncChannel({channelId: '0xf0'})).rejects.toMatchObject(
    new Error('Channel not found')
  );
});
