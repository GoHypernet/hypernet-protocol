import { SignedState, Message } from '@statechannels/wallet-core';
export declare const message: (props?: Partial<Message> | undefined) => Message;
declare type WithState = {
    signedStates: SignedState[];
};
export declare function messageWithState(props?: Partial<Message>): Message & WithState;
export {};
//# sourceMappingURL=messages.d.ts.map