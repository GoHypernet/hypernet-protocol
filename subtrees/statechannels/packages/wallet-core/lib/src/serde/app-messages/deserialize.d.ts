import { Allocations as AppAllocations, DomainBudget as AppDomainBudget, ApproveBudgetAndFundParams as AppBudgetRequest } from '@statechannels/client-api-schema';
import { Allocation, DomainBudget } from '../../types';
export declare function deserializeBudgetRequest(budgetRequest: AppBudgetRequest, domain: string): DomainBudget;
export declare function deserializeDomainBudget(DomainBudget: AppDomainBudget): DomainBudget;
export declare function deserializeAllocations(allocations: AppAllocations): Allocation;
//# sourceMappingURL=deserialize.d.ts.map