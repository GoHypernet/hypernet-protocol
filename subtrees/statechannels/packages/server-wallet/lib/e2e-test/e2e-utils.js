"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const kill = require("tree-kill");
const Knex = require("knex");
const wallet_core_1 = require("@statechannels/wallet-core");
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const channel_1 = require("../src/models/__test__/fixtures/channel");
const signing_wallet_1 = require("../src/models/signing-wallet");
const state_vars_1 = require("../src/wallet/__test__/fixtures/state-vars");
const channel_2 = require("../src/models/channel");
const config_1 = require("../src/config");
exports.payerConfig = { ...config_1.defaultConfig, postgresDBName: 'payer' };
exports.receiverConfig = { ...config_1.defaultConfig, postgresDBName: 'receiver' };
const timers_1 = require("./payer/timers");
exports.triggerPayments = async (channelIds, numPayments) => {
    let args = ['start', '--database', 'payer', '--channels', ...channelIds];
    if (numPayments)
        args = args.concat(['--numPayments', numPayments.toString()]);
    const payerScript = child_process_1.fork(path_1.join(__dirname, './payer/index.ts'), args, {
        execArgv: ['-r', 'ts-node/register'],
    });
    payerScript.on('message', message => console.log(timers_1.PerformanceTimer.formatResults(JSON.parse(message))));
    await new Promise(resolve => payerScript.on('exit', resolve));
};
exports.startReceiverServer = () => {
    const server = child_process_1.spawn('yarn', ['ts-node', './e2e-test/receiver/server'], {
        stdio: 'pipe',
        env: {
            ...process.env,
        },
    });
    server.on('error', data => console.error(data.toString()));
    server.stdout.on('data', data => console.log(data.toString()));
    server.stderr.on('data', data => console.error(data.toString()));
    return {
        server,
        url: `http://127.0.0.1:65535`,
    };
};
exports.waitForServerToStart = (receiverServer, pingInterval = 1500) => new Promise(resolve => {
    const interval = setInterval(async () => {
        try {
            await axios_1.default.post(`${receiverServer.url}/status`);
            clearInterval(interval);
            resolve();
        }
        catch {
            return;
        }
    }, pingInterval);
});
exports.knexPayer = Knex(config_1.extractDBConfigFromServerWalletConfig(exports.payerConfig));
exports.knexReceiver = Knex(config_1.extractDBConfigFromServerWalletConfig(exports.receiverConfig));
exports.killServer = async ({ server }) => {
    kill(server.pid);
};
async function seedTestChannels(payer, payerPrivateKey, receiver, receiverPrivateKey, numOfChannels, knexPayer) {
    const channelIds = [];
    for (let i = 0; i < numOfChannels; i++) {
        const seed = channel_1.withSupportedState([
            signing_wallet_1.SigningWallet.fromJson({ privateKey: payerPrivateKey }),
            signing_wallet_1.SigningWallet.fromJson({ privateKey: receiverPrivateKey }),
        ])({
            vars: [state_vars_1.stateVars({ turnNum: 3 })],
            channelNonce: i,
            participants: [payer, receiver],
        });
        await channel_2.Channel.bindKnex(knexPayer)
            .query()
            .insert([{ ...seed, signingAddress: payer.signingAddress }]);
        await channel_2.Channel.bindKnex(exports.knexReceiver)
            .query()
            .insert([{ ...seed, signingAddress: receiver.signingAddress }]);
        channelIds.push(seed.channelId);
    }
    return channelIds;
}
exports.seedTestChannels = seedTestChannels;
function getParticipant(participantId, privateKey) {
    const signingAddress = new ethers_1.Wallet(privateKey).address;
    return {
        signingAddress,
        participantId,
        destination: wallet_core_1.makeDestination(signingAddress),
    };
}
exports.getParticipant = getParticipant;
//# sourceMappingURL=e2e-utils.js.map