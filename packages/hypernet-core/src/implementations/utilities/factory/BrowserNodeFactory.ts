import { BrowserNode } from "@connext/vector-browser-node";
import { ChainProviders, ContractAddresses } from "@connext/vector-types";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { WrappedBrowserNode } from "@implementations/utilities";
import {
  IChainInformationUtils,
  IChainInformationUtilsType,
} from "@interfaces/data/utilities";
import {
  IBrowserNode,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";

@injectable()
export class BrowserNodeFactory implements IBrowserNodeFactory {
  constructor(
    @inject(IChainInformationUtilsType)
    protected chainInformationUtils: IChainInformationUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public factoryBrowserNode(): ResultAsync<IBrowserNode, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.chainInformationUtils.getChainInformation(),
    ]).map(([config, chainInformation]) => {
      this.logUtils.debug("Creating BrowserNode");

      // We need to map the chain information into a list of chain providers
      const chainProviders = chainInformation.reduce((prev, cur) => {
        prev[cur.chainId] = cur.providerUrls[0];
        return prev;
      }, {} as ChainProviders);

      // Now we need to map the chain addresses
      const chainAddresses = chainInformation.reduce((prev, cur) => {
        prev[cur.chainId] = {
          channelFactoryAddress: cur.channelFactoryAddress,
          transferRegistryAddress: cur.transferRegistryAddress,
        };

        return prev;
      }, {} as ContractAddresses);

      // Create the browser node
      const vectorBrowserNode = new BrowserNode({
        logger: this.logUtils.getPino(),
        iframeSrc: config.iframeSource,
        chainProviders: chainProviders,
        chainAddresses: chainAddresses,
        natsUrl: config.natsUrl,
        authUrl: config.authUrl,
      });

      // Stick it in a wrapper
      return new WrappedBrowserNode(vectorBrowserNode);
    });
  }
}
