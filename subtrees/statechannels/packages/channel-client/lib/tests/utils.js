"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function setProviderStates(providers, state) {
    providers.forEach(provider => {
        provider.setState(state);
    });
}
exports.setProviderStates = setProviderStates;
class ChannelResultBuilder {
    constructor(participants, allocations, appDefinition, appData, channelId, turnNum, status) {
        this.channelResult = {
            participants,
            allocations,
            appDefinition,
            appData,
            channelId,
            turnNum,
            status
        };
    }
    static from(channelResult) {
        return new ChannelResultBuilder(channelResult.participants, channelResult.allocations, channelResult.appDefinition, channelResult.appData, channelResult.channelId, channelResult.turnNum, channelResult.status);
    }
    build() {
        return this.channelResult;
    }
    setStatus(status) {
        this.channelResult.status = status;
        return this;
    }
    static setStatus(channelResult, status) {
        return ChannelResultBuilder.from(channelResult)
            .setStatus(status)
            .build();
    }
    setTurnNum(turnNum) {
        this.channelResult.turnNum = turnNum;
        return this;
    }
    static setTurnNum(channelResult, turnNum) {
        return ChannelResultBuilder.from(channelResult)
            .setTurnNum(turnNum)
            .build();
    }
    setAppData(appData) {
        this.channelResult.appData = appData;
        return this;
    }
    static setAppData(channelResult, appData) {
        return ChannelResultBuilder.from(channelResult)
            .setAppData(appData)
            .build();
    }
}
exports.ChannelResultBuilder = ChannelResultBuilder;
function buildParticipant(address) {
    return {
        participantId: address,
        signingAddress: address,
        destination: address
    };
}
exports.buildParticipant = buildParticipant;
function buildAllocation(destination, amount, token = constants_1.ETH_TOKEN_ADDRESS) {
    return {
        token,
        allocationItems: [
            {
                destination,
                amount
            }
        ]
    };
}
exports.buildAllocation = buildAllocation;
//# sourceMappingURL=utils.js.map