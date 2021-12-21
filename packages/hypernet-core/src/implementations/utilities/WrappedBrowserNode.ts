import { BrowserNode } from "@connext/vector-browser-node";
import {
  CONDITIONAL_TRANSFER_CREATED_EVENT,
  CONDITIONAL_TRANSFER_RESOLVED_EVENT,
} from "@connext/vector-types";
import {
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
  Signature,
  BigNumberString,
  UnixTimestamp,
  VectorError,
  InsuranceResolver,
  MessageResolver,
  ParameterizedResolver,
  ChainId,
  UtilityMessageSignature,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IBrowserNode } from "@interfaces/utilities";
import { injectable } from "inversify";

injectable();
export class WrappedBrowserNode implements IBrowserNode {
  protected toVectorError: (e: unknown) => VectorError = (e) => {
    return new VectorError(e as Error);
  };

  constructor(protected browserNode: BrowserNode) {}

  public init(
    signature: Signature,
    account: EthereumAccountAddress,
  ): ResultAsync<void, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.init({
        signature,
        signer: account,
      }),
      this.toVectorError,
    );
  }

  public reconcileDeposit(
    assetId: EthereumContractAddress,
    channelAddress: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, VectorError> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ResultAsync.fromPromise(
      this.browserNode.reconcileDeposit({ assetId, channelAddress }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(
          EthereumContractAddress(result.getValue().channelAddress),
        );
      }
    });
  }

  public withdraw(
    channelAddress: EthereumContractAddress,
    amount: BigNumberString,
    assetId: EthereumContractAddress,
    recipient: EthereumAccountAddress,
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
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue() as IWithdrawResponse);
      }
    });
  }

  public getTransfer(
    transferId: TransferId,
  ): ResultAsync<IFullTransferState<unknown, unknown>, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getTransfer({ transferId }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue() as IFullTransferState);
      }
    });
  }
  public getActiveTransfers(
    channelAddress: EthereumContractAddress,
  ): ResultAsync<IFullTransferState<unknown, unknown>[], VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getActiveTransfers({ channelAddress }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue() as IFullTransferState[]);
      }
    });
  }

  public getRegisteredTransfers(
    chainId: ChainId,
  ): ResultAsync<IRegisteredTransfer[], VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getRegisteredTransfers({ chainId }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getTransfers(
    startDate: UnixTimestamp,
    endDate: UnixTimestamp,
  ): ResultAsync<IFullTransferState<unknown, unknown>[], VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getTransfers({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public signUtilityMessage(
    message: string,
  ): ResultAsync<UtilityMessageSignature, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.signUtilityMessage({ message }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(
          UtilityMessageSignature(result.getValue().signedMessage),
        );
      }
    });
  }

  public resolveTransfer(
    channelAddress: EthereumContractAddress,
    transferId: TransferId,
    transferResolver:
      | MessageResolver
      | ParameterizedResolver
      | InsuranceResolver,
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
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public conditionalTransfer(
    channelAddress: EthereumContractAddress,
    amount: BigNumberString,
    assetId: EthereumContractAddress,
    type: string,
    details: any,
    recipient?: PublicIdentifier,
    recipientChainId?: number,
    recipientAssetId?: EthereumContractAddress,
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
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannels(): ResultAsync<
    EthereumContractAddress[],
    VectorError
  > {
    return ResultAsync.fromPromise(
      this.browserNode.getStateChannels(),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(
          result.getValue().map((val) => {
            return EthereumContractAddress(val);
          }),
        );
      }
    });
  }

  public getStateChannel(
    channelAddress: EthereumContractAddress,
  ): ResultAsync<IFullChannelState | undefined, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getStateChannel({ channelAddress }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public getStateChannelByParticipants(
    counterparty: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<IFullChannelState | undefined, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.getStateChannelByParticipants({ counterparty, chainId }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public setup(
    counterpartyIdentifier: PublicIdentifier,
    chainId: ChainId,
    timeout: string,
    meta?: any,
  ): ResultAsync<IBasicChannelResponse, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.setup({
        counterpartyIdentifier,
        chainId,
        timeout,
        meta,
      }),
      this.toVectorError,
    ).andThen((result) => {
      if (result.isError) {
        return errAsync(new VectorError(result.getError()));
      } else {
        return okAsync(result.getValue());
      }
    });
  }

  public restoreState(
    counterpartyIdentifier: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<void, VectorError> {
    return ResultAsync.fromPromise(
      this.browserNode.restoreState({ counterpartyIdentifier, chainId }),
      this.toVectorError,
    ).map(() => {});
  }

  public onConditionalTransferResolved(
    callback: (
      payload: IConditionalTransferResolvedPayload,
    ) => void | Promise<void>,
    filter?: (payload: IConditionalTransferResolvedPayload) => boolean,
  ): Promise<void> {
    return this.browserNode.on(
      CONDITIONAL_TRANSFER_RESOLVED_EVENT,
      callback,
      filter,
    );
  }

  public onConditionalTransferCreated(
    callback: (
      payload: IConditionalTransferCreatedPayload,
    ) => void | Promise<void>,
    filter?: (payload: IConditionalTransferCreatedPayload) => boolean,
  ): Promise<void> {
    return this.browserNode.on(
      CONDITIONAL_TRANSFER_CREATED_EVENT,
      callback,
      filter,
    );
  }

  get publicIdentifier(): PublicIdentifier {
    return PublicIdentifier(this.browserNode.publicIdentifier);
  }
}
