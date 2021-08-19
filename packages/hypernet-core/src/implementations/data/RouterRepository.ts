import {
  BlockchainUnavailableError,
  GatewayUrl,
  PersistenceError,
  PublicIdentifier,
  RouterDetails,
  SupportedToken,
  TransferAbis,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IRouterRepository } from "@interfaces/data";
import { Contract } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";

@injectable()
export class RouterRepository implements IRouterRepository {
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getRouterDetails(
    publicIdentifiers: PublicIdentifier[],
  ): ResultAsync<Map<PublicIdentifier, RouterDetails>, PersistenceError> {
    return ResultUtils.combine([
      this.blockchainProvider.getGovernanceProvider(),
      this.configProvider.getConfig(),
    ])
      .andThen((vals) => {
        const [provider, config] = vals;

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

        const liquidityRegistryContract = new Contract(
          liquidityRegistryAddress,
          TransferAbis.LiquidityRegistry.abi,
          provider,
        );

        return ResultUtils.combine(
          publicIdentifiers.map((publicIdentifier) => {
            return ResultAsync.fromPromise(
              liquidityRegistryContract.getLiquidity(
                publicIdentifier,
              ) as Promise<string>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Cannot get gateway registry entry",
                  e,
                );
              },
            ).map((registryString) => {
              const registryEntry = JSON.parse(
                registryString,
              ) as IRouterDetailsEntry;

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
