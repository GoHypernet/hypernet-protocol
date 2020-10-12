import { ChannelResult, DomainBudget, Message, ErrorCodes, Allocation, PushMessageResult, Participant, FundingStrategy } from '@statechannels/client-api-schema';
import { ChannelProviderInterface } from '@statechannels/iframe-channel-provider';
import { ReplaySubject } from 'rxjs';
/**
 * @beta
 */
export declare type TokenAllocations = Allocation[];
/**
 * @beta
 */
export declare type UnsubscribeFunction = () => void;
/**
 * @beta
 */
export interface ChannelClientInterface {
    onMessageQueued: (callback: (message: Message) => void) => UnsubscribeFunction;
    onChannelUpdated: (callback: (result: ChannelResult) => void) => UnsubscribeFunction;
    onChannelProposed: (callback: (result: ChannelResult) => void) => UnsubscribeFunction;
    provider: ChannelProviderInterface;
    channelState: ReplaySubject<ChannelResult>;
    walletVersion?: string;
    signingAddress?: string;
    destinationAddress?: string;
    pushMessage: (message: Message) => Promise<PushMessageResult>;
    createChannel: (participants: Participant[], allocations: Allocation[], appDefinition: string, appData: string, fundingStrategy: FundingStrategy) => Promise<ChannelResult>;
    joinChannel: (channelId: string) => Promise<ChannelResult>;
    updateChannel: (channelId: string, allocations: Allocation[], appData: string) => Promise<ChannelResult>;
    getState: (channelId: string) => Promise<ChannelResult>;
    challengeChannel: (channelId: string) => Promise<ChannelResult>;
    closeChannel: (channelId: string) => Promise<ChannelResult>;
    getChannels(includeClosed: boolean): Promise<ChannelResult[]>;
}
/**
 * @beta
 */
export interface BrowserChannelClientInterface extends ChannelClientInterface {
    onBudgetUpdated: (callback: (result: DomainBudget) => void) => UnsubscribeFunction;
    approveBudgetAndFund(playerAmount: string, hubAmount: string, hubAddress: string, hubOutcomeAddress: string): Promise<DomainBudget>;
    closeAndWithdraw(hubParticipantId: string): Promise<DomainBudget | {}>;
    getBudget(hubAddress: string): Promise<DomainBudget | {}>;
}
export interface EventsWithArgs {
    MessageQueued: [Message];
    ChannelUpdated: [ChannelResult];
    ChannelProposed: [ChannelResult];
}
/**
 * @beta
 */
export declare const ErrorCode: ErrorCodes;
//# sourceMappingURL=types.d.ts.map