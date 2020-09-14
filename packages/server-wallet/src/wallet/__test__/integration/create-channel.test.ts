import {Channel} from '../../../models/channel';
import {Wallet} from '../..';
import {createChannelArgs} from '../fixtures/create-channel';
import {seedAlicesSigningWallet} from '../../../db/seeds/1_signing_wallet_seeds';
import {truncate} from '../../../db-admin/db-admin-connection';
import knex from '../../../db/connection';

let w: Wallet;
beforeEach(async () => {
  await truncate(knex);
  w = new Wallet();
});

describe('happy path', () => {
  beforeEach(async () => seedAlicesSigningWallet(knex));

  it('creates a channel', async () => {
    expect(await Channel.query().resultSize()).toEqual(0);

    const appData = '0xaf00';
    const createPromise = w.createChannel(createChannelArgs({appData}));
    await expect(createPromise).resolves.toMatchObject({
      channelResult: {channelId: expect.any(String)},
    });

    await expect(createPromise).resolves.toMatchObject({
      outbox: [
        {
          params: {
            recipient: 'bob',
            sender: 'alice',
            data: {signedStates: [{turnNum: 0, appData}]},
          },
        },
      ],
      channelResult: {channelId: expect.any(String), turnNum: 0, appData},
    });
    const {channelId} = (await createPromise).channelResult;
    expect(await Channel.query().resultSize()).toEqual(1);

    const updated = await Channel.forId(channelId, undefined);
    const expectedState = {
      turnNum: 0,
      appData,
    };
    expect(updated).toMatchObject({
      latest: expectedState,
      latestSignedByMe: expectedState,
      supported: undefined,
    });
  });

  it('creates many channels', async () => {
    expect(await Channel.query().resultSize()).toEqual(0);

    const createArgs = createChannelArgs({appData: '0xaf00'});
    const NUM_CHANNELS = 10;
    const createPromises = Array(NUM_CHANNELS)
      .fill(createArgs)
      .map(w.createChannel);
    await expect(Promise.all(createPromises)).resolves.not.toThrow();

    expect(await Channel.query().resultSize()).toEqual(NUM_CHANNELS);
  }, 10_000);
});

it("doesn't create a channel if it doesn't have a signing wallet", () =>
  expect(w.createChannel(createChannelArgs())).rejects.toThrow(
    'null value in column "signing_address"'
  ));
