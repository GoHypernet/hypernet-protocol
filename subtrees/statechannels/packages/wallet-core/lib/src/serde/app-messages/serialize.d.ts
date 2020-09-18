import { Allocations as AppAllocations, DomainBudget as AppDomainBudget, ChannelResult } from '@statechannels/client-api-schema';
import { Allocation, DomainBudget, SignedState, ChannelConstants } from '../../types';
export declare function serializeDomainBudget(budget: DomainBudget): AppDomainBudget;
export declare function serializeAllocation(allocation: Allocation): AppAllocations;
declare type ChannelStoreEntry = {
    supported: SignedState;
    latest: SignedState;
    channelConstants: ChannelConstants;
    channelId: string;
    hasConclusionProof: boolean;
    isSupported: boolean;
};
export declare function serializeChannelEntry(channelEntry: ChannelStoreEntry): ChannelResult;
export {};
//# sourceMappingURL=serialize.d.ts.map