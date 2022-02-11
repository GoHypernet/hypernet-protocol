import {
  RegistryFactoryContractError,
  RegistryName,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import {
  ILogUtils,
  ILogUtilsType,
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ResultUtils,
} from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IContextProvider, IContextProviderType } from "@interfaces/utilities";
import { IRegistryUtils } from "@interfaces/data/utilities";
import {
  IRegistryFactoryContractFactory,
  IRegistryFactoryContractFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class RegistryUtils implements IRegistryUtils {
  protected registryNameAddressMap: Map<RegistryName, EthereumContractAddress> =
    new Map();
  protected initializedPromiseResolved: boolean;
  protected waitInitializedPromise: Promise<void>;
  protected initializePromiseResolve: (() => void) | null;

  constructor(
    @inject(IRegistryFactoryContractFactoryType)
    protected registryFactoryContractFactory: IRegistryFactoryContractFactory,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {
    this.initializedPromiseResolved = false;
    this.initializePromiseResolve = null;
    this.waitInitializedPromise = new Promise((resolve) => {
      this.initializePromiseResolve = resolve;
    });
  }

  public initializeRegistryNameAddresses(): ResultAsync<
    Map<RegistryName, EthereumContractAddress>,
    RegistryFactoryContractError
  > {
    if (this.initializedPromiseResolved === true) {
      return okAsync(this.registryNameAddressMap);
    }
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.registryFactoryContractFactory.factoryRegistryFactoryContract(),
    ]).andThen(([context, registryFactoryContract]) => {
      const registryNames = context.governanceChainInformation.registryNames;

      const registryNameList: RegistryName[] = [];
      const registryAddressListResult: ResultAsync<
        EthereumContractAddress,
        RegistryFactoryContractError
      >[] = [];
      for (const name in registryNames) {
        const registryName = RegistryName(registryNames[name]);

        registryNameList.push(registryName);

        registryAddressListResult.push(
          registryFactoryContract.nameToAddress(registryName),
        );
      }

      return ResultUtils.combine(registryAddressListResult).andThen(
        (addresses) => {
          addresses.forEach((address, index) => {
            this.registryNameAddressMap.set(registryNameList[index], address);
          });

          this.initializedPromiseResolved = true;
          if (this.initializePromiseResolve != null) {
            this.initializePromiseResolve();
          }
          return okAsync(this.registryNameAddressMap);
        },
      );
    });
  }

  public getRegistryNameAddresses(): ResultAsync<
    Map<RegistryName, EthereumContractAddress>,
    never
  > {
    if (this.initializedPromiseResolved === true) {
      return okAsync(this.registryNameAddressMap);
    }

    return ResultAsync.fromSafePromise<void, never>(
      this.waitInitializedPromise,
    ).map(() => {
      return this.registryNameAddressMap;
    });
  }

  public getRegistryNameAddress(
    registryName: RegistryName,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError> {
    return this.getRegistryNameAddresses().andThen((registryNameAddressMap) => {
      const registryAddress = registryNameAddressMap.get(registryName);

      if (registryAddress == null) {
        return errAsync(
          new RegistryFactoryContractError(
            `Registry address for registry name ${registryName} not found`,
          ),
        );
      }

      return okAsync(registryAddress);
    });
  }
}
