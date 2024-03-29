import { NonEIP712Message } from "@connext/vector-browser-node";
import {
  BlockchainUnavailableError,
  EthereumAccountAddress,
  Signature,
  VectorError,
} from "@hypernetlabs/objects";
import {
  ILogUtils,
  ResultUtils,
  ILocalStorageUtils,
} from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBrowserNode,
  IContextProvider,
  IBrowserNodeProvider,
  IConfigProvider,
  IBlockchainProvider,
} from "@interfaces/utilities";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNodeResult: ResultAsync<
    IBrowserNode,
    VectorError | BlockchainUnavailableError
  > | null = null;
  protected browserNode: IBrowserNode = {} as IBrowserNode;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
    protected localStorageUtils: ILocalStorageUtils,
    protected browserNodeFactory: IBrowserNodeFactory,
  ) {}

  protected initialize(): ResultAsync<
    IBrowserNode,
    VectorError | BlockchainUnavailableError
  > {
    if (this.browserNodeResult != null) {
      return this.browserNodeResult;
    }

    this.browserNodeResult = ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getSigner(),
      this.contextProvider.getAccount(),
      this.browserNodeFactory.factoryBrowserNode(),
    ]).andThen((vals) => {
      const [config, signer, account, browserNode] = vals;
      this.browserNode = browserNode;

      // Check if the user has a signature in local storage for this account
      const storedSignature = this.localStorageUtils.getSessionItem(
        `account-${account}-signature`,
      );

      let signatureResult: ResultAsync<string, BlockchainUnavailableError>;

      if (storedSignature != null) {
        signatureResult = okAsync<string, BlockchainUnavailableError>(
          storedSignature,
        );
      } else {
        signatureResult = ResultAsync.fromPromise(
          signer.signMessage(NonEIP712Message),
          (e) => {
            return e as BlockchainUnavailableError;
          },
        );
      }

      return signatureResult
        .andThen((signature) => {
          const sigAddress = ethers.utils.verifyMessage(
            NonEIP712Message,
            signature,
          );

          // Store the signature so you don't have to sign again
          this.localStorageUtils.setSessionItem(
            `account-${account}-signature`,
            signature,
          );
          this.logUtils.debug(
            `Initializing browser node with account ${account} and signature ${signature}`,
          );
          return this.browserNode.init(
            Signature(signature),
            EthereumAccountAddress(account),
          );
        })
        .map(() => {
          this.logUtils.debug("Successfully started Vector browser node");
          return this.browserNode;
        });
    });

    return this.browserNodeResult;
  }

  public getBrowserNode(): ResultAsync<
    IBrowserNode,
    VectorError | BlockchainUnavailableError
  > {
    return this.initialize();
  }
}
