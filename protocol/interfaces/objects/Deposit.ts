import {BigNumber} from '..';
import * from moment;

export enum DepositState {
    PENDING_INITIALIZATION = 0, //the default value when one is not set
    PENDING_PROVIDER_AUTH, // when the consumer sent a deposit request to the provider, or the for the provider when they haven't answered yet
    DEPOSIT_AUTHORIZED, // when the provider responded and the consumer can send the tx
    PENDING_DEPOSIT_TX, // when the tx has been submitted by the consumer
    DEPOSIT_TX_FAILURE, // when there was an error in the deposit blockchain submission
    MINED // Deposit mined
}

export class Deposit {
    constructor(
        public channelId: string,
        public depositAmount: BigNumber,
        public state: number,
        public timestamp: moment.Moment
    ) {}
}
