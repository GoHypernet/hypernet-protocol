"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("loglevel");
const EventEmitter = require("eventemitter3");
const src_1 = require("../src");
const utils_1 = require("../src/utils");
const utils_2 = require("./utils");
const constants_1 = require("./constants");
const fake_browser_channel_provider_1 = require("./fakes/fake-browser-channel-provider");
log.setDefaultLevel(log.levels.SILENT);
describe('FakeChannelClient', () => {
    const participantA = utils_2.buildParticipant(constants_1.PARTICIPANT_A);
    const participantB = utils_2.buildParticipant(constants_1.PARTICIPANT_B);
    const participantC = utils_2.buildParticipant(constants_1.PARTICIPANT_C);
    const statesAB = {};
    const statesAC = {};
    const participantsAB = [participantA, participantB];
    const participantsAC = [participantA, participantC];
    const allocationsAB = [utils_2.buildAllocation(constants_1.PARTICIPANT_A, '5'), utils_2.buildAllocation(constants_1.PARTICIPANT_B, '5')];
    const allocationsAC = [utils_2.buildAllocation(constants_1.PARTICIPANT_A, '5'), utils_2.buildAllocation(constants_1.PARTICIPANT_C, '5')];
    const channelIdAB = utils_1.calculateChannelId(participantsAB, constants_1.APP_DEFINITION);
    const channelIdAC = utils_1.calculateChannelId(participantsAC, constants_1.APP_DEFINITION);
    // This event emitter only enable easier assertions of expected
    // events the client is listening on
    const clientBEventEmitter = new EventEmitter();
    const clientCEventEmitter = new EventEmitter();
    let clientA, clientB, clientC;
    let providerA, providerB, providerC;
    beforeAll(() => {
        statesAB['proposed'] = new utils_2.ChannelResultBuilder(participantsAB, allocationsAB, constants_1.APP_DEFINITION, constants_1.APP_DATA, channelIdAB, 0, 'proposed').build();
        statesAB['running'] = utils_2.ChannelResultBuilder.from(statesAB['proposed'])
            .setStatus('running')
            .setTurnNum(3)
            .build();
        statesAB['updated_app_data'] = utils_2.ChannelResultBuilder.from(statesAB['running'])
            .setAppData(constants_1.UPDATED_APP_DATA)
            .setTurnNum(4)
            .build();
        statesAB['closed'] = utils_2.ChannelResultBuilder.from(statesAB['running'])
            .setStatus('closed')
            .setTurnNum(5)
            .build();
        statesAC['proposed'] = new utils_2.ChannelResultBuilder(participantsAC, allocationsAC, constants_1.APP_DEFINITION, constants_1.APP_DATA, channelIdAC, 0, 'proposed').build();
        statesAC['running'] = utils_2.ChannelResultBuilder.from(statesAC['proposed'])
            .setStatus('running')
            .setTurnNum(3)
            .build();
        statesAC['updated_app_data'] = utils_2.ChannelResultBuilder.from(statesAC['running'])
            .setAppData(constants_1.UPDATED_APP_DATA)
            .setTurnNum(4)
            .build();
        statesAC['closed'] = utils_2.ChannelResultBuilder.from(statesAC['running'])
            .setStatus('closed')
            .setTurnNum(5)
            .build();
    });
    beforeEach(() => {
        providerA = new fake_browser_channel_provider_1.FakeBrowserChannelProvider();
        providerA.internalAddress = participantA.signingAddress;
        providerB = new fake_browser_channel_provider_1.FakeBrowserChannelProvider();
        providerB.internalAddress = participantB.signingAddress;
        providerC = new fake_browser_channel_provider_1.FakeBrowserChannelProvider();
        providerC.internalAddress = participantC.signingAddress;
        clientA = new src_1.ChannelClient(providerA);
        clientB = new src_1.ChannelClient(providerB);
        clientC = new src_1.ChannelClient(providerC);
        providerA.updatePlayerIndex(channelIdAB, 0);
        providerA.opponentAddress[channelIdAB] = participantB.participantId;
        providerB.updatePlayerIndex(channelIdAB, 1);
        providerB.opponentAddress[channelIdAB] = participantA.participantId;
        providerC.updatePlayerIndex(channelIdAC, 1);
        providerC.opponentAddress[channelIdAC] = participantA.participantId;
        // This setup simulates the message being received from A's wallet
        // and "queued" by A's app to be sent to the opponent (handled by
        // A's channel client, which then is "dequeued" on A's channel client
        // and sent to B's app (handled by B's channel client here) and
        // pushed from B's app to B's wallet.
        // The de/queuing described above is effectively faked by explicitly passing
        // the messages between the clients.
        clientA.onMessageQueued((message) => __awaiter(void 0, void 0, void 0, function* () {
            yield clientB.pushMessage(message);
        }));
        clientB.onMessageQueued((message) => __awaiter(void 0, void 0, void 0, function* () {
            yield clientA.pushMessage(message);
        }));
        clientB.onChannelProposed((result) => {
            clientBEventEmitter.emit('ChannelProposed', result);
        });
        clientC.onMessageQueued((message) => __awaiter(void 0, void 0, void 0, function* () {
            yield clientA.pushMessage(message);
        }));
        clientC.onChannelProposed((result) => {
            clientCEventEmitter.emit('ChannelProposed', result);
        });
    });
    describe('client A creates channels', () => {
        let proposalMessageB, proposalMessageC;
        it('client A produces the right channel result', () => __awaiter(void 0, void 0, void 0, function* () {
            const clientChannelStateAB = yield clientA.createChannel(participantsAB, allocationsAB, constants_1.APP_DEFINITION, constants_1.APP_DATA, 'Direct');
            expect(clientChannelStateAB).toEqual(statesAB['proposed']);
            proposalMessageB = {
                sender: participantA.participantId,
                recipient: participantB.participantId,
                data: clientChannelStateAB
            };
            const clientChannelStateAC = yield clientA.createChannel(participantsAC, allocationsAC, constants_1.APP_DEFINITION, constants_1.APP_DATA, 'Direct');
            expect(clientChannelStateAC).toEqual(statesAC['proposed']);
            proposalMessageC = {
                sender: participantA.participantId,
                recipient: participantC.participantId,
                data: clientChannelStateAC
            };
        }));
        it('client B gets proposal', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], statesAB['proposed']);
            return new Promise(resolve => {
                clientBEventEmitter.once('ChannelProposed', () => {
                    expect(providerB.latestState[channelIdAB]).toEqual(statesAB['proposed']);
                    resolve();
                });
                clientB.pushMessage(proposalMessageB);
            });
        }));
        it('client C also gets proposal', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerC], statesAC['proposed']);
            return new Promise(resolve => {
                clientCEventEmitter.once('ChannelProposed', () => {
                    expect(providerC.latestState[channelIdAC]).toEqual(statesAC['proposed']);
                    resolve();
                });
                clientC.pushMessage(proposalMessageC);
            });
        }));
    });
    describe('joins a channel', () => {
        it('the player whose turn it is can accept proposal to join the channel', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA], statesAB['running']);
            utils_2.setProviderStates([providerB], statesAB['proposed']);
            utils_2.setProviderStates([providerA], statesAC['running']);
            utils_2.setProviderStates([providerC], statesAC['proposed']);
            const ChannelResultAB = yield clientB.joinChannel(channelIdAB);
            expect(ChannelResultAB).toEqual(statesAB['running']);
            expect(providerB.latestState[channelIdAB]).toEqual(statesAB['running']);
            expect(providerC.latestState[channelIdAC]).toEqual(statesAC['proposed']);
        }));
        it('the player whose turn it is not cannot accept a join proposal they sent', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], statesAB['proposed']);
            yield expect(clientA.joinChannel(channelIdAB)).rejects.toBeDefined();
        }));
    });
    describe('updates a channel', () => {
        it('the player whose turn it is can update the channel', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], statesAB['running']);
            utils_2.setProviderStates([providerA, providerC], statesAC['running']);
            const ChannelResultAB = yield clientA.updateChannel(channelIdAB, allocationsAB, constants_1.UPDATED_APP_DATA);
            expect(ChannelResultAB).toEqual(statesAB['updated_app_data']);
            expect(providerB.latestState[channelIdAB]).toEqual(statesAB['updated_app_data']);
            expect(providerC.latestState[channelIdAC]).toEqual(statesAC['running']);
        }));
        it('the player whose turn it is not cannot update the channel', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], statesAB['running']);
            yield expect(clientB.updateChannel(channelIdAB, allocationsAB, constants_1.UPDATED_APP_DATA)).rejects.toBeDefined();
        }));
    });
    describe('closes a channel', () => {
        it('player with valid turn can make a valid close channel call', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], statesAB['running']);
            utils_2.setProviderStates([providerA, providerC], statesAC['running']);
            // Since the clients agree to close a channel, this skips the 'closing'
            // phase and the clients directly go to the channel 'closed' state
            const ChannelResult = yield clientA.closeChannel(channelIdAB);
            expect(ChannelResult).toEqual(statesAB['closed']);
            expect(providerB.latestState[channelIdAB]).toEqual(statesAB['closed']);
            expect(providerC.latestState[channelIdAC]).toEqual(statesAC['running']);
        }));
        it('player with invalid turn cannot make a valid close channel call', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], statesAB['running']);
            yield expect(clientB.closeChannel(channelIdAB)).rejects.toBeDefined();
        }));
    });
});
//# sourceMappingURL=fake-channel-client.test.js.map