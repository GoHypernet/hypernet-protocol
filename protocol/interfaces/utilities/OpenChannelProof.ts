import {EIP712Message, BigNumber} from '..';

export class OpenChannelMessage implements EIP712Message {
    constructor(
        public provider: string,
        public consumer: string,
        public paymentToken: string,
        public feeAddress: string,
        public feePercentage: number,
        public channelBalance: string, //needs to be a string to be signed
        public challengePeriod: number,
        public expiration: number,
        public providerSalt: string
    ) {}
}

export class OpenChannelProof extends OpenChannelMessage {
    constructor(
        public provider: string,
        public consumer: string,
        public paymentToken: string,
        public feeAddress: string,
        public feePercentage: number,
        public channelBalance: string, //needs to be a string to be signed
        public challengePeriod: number,
        public expiration: number,
        public providerSalt: string,
        public providerSignature: string
    ) {
        super(
            provider,
            consumer,
            paymentToken,
            feeAddress,
            feePercentage,
            channelBalance,
            challengePeriod,
            expiration,
            providerSalt
        );
    }
}

export class CreateChannelRequest {
    constructor(
        public provider: string,
        public tokenAddress: string,
        public consumerBalance: BigNumber,
        public challengePeriod: number | null = null
    ) {}
}

export class GenerateOpenChannelProofRequest {
    constructor(
        public provider: string,
        public consumer: string,
        public tokenAddress: string,
        public consumerBalance: BigNumber,
        public challengePeriod: number | undefined | null
    ) {}
}
