import {BigNumber, EIP712Message} from '..';

export class ChannelPayment implements EIP712Message {
    constructor(
        public purpose: string,
        public consumer: string,
        public provider: string,
        public paymentToken: string,
        public providerBalance: string, // needs to be a string to be signed
        public openBlock: number // | BigNumber | string;
    ) {}
}

export class NewPayment {
    constructor(
        public uuid: string,
        public purpose: string,
        public consumer: string,
        public provider: string,
        public tokenAddress: string,
        public providerBalance: BigNumber, // | BigNumber | string,
        public amount: BigNumber,
        public openBlock: number, // | BigNumber | string,
        public consumerSignature: string // | null
    ) {}
}

export class Payment extends NewPayment {
    constructor(
        public id: number,
        public channelId: number,
        uuid: string,
        purpose: string,
        consumer: string,
        provider: string,
        tokenAddress: string,
        providerBalance: BigNumber, // | BigNumber | string,
        amount: BigNumber,
        openBlock: number, // | BigNumber | string,
        consumerSignature: string // | null
    ) {
        super(uuid, purpose, consumer, provider, tokenAddress, providerBalance, amount, openBlock, consumerSignature);
    }
}
