export class InitializeStatus {
  constructor(
    public blockchainProviderInitialized: boolean,
    public paymentsInitialized: boolean,
    public governanceInitialized: boolean,
  ) {}
}
