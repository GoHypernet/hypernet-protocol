import { mock, instance } from "ts-mockito";

import { IAccountsRepository } from "@interfaces/data";
import { IBlockchainProvider, IBrowserNodeProvider, IVectorUtils, ILogUtils } from "@interfaces/utilities";
import { AccountsRepository } from "@implementations/data/AccountsRepository";
import { BrowserNode } from "@connext/vector-browser-node";
import { INodeService } from "@connext/vector-types";

// normal ts-mock "when" function won't work (issue: https://github.com/NagRock/ts-mockito/issues/209) that's why we had to write a different implementation here
jest.mock("@connext/vector-browser-node");

BrowserNode.prototype.getStateChannel = jest.fn();
BrowserNode.prototype.reconcileDeposit = jest.fn();
BrowserNode.prototype.withdraw = jest.fn();

export default class AccountsRepositoryMocks {
  public blockchainProvider: IBlockchainProvider = mock<IBlockchainProvider>();
  public vectorUtils: IVectorUtils = mock<IVectorUtils>();
  public browserNodeProvider: IBrowserNodeProvider = mock<IBrowserNodeProvider>();
  public logUtils: ILogUtils = mock<ILogUtils>();
  public browserNode = BrowserNode;

  public getBlockchainProviderFactory(): IBlockchainProvider {
    return instance(this.blockchainProvider);
  }

  public getVectorUtilsFactory(): IVectorUtils {
    return instance(this.vectorUtils);
  }

  public getBrowserNodeProviderFactory(): IBrowserNodeProvider {
    return instance(this.browserNodeProvider);
  }

  public getLogUtilsFactory(): ILogUtils {
    return instance(this.logUtils);
  }

  public getBrowserNodeFactory(): BrowserNode {
    const browserNodeInstance = new (BrowserNode as any)() as BrowserNode;
    return browserNodeInstance;
  }

  public getServiceFactory(): IAccountsRepository {
    return new AccountsRepository(
      this.getBlockchainProviderFactory(),
      this.getVectorUtilsFactory(),
      this.getBrowserNodeProviderFactory(),
      this.getLogUtilsFactory(),
    );
  }
}
