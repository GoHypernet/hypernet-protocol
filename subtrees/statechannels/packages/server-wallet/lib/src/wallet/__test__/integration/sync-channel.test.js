"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../../../models/channel");
const __1 = require("../..");
const _1_signing_wallet_seeds_1 = require("../../../db/seeds/1_signing_wallet_seeds");
const db_admin_connection_1 = require("../../../db-admin/db-admin-connection");
const states_1 = require("../fixtures/states");
const signing_wallets_1 = require("../fixtures/signing-wallets");
const participantFixtures = __importStar(require("../fixtures/participants"));
const channel_2 = require("../../../models/__test__/fixtures/channel");
const knex_setup_teardown_1 = require("../../../../jest/knex-setup-teardown");
const config_1 = require("../../../config");
let w;
beforeEach(async () => {
    await db_admin_connection_1.truncate(knex_setup_teardown_1.testKnex);
    w = new __1.Wallet(config_1.defaultConfig);
});
afterEach(async () => {
    await w.knex.destroy();
});
beforeEach(async () => _1_signing_wallet_seeds_1.seedAlicesSigningWallet(knex_setup_teardown_1.testKnex));
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
    const nextState = { turnNum: turnNum + 1, appData };
    const c = channel_2.channel({
        participants,
        vars: [
            states_1.stateWithHashSignedBy(signing_wallets_1.alice(), signing_wallets_1.bob(), signing_wallets_1.charlie())(runningState),
            states_1.stateWithHashSignedBy(signing_wallets_1.alice())(nextState),
        ],
    });
    const inserted = await channel_1.Channel.query(w.knex).insert(c);
    expect(inserted.vars).toMatchObject([runningState, nextState]);
    const channelId = c.channelId;
    await expect(w.syncChannel({ channelId })).resolves.toMatchObject({
        outbox: [
            {
                method: 'MessageQueued',
                params: {
                    recipient: 'bob',
                    sender: 'alice',
                    data: {
                        signedStates: [runningState, nextState],
                        requests: [{ type: 'GetChannel', channelId }],
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
                        requests: [{ type: 'GetChannel', channelId }],
                    },
                },
            },
        ],
        channelResult: runningState,
    });
    const updated = await channel_1.Channel.forId(channelId, w.knex);
    expect(updated.protocolState).toMatchObject({ latest: runningState, supported: runningState });
});
it('reject when the channel is not known', async () => {
    await expect(w.syncChannel({ channelId: '0xf0' })).rejects.toMatchObject(new Error('Channel not found'));
});
//# sourceMappingURL=sync-channel.test.js.map