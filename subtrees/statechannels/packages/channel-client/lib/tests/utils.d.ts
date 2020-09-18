import { Participant, Allocation, ChannelStatus, ChannelResult } from '@statechannels/client-api-schema';
import { FakeBrowserChannelProvider } from './fakes/fake-browser-channel-provider';
export declare function setProviderStates(providers: FakeBrowserChannelProvider[], state: ChannelResult): void;
export declare class ChannelResultBuilder {
    private channelResult;
    constructor(participants: Participant[], allocations: Allocation[], appDefinition: string, appData: string, channelId: string, turnNum: number, status: ChannelStatus);
    static from(channelResult: ChannelResult): ChannelResultBuilder;
    build(): ChannelResult;
    setStatus(status: ChannelStatus): ChannelResultBuilder;
    static setStatus(channelResult: ChannelResult, status: ChannelStatus): ChannelResult;
    setTurnNum(turnNum: number): ChannelResultBuilder;
    static setTurnNum(channelResult: ChannelResult, turnNum: number): ChannelResult;
    setAppData(appData: string): ChannelResultBuilder;
    static setAppData(channelResult: ChannelResult, appData: string): ChannelResult;
}
export declare function buildParticipant(address: string): Participant;
export declare function buildAllocation(destination: string, amount: string, token?: string): Allocation;
//# sourceMappingURL=utils.d.ts.map