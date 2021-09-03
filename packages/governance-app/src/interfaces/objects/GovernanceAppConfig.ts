import { EthereumAddress, ChainId } from "@hypernetlabs/objects";

export type ChainProviders = {
  [chainId: number]: string;
};

export class GovernanceAppConfig {
  constructor(
    public chainProviders: ChainProviders,
    public chainAddresses: HypernetChainAddresses,
    public governanceChainId: ChainId,
    public infuraId: string,
    public debug: boolean,
  ) {}
}

export class HypernetChainAddresses {
  [chainId: number]: HypernetContractAddresses | null;
}

export class HypernetContractAddresses {
  constructor(
    public hypertokenAddress: EthereumAddress,
    public hypernetGovernorAddress: EthereumAddress,
  ) {}
}
