import { TransferId } from "@objects/TransferId";
export class PaymentInternalDetails {
  constructor(
    public offerTransferId: TransferId,
    public insuranceTransferId: TransferId | null | undefined,
    public parameterizedTransferId: TransferId | null | undefined,
    public pullTransferIds: TransferId[],
  ) {}
}
