import { JsonRpcRequest, JsonRpcResponse } from '../jsonrpc-header-types';
import { DomainBudget } from '../data-types';
export interface GetBudgetParams {
    hubParticipantId: string;
}
export declare type GetBudgetRequest = JsonRpcRequest<'GetBudget', GetBudgetParams>;
export declare type GetBudgetResponse = JsonRpcResponse<DomainBudget | {}>;
//# sourceMappingURL=GetBudget.d.ts.map