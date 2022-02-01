import { ChainId } from "@objects/ChainId";

export class InitializeStatus {
  constructor(
    public blockchainProviderInitialized: Map<ChainId, boolean>,
    public registriesInitialized: Map<ChainId, boolean>,
    public governanceInitialized: Map<ChainId, boolean>,
    public paymentsInitialized: Map<ChainId, boolean>,
  ) {}
}
