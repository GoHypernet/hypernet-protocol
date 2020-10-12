"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @beta
 */
exports.ErrorCode = {
    EnableEthereum: { EthereumNotEnabled: 100 },
    CloseAndWithdraw: { UserDeclined: 200 },
    CloseChannel: {
        NotYourTurn: 300,
        ChannelNotFound: 301
    },
    UpdateChannel: {
        ChannelNotFound: 400,
        InvalidTransition: 401,
        InvalidAppData: 402,
        NotYourTurn: 403,
        ChannelClosed: 404
    },
    PushMessage: {
        WrongParticipant: 900
    },
    CreateChannel: {
        SigningAddressNotFound: 1000,
        InvalidAppDefinition: 1001,
        UnsupportedToken: 1002
    },
    JoinChannel: {
        ChannelNotFound: 1100,
        InvalidTransition: 1101
    },
    GetState: {
        ChannelNotFound: 1200
    },
    ChallengeChannel: {
        ChannelNotFound: 1300
    }
};
//# sourceMappingURL=types.js.map