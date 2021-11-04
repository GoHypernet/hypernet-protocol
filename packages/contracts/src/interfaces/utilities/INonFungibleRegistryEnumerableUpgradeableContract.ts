import { ethers, BigNumber } from "ethers";

import {
  NonFungibleRegistryEnumerableUpgradeableContractError,
  EthereumAddress,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface INonFungibleRegistryEnumerableUpgradeableContract {
  initializeContract(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | undefined,
    contractAddress: EthereumAddress,
  ): void;
  getContractAddress(): EthereumAddress;
  getRegistrarRoleMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  getRegistrarRoleMember(
    index: number,
  ): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  getRegistrarRoleAdminMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  getRegistrarRoleAdminMember(
    index: number,
  ): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  name(): ResultAsync<
    string,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  symbol(): ResultAsync<
    string,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  totalSupply(): ResultAsync<
    number,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  allowLazyRegister(): ResultAsync<
    boolean,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  allowStorageUpdate(): ResultAsync<
    boolean,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  allowLabelChange(): ResultAsync<
    boolean,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  allowTransfers(): ResultAsync<
    boolean,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  registrationToken(): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  registrationFee(): ResultAsync<
    BigNumberString,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  burnAddress(): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  burnFee(): ResultAsync<
    number,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  primaryRegistry(): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  tokenByIndex(
    index: number,
  ): ResultAsync<number, NonFungibleRegistryEnumerableUpgradeableContractError>;
  reverseRegistryMap(
    tokenId: number,
  ): ResultAsync<string, NonFungibleRegistryEnumerableUpgradeableContractError>;
  ownerOf(
    tokenId: number,
  ): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryEnumerableUpgradeableContractError
  >;
  tokenURI(
    tokenId: number,
  ): ResultAsync<string, NonFungibleRegistryEnumerableUpgradeableContractError>;
  updateRegistration(
    tokenId: number,
    registrationData: string,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  updateLabel(
    tokenId: number,
    label: string,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  transferFrom(
    tokenId: number,
    ownerAddress: EthereumAddress,
    toAddress: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  burn(
    tokenId: number,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  setRegistryParameters(
    params: string,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  registerByToken(
    recipientAddress: EthereumAddress,
    label: string,
    data: string,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  register(
    recipientAddress: EthereumAddress,
    label: string,
    data: string,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  grantRole(
    address: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  revokeRole(
    address: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
  renounceRole(
    address: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryEnumerableUpgradeableContractError>;
}

export const INonFungibleRegistryEnumerableUpgradeableContractType = Symbol.for(
  "INonFungibleRegistryEnumerableUpgradeableContract",
);
