import {EIP712Message} from '..';

export class DepositFundsMessage implements EIP712Message {
    constructor(
        public provider: string,
        public consumer: string,
        public paymentToken: string,
        public depositAmount: string, //needs to be a string to be signed
        public openBlock: number,
        public expiration: number,
        public providerSalt: string
    ) {}
}
export class DepositFundsProof extends DepositFundsMessage {
    constructor(
        public provider: string,
        public consumer: string,
        public paymentToken: string,
        public depositAmount: string, //needs to be a string to be signed
        public openBlock: number,
        public expiration: number,
        public providerSalt: string,
        public providerSignature: string
    ) {
        super(provider, consumer, paymentToken, depositAmount, openBlock, expiration, providerSalt);
    }
}

export type GenerateDepositFundsMessage = Omit<DepositFundsMessage, 'expiration' | 'providerSalt'>; //Omit<Omit<DepositFundsMessage, 'expiration'>, 'providerSalt'>;
