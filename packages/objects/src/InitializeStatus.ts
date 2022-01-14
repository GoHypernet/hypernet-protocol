export class InitializeStatus {
  constructor(
    public blockchainProviderInitialized: boolean,
    public registriesInitialized: boolean,
    public governanceInitialized: boolean,
    public paymentsInitialized: boolean,
  ) {}
}
