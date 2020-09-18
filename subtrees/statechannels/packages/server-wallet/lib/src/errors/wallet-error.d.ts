export declare type Values<E> = E[keyof E];
export declare abstract class WalletError extends Error {
    readonly data: any;
    static readonly errors: {
        readonly ChannelError: "ChannelError";
        readonly JoinChannelError: "JoinChannelError";
        readonly CloseChannelError: "CloseChannelError";
        readonly UpdateChannelError: "UpdateChannelError";
        readonly NonceError: "NonceError";
        readonly StoreError: "StoreError";
        readonly OnchainError: "OnchainError";
    };
    abstract readonly type: Values<typeof WalletError.errors>;
    static readonly reasons: {
        [key: string]: string;
    };
    constructor(reason: Values<typeof WalletError.reasons>, data?: any);
}
export declare function isWalletError(error: any): error is WalletError;
//# sourceMappingURL=wallet-error.d.ts.map