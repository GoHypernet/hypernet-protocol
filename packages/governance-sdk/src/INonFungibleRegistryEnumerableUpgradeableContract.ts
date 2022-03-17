import {
  NonFungibleRegistryContractError,
  EthereumContractAddress,
  EthereumAccountAddress,
  BigNumberString,
  RegistryTokenId,
  RegistryEntry,
  TransactionNotImplementedError,
  TransactionServerError,
  TransactionTimeoutError,
  TransactionUnknownError,
  TransactionUnsupportedOperationError,
} from "@hypernetlabs/objects";
import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export interface INonFungibleRegistryEnumerableUpgradeableContract {
  getContractAddress(): EthereumContractAddress;
  getRegistrarRoleMember(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress[], NonFungibleRegistryContractError>;
  getRegistrarRoleAdminMember(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress[], NonFungibleRegistryContractError>;
  name(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  symbol(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  totalSupply(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError>;
  allowStorageUpdate(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<boolean, NonFungibleRegistryContractError>;
  allowLabelChange(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<boolean, NonFungibleRegistryContractError>;
  allowTransfers(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<boolean, NonFungibleRegistryContractError>;
  registrationToken(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, NonFungibleRegistryContractError>;
  registrationFee(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<BigNumberString, NonFungibleRegistryContractError>;
  registrationFeeBigNumber(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<BigNumber, NonFungibleRegistryContractError>;
  burnAddress(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError>;
  burnFee(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError>;
  primaryRegistry(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, NonFungibleRegistryContractError>;
  tokenByIndex(
    index: number,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError>;
  registryMap(
    label: string,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError>;
  reverseRegistryMap(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  ownerOf(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError>;
  tokenURI(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  updateRegistration(
    tokenId: RegistryTokenId,
    registrationData: string,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  updateLabel(
    tokenId: RegistryTokenId,
    label: string,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  transferFrom(
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    toAddress: EthereumAccountAddress,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  burn(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  setRegistryParameters(
    params: string,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  registerByToken(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string | null,
    tokenId: RegistryTokenId,
    transactionCallback?:
      | ((transaction: ethers.providers.TransactionResponse) => void)
      | null,
    overrides?: ContractOverrides | null,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  register(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string | null,
    tokenId: RegistryTokenId,
    transactionCallback?:
      | ((transaction: ethers.providers.TransactionResponse) => void)
      | null,
    overrides?: ContractOverrides | null,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  registerAsync(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string | null,
    tokenId: RegistryTokenId,
    overrides?: ContractOverrides | null,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    | TransactionNotImplementedError
    | TransactionServerError
    | TransactionTimeoutError
    | TransactionUnknownError
    | TransactionUnsupportedOperationError
    | NonFungibleRegistryContractError
  >;
  registerByTokenAsync(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string | null,
    tokenId: RegistryTokenId,
    overrides?: ContractOverrides | null,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    | TransactionNotImplementedError
    | TransactionServerError
    | TransactionTimeoutError
    | TransactionUnknownError
    | TransactionUnsupportedOperationError
    | NonFungibleRegistryContractError
  >;
  grantRole(
    address: EthereumAccountAddress | EthereumContractAddress,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  revokeRole(
    address: EthereumAccountAddress | EthereumContractAddress,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  renounceRole(
    address: EthereumAccountAddress | EthereumContractAddress,
    registryAddress?: EthereumContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  getRegistryEntryByTokenId(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError>;
  getRegistryEntryByLabel(
    label: string,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError>;
  tokenOfOwnerByIndex(
    ownerAddress: EthereumAccountAddress,
    index: number,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError>;
  getRegistryEntryByOwnerAddress(
    ownerAddress: EthereumAccountAddress,
    index: number,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry | null, NonFungibleRegistryContractError>;
  balanceOf(
    address: EthereumAccountAddress,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError>;
  getFirstRegistryEntryByOwnerAddress(
    ownerAddress: EthereumAccountAddress,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry | null, NonFungibleRegistryContractError>;
  baseURI(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
}

export const INonFungibleRegistryEnumerableUpgradeableContractType = Symbol.for(
  "INonFungibleRegistryEnumerableUpgradeableContract",
);
