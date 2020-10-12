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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ethers_1 = require("ethers");
const log = require("loglevel");
const utils_1 = require("../../src/utils");
/*
 This fake provider becomes the stateful object which handles the calls
 coming from a non-fake `ChannelClient`.
 */
class FakeChannelProvider {
    constructor() {
        this.events = new eventemitter3_1.default();
        this.url = '';
        this.playerIndex = {};
        this.opponentIndex = {};
        this.internalAddress = ethers_1.Wallet.createRandom().address;
        this.opponentAddress = {};
        this.latestState = {};
        this.on = (method, params) => this.events.on(method, params);
        this.off = (method, params) => this.events.off(method, params);
    }
    send(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (method) {
                case 'CreateChannel':
                    return this.createChannel(params);
                case 'PushMessage':
                    return this.pushMessage(params);
                case 'GetWalletInformation':
                    return {
                        signingAddress: this.getAddress(),
                        destinationAddress: '0xEthereumAddress',
                        walletVersion: 'FakeChannelProvider@VersionTBD'
                    };
                case 'JoinChannel':
                    return this.joinChannel(params);
                case 'GetState':
                    return this.getState(params);
                case 'UpdateChannel':
                    return this.updateChannel(params);
                case 'CloseChannel':
                    return this.closeChannel(params);
                default:
                    return Promise.reject(`No callback available for ${method}`);
            }
        });
    }
    subscribe() {
        return Promise.resolve('success');
    }
    unsubscribe() {
        return Promise.resolve(true);
    }
    setState(state) {
        this.latestState = Object.assign(Object.assign({}, this.latestState), { [state.channelId]: state });
    }
    setAddress(address) {
        this.internalAddress = address;
    }
    updatePlayerIndex(channelId, playerIndex) {
        if (this.playerIndex[channelId] === undefined) {
            this.playerIndex[channelId] = playerIndex;
            this.opponentIndex[channelId] = playerIndex == 1 ? 0 : 1;
        }
    }
    getAddress() {
        if (this.internalAddress === undefined) {
            throw Error('No address has been set yet');
        }
        return this.internalAddress;
    }
    getPlayerIndex(channelId) {
        if (this.playerIndex === undefined) {
            throw Error(`This client does not have its player index set yet`);
        }
        return this.playerIndex[channelId];
    }
    getOpponentIndex(channelId) {
        if (this.opponentIndex[channelId] === undefined) {
            throw Error(`This client does not have its opponent player index set yet`);
        }
        return this.opponentIndex[channelId];
    }
    verifyTurnNum(channelId, turnNum) {
        if (turnNum % 2 === this.getPlayerIndex(channelId)) {
            return Promise.reject(`Not your turn: currentTurnNum = ${turnNum}, index = ${this.playerIndex[channelId]}`);
        }
        return Promise.resolve();
    }
    findChannel(channelId) {
        if (!Object.keys(this.latestState).includes(channelId)) {
            throw Error(`Channel doesn't exist with channelId '${JSON.stringify(channelId, null, 4)}'`);
        }
        return this.latestState[channelId];
    }
    createChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const participants = params.participants;
            const allocations = params.allocations;
            const appDefinition = params.appDefinition;
            const appData = params.appData;
            const channel = {
                participants,
                allocations,
                appDefinition,
                appData,
                channelId: utils_1.calculateChannelId(participants, appDefinition),
                turnNum: 0,
                status: 'proposed'
            };
            this.updatePlayerIndex(channel.channelId, 0);
            this.setState(channel);
            this.internalAddress = channel.participants[0].participantId;
            this.opponentAddress[channel.channelId] = channel.participants[1].participantId;
            this.notifyOpponent(channel, 'CreateChannel');
            return channel;
        });
    }
    joinChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channelId } = params;
            const latestState = this.findChannel(channelId);
            this.updatePlayerIndex(channelId, 1);
            log.debug(`Player ${this.getPlayerIndex(channelId)} joining channel ${channelId}`);
            yield this.verifyTurnNum(channelId, latestState.turnNum);
            // skip funding by setting the channel to 'running' the moment it is joined
            // [assuming we're working with 2-participant channels for the time being]
            this.setState(Object.assign(Object.assign({}, latestState), { turnNum: 3, status: 'running' }));
            this.opponentAddress[channelId] = latestState.participants[0].participantId;
            this.notifyOpponent(this.latestState[channelId], 'joinChannel');
            return this.latestState[channelId];
        });
    }
    getState({ channelId }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findChannel(channelId);
        });
    }
    updateChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = params.channelId;
            const allocations = params.allocations;
            const appData = params.appData;
            log.debug(`Player ${this.getPlayerIndex(channelId)} updating channel ${channelId}`);
            const latestState = this.findChannel(channelId);
            const nextState = Object.assign(Object.assign({}, latestState), { allocations, appData });
            yield this.verifyTurnNum(channelId, latestState.turnNum);
            nextState.turnNum = latestState.turnNum + 1;
            log.debug(`Player ${this.getPlayerIndex(channelId)} updated channel to turnNum ${nextState.turnNum}`);
            this.setState(nextState);
            this.notifyOpponent(this.latestState[channelId], 'ChannelUpdate');
            return this.latestState[channelId];
        });
    }
    closeChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const latestState = this.findChannel(params.channelId);
            yield this.verifyTurnNum(params.channelId, latestState.turnNum);
            const turnNum = latestState.turnNum + 1;
            const status = 'closing';
            this.setState(Object.assign(Object.assign({}, latestState), { turnNum, status }));
            log.debug(`Player ${this.getPlayerIndex(params.channelId)} updated channel to status ${status} on turnNum ${turnNum}`);
            this.notifyOpponent(this.latestState[params.channelId], 'ChannelUpdate');
            return this.latestState[params.channelId];
        });
    }
    // TODO: Craft a full message
    notifyAppChannelUpdated(data) {
        this.events.emit('ChannelUpdated', data);
    }
    notifyAppBudgetUpdated(data) {
        this.events.emit('BudgetUpdated', data);
    }
    notifyOpponent(data, notificationType) {
        log.debug(`${this.getPlayerIndex(data.channelId)} notifying opponent ${this.getOpponentIndex(data.channelId)} about ${notificationType}`);
        const sender = this.internalAddress;
        const recipient = this.opponentAddress[data.channelId];
        if (!recipient) {
            throw Error(`Cannot notify opponent - opponent address not set`);
        }
        this.events.emit('MessageQueued', { sender, recipient, data });
    }
    isChannelResult(data) {
        return typeof data === 'object' && data != null && 'turnNum' in data;
    }
    pushMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isChannelResult(params.data)) {
                this.setState(params.data);
                this.notifyAppChannelUpdated(this.latestState[params.data.channelId]);
                const channel = params.data;
                const turnNum = channel.turnNum + 1;
                switch (params.data.status) {
                    case 'proposed':
                        this.events.emit('ChannelProposed', channel);
                        break;
                    // auto-close, if we received a close
                    case 'closing':
                        this.setState(Object.assign(Object.assign({}, this.latestState[channel.channelId]), { turnNum, status: 'closed' }));
                        this.notifyOpponent(this.latestState[channel.channelId], 'ChannelUpdate');
                        this.notifyAppChannelUpdated(this.latestState[channel.channelId]);
                        break;
                    default:
                        break;
                }
            }
            return { success: true };
        });
    }
}
exports.FakeChannelProvider = FakeChannelProvider;
//# sourceMappingURL=fake-channel-provider.js.map