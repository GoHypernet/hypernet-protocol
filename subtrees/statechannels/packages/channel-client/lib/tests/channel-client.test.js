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
describe('ChannelClient with FakeBrowserChannelProvider', () => {
    const participantA = utils_2.buildParticipant(constants_1.PARTICIPANT_A);
    const participantB = utils_2.buildParticipant(constants_1.PARTICIPANT_B);
    const states = {};
    const participants = [participantA, participantB];
    const allocations = [utils_2.buildAllocation(constants_1.PARTICIPANT_A, '5'), utils_2.buildAllocation(constants_1.PARTICIPANT_B, '5')];
    const channelId = utils_1.calculateChannelId(participants, constants_1.APP_DEFINITION);
    // This event emitter enables easier assertions of expected
    // events the client is listening on
    const clientBEventEmitter = new EventEmitter();
    let providerA, providerB;
    let clientA, clientB;
    beforeAll(() => {
        states['proposed'] = new utils_2.ChannelResultBuilder(participants, allocations, constants_1.APP_DEFINITION, constants_1.APP_DATA, channelId, 0, 'proposed').build();
        states['running'] = utils_2.ChannelResultBuilder.from(states['proposed'])
            .setStatus('running')
            .setTurnNum(3)
            .build();
        states['updated_app_data'] = utils_2.ChannelResultBuilder.from(states['running'])
            .setAppData(constants_1.UPDATED_APP_DATA)
            .setTurnNum(4)
            .build();
        states['closed'] = utils_2.ChannelResultBuilder.from(states['running'])
            .setStatus('closed')
            .setTurnNum(5)
            .build();
    });
    function setupProvider(provider, playerIndex, addresses) {
        provider.setAddress(addresses.self);
        provider.updatePlayerIndex(channelId, playerIndex);
        provider.opponentAddress[channelId] = addresses.opponent;
    }
    beforeEach(() => {
        providerA = new fake_browser_channel_provider_1.FakeBrowserChannelProvider();
        providerB = new fake_browser_channel_provider_1.FakeBrowserChannelProvider();
        providerA.enable();
        providerB.enable();
        clientA = new src_1.ChannelClient(providerA);
        clientB = new src_1.ChannelClient(providerB);
        setupProvider(providerA, 0, {
            self: participantA.participantId,
            opponent: participantB.participantId
        });
        setupProvider(providerB, 1, {
            self: participantB.participantId,
            opponent: participantA.participantId
        });
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
    });
    describe('creates a channel', () => {
        let proposalMessage;
        it('client A produces the right channel result', () => __awaiter(void 0, void 0, void 0, function* () {
            const clientAChannelState = yield clientA.createChannel(participants, allocations, constants_1.APP_DEFINITION, constants_1.APP_DATA, 'Direct');
            expect(clientAChannelState).toEqual(states['proposed']);
            proposalMessage = {
                sender: clientA.signingAddress,
                recipient: clientB.signingAddress,
                data: clientAChannelState
            };
        }));
        it('client B gets proposal', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['proposed']);
            return new Promise(resolve => {
                clientBEventEmitter.once('ChannelProposed', () => {
                    expect(providerB.latestState[channelId]).toEqual(states['proposed']);
                    resolve();
                });
                clientB.pushMessage(proposalMessage);
            });
        }));
    });
    describe('joins a channel', () => {
        it('the player whose turn it is can accept proposal to join the channel', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA], states['running']);
            utils_2.setProviderStates([providerB], states['proposed']);
            const channelResult = yield clientB.joinChannel(channelId);
            expect(channelResult).toEqual(states['running']);
            expect(providerA.latestState[channelId]).toEqual(states['running']);
        }));
        it('the player whose turn it is not cannot accept a join proposal they sent', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['proposed']);
            yield expect(clientA.joinChannel(channelId)).rejects.toBeDefined();
        }));
    });
    describe('updates a channel', () => {
        it('the player whose turn it is can update the channel', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['running']);
            const channelResult = yield clientA.updateChannel(channelId, allocations, constants_1.UPDATED_APP_DATA);
            expect(channelResult).toEqual(states['updated_app_data']);
            expect(providerB.latestState[channelId]).toEqual(states['updated_app_data']);
        }));
        it('the player whose turn it is not cannot update the channel', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['running']);
            yield expect(clientB.updateChannel(channelId, allocations, constants_1.UPDATED_APP_DATA)).rejects.toBeDefined();
        }));
    });
    describe('gets state from a channel', () => {
        it('anyone can get state', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['running']);
            const channelResult = yield clientA.getState(channelId);
            expect(channelResult).toEqual(states['running']);
            expect(providerB.latestState[channelId]).toEqual(states['running']);
        }));
    });
    describe('closes a channel', () => {
        it('player with valid turn can make a valid close channel call', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['running']);
            // Since the clients agree to close a channel, this skips the 'closing'
            // phase and the clients directly go to the channel 'closed' state
            const channelResult = yield clientA.closeChannel(channelId);
            expect(channelResult).toEqual(states['closed']);
            expect(providerB.latestState[channelId]).toEqual(states['closed']);
        }));
        it('player with invalid turn cannot make a valid close channel call', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_2.setProviderStates([providerA, providerB], states['running']);
            yield expect(clientB.closeChannel(channelId)).rejects.toBeDefined();
        }));
    });
});
//# sourceMappingURL=channel-client.test.js.map