import { BrowserNode } from "@connext/vector-browser-node";
import {
  CONDITIONAL_TRANSFER_CREATED_EVENT,
  CONDITIONAL_TRANSFER_RESOLVED_EVENT,
  NodeError,
} from "@connext/vector-types";
import {
  EthereumAddress,
  PublicIdentifier,
  IBasicChannelResponse,
  IBasicTransferResponse,
  IConditionalTransferCreatedPayload,
  IConditionalTransferResolvedPayload,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawQuote,
  IWithdrawResponse,
} from "@hypernetlabs/objects";
import { VectorError } from "@hypernetlabs/objects/errors";
import { InsuranceResolver, MessageResolver, ParameterizedResolver } from "@hypernetlabs/objects/types/typechain";
import { IBrowserNode } from "@interfaces/utilities";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

export class WrappedBrowserNode implements IBrowserNode {
  protected toVectorError: (e: unknown) => VectorError;
  constructor(protected browserNode: BrowserNode) {
    this.toVectorError = (e) => {
      return new VectorError(e as Error);
    };
  }

  public init(signature: string, account: string): ResultAsync<void, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.init({
        signature,
        signer: account,
      }),
      this.toVectorError,
    );
  }

  public reconcileDeposit(assetId: EthereumAddress, channelAddress: EthereumAddress): ResultAsync<string, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.reconcileDeposit({ assetId, channelAddress }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue().channelAddress);
      }
    });
  }

  public withdraw(
    channelAddress: EthereumAddress,
    amount: string,
    assetId: string,
    recipient: EthereumAddress,
    quote?: IWithdrawQuote,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.withdraw({
        channelAddress,
        amount,
        assetId,
        recipient,
        quote,
        callTo,
        callData,
        meta,
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getTransfer(transferId: string): ResultAsync<IFullTransferState, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getTransfer({ transferId }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as NodeError));
        } else {
          return okAsync(result.getValue() as IFullTransferState);
        }
      },
    );
  }
  public getActiveTransfers(channelAddress: string): ResultAsync<IFullTransferState[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getActiveTransfers({ channelAddress }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as NodeError));
        } else {
          return okAsync(result.getValue());
        }
      },
    );
  }

  public getRegisteredTransfers(chainId: number): ResultAsync<IRegisteredTransfer[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getRegisteredTransfers({ chainId }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as NodeError));
        } else {
          return okAsync(result.getValue());
        }
      },
    );
  }

  public getTransfers(startDate: number, endDate: number): ResultAsync<IFullTransferState[], VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getTransfers({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public signUtilityMessage(message: string): ResultAsync<string, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.signUtilityMessage({ message }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as NodeError));
        } else {
          return okAsync(result.getValue().signedMessage);
        }
      },
    );
  }

  public resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: string,
    transferResolver: MessageResolver | ParameterizedResolver | InsuranceResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.resolveTransfer({
        channelAddress,
        transferId,
        transferResolver,
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public conditionalTransfer(
    channelAddress: EthereumAddress,
    amount: string,
    assetId: EthereumAddress,
    type: string,
    details: any,
    recipient?: PublicIdentifier,
    recipientChainId?: number,
    recipientAssetId?: EthereumAddress,
    timeout?: string,
    meta?: any,
  ): ResultAsync<IBasicTransferResponse, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.conditionalTransfer({
        channelAddress,
        amount,
        assetId,
        type,
        details,
        recipient,
        recipientChainId,
        recipientAssetId,
        timeout,
        meta,
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannels(): ResultAsync<EthereumAddress[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getStateChannels(), this.toVectorError).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannel(channelAddress: EthereumAddress): ResultAsync<IFullChannelState | undefined, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getStateChannel({ channelAddress }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as NodeError));
        } else {
          return okAsync(result.getValue());
        }
      },
    );
  }

  public getStateChannelByParticipants(
    counterparty: PublicIdentifier,
    chainId: number,
  ): ResultAsync<IFullChannelState | undefined, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getStateChannelByParticipants({ counterparty, chainId }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public setup(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
    timeout: string,
    meta?: any,
  ): ResultAsync<IBasicChannelResponse, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.setup({ counterpartyIdentifier, chainId, timeout, meta }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public restoreState(counterpartyIdentifier: PublicIdentifier, chainId: number): ResultAsync<void, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.restoreState({ counterpartyIdentifier, chainId }),
      this.toVectorError,
    ).map(() => {});
  }

  public onConditionalTransferResolved(
    callback: (payload: IConditionalTransferResolvedPayload) => void | Promise<void>,
    filter?: (payload: IConditionalTransferResolvedPayload) => boolean,
  ): Promise<void> {
    return this.browserNode.on(CONDITIONAL_TRANSFER_RESOLVED_EVENT, callback, filter);
  }

  public onConditionalTransferCreated(
    callback: (payload: IConditionalTransferCreatedPayload) => void | Promise<void>,
    filter?: (payload: IConditionalTransferCreatedPayload) => boolean,
  ): Promise<void> {
    return this.browserNode.on(CONDITIONAL_TRANSFER_CREATED_EVENT, callback, filter);
  }

  get publicIdentifier(): string {
    return this.browserNode.publicIdentifier;
  }
}
