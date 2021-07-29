import { IHypernetOfferDetails } from "./HypernetOfferDetails";

import {
  InsuranceState,
  MessageState,
  ParameterizedState,
} from "@objects/typing";
import { IFullTransferState } from "@objects/vector";

export class SortedTransfers {
  constructor(
    public offerTransfers: IFullTransferState<MessageState>[],
    public insuranceTransfers: IFullTransferState<InsuranceState>[],
    public parameterizedTransfers: IFullTransferState<ParameterizedState>[],
    public pullRecordTransfers: IFullTransferState<MessageState>[],
  ) {}
}
