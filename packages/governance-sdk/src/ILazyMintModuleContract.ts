import {
  LazyMintModuleContractError,
  Signature,
  EthereumContractAddress,
  RegistryTokenId,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILazyMintModuleContract {
  lazyRegister(
    registryAddress: EthereumContractAddress,
    signature: Signature,
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    registrationData: string,
  ): ResultAsync<void, LazyMintModuleContractError>;
}

export const ILazyMintModuleContractType = Symbol.for(
  "ILazyMintModuleContract",
);
