export class NewEvent {
    constructor(public state: string, public blockNumber: number, public logIndex: number) {}
}

export class Event extends NewEvent {
    constructor(public id: number, state: string, blockNumber: number, logIndex: number) {
        super(state, blockNumber, logIndex);
    }
}
