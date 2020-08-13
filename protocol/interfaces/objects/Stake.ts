import {BigNumber} from "@interfaces/objects";

export class NewStake {
    constructor(public amount: BigNumber, public type: 'deposit' | 'withdrawal', public state: string) {}
}

export class Stake extends NewStake {
    constructor(
        public id: number,
        public type: 'deposit' | 'withdrawal',
        public amount: BigNumber,
        public state: string,
        public minedBlock: number
    ) {
        super(amount, type, state);
    }
}
