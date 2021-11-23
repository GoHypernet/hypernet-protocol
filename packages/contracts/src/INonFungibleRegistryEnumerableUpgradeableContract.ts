import {
  NonFungibleRegistryContractError,
  EthereumContractAddress,
  EthereumAccountAddress,
  BigNumberString,
  RegistryTokenId,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface INonFungibleRegistryEnumerableUpgradeableContract {
  getContractAddress(): EthereumContractAddress;
  getRegistrarRoleMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  >;
  getRegistrarRoleMember(
    index?: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError>;
  getRegistrarRoleAdminMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  >;
  getRegistrarRoleAdminMember(
    index?: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError>;
  name(): ResultAsync<string, NonFungibleRegistryContractError>;
  symbol(): ResultAsync<string, NonFungibleRegistryContractError>;
  totalSupply(): ResultAsync<number, NonFungibleRegistryContractError>;
  allowStorageUpdate(): ResultAsync<boolean, NonFungibleRegistryContractError>;
  allowLabelChange(): ResultAsync<boolean, NonFungibleRegistryContractError>;
  allowTransfers(): ResultAsync<boolean, NonFungibleRegistryContractError>;
  registrationToken(): ResultAsync<
    EthereumContractAddress,
    NonFungibleRegistryContractError
  >;
  registrationFee(): ResultAsync<
    BigNumberString,
    NonFungibleRegistryContractError
  >;
  burnAddress(): ResultAsync<
    EthereumAccountAddress,
    NonFungibleRegistryContractError
  >;
  burnFee(): ResultAsync<number, NonFungibleRegistryContractError>;
  primaryRegistry(): ResultAsync<
    EthereumContractAddress,
    NonFungibleRegistryContractError
  >;
  tokenByIndex(
    index: number,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError>;
  registryMap(
    label: string,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError>;
  reverseRegistryMap(
    tokenId: RegistryTokenId,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  ownerOf(
    tokenId: RegistryTokenId,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError>;
  tokenURI(
    tokenId: RegistryTokenId,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  updateRegistration(
    tokenId: RegistryTokenId,
    registrationData: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  updateLabel(
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  transferFrom(
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    toAddress: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  burn(
    tokenId: RegistryTokenId,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  setRegistryParameters(
    params: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  registerByToken(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  register(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  grantRole(
    address: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  revokeRole(
    address: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  renounceRole(
    address: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  getRegistryEntryByTokenId(
    tokenId: RegistryTokenId,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError>;
  getRegistryEntryByLabel(
    label: string,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError>;
}

export const INonFungibleRegistryEnumerableUpgradeableContractType = Symbol.for(
  "INonFungibleRegistryEnumerableUpgradeableContract",
);
