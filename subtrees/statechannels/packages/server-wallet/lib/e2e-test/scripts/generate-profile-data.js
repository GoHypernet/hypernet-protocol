"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const devtools_1 = require("@statechannels/devtools");
const e2e_utils_1 = require("../e2e-utils");
const signing_wallets_1 = require("../../src/wallet/__test__/fixtures/signing-wallets");
const signing_wallet_1 = require("../../src/models/signing-wallet");
const db_admin_connection_1 = require("../../src/db-admin/db-admin-connection");
const kill = require("tree-kill");
const startReceiver = async (profiling) => {
    if (profiling === 'FlameGraph') {
        const server = child_process_1.exec(`npx clinic flame --collect-only -- node ./lib/e2e-test/receiver/server.js`, {
            env: {
                ...process.env,
                SERVER_DB_NAME: 'receiver',
            },
        });
        return {
            server: server,
            url: `http://127.0.0.1:65535`,
        };
    }
    else if (profiling == 'Doctor') {
        const server = child_process_1.exec(`npx clinic doctor --collect-only -- node  ./lib/e2e-test/receiver/server.js`, {
            env: {
                ...process.env,
                SERVER_DB_NAME: 'receiver',
            },
        });
        return {
            server: server,
            url: `http://127.0.0.1:65535`,
        };
    }
    else {
        const server = child_process_1.exec(`npx clinic bubbleprof --collect-only -- node  ./lib/e2e-test/receiver/server.js`, {
            env: {
                ...process.env,
                SERVER_DB_NAME: 'receiver',
            },
        });
        return {
            server: server,
            url: `http://127.0.0.1:65535`,
        };
    }
};
const NUM_CHANNELS = 20;
const NUM_PAYMENTS = 20;
async function generateData(type) {
    const [SWPayer, SWReceiver] = [e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(knex => signing_wallet_1.SigningWallet.bindKnex(knex));
    await Promise.all([e2e_utils_1.knexPayer, e2e_utils_1.knexReceiver].map(db => db_admin_connection_1.truncate(db)));
    await SWPayer.query().insert(signing_wallets_1.alice());
    await SWReceiver.query().insert(signing_wallets_1.bob());
    const channelIds = await e2e_utils_1.seedTestChannels(e2e_utils_1.getParticipant('payer', signing_wallets_1.alice().privateKey), signing_wallets_1.alice().privateKey, e2e_utils_1.getParticipant('receiver', signing_wallets_1.bob().privateKey), signing_wallets_1.bob().privateKey, NUM_CHANNELS, e2e_utils_1.knexPayer);
    const receiverServer = await startReceiver(type);
    await e2e_utils_1.waitForServerToStart(receiverServer);
    await e2e_utils_1.triggerPayments(channelIds, NUM_PAYMENTS);
    kill(receiverServer.server.pid, 'SIGINT');
    return new Promise(resolve => {
        receiverServer.server.on('exit', () => {
            resolve();
        });
    });
}
(async function () {
    devtools_1.configureEnvVariables();
    const typeArg = process.argv.slice(2)[0].toLowerCase();
    const type = typeArg === 'bubbleprof' ? 'BubbleProf' : typeArg === 'flamegraph' ? 'FlameGraph' : 'Doctor';
    await generateData(type);
    process.exit(0);
})();
//# sourceMappingURL=generate-profile-data.js.map