import {
  BlockchainUnavailableError,
  NonFungibleRegistryContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInjectedProviderService {
  setupInjectedProvider(): ResultAsync<
    void,
    BlockchainUnavailableError | NonFungibleRegistryContractError
  >;
}

export const IInjectedProviderServiceType = Symbol.for(
  "IInjectedProviderService",
);
