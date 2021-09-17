import {
  BlockchainUnavailableError,
  GatewayUrl,
  PublicIdentifier,
  RouterDetails,
  SupportedToken,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IRouterRepository } from "@interfaces/data";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";

@injectable()
export class RouterRepository implements IRouterRepository {
  constructor(
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getRouterDetails(
    publicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    Map<PublicIdentifier, RouterDetails>,
    BlockchainUnavailableError
  > {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const liquidityRegistryAddress =
          config.chainAddresses[config.governanceChainId]
            ?.liquidityRegistryAddress;
        if (liquidityRegistryAddress == null) {
          return errAsync<RouterDetails[], BlockchainUnavailableError>(
            new BlockchainUnavailableError(
              `Unable to getRouterDetails for chain ${config.governanceChainId}. No configuration info for that chain is available`,
            ),
          );
        }

        return ResultUtils.combine(
          publicIdentifiers.map((publicIdentifier) => {
            return this.blockchainUtils
              .getERC721Entry<IRouterDetailsEntry>(
                liquidityRegistryAddress,
                publicIdentifier,
              )
              .map((registryEntry) => {
                return new RouterDetails(
                  publicIdentifier,
                  registryEntry.supportedTokens,
                  registryEntry.allowedGateways,
                );
              });
          }),
        );
      })
      .map((routerDetails) => {
        return new Map(
          routerDetails.map((routerDetail) => [
            routerDetail.publicIdentifier,
            routerDetail,
          ]),
        );
      });
  }
}

interface IRouterDetailsEntry {
  supportedTokens: SupportedToken[];
  allowedGateways: GatewayUrl[];
}
