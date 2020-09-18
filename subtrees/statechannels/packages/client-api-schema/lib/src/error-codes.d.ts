/**
 * Error codes that might be returned by the wallet
 *
 * @remarks
 * Errors conform to the [JSON-RPC 2.0 error spec](https://www.jsonrpc.org/specification#error_object).
Beyond the standard errors from that spec, the following domain-specific errors are possible:
* <ul>
 * <li> 100: The wallet approval was rejected by the Web3 provider.</li>
 * <li> 200: The user declines</li>
 * <li> 300: You cannot close the channel when it is not your turn</li>
 * <li> 400: Channel not found</li>
 * <li> 900: The message is not addressed to this wallet.</li>
 * <li> 1000: The wallet can't find the signing key corresponding to the first signing address in the participants array.</li>
 * <li> 1001: There isn't a contract deployed at the app definition address. </li>
 * <li> 1002: The wallet doesn't support one or more of the tokens appearing in the allocation.</li>
 * <li> 1100: The wallet can't find the channel corresponding to the channelId</li>
 * <li> 1101: The wallet contains invalid state data</li>
 * <li> 1200: The wallet can't find the channel corresponding to the channelId</li>
 * <li> 1300: The wallet can't find the channel corresponding to the channelId</li>
 * </ul>
 */
export declare type ErrorCodes = {
    EnableEthereum: {
        EthereumNotEnabled: 100;
    };
    CloseAndWithdraw: {
        UserDeclined: 200;
    };
    CloseChannel: {
        NotYourTurn: 300;
        ChannelNotFound: 301;
    };
    UpdateChannel: {
        ChannelNotFound: 400;
        InvalidTransition: 401;
        InvalidAppData: 402;
        NotYourTurn: 403;
        ChannelClosed: 404;
    };
    PushMessage: {
        WrongParticipant: 900;
    };
    CreateChannel: {
        SigningAddressNotFound: 1000;
        InvalidAppDefinition: 1001;
        UnsupportedToken: 1002;
    };
    JoinChannel: {
        ChannelNotFound: 1100;
        InvalidTransition: 1101;
    };
    GetState: {
        ChannelNotFound: 1200;
    };
    ChallengeChannel: {
        ChannelNotFound: 1300;
    };
};
//# sourceMappingURL=error-codes.d.ts.map