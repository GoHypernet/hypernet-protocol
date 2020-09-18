"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const { AddressZero } = ethers_1.constants;
const wallet_core_1 = require("@statechannels/wallet-core");
const src_1 = require("../../src");
const metrics_1 = require("../../src/metrics");
const e2e_utils_1 = require("../e2e-utils");
const config_1 = require("../../src/config");
class PayerClient {
    constructor(pk, receiverHttpServerURL) {
        this.pk = pk;
        this.receiverHttpServerURL = receiverHttpServerURL;
        this.wallet = metrics_1.recordFunctionMetrics(new src_1.Wallet(e2e_utils_1.payerConfig), e2e_utils_1.payerConfig.timingMetrics);
        this.time = metrics_1.timerFactory(config_1.defaultConfig.timingMetrics, 'payerClient');
        this.participantId = 'payer';
    }
    async destroy() {
        await this.wallet.destroy();
    }
    get address() {
        return new ethers_1.Wallet(this.pk).address;
    }
    get destination() {
        return wallet_core_1.makeDestination(this.address);
    }
    get me() {
        const { address: signingAddress, destination, participantId } = this;
        return {
            signingAddress,
            destination,
            participantId,
        };
    }
    async getReceiversParticipantInfo() {
        const { data: participant } = await axios_1.default.get(`${this.receiverHttpServerURL}/participant`);
        return participant;
    }
    async getChannel(channelId) {
        const { channelResult: channel } = await this.wallet.getState({ channelId });
        return channel;
    }
    async getChannels() {
        const { channelResults } = await this.wallet.getChannels();
        return channelResults;
    }
    async createPayerChannel(receiver) {
        const { outbox: [{ params }], channelResult: { channelId }, } = await this.wallet.createChannel({
            appData: '0x',
            appDefinition: AddressZero,
            fundingStrategy: 'Direct',
            participants: [this.me, receiver],
            allocations: [
                {
                    token: AddressZero,
                    allocationItems: [
                        {
                            amount: wallet_core_1.BN.from(0),
                            destination: this.destination,
                        },
                        { amount: wallet_core_1.BN.from(0), destination: receiver.destination },
                    ],
                },
            ],
        });
        const reply = await this.messageReceiverAndExpectReply(params.data);
        await this.wallet.pushMessage(reply);
        const { channelResult } = await this.wallet.getState({ channelId });
        return channelResult;
    }
    async makePayment(channelId) {
        const channel = await this.time(`get channel ${channelId}`, async () => this.getChannel(channelId));
        const { outbox: [{ params }], } = await this.time(`update ${channelId}`, async () => this.wallet.updateChannel(channel));
        const reply = await this.time(`send message ${channelId}`, async () => this.messageReceiverAndExpectReply(params.data));
        await this.time(`push message ${channelId}`, async () => this.wallet.pushMessage(reply));
    }
    emptyMessage() {
        return this.messageReceiverAndExpectReply({
            signedStates: [],
            objectives: [],
        });
    }
    async messageReceiverAndExpectReply(message) {
        const { data: reply } = await axios_1.default.post(this.receiverHttpServerURL + '/inbox', { message });
        return reply;
    }
}
exports.default = PayerClient;
//# sourceMappingURL=client.js.map