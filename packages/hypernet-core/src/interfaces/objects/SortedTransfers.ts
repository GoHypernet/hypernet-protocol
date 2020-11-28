import { FullTransferState } from "@connext/vector-types";
import { IHypernetTransferMetadata } from "./HypernetTransferMetadata";

export class SortedTransfers {
  constructor(
    public offerTransfer: FullTransferState,
    public insuranceTransfer: FullTransferState | null,
    public parameterizedTransfer: FullTransferState | null,
    public pullRecordTransfers: FullTransferState[],
    public metadata: IHypernetTransferMetadata,
  ) {}
}
