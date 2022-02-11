import {
  BlockchainUnavailableError,
  PersistenceError,
  RegistryFactoryContractError,
  RegistryName,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryUtils {
  initializeRegistryNameAddresses(): ResultAsync<
    Map<RegistryName, EthereumContractAddress>,
    RegistryFactoryContractError
  >;
  getRegistryNameAddresses(): ResultAsync<
    Map<RegistryName, EthereumContractAddress>,
    never
  >;
  getRegistryNameAddress(
    registryName: RegistryName,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError>;
}

export const IRegistryUtilsType = Symbol.for("IRegistryUtils");
