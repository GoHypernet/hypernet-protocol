import { ChainInformation } from "@hypernetlabs/objects";
import { IChainInformationRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IChainInformationUtils,
  IChainInformationUtilsType,
} from "@interfaces/data/utilities";

/**
 * This class is just a wrapper around ChainInformationUtils, which is actually a repository....
 * This just keeps the layer model consistent. ChainInformation is needed by a lot of other
 * repositories, so it needs to be in a lower layer, but it is also needed at higher layers,
 * which should consume a repository directly and not from the Data Utilities layer.
 */
@injectable()
export class ChainInformationRepository implements IChainInformationRepository {
  protected chainInfo: ChainInformation[] = [];
  protected governanceChainInfo: ChainInformation = {} as ChainInformation;

  constructor(
    @inject(IChainInformationUtilsType)
    protected chainInfoUtils: IChainInformationUtils,
  ) {}

  public getChainInformation(): ResultAsync<ChainInformation[], never> {
    return this.chainInfoUtils.getChainInformation();
  }

  public getGovernanceChainInformation(): ResultAsync<ChainInformation, never> {
    return this.chainInfoUtils.getGovernanceChainInformation();
  }
}
