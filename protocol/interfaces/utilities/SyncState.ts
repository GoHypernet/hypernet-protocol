export class SyncState {
    constructor(
        public networkId: number, //networkId
        public block: number,
        public userAddress: string,
        public hypernetContractAddress: string
    ) {}
}
