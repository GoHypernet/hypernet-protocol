import {BigNumber} from '..';

export enum ChannelState {
    PENDING_INITIALIZATION = 0, //the default value when one is not set
    OPEN, //the channel is open and ready to send payments in
    CLOSED, //the channel is closed and cannot be used
    PENDING_PROVIDER_OPEN_AUTH, //the channel has been recorded and is now pending authorization
    PROVIDER_APPROVED_CHANNEL_OPENING, //the provider has approved the channel's creation
    PENDING_OPEN_CHANNEL_TRANSACTION, //the channel is awaiting creation via a transaction
    OPEN_CHANNEL_TRANSACTION_SUBMITTED, //the transaction to create a channel has been submitted
    OPEN_CHANNEL_TRANSACTION_FAILURE, //the transaction to create a channel has failed
    PENDING_PROVIDER_CLOSING_AUTH, //the channel is waiting for a closing proof from the provider
    PROVIDER_REJECTED_CLOSING_AUTH, //the provider rejected closing the channel cooperatively
    PROVIDER_APPROVED_CLOSING_AUTH, //the provider has approved channel closure
    PENDING_CLOSE_TRANSACTION, //the transaction to close the channel has been submitted
    CLOSE_TRANSACTION_FAILURE, //the transaction to close a channel has failed
    PENDING_CHALLENGE_TRANSACTION, //the transaction to challenge the channel has been submitted
    CHALLENGE_TRANSACTION_FAILURE, //the transaction to challenge a channel has failed
    CONSUMER_WITHDRAW_TRANSACTION_SUBMITTED, //the transaction to withdraw funds after winning a challenge has been submitted
    CONSUMER_WITHDRAW_TRANSACTION_FAILURE //the transaction to withdraw funds has failed
}


export interface NitroChannel {
    channelNonce: Uint48;
    participants: Address[];
    chainId: Uint256;
  }

  export interface NitroState {
    turnNum: number; // TODO: This should maybe be a string b/c it is uint256 in solidity
    isFinal: boolean;
    channel: Channel;
    challengeDuration: number;
    outcome: Outcome;
    appDefinition: string;
    appData: string;
  }

export class NewChannel {
    constructor(
        public multihash: string,
        public provider: string,
        public consumer: string,
        public tokenAddress: string,
        public openBlock: number,
        public challengePeriod: number | null,
        public lockedBalance: BigNumber,
        public providerBalance: BigNumber,
        public consumerBalance: BigNumber,
        public withdrawnBalance: BigNumber,
        public key: string | null,
        public state: ChannelState
    ) {}
}

export class Channel extends NewChannel {
    constructor(
        public id: number,
        multihash: string,
        provider: string,
        consumer: string,
        tokenAddress: string,
        openBlock: number,
        challengePeriod: number | null,
        lockedBalance: BigNumber,
        providerBalance: BigNumber,
        consumerBalance: BigNumber,
        withdrawnBalance: BigNumber,
        key: string | null,
        state: ChannelState
    ) {
        super(
            multihash,
            provider,
            consumer,
            tokenAddress,
            openBlock,
            challengePeriod,
            lockedBalance,
            providerBalance,
            consumerBalance,
            withdrawnBalance,
            key,
            state
        );
    }
}
