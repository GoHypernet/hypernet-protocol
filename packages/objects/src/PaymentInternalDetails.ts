export class PaymentInternalDetails {
  constructor(
    public offerTransferId: string,
    public insuranceTransferId: string | null | undefined,
    public parameterizedTransferId: string | null | undefined,
    public pullTransferIds: string[],
  ) {}
}
