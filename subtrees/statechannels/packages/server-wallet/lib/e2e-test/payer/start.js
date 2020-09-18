"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const knex_1 = __importDefault(require("knex"));
const lodash_1 = __importDefault(require("lodash"));
const devtools_1 = require("@statechannels/devtools");
devtools_1.configureEnvVariables();
const client_1 = __importDefault(require("../payer/client"));
const signing_wallets_1 = require("../../src/wallet/__test__/fixtures/signing-wallets");
const metrics_1 = require("../../src/metrics");
const config_1 = require("../../src/config");
const timers_1 = require("./timers");
exports.default = {
    command: 'start',
    describe: 'Makes (fake) payments on many channels concurrently',
    builder: (yargs) => yargs
        .option('database', {
        type: 'string',
        demandOption: true,
    })
        .option('channels', {
        type: 'array',
        demandOption: true,
    })
        .option('numPayments', {
        type: 'number',
        default: 1,
    })
        .coerce('channels', (channels) => channels.map(channel => channel.toString(16)))
        .example('payer --database payer --channels 0xf00 0x123 0xabc', 'Makes payments with three channels'),
    handler: async (argv) => {
        const { database, numPayments, channels } = argv;
        const knex = knex_1.default(lodash_1.default.merge(config_1.extractDBConfigFromServerWalletConfig(config_1.defaultConfig), { connection: { database } }));
        objection_1.Model.knex(knex);
        const payerClient = metrics_1.recordFunctionMetrics(new client_1.default(signing_wallets_1.alice().privateKey, `http://127.0.0.1:65535`));
        const performanceTimer = new timers_1.PerformanceTimer(channels || [], numPayments);
        await Promise.all((channels || []).map((channelId) => lodash_1.default.range(numPayments).reduce(p => p.then(() => {
            performanceTimer.start(channelId);
            return payerClient.makePayment(channelId).then(() => {
                performanceTimer.stop(channelId);
            });
        }), Promise.resolve())));
        const timingResults = performanceTimer.calculateResults();
        console.log(timers_1.PerformanceTimer.formatResults(timingResults));
        process.send && process.send(JSON.stringify(timingResults));
        process.exit(0);
    },
};
//# sourceMappingURL=start.js.map