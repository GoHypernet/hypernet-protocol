import {
  InsuranceResolver,
  InsuranceState,
  MessageResolver,
  MessageState,
  ParameterizedResolver,
  ParameterizedState,
} from "@objects/typing";
import { IFullTransferState } from "@objects/vector";

export class SortedTransfers {
  constructor(
    public offerTransfers: IFullTransferState<MessageState, MessageResolver>[],
    public insuranceTransfers: IFullTransferState<
      InsuranceState,
      InsuranceResolver
    >[],
    public parameterizedTransfers: IFullTransferState<
      ParameterizedState,
      ParameterizedResolver
    >[],
    public pullRecordTransfers: IFullTransferState<
      MessageState,
      MessageResolver
    >[],
  ) {}
}
