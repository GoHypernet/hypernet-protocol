import {
  IRegistryFactoryContract,
  RegistryFactoryContract,
} from "@hypernetlabs/governance-sdk";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { IRegistryFactoryContractFactory } from "@interfaces/utilities/factory";
import { ResultUtils } from "@hypernetlabs/utils";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";

@injectable()
export class RegistryFactoryContractFactory
  implements IRegistryFactoryContractFactory
{
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
  ) {}

  public factoryRegistryFactoryContract(): ResultAsync<
    IRegistryFactoryContract,
    never
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).map(([context, provider]) => {
      return new RegistryFactoryContract(
        provider,
        context.governanceChainInformation.registryFactoryAddress,
      );
    });
  }
}
