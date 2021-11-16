import { NonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/contracts";
import {
  BlockchainUnavailableError,
  GatewayUrl,
  NonFungibleRegistryContractError,
  PublicIdentifier,
  RouterDetails,
  RouterSupportedToken,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IRouterRepository } from "@interfaces/data";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import {
  IChainInformationUtils,
  IChainInformationUtilsType,
} from "@interfaces/data/utilities";
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
  protected routerRegistrationInfoMap: Map<PublicIdentifier, RouterDetails>;

  constructor(
    @inject(IChainInformationUtilsType)
    protected chainInformationUtils: IChainInformationUtils,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {
    this.routerRegistrationInfoMap = new Map();
  }

  public getRouterDetails(
    publicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    Map<PublicIdentifier, RouterDetails>,
    BlockchainUnavailableError | NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.chainInformationUtils.getGovernanceChainInformation(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).andThen(([governanceChainInformation, provider]) => {
      if (governanceChainInformation.liquidityRegistryAddress == null) {
        return errAsync<
          Map<PublicIdentifier, RouterDetails>,
          BlockchainUnavailableError
        >(
          new BlockchainUnavailableError(
            `Unable to getRouterDetails for chain ${governanceChainInformation.chainId}. No configuration info for that chain is available`,
          ),
        );
      }

      const returnInfo = new Map<PublicIdentifier, RouterDetails>();
      const newRouterResults = new Array<
        ResultAsync<void, NonFungibleRegistryContractError>
      >();

      const routerRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          governanceChainInformation.liquidityRegistryAddress,
        );

      // Check for entries that are already cached.
      for (const publicIdentifier of publicIdentifiers) {
        const cachedRegistration =
          this.routerRegistrationInfoMap.get(publicIdentifier);
        if (cachedRegistration != null) {
          returnInfo.set(publicIdentifier, cachedRegistration);
        } else {
          // We need to get the registration info that's not in the cache
          newRouterResults.push(
            routerRegistryContract
              .getRegistryEntryByLabel(publicIdentifier)
              .map((registryEntry) => {
                if (registryEntry.tokenURI == null) {
                  throw new Error(
                    `Invalid registry entry in Liquidity Providers registry. Entry for ${publicIdentifier} has no tokenURI`,
                  );
                }
                const parsedEntry = JSON.parse(
                  registryEntry.tokenURI,
                ) as IRouterDetailsEntry;

                const routerDetails = new RouterDetails(
                  publicIdentifier,
                  parsedEntry.supportedTokens,
                  parsedEntry.allowedGateways,
                );

                // Set it into the return info
                returnInfo.set(publicIdentifier, routerDetails);
                this.routerRegistrationInfoMap.set(
                  publicIdentifier,
                  routerDetails,
                );
              }),
          );
        }
      }

      // Wait for all the new results, and return the final list
      return ResultUtils.combine(newRouterResults).map(() => {
        return returnInfo;
      });
    });
  }
}

interface IRouterDetailsEntry {
  supportedTokens: RouterSupportedToken[];
  allowedGateways: GatewayUrl[];
}
