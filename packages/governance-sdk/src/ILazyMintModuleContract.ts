import {
  LazyMintModuleContractError,
  Signature,
  EthereumContractAddress,
  RegistryTokenId,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export interface ILazyMintModuleContract {
  lazyRegister(
    registryAddress: EthereumContractAddress,
    signature: Signature,
    tokenId: RegistryTokenId,
    chainId: Number,
    nonce: Number,
    ownerAddress: EthereumAccountAddress,
    registrationData: string,
    overrides?: ContractOverrides,
  ): ResultAsync<void, LazyMintModuleContractError>;
}

export const ILazyMintModuleContractType = Symbol.for(
  "ILazyMintModuleContract",
);
