import {
  BlockchainUnavailableError,
  NonFungibleRegistryContractError,
  ChainId,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInjectedProviderService {
  setupInjectedProvider(): ResultAsync<
    void,
    BlockchainUnavailableError | NonFungibleRegistryContractError
  >;
  switchNetwork(
    chainId: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError>;
}

export const IInjectedProviderServiceType = Symbol.for(
  "IInjectedProviderService",
);
