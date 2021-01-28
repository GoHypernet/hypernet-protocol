import { BrowserNode } from "@connext/vector-browser-node";
import {
  CONDITIONAL_TRANSFER_CREATED_EVENT,
  CONDITIONAL_TRANSFER_RESOLVED_EVENT,
  NodeError,
} from "@connext/vector-types";
import { EthereumAddress, PublicIdentifier } from "@interfaces/objects";
import { VectorError } from "@interfaces/objects/errors";
import { ParameterizedResolver } from "@interfaces/types/typechain";
import {
  IBasicChannelResponse,
  IBasicTransferResponse,
  IBrowserNode,
  IConditionalTransferCreatedPayload,
  IConditionalTransferResolvedPayload,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawResponse,
} from "@interfaces/utilities";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class WrappedBrowserNode implements IBrowserNode {
  constructor(protected browserNode: BrowserNode) {}

  public init(): ResultAsync<void, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.init(), (e) => {
      return new VectorError(e as Error);
    });
  }

  public reconcileDeposit(assetId: EthereumAddress, channelAddress: EthereumAddress): ResultAsync<string, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.reconcileDeposit({ assetId, channelAddress }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
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
    recipient: string,
    fee: string,
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
        fee,
        callTo,
        callData,
        meta,
      }),
      (e) => {
        return new VectorError(e as Error);
      },
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }
  public getTransfer(transferId: string): ResultAsync<IFullTransferState, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getTransfer({ transferId }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue() as IFullTransferState);
      }
    });
  }
  public getActiveTransfers(channelAddress: string): ResultAsync<IFullTransferState[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getActiveTransfers({ channelAddress }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getRegisteredTransfers(chainId: number): ResultAsync<IRegisteredTransfer[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getRegisteredTransfers({ chainId }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public signUtilityMessage(message: string): ResultAsync<string, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.signUtilityMessage({ message }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue().signedMessage);
      }
    });
  }

  public resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: string,
    transferResolver: ParameterizedResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.resolveTransfer({
        channelAddress,
        transferId,
        transferResolver,
      }),
      (e) => {
        return new VectorError(e as Error);
      },
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
      (e) => {
        return new VectorError(e as Error);
      },
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannels(): ResultAsync<EthereumAddress[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getStateChannels(), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannel(channelAddress: EthereumAddress): ResultAsync<IFullChannelState | undefined, VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getStateChannel({ channelAddress }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
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
    return ResultAsync.fromPromise(this.browserNode.setup({ counterpartyIdentifier, chainId, timeout, meta }), (e) => {
      return new VectorError(e as Error);
    }).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as NodeError));
      } else {
        return okAsync(result.getValue());
      }
    });
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
