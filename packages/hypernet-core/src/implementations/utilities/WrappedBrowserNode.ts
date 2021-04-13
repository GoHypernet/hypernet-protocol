import { BrowserNode } from "@connext/vector-browser-node";
import { CONDITIONAL_TRANSFER_CREATED_EVENT, CONDITIONAL_TRANSFER_RESOLVED_EVENT } from "@connext/vector-types";
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
  TransferId,
} from "@hypernetlabs/objects";
import { VectorError, InvalidParametersError } from "@hypernetlabs/objects";
import { InsuranceResolver, MessageResolver, ParameterizedResolver } from "@hypernetlabs/objects/types/typechain";
import { IBrowserNode } from "@interfaces/utilities";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

export class WrappedBrowserNode implements IBrowserNode {
  protected toVectorError: (e: unknown) => VectorError = (e) => {
    return new VectorError(e as Error);
  };

  constructor(protected browserNode: BrowserNode) {}

  public init(signature: string, account: EthereumAddress): ResultAsync<void, VectorError | InvalidParametersError> {
    if (!signature || !account) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.init({
        signature,
        signer: account,
      }),
      this.toVectorError,
    );
  }

  public reconcileDeposit(
    assetId: EthereumAddress,
    channelAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, VectorError | InvalidParametersError> {
    if (!assetId || !channelAddress) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.reconcileDeposit({ assetId, channelAddress }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as VectorError));
      } else {
        return okAsync(EthereumAddress(result.getValue().channelAddress));
      }
    });
  }

  public withdraw(
    channelAddress: EthereumAddress,
    amount: string,
    assetId: EthereumAddress,
    recipient: EthereumAddress,
    quote?: IWithdrawQuote,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError | InvalidParametersError> {
    if (!channelAddress || !amount || !assetId || !recipient) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

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
        return errAsync(new VectorError(result.getError() as VectorError));
      } else {
        return okAsync(result.getValue() as IWithdrawResponse);
      }
    });
  }

  public getTransfer(transferId: TransferId): ResultAsync<IFullTransferState, VectorError | InvalidParametersError> {
    if (!transferId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(this.browserNode.getTransfer({ transferId }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as VectorError));
        } else {
          return okAsync(result.getValue() as IFullTransferState);
        }
      },
    );
  }
  public getActiveTransfers(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullTransferState[], VectorError | InvalidParametersError> {
    if (!channelAddress) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(this.browserNode.getActiveTransfers({ channelAddress }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as VectorError));
        } else {
          return okAsync(result.getValue() as IFullTransferState[]);
        }
      },
    );
  }

  public getRegisteredTransfers(
    chainId: number,
  ): ResultAsync<IRegisteredTransfer[], VectorError | InvalidParametersError> {
    if (!chainId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(this.browserNode.getRegisteredTransfers({ chainId }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as VectorError));
        } else {
          return okAsync(result.getValue());
        }
      },
    );
  }

  public getTransfers(
    startDate: number,
    endDate: number,
  ): ResultAsync<IFullTransferState[], VectorError | InvalidParametersError> {
    if (!startDate || !endDate) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.getTransfers({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as VectorError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public signUtilityMessage(message: string): ResultAsync<string, VectorError | InvalidParametersError> {
    if (!message) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(this.browserNode.signUtilityMessage({ message }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as VectorError));
        } else {
          return okAsync(result.getValue().signedMessage);
        }
      },
    );
  }

  public resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: TransferId,
    transferResolver: MessageResolver | ParameterizedResolver | InsuranceResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError | InvalidParametersError> {
    if (!channelAddress || !transferId || !transferResolver) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.resolveTransfer({
        channelAddress,
        transferId,
        transferResolver,
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as VectorError));
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
  ): ResultAsync<IBasicTransferResponse, VectorError | InvalidParametersError> {
    if (!channelAddress || !amount || !assetId || !type || !details) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

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
        return errAsync(new VectorError(result.getError() as VectorError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannels(): ResultAsync<EthereumAddress[], VectorError> {
    return ResultAsync.fromPromise(this.browserNode.getStateChannels(), this.toVectorError).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as VectorError));
      } else {
        return okAsync(
          result.getValue().map((val) => {
            return EthereumAddress(val);
          }),
        );
      }
    });
  }

  public getStateChannel(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullChannelState | undefined, VectorError | InvalidParametersError> {
    if (!channelAddress) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(this.browserNode.getStateChannel({ channelAddress }), this.toVectorError).andThen(
      (result) => {
        if (result.isError) {
          return errAsync(new VectorError(result.getError() as VectorError));
        } else {
          return okAsync(result.getValue());
        }
      },
    );
  }

  public getStateChannelByParticipants(
    counterparty: PublicIdentifier,
    chainId: number,
  ): ResultAsync<IFullChannelState | undefined, VectorError | InvalidParametersError> {
    if (!counterparty || !chainId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.getStateChannelByParticipants({ counterparty, chainId }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as VectorError));
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
  ): ResultAsync<IBasicChannelResponse, VectorError | InvalidParametersError> {
    if (!counterpartyIdentifier || !chainId || !timeout) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.setup({ counterpartyIdentifier, chainId, timeout, meta }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError() as VectorError));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public restoreState(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
  ): ResultAsync<void, VectorError | InvalidParametersError> {
    if (!counterpartyIdentifier || !chainId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return ResultAsync.fromPromise(
      this.browserNode.restoreState({ counterpartyIdentifier, chainId }),
      this.toVectorError,
    ).map(() => {});
  }

  public onConditionalTransferResolved(
    callback: (payload: IConditionalTransferResolvedPayload) => void | Promise<void>,
    filter?: (payload: IConditionalTransferResolvedPayload) => boolean,
  ): Promise<void> {
    if (!callback) {
      throw new InvalidParametersError("Incorrectly provided arguments");
    }

    return this.browserNode.on(CONDITIONAL_TRANSFER_RESOLVED_EVENT, callback, filter);
  }

  public onConditionalTransferCreated(
    callback: (payload: IConditionalTransferCreatedPayload) => void | Promise<void>,
    filter?: (payload: IConditionalTransferCreatedPayload) => boolean,
  ): Promise<void> {
    if (!callback) {
      throw new InvalidParametersError("Incorrectly provided arguments");
    }

    return this.browserNode.on(CONDITIONAL_TRANSFER_CREATED_EVENT, callback, filter);
  }

  get publicIdentifier(): PublicIdentifier {
    return PublicIdentifier(this.browserNode.publicIdentifier);
  }
}
