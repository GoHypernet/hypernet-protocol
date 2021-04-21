import { InsuranceState, MessageState, ParameterizedState } from "@objects/types";
import { IFullTransferState } from "@objects/vector";

import { IHypernetOfferDetails } from "./HypernetOfferDetails";

export class SortedTransfers {
  constructor(
    public offerTransfer: IFullTransferState<MessageState>,
    public insuranceTransfer: IFullTransferState<InsuranceState> | null,
    public parameterizedTransfer: IFullTransferState<ParameterizedState> | null,
    public pullRecordTransfers: IFullTransferState<MessageState>[],
    public offerDetails: IHypernetOfferDetails,
  ) {}
}
