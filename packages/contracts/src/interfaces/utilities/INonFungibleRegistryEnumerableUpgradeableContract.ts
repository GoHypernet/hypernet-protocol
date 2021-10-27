import {
  NonFungibleRegistryContractError,
  EthereumContractAddress,
  EthereumAccountAddress,
  BigNumberString,
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
  allowLazyRegister(): ResultAsync<boolean, NonFungibleRegistryContractError>;
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
  ): ResultAsync<number, NonFungibleRegistryContractError>;
  reverseRegistryMap(
    tokenId: number,
  ): ResultAsync<string, NonFungibleRegistryContractError>;
  ownerOf(
    tokenId: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError>;
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
    ownerAddress: EthereumAccountAddress,
    toAddress: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  burn(tokenId: number): ResultAsync<void, NonFungibleRegistryContractError>;
  setRegistryParameters(
    params: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  registerByToken(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string,
  ): ResultAsync<void, NonFungibleRegistryContractError>;
  register(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string,
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
}

export const INonFungibleRegistryEnumerableUpgradeableContractType = Symbol.for(
  "INonFungibleRegistryEnumerableUpgradeableContract",
);
