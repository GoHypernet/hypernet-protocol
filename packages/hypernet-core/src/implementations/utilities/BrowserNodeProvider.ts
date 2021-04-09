import { NonEIP712Message } from "@connext/vector-browser-node";
import {
  IBrowserNode,
  IContextProvider,
  ILogUtils,
  IBrowserNodeProvider,
  IConfigProvider,
  IBlockchainProvider,
} from "@interfaces/utilities";
import { BlockchainUnavailableError, EthereumAddress, VectorError } from "@hypernetlabs/objects";
import { HypernetConfig } from "@hypernetlabs/objects";
import { ResultUtils, ILocalStorageUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNodeResult: ResultAsync<IBrowserNode, VectorError | BlockchainUnavailableError> | null = null;
  protected browserNode: IBrowserNode = {} as IBrowserNode;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
    protected storageUtils: ILocalStorageUtils,
    protected browserNodeFactory: IBrowserNodeFactory,
  ) {}

  protected initialize(): ResultAsync<IBrowserNode, VectorError | BlockchainUnavailableError> {
    if (this.browserNodeResult == null) {
      let config: HypernetConfig;
      let signer: ethers.providers.JsonRpcSigner;
      let account: string;

      this.browserNodeResult = ResultUtils.combine([
        this.configProvider.getConfig(),
        this.blockchainProvider.getSigner(),
        this.contextProvider.getAccount(),
        this.browserNodeFactory.factoryBrowserNode(),
      ])
        .andThen((vals) => {
          [config, signer, account, this.browserNode] = vals;

          // Check if the user has a signature in local storage for this account
          const storedSignature = this.storageUtils.getSessionItem(`account-${account}-signature`);

          if (storedSignature != null) {
            return okAsync<string[], BlockchainUnavailableError>([account, storedSignature]);
          }

          return ResultUtils.combine([
            ResultAsync.fromPromise(signer.getAddress(), (e) => {
              return e as BlockchainUnavailableError;
            }),
            ResultAsync.fromPromise(signer.signMessage(NonEIP712Message), (e) => {
              return e as BlockchainUnavailableError;
            }),
          ]);
        })
        .andThen((vals) => {
          const [address, signature] = vals;

          // Store the signature so you don't have to sign again
          this.storageUtils.setSessionItem(`account-${address}-signature`, signature);

          return this.browserNode.init(signature, EthereumAddress(account));
        })
        .orElse((e) => {
          const shouldAttemptRestore = ((e as any).context?.validationError ?? "").includes("Channel is already setup");

          if (shouldAttemptRestore && this.browserNode != null) {
            return this.browserNode
              .getStateChannelByParticipants(config.routerPublicIdentifier, config.chainId)
              .andThen((channelState) => {
                if (channelState == null && this.browserNode != null) {
                  return this.browserNode.restoreState(config.routerPublicIdentifier, config.chainId);
                }
                return okAsync<void, VectorError>(undefined);
              });
          } else {
            return errAsync(e);
          }
        })
        .map(() => this.browserNode);
    }
    return this.browserNodeResult as ResultAsync<IBrowserNode, VectorError | BlockchainUnavailableError>;
  }
  public getBrowserNode(): ResultAsync<IBrowserNode, VectorError | BlockchainUnavailableError> {
    return this.initialize();
  }
}
