/**
 * @packageDocumentation Defines and validates the data types communicated between an app and a wallet
 *
 * @remarks
 * Also exposes functions that can validate messages (Requests, Responses, Notifications and Error Responses), as well as to cast them as the correct Type.
 *
 * Example request:
 * ```json
 * {
 *   "jsonrpc": "2.0",
 *   "method": "PushMessage",
 *   "id": 1,
 *   "params": {
 *     "recipient": "user123",
 *     "sender": "user456",
 *     "data": "0x123.."
 *   }
 * }
 * ```
 *
 * Example response:
 *
 * ```json
 * {
 *   "jsonrpc": "2.0",
 *   "id": 1,
 *   "result": {"success": true}
 * }
 * ```
 */


/**
 * Ethereum Address
 * @pattern  ^0x([a-fA-F0-9]{40})|0$
 */
export declare type Address = string;

/**
 * Array of destination-amount pairings for a given token
 */
export declare interface Allocation {
    /**
     * The token contract address
     */
    token: Address;
    /**
     * Array of destination-amount pairings
     */
    allocationItems: AllocationItem[];
}

/**
 * Assigns some amount of an unspecified asset to a destination
 */
export declare interface AllocationItem {
    /**
     * Address of EOA to receive channel proceeds.
     */
    destination: Address;
    /**
     * How much funds will be transferred to the destination address.
     */
    amount: Uint256;
}

/**
 * Included for backwards compatibility
 */
export declare type Allocations = Allocation[];

export declare interface ApproveBudgetAndFundParams {
    hub: Participant;
    playerParticipantId: string;
    token: Address;
    requestedSendCapacity: Uint256;
    requestedReceiveCapacity: Uint256;
}

export declare type ApproveBudgetAndFundRequest = JsonRpcRequest<'ApproveBudgetAndFund', ApproveBudgetAndFundParams>;

export declare type ApproveBudgetAndFundResponse = JsonRpcResponse<DomainBudget>;

export declare type BudgetUpdatedNotification = JsonRpcNotification<'BudgetUpdated', DomainBudget>;

/**
 * Bytes32
 * @pattern  ^0x([a-fA-F0-9]{64})$
 */
export declare type Bytes32 = string;

export declare type ChallengeChannelError = ChannelNotFound_5;

export declare interface ChallengeChannelParams {
    channelId: ChannelId;
}

export declare type ChallengeChannelRequest = JsonRpcRequest<'ChallengeChannel', ChallengeChannelParams>;

export declare type ChallengeChannelResponse = JsonRpcResponse<ChannelResult>;

export declare interface ChannelBudget {
    channelId: Bytes32;
    amount: Uint256;
}

export declare type ChannelClosed = JsonRpcError<ErrorCodes_3['ChannelClosed'], 'Channel closed'>;

export declare type ChannelClosingNotification = JsonRpcNotification<'ChannelClosed', ChannelResult>;

/**
 * Nitro ChannelId
 * @pattern  ^0x([a-fA-F0-9]{64})$
 */
export declare type ChannelId = string;

export declare type ChannelNotFound = JsonRpcError<ErrorCodes_3['ChannelNotFound'], 'Channel not found'>;

declare type ChannelNotFound_2 = JsonRpcError<ErrorCodes_2['ChannelNotFound'], 'Channel not found'>;

declare type ChannelNotFound_3 = JsonRpcError<ErrorCodes_5['ChannelNotFound'], 'Could not find channel'>;

declare type ChannelNotFound_4 = JsonRpcError<ErrorCodes_6['ChannelNotFound'], 'Could not find channel'>;

declare type ChannelNotFound_5 = JsonRpcError<ErrorCodes_8['ChannelNotFound'], 'Could not find channel'>;

export declare type ChannelProposedNotification = JsonRpcNotification<'ChannelProposed', ChannelResult>;

export declare interface ChannelResult {
    participants: Participant[];
    allocations: Allocation[];
    appData: string;
    appDefinition: Address;
    channelId: ChannelId;
    status: ChannelStatus;
    turnNum: Uint48;
    challengeExpirationTime?: number;
}

export declare type ChannelStatus = 'proposed' | 'opening' | 'funding' | 'running' | 'challenging' | 'responding' | 'closing' | 'closed';

export declare type ChannelUpdatedNotification = JsonRpcNotification<'ChannelUpdated', ChannelResult>;

export declare type CloseAndWithdrawError = JsonRpcError<ErrorCodes['CloseAndWithdraw']['UserDeclined'], 'User declined'>;

export declare interface CloseAndWithdrawParams {
    hubParticipantId: string;
}

export declare type CloseAndWithdrawRequest = JsonRpcRequest<'CloseAndWithdraw', CloseAndWithdrawParams>;

export declare type CloseAndWithdrawResponse = JsonRpcResponse<{
    success: boolean;
}>;

export declare type CloseChannelError = NotYourTurn_2 | ChannelNotFound_2;

export declare interface CloseChannelParams {
    channelId: ChannelId;
}

export declare type CloseChannelRequest = JsonRpcRequest<'CloseChannel', CloseChannelParams>;

export declare type CloseChannelResponse = JsonRpcResponse<ChannelResult>;

export declare type CreateChannelError = SigningAddressNotFound | InvalidAppDefinition | UnsupportedToken;

export declare interface CreateChannelParams {
    participants: Participant[];
    allocations: Allocation[];
    appDefinition: Address;
    appData: string;
    fundingStrategy: FundingStrategy;
}

export declare type CreateChannelRequest = JsonRpcRequest<'CreateChannel', CreateChannelParams>;

export declare type CreateChannelResponse = JsonRpcResponse<ChannelResult>;

export declare interface DomainBudget {
    domain: string;
    hubAddress: string;
    budgets: TokenBudget[];
}

export declare type EnableEthereumError = JsonRpcError<ErrorCodes['EnableEthereum']['EthereumNotEnabled'], 'Ethereum Not Enabled'>;

export declare type EnableEthereumRequest = JsonRpcRequest<'EnableEthereum', {}>;

export declare type EnableEthereumResponse = JsonRpcResponse<{
    signingAddress: Address;
    destinationAddress: Address;
    walletVersion: string;
}>;

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

declare type ErrorCodes_2 = ErrorCodes['CloseChannel'];

declare type ErrorCodes_3 = ErrorCodes['UpdateChannel'];

declare type ErrorCodes_4 = ErrorCodes['PushMessage'];

declare type ErrorCodes_5 = ErrorCodes['JoinChannel'];

declare type ErrorCodes_6 = ErrorCodes['GetState'];

declare type ErrorCodes_7 = ErrorCodes['CreateChannel'];

declare type ErrorCodes_8 = ErrorCodes['ChallengeChannel'];

/**
 * Nitro ChannelId
 * @pattern  ^0x(0{24})([a-fA-F0-9]{40})$
 */
export declare type ExternalDestination = string;

declare type FilterByMethod<T, Method> = T extends {
    method: Method;
} ? T : never;

export declare type FundingStrategy = 'Direct' | 'Ledger' | 'Virtual';

export declare interface Funds {
    token: Address;
    amount: Uint256;
}

declare type GenericError = JsonRpcError<500, 'Wallet error'>;

export declare interface GetBudgetParams {
    hubParticipantId: string;
}

export declare type GetBudgetRequest = JsonRpcRequest<'GetBudget', GetBudgetParams>;

export declare type GetBudgetResponse = JsonRpcResponse<DomainBudget | {}>;

export declare interface GetChannelsParams {
    includeClosed?: boolean;
}

export declare type GetChannelsRequest = JsonRpcRequest<'GetChannels', {
    includeClosed?: boolean;
}>;

export declare type GetChannelsResponse = JsonRpcResponse<ChannelResult[]>;

export declare type GetStateError = ChannelNotFound_4;

export declare interface GetStateParams {
    channelId: ChannelId;
}

export declare type GetStateRequest = JsonRpcRequest<'GetState', GetStateParams>;

export declare type GetStateResponse = JsonRpcResponse<ChannelResult>;

export declare type GetWalletInformationRequest = JsonRpcRequest<'GetWalletInformation', {}>;

export declare type GetWalletInformationResponse = JsonRpcResponse<{
    signingAddress: Address;
    destinationAddress: Address | undefined;
    walletVersion: string;
}>;

export declare type InvalidAppData = JsonRpcError<ErrorCodes_3['InvalidAppData'], 'Invalid app data', {
    appData: string;
}>;

declare type InvalidAppDefinition = JsonRpcError<ErrorCodes_7['InvalidAppDefinition'], 'Invalid App Definition'>;

export declare type InvalidTransition = JsonRpcError<ErrorCodes_3['InvalidTransition'], 'Invalid transition', {
    channelStatus: ChannelStatus;
    proposedUpdate: UpdateChannelParams;
}>;

declare type InvalidTransition_2 = JsonRpcError<ErrorCodes_5['InvalidTransition'], 'Invalid Transition'>;

/**
 * Type guard for {@link JsonRpcErrorResponse | JsonRpcErrorResponse}
 *
 * @returns true if the message is a JSON-RPC error response, false otherwise
 * @beta
 */
export declare function isJsonRpcErrorResponse<Code extends number, Message, Data = undefined>(message: object): message is JsonRpcErrorResponse<JsonRpcError<Code, Message, Data>>;

/**
 * Type guard for {@link JsonRpcNotification | JsonRpcNotification}
 *
 * @returns true if the message is a JSON-RPC notification, false otherwise
 * @beta
 */
export declare function isJsonRpcNotification<Name extends string, Params extends object>(message: object): message is JsonRpcNotification<Name, Params>;

/**
 * Type guard for {@link JsonRpcRequest | JsonRpcRequest}
 *
 * @returns true if the message is a JSON-RPC request, false otherwise
 * @beta
 */
export declare function isJsonRpcRequest(message: any): message is JsonRpcRequest;

/**
 * Type guard for {@link JsonRpcResponse| JsonRpcResponse}
 *
 * @returns true if the message is a JSON-RPC response, false otherwis
 * @beta
 */
export declare function isJsonRpcResponse<ResponseType = object>(message: object): message is JsonRpcResponse<ResponseType>;

export declare function isStateChannelsErrorResponse(message: StateChannelsJsonRpcMessage): message is StateChannelsErrorResponse;

export declare function isStateChannelsNotification(message: StateChannelsJsonRpcMessage): message is StateChannelsNotification;

export declare function isStateChannelsRequest(message: StateChannelsJsonRpcMessage): message is StateChannelsRequest;

export declare function isStateChannelsResponse(message: StateChannelsJsonRpcMessage): message is StateChannelsResponse;

export declare type JoinChannelError = ChannelNotFound_3 | InvalidTransition_2;

export declare interface JoinChannelParams {
    channelId: ChannelId;
}

export declare type JoinChannelRequest = JsonRpcRequest<'JoinChannel', JoinChannelParams>;

export declare type JoinChannelResponse = JsonRpcResponse<ChannelResult>;

/**
 * Specifies error object as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export declare interface JsonRpcError<Code extends number, Message, Data = undefined> {
    /**
     * Error code
     */
    code: Code;
    /**
     * Error message
     */
    message: Message;
    /**
     * Error data
     */
    data?: Data;
}

/**
 * Specifies response headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export declare interface JsonRpcErrorResponse<Error = any> {
    /**
     * Identifier for the response
     * @remarks Matches that of a request
     */
    id: number;
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * The generic type of the response
     */
    error: Error;
}

/**
 * Specifies notification headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 *
 * @remarks
 * Note one difference to the JSON-RPC spec is that notifications originate from the wallet (i.e. the Server, not the Client).
 *
 * @beta
 */
export declare interface JsonRpcNotification<NotificationName extends string, NotificationParams extends object> {
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * Generic type of the Notification name
     */
    method: NotificationName;
    /**
     * Generic type of the Notification parameters
     */
    params: NotificationParams;
}

/**
 * Specifies request headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export declare interface JsonRpcRequest<MethodName = string, RequestParams = object> {
    /**
     * Identifier for the resquest
     *
     * @remarks To be matched in a response
     */
    id: number;
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * Generic type of the request method
     */
    method: MethodName;
    /**
     * Request parameters
     */
    params: RequestParams;
}

/**
 * Specifies response headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export declare interface JsonRpcResponse<ResponseType = object> {
    /**
     * Identifier for the response
     * @remarks Matches that of a request
     */
    id: number;
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * The generic type of the response
     */
    result: ResponseType;
}

/**
 * Format of message sent from the wallet to the app
 *
 * @remarks The app relays it to another participant.
 */
export declare interface Message {
    /**
     * Identifier of user that the message should be relayed to
     */
    recipient: string;
    /**
     * Identifier of user that the message is from
     */
    sender: string;
    /**
     * Message payload. Format defined by wallet and opaque to app.
     */
    data: unknown;
}

export declare type MessageQueuedNotification = JsonRpcNotification<'MessageQueued', Message>;

export declare type NotYourTurn = JsonRpcError<ErrorCodes_3['NotYourTurn'], 'Not your turn'>;

declare type NotYourTurn_2 = JsonRpcError<ErrorCodes_2['NotYourTurn'], 'Not your turn'>;

declare type NotYourTurn_3 = JsonRpcError<ErrorCodes_4['WrongParticipant'], 'Wrong participant'>;

/**
 * Validates an error response against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsErrorResponse}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseErrorResponse(jsonBlob: object): StateChannelsErrorResponse;

/**
 * Validates a notification against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsNotification}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseNotification(jsonBlob: object): StateChannelsNotification;

/**
 * Validates a request against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsRequest}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseRequest(jsonBlob: object): StateChannelsRequest;

/**
 * Validates a response against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsResponse}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseResponse(jsonBlob: object): StateChannelsResponse;

/**
 * Container for data specific to a single state channel participant
 */
export declare interface Participant {
    /**
     * App allocated id, used for relaying messages to the participant
     */
    participantId: string;
    /**
     * Address used to sign channel updates
     */
    signingAddress: Address;
    /**
     * Address of EOA to receive channel proceeds (the account that'll get the funds).
     */
    destination: Address;
}

export declare type PushMessageError = NotYourTurn_3;

export declare type PushMessageParams = PushMessageRequest['params'];

export declare type PushMessageRequest = JsonRpcRequest<'PushMessage', Message>;

export declare type PushMessageResponse = JsonRpcResponse<PushMessageResult>;

export declare type PushMessageResult = {
    success: boolean;
};

declare type SigningAddressNotFound = JsonRpcError<ErrorCodes_7['SigningAddressNotFound'], 'Could not find signing address'>;

export declare type StateChannelsError = EnableEthereumError | CloseAndWithdrawError | CloseChannelError | UpdateChannelError | PushMessageError | JoinChannelError | GetStateError | CreateChannelError | ChallengeChannelError | PushMessageError | GenericError;

export declare type StateChannelsErrorResponse = JsonRpcErrorResponse<StateChannelsError>;

export declare type StateChannelsJsonRpcMessage = StateChannelsRequest | StateChannelsResponse | StateChannelsNotification | StateChannelsErrorResponse;

export declare type StateChannelsNotification = ChannelProposedNotification | ChannelUpdatedNotification | ChannelClosingNotification | BudgetUpdatedNotification | MessageQueuedNotification | UiNotification | WalletReady;

export declare type StateChannelsNotificationType = {
    [T in StateChannelsNotification['method']]: [FilterByMethod<StateChannelsNotification, T>['params']];
};

export declare type StateChannelsRequest = CreateChannelRequest | JoinChannelRequest | UpdateChannelRequest | GetWalletInformationRequest | EnableEthereumRequest | GetStateRequest | PushMessageRequest | ChallengeChannelRequest | GetBudgetRequest | ApproveBudgetAndFundRequest | CloseChannelRequest | CloseAndWithdrawRequest | GetChannelsRequest;

export declare type StateChannelsResponse = CreateChannelResponse | JoinChannelResponse | UpdateChannelResponse | GetWalletInformationResponse | EnableEthereumResponse | GetStateResponse | PushMessageResponse | ChallengeChannelResponse | GetBudgetResponse | CloseChannelResponse | ApproveBudgetAndFundResponse | CloseAndWithdrawResponse | GetChannelsResponse;

export declare interface TokenBudget {
    token: Address;
    availableReceiveCapacity: Uint256;
    availableSendCapacity: Uint256;
    channels: ChannelBudget[];
}

export declare type UiNotification = JsonRpcNotification<'UIUpdate', {
    showWallet: boolean;
}>;

/**
 * Uint256
 * @pattern  ^0x([a-fA-F0-9]{64})$
 */
export declare type Uint256 = string;

export declare type Uint48 = number;

declare type UnsupportedToken = JsonRpcError<ErrorCodes_7['UnsupportedToken'], 'This token is not supported'>;

export declare type UpdateChannelError = ChannelNotFound | InvalidTransition | InvalidAppData | NotYourTurn | ChannelClosed;

export declare interface UpdateChannelParams {
    channelId: ChannelId;
    allocations: Allocation[];
    appData: string;
}

export declare type UpdateChannelRequest = JsonRpcRequest<'UpdateChannel', UpdateChannelParams>;

export declare type UpdateChannelResponse = JsonRpcResponse<ChannelResult>;

export declare type WalletReady = JsonRpcNotification<'WalletReady', {}>;

export { }
