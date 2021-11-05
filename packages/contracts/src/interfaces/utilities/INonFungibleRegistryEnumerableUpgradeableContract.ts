import { ethers, BigNumber } from "ethers";

import {
  NonFungibleRegistryContractError,
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
    NonFungibleRegistryContractError
  >;
  getRegistrarRoleMember(
    index: number,
  ): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryContractError
  >;
  getRegistrarRoleAdminMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  >;
  getRegistrarRoleAdminMember(
    index: number,
  ): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryContractError
  >;
  name(): ResultAsync<
    string,
    NonFungibleRegistryContractError
  >;
  symbol(): ResultAsync<
    string,
    NonFungibleRegistryContractError
  >;
  totalSupply(): ResultAsync<
    number,
    NonFungibleRegistryContractError
  >;
  allowLazyRegister(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  >;
  allowStorageUpdate(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  >;
  allowLabelChange(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  >;
  allowTransfers(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  >;
  registrationToken(): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryContractError
  >;
  registrationFee(): ResultAsync<
    BigNumberString,
    NonFungibleRegistryContractError
  >;
  burnAddress(): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryContractError
  >;
  burnFee(): ResultAsync<
    number,
    NonFungibleRegistryContractError
  >;
  primaryRegistry(): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryContractError
  >;
  tokenByIndex(
    index: number,
  ): ResultAsync<number, NonFungibleRegistryContractError>;
  reverseRegistryMap(
    tokenId: number,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  ownerOf(
    tokenId: number,
  ): ResultAsync<
    EthereumAddress,
    NonFungibleRegistryContractError
  >;
  tokenURI(
    tokenId: number,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  updateRegistration(
    tokenId: number,
    registrationData: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  updateLabel(
    tokenId: number,
    label: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  transferFrom(
    tokenId: number,
    ownerAddress: EthereumAddress,
    toAddress: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  burn(
    tokenId: number,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  setRegistryParameters(
    params: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  registerByToken(
    recipientAddress: EthereumAddress,
    label: string,
    data: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  register(
    recipientAddress: EthereumAddress,
    label: string,
    data: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  grantRole(
    address: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  revokeRole(
    address: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  renounceRole(
    address: EthereumAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
}

export const INonFungibleRegistryEnumerableUpgradeableContractType = Symbol.for(
  "INonFungibleRegistryEnumerableUpgradeableContract",
);
