import {BigNumber} from '..';

export enum WithdrawalState {
    PENDING_INITIALIZATION = 0, //the default value when one is not set
    CLOSING_AUTHORIZED, // provider authorized consume rto close channel
    PENDING_CHANNEL_CLOSING_TX, // channel closing tx has been sent and needs to be mined
    PENDING_WITHDRAWAL_TX, // provider withdrawal tx has been sent and needs to be mined
    CLOSING_MINED, // Channel closing has been mined
    WITHDRAWAL_MINED, // Provider Withdrawal has been mined
    PROVIDER_WITHDRAWAL_MINED // Provider either closed or withdrawn from the channel, which the consumer can't know yet
}

export class NewWithdrawal {
    constructor(public channelId: number, public amount: BigNumber, public state: number, public minedBlock: number) {}
}

export class Withdrawal extends NewWithdrawal {
    constructor(public id: number, channelId: number, amount: BigNumber, state: number, minedBlock: number) {
        super(channelId, amount, state, minedBlock);
        id = -1;
    }
}
