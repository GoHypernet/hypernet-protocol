import { NonEIP712Message } from "@connext/vector-browser-node";
import {
  IBrowserNode,
  IContextProvider,
  ILogUtils,
  IBrowserNodeProvider,
  IConfigProvider,
  IBlockchainProvider,
} from "@interfaces/utilities";
import { BlockchainUnavailableError, CoreUninitializedError, VectorError } from "@interfaces/objects/errors";
import { errAsync, HypernetConfig, HypernetContext, okAsync, ResultAsync } from "@interfaces/objects";
import { ResultUtils, ILocalStorageUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNodeResult: ResultAsync<IBrowserNode, VectorError | Error> | null;
  protected browserNode: IBrowserNode | null;
  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
    protected storageUtils: ILocalStorageUtils,
    protected browserNodeFactory: IBrowserNodeFactory,
  ) {
    this.browserNodeResult = null;
    this.browserNode = null;
  }
  protected initialize(): ResultAsync<IBrowserNode, VectorError | CoreUninitializedError> {
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

          // Initialize the browser node
          if (this.browserNode == null) {
            throw new Error("Something is badly broken");
          }
          return this.browserNode.init(signature, account);
        })
        .orElse((e) => {
          console.log(e);
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
        .map(() => {
          return this.browserNode as IBrowserNode;
        });
    }
    return this.browserNodeResult as ResultAsync<IBrowserNode, VectorError>;
  }
  public getBrowserNode(): ResultAsync<IBrowserNode, VectorError | Error> {
    return this.initialize();
  }
}
