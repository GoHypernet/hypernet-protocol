import { NonEIP712Message } from "@connext/vector-browser-node";
import {
  IBrowserNode,
  IContextProvider,
  ILogUtils,
  IBrowserNodeProvider,
  IConfigProvider,
  IBlockchainProvider,
} from "@interfaces/utilities";
import { BlockchainUnavailableError, CoreUninitializedError, VectorError } from "@hypernetlabs/objects";
import { HypernetConfig, HypernetContext } from "@hypernetlabs/objects";
import { ResultUtils, ILocalStorageUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

type BrowserNodeInitializationError = VectorError | CoreUninitializedError | BlockchainUnavailableError;

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNodeResult: ResultAsync<IBrowserNode, BrowserNodeInitializationError> | null = null;
  protected browserNode: IBrowserNode = {} as IBrowserNode;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
    protected storageUtils: ILocalStorageUtils,
    protected browserNodeFactory: IBrowserNodeFactory,
  ) {}

  protected initialize(): ResultAsync<IBrowserNode, BrowserNodeInitializationError> {
    if (this.browserNodeResult == null) {
      let config: HypernetConfig;
      let signer: ethers.providers.JsonRpcSigner;
      let context: HypernetContext;

      this.browserNodeResult = ResultUtils.combine([
        this.configProvider.getConfig(),
        this.blockchainProvider.getSigner(),
        this.contextProvider.getContext(),
        this.browserNodeFactory.factoryBrowserNode(),
      ])
        .andThen((vals) => {
          [config, signer, context, this.browserNode] = vals;

          // If no account is set in the context, then we have to error out.
          // Normally we would use getInitializedContext, but in this case, you need
          // the browser node up and running to get the publicIdentifier, which
          // is part of what qualifies for getInitializedContext. I do not see
          // a better way that doesn't involve a huge refactor.
          if (context.account == null) {
            return errAsync<string[], CoreUninitializedError>(
              new CoreUninitializedError("Account is not set in BrowserNodeProvider.initialize"),
            );
          }

          // Check if the user has a signature in local storage for this account
          const storedSignature = this.storageUtils.getSessionItem(`account-${context.account}-signature`);

          if (storedSignature != null) {
            return okAsync<string[], BlockchainUnavailableError>([context.account, storedSignature]);
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
          const [account, signature] = vals;

          // Store the signature so you don't have to sign again
          this.storageUtils.setSessionItem(`account-${account}-signature`, signature);

          return this.browserNode.init(signature, account);
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
    return this.browserNodeResult as ResultAsync<IBrowserNode, BrowserNodeInitializationError>;
  }
  public getBrowserNode(): ResultAsync<IBrowserNode, BrowserNodeInitializationError> {
    return this.initialize();
  }
}
