"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const signing_wallets_1 = require("../../src/wallet/__test__/fixtures/signing-wallets");
const wallet_1 = require("../../src/wallet");
const metrics_1 = require("../../src/metrics");
const e2e_utils_1 = require("../e2e-utils");
const config_1 = require("../../src/config");
class ReceiverController {
    constructor() {
        this.wallet = metrics_1.recordFunctionMetrics(new wallet_1.Wallet(e2e_utils_1.receiverConfig), config_1.defaultConfig.timingMetrics);
        this.myParticipantID = 'receiver';
        this.time = metrics_1.timerFactory(config_1.defaultConfig.timingMetrics, 'controller');
    }
    get participantInfo() {
        return {
            participantId: this.myParticipantID,
            signingAddress: signing_wallets_1.bob().address,
            destination: wallet_core_1.makeDestination(signing_wallets_1.bob().address),
        };
    }
    async acceptMessageAndReturnReplies(message) {
        var _a;
        const { signedStates } = message;
        const { channelResults: [channelResult], } = await this.time('push message', async () => this.wallet.pushMessage(message));
        if (!signedStates || ((_a = signedStates) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return {
                signedStates: [],
                objectives: [],
            };
        }
        else {
            const { outbox: [messageToSendToPayer], } = await this.time('react', async () => (channelResult.status === 'proposed' ? this.wallet.joinChannel : this.wallet.updateChannel)(channelResult));
            return messageToSendToPayer.params.data;
        }
    }
}
exports.default = ReceiverController;
//# sourceMappingURL=controller.js.map