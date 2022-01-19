import { NonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/governance-sdk";
import {
  GatewayUrl,
  NonFungibleRegistryContractError,
  PublicIdentifier,
  RouterDetails,
  RouterSupportedToken,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IRouterRepository } from "@interfaces/data";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";

@injectable()
export class RouterRepository implements IRouterRepository {
  protected routerRegistrationInfoMap: Map<PublicIdentifier, RouterDetails>;

  constructor(
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.routerRegistrationInfoMap = new Map();
  }

  public getRouterDetails(
    publicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    Map<PublicIdentifier, RouterDetails>,
    NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).andThen(([context, provider]) => {
      const returnInfo = new Map<PublicIdentifier, RouterDetails>();
      const newRouterResults = new Array<
        ResultAsync<void, NonFungibleRegistryContractError>
      >();

      const routerRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          context.governanceChainInformation.liquidityRegistryAddress,
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
