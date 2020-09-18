import { Participant, Address, Uint256, DomainBudget } from '../data-types';
import { JsonRpcRequest, JsonRpcResponse } from '../jsonrpc-header-types';
export interface ApproveBudgetAndFundParams {
    hub: Participant;
    playerParticipantId: string;
    token: Address;
    requestedSendCapacity: Uint256;
    requestedReceiveCapacity: Uint256;
}
export declare type ApproveBudgetAndFundRequest = JsonRpcRequest<'ApproveBudgetAndFund', ApproveBudgetAndFundParams>;
export declare type ApproveBudgetAndFundResponse = JsonRpcResponse<DomainBudget>;
//# sourceMappingURL=ApproveBudgetAndFund.d.ts.map