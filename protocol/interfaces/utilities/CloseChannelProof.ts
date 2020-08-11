import {EIP712Message, BigNumber} from '..';

export interface ConsumerSignature extends EIP712Message {
    consumerSignature: string;
}

export class ClosingProof {
    constructor(
        public providerSignature: string,
        public consumerSignature: string,
        public purpose: string,
        public provider: string,
        public consumer: string,
        public tokenAddress: string,
        public providerBalance: BigNumber,
        public openBlock: number
    ) {}
}
