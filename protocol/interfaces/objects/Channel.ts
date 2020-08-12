import {BigNumber} from '..';

import {EChannelState} from "@interfaces/types";

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
        public state: EChannelState
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
        state: EChannelState
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
