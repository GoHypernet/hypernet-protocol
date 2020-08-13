import {BigNumber} from '..';

import {EChannelState} from "@interfaces/types";

export class HypernetChannel {
    constructor(
        public consumer: Address,
        public provider: Address,
        public paymentToken: Address,
        public consumerTotalDeposit: BigNumber,
        public consumerBalance: BigNumber,
        public providerBalance: BigNumber,
        public providerStake: BigNumber,
        public state: EChannelState,
        public internalChannelId: Optional<string>
    ) {}

    public get id() {

    }
}
