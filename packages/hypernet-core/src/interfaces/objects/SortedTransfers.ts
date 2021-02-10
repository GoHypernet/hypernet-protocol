import { InsuranceState, MessageState, ParameterizedState } from "@interfaces/types";
import { IFullTransferState } from "@interfaces/utilities";
import { IHypernetOfferDetails } from "./HypernetOfferDetails";

export class SortedTransfers {
  constructor(
    public offerTransfer: IFullTransferState<MessageState>,
    public insuranceTransfer: IFullTransferState<InsuranceState> | null,
    public parameterizedTransfer: IFullTransferState<ParameterizedState> | null,
    public pullRecordTransfers: IFullTransferState[],
    public offerDetails: IHypernetOfferDetails,
  ) {}
}
