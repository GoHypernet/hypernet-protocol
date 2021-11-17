import { getSignerAddressFromPublicIdentifier } from "@connext/vector-utils";
import {
  IHypernetOfferDetails,
  PublicIdentifier,
  IHypernetPullPaymentDetails,
  IBasicTransferResponse,
  IFullChannelState,
  IFullTransferState,
  PaymentId,
  TransferId,
  Signature,
  EPaymentType,
  ETransferState,
  InsuranceResolver,
  InsuranceResolverData,
  InsuranceState,
  MessageResolver,
  MessageState,
  ParameterizedState,
  EMessageTransferType,
  InvalidParametersError,
  RouterChannelUnknownError,
  TransferCreationError,
  TransferResolutionError,
  VectorError,
  ParameterizedResolver,
  ParameterizedResolverData,
  Rate,
  BigNumberString,
  UnixTimestamp,
  BlockchainUnavailableError,
  ETransferType,
  LogicalError,
  IMessageTransferData,
  IRegisteredTransfer,
  ChainId,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ITimeUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IBrowserNodeProvider,
  IContextProvider,
  IVectorUtils,
  IConfigProvider,
  IBlockchainProvider,
  IPaymentIdUtils,
  IBrowserNode,
  IBlockchainUtils,
} from "@interfaces/utilities";

import "reflect-metadata";

/**
 * VectorUtils contains methods for interacting directly with the core Vector stuff -
 * creating transfers, resolving them, & dealing the with router channel.
 */
export class VectorUtils implements IVectorUtils {
  protected messageTransferTypeName = "MessageTransfer";
  protected insuranceTransferTypeName = "Insurance";
  protected parameterizedTransferTypeName = "Parameterized";

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected blockchainUtils: IBlockchainUtils,
    protected paymentIdUtils: IPaymentIdUtils,
    protected logUtils: ILogUtils,
    protected timeUtils: ITimeUtils,
  ) {}

  /**
   * Resolves a message/offer/null transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public resolveMessageTransfer(
    transferId: TransferId,
    message = "Finalized",
  ): ResultAsync<
    IBasicTransferResponse,
    TransferResolutionError | VectorError | BlockchainUnavailableError
  > {
    return this.browserNodeProvider.getBrowserNode().andThen((browserNode) => {
      return browserNode
        .getTransfer(transferId)
        .andThen((transfer) => {
          this.logUtils.debug(`Resolving offer transfer ${transferId}`);
          return browserNode.resolveTransfer(
            EthereumContractAddress(transfer.channelAddress),
            transferId,
            {
              message: message, // This can be literally anything except the blank string; that would be the same as canceling it
            } as MessageResolver,
          );
        })
        .mapErr((err) => new TransferResolutionError(err, err?.message));
    });
  }

  /**
   * Resolves an insurance transfer with Vector.
   * @param transferId the ID of the tarnsfer to resolve
   */
  public resolveInsuranceTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    gatewaySignature: Signature | null,
    amount: BigNumberString,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError> {
    const resolverData: InsuranceResolverData = {
      amount: amount,
      UUID: paymentId,
    };

    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        let signatureResult: ResultAsync<
          string,
          TransferResolutionError | VectorError
        >;
        if (gatewaySignature == null) {
          const resolverDataEncoding = ["tuple(uint256 amount, bytes32 UUID)"];
          const encodedResolverData = defaultAbiCoder.encode(
            resolverDataEncoding,
            [resolverData],
          );
          const hashedResolverData = keccak256(encodedResolverData);

          signatureResult = browserNode.signUtilityMessage(hashedResolverData);
        } else {
          signatureResult = okAsync<string, TransferResolutionError>(
            gatewaySignature,
          );
        }

        return ResultUtils.combine([
          signatureResult,
          browserNode.getTransfer(transferId),
        ]).andThen((vals) => {
          const [signature, transfer] = vals;

          const resolver: InsuranceResolver = {
            data: resolverData,
            signature: signature,
          };

          return browserNode.resolveTransfer(
            EthereumContractAddress(transfer.channelAddress),
            transferId,
            resolver,
          );
        });
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  /**
   * Resolves a parameterized payment transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public resolveParameterizedTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferResolutionError | VectorError | BlockchainUnavailableError
  > {
    const resolverData: ParameterizedResolverData = {
      UUID: paymentId,
      paymentAmountTaken: amount,
    };

    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.blockchainProvider.getLatestBlock(),
    ]).andThen((vals) => {
      const [browserNode, block] = vals;

      this.logUtils.debug(`Current block timestamp: ${block.timestamp}`);

      const resolverDataEncoding = [
        "tuple(bytes32 UUID, uint256 paymentAmountTaken)",
      ];
      const encodedResolverData = defaultAbiCoder.encode(resolverDataEncoding, [
        resolverData,
      ]);
      const hashedResolverData = keccak256(encodedResolverData);

      return ResultUtils.combine([
        browserNode.signUtilityMessage(hashedResolverData),
        browserNode.getTransfer(transferId),
      ])
        .andThen((vals) => {
          const [signature, transfer] = vals;
          const resolver: ParameterizedResolver = {
            data: resolverData,
            payeeSignature: signature,
          };

          return browserNode.resolveTransfer(
            EthereumContractAddress(transfer.channelAddress),
            transferId,
            resolver,
          );
        })
        .mapErr((err) => new TransferResolutionError(err, err?.message));
    });
  }

  public cancelMessageTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError> {
    this.logUtils.debug(`Canceling message transfer ${transferId}`);

    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        return browserNode.getTransfer(transferId).andThen((transfer) => {
          return browserNode.resolveTransfer(
            EthereumContractAddress(transfer.channelAddress),
            transferId,
            {
              message: "",
            } as MessageResolver,
          );
        });
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  public cancelInsuranceTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError> {
    this.logUtils.debug(`Canceling Insurance transfer ${transferId}`);

    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        return browserNode.getTransfer(transferId).andThen((transfer) => {
          return browserNode.resolveTransfer(
            EthereumContractAddress(transfer.channelAddress),
            transferId,
            {
              data: {
                amount:
                  "0x0000000000000000000000000000000000000000000000000000000000000000",
                UUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
              },
              signature:
                "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            } as InsuranceResolver,
          );
        });
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  public cancelParameterizedTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError> {
    this.logUtils.debug(`Canceling Parameterized transfer ${transferId}`);

    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        return browserNode.getTransfer(transferId).andThen((transfer) => {
          return browserNode.resolveTransfer(
            EthereumContractAddress(transfer.channelAddress),
            transferId,
            {
              data: {
                paymentAmountTaken:
                  "0x0000000000000000000000000000000000000000000000000000000000000000",
                UUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
              },
              payeeSignature:
                "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            } as ParameterizedResolver,
          );
        });
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  /**
   * Creates a "Message" transfer with Vector, to notify the other party of a pull payment
   * @param toAddress the public identifier (not eth address!) of the intended recipient
   * @param message the message to send as IHypernetOfferDetails
   */
  public createPullNotificationTransfer(
    channelAddress: EthereumContractAddress,
    chainId: ChainId,
    toAddress: PublicIdentifier,
    message: IHypernetPullPaymentDetails,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  > {
    // The message type has to be PULLPAYMENT
    message.messageType = EMessageTransferType.PULLPAYMENT;

    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(
      message.paymentId,
    );
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(
          new InvalidParametersError(
            `CreatePullNotificationTransfer: Invalid paymentId: '${message.paymentId}'`,
          ),
        );
      }
    }

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        const [config, browserNode] = vals;

        const hypertokenAddress =
          config.chainAddresses[chainId]?.hypertokenAddress;
        if (hypertokenAddress == null) {
          return errAsync<
            IBasicTransferResponse,
            TransferCreationError | InvalidParametersError | VectorError
          >(
            new TransferCreationError(
              undefined,
              `Unable to create insurance transfer on chain ${chainId}. No configuration info for that chain is available`,
            ),
          );
        }

        const initialState: MessageState = {
          message: JSON.stringify(message),
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          BigNumberString("0"),
          hypertokenAddress,
          this.messageTransferTypeName,
          initialState,
          toAddress,
          undefined, // CRITICAL- must be undefined
          undefined,
          undefined,
          message,
        );
      })
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  /**
   * Creates a "Message" transfer with Vector, to notify the other party of a payment creation
   * @param toAddress the public identifier (not eth address!) of the intended recipient
   * @param message the message to send as IHypernetOfferDetails
   */
  public createOfferTransfer(
    channelAddress: EthereumContractAddress,
    toAddress: PublicIdentifier,
    message: IHypernetOfferDetails,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  > {
    // The message type has to be OFFER
    message.messageType = EMessageTransferType.OFFER;

    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(
      message.paymentId,
    );
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(
          new InvalidParametersError(
            `CreateOfferTransfer: Invalid paymentId: '${message.paymentId}'`,
          ),
        );
      }
    }

    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        const initialState: MessageState = {
          message: JSON.stringify(message),
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          BigNumberString("0"),
          message.paymentToken, // The offer is always for 0, so we will make the asset ID in the payment token type, because why not?
          this.messageTransferTypeName,
          initialState,
          toAddress,
          undefined, // CRITICAL- must be undefined
          undefined,
          undefined,
          message,
        );
      })
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  /**
   * Creates the actual Insurance transfer with Vector
   * @param toAddress the publicIdentifier of the person to send the transfer to
   * @param mediatorAddress the Ethereum address of the mediator
   * @param amount the amount of the token to commit into the InsuranceTransfer
   * @param expiration the expiration date of this InsuranceTransfer
   * @param paymentId a length-64 hexadecimal string; this becomes the UUID component of the InsuranceState
   */
  public createInsuranceTransfer(
    channelAddress: EthereumContractAddress,
    chainId: ChainId,
    toAddress: PublicIdentifier,
    mediatorAddress: EthereumAccountAddress,
    amount: BigNumberString,
    expiration: UnixTimestamp,
    paymentId: PaymentId,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  > {
    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(
          new InvalidParametersError(
            `CreateInsuranceTransfer: Invalid paymentId: '${paymentId}'`,
          ),
        );
      }
    }

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        const [config, browserNode] = vals;

        const hypertokenAddress =
          config.chainAddresses[chainId]?.hypertokenAddress;
        if (hypertokenAddress == null) {
          return errAsync<
            IBasicTransferResponse,
            TransferCreationError | VectorError
          >(
            new TransferCreationError(
              undefined,
              `Unable to create insurance transfer on chain ${chainId}. No configuration info for that chain is available`,
            ),
          );
        }

        const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

        const initialState: InsuranceState = {
          receiver: toEthAddress,
          mediator: mediatorAddress,
          collateral: amount,
          expiration: expiration.toString(),
          UUID: paymentId,
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          amount,
          hypertokenAddress,
          this.insuranceTransferTypeName,
          initialState,
          toAddress,
          undefined,
          undefined,
          undefined,
          { requireOnline: config.requireOnline },
        );
      })
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  public createParameterizedTransfer(
    channelAddress: EthereumContractAddress,
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumberString,
    assetAddress: EthereumContractAddress,
    paymentId: PaymentId,
    start: UnixTimestamp,
    expiration: UnixTimestamp,
    deltaTime?: number,
    deltaAmount?: BigNumberString,
  ): ResultAsync<
    IBasicTransferResponse,
    | TransferCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
  > {
    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        // Sanity check
        if (type === EPaymentType.Pull && deltaTime == null) {
          this.logUtils.error("Must provide deltaTime for Pull payments");
          return errAsync(
            new InvalidParametersError(
              "Must provide deltaTime for Pull payments",
            ),
          );
        }

        if (type === EPaymentType.Pull && deltaAmount == null) {
          this.logUtils.error("Must provide deltaAmount for Pull payments");
          return errAsync(
            new InvalidParametersError(
              "Must provide deltaAmount for Pull payments",
            ),
          );
        }

        if (BigNumber.from(amount).isZero()) {
          this.logUtils.error("Amount cannot be zero.");
          return errAsync(new InvalidParametersError("Amount cannot be zero."));
        }

        // Make sure the paymentId is valid:
        const validPayment = this.paymentIdUtils.isValidPaymentId(paymentId);
        if (validPayment.isErr()) {
          this.logUtils.error(validPayment.error);
          return errAsync(validPayment.error);
        } else {
          if (!validPayment.value) {
            this.logUtils.error(
              `CreatePaymentTransfer: Invalid paymentId: '${paymentId}'`,
            );
            return errAsync(
              new InvalidParametersError(
                `CreatePaymentTransfer: Invalid paymentId: '${paymentId}'`,
              ),
            );
          }
        }

        return ResultUtils.combine([
          this.browserNodeProvider.getBrowserNode(),
          this.configProvider.getConfig(),
        ]).andThen(([browserNode, config]) => {
          const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

          // @todo toEthAddress isn't really an eth address, it's the internal signing key
          // therefore we need to actually do the signing of the payment transfer (on resolve)
          // with this internal key!

          const infiniteRate = {
            deltaAmount: amount,
            deltaTime: "1",
          };

          let ourRate: Rate;
          // Have to throw this error, or the ourRate object below will complain that one
          // of the params is possibly undefined.
          if (type == EPaymentType.Pull) {
            if (deltaTime == null || deltaAmount == null) {
              this.logUtils.error(
                "Somehow, deltaTime or deltaAmount were not set!",
              );
              return errAsync<
                IBasicTransferResponse,
                | TransferCreationError
                | InvalidParametersError
                | VectorError
                | BlockchainUnavailableError
              >(
                new InvalidParametersError(
                  "Somehow, deltaTime or deltaAmount were not set!",
                ),
              );
            }

            if (deltaTime == 0 || deltaAmount == "0") {
              this.logUtils.error("deltatime & deltaAmount cannot be zero!");
              return errAsync(
                new InvalidParametersError(
                  "deltatime & deltaAmount cannot be zero!",
                ),
              );
            }

            ourRate = {
              deltaTime: deltaTime?.toString(),
              deltaAmount: deltaAmount,
            };
          } else {
            ourRate = infiniteRate;
          }

          const initialState: ParameterizedState = {
            receiver: toEthAddress,
            start: start.toString(),
            expiration: expiration.toString(),
            UUID: paymentId,
            rate: ourRate,
          };

          return browserNode.conditionalTransfer(
            channelAddress,
            amount,
            assetAddress,
            this.parameterizedTransferTypeName,
            initialState,
            toAddress,
            undefined,
            undefined,
            undefined,
            { requireOnline: config.requireOnline },
          );
        });
      })
      .map((val) => val as IBasicTransferResponse)
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  public getTimestampFromTransfer(transfer: IFullTransferState): UnixTimestamp {
    if (transfer.meta == null) {
      // We need to figure out the transfer type, I think; but for now we'll just say
      // that the transfer is right now
      return this.timeUtils.getUnixNow();
    }

    return UnixTimestamp(transfer.meta.createdAt);
  }

  public getTransferStateFromTransfer(
    transfer: IFullTransferState,
  ): ResultAsync<ETransferState, VectorError | BlockchainUnavailableError> {
    if (transfer.transferResolver != null) {
      // If the transfer isn't resolved, it can't be canceled

      // We need to encode the transferResolver, and to do that, we'll need the ResolverEncoding
      return this._getRegisteredTransfers(ChainId(transfer.chainId)).map(
        (registeredTransfers) => {
          const registeredTransfer = registeredTransfers.find(
            (val) => val.definition == transfer.transferDefinition,
          );

          if (registeredTransfer == null) {
            throw new Error(
              "Transfer is not a registered type. Is the chain deployed correctly?",
            );
          }

          const resolverDataEncoding = [registeredTransfer.resolverEncoding];
          const encodedResolverData = defaultAbiCoder.encode(
            resolverDataEncoding,
            [transfer.transferResolver],
          );

          // If the transferResolver is the same as the encodedCancelData, then we can consider the transfer as canceled
          if (encodedResolverData == registeredTransfer.encodedCancel) {
            return ETransferState.Canceled;
          }
          return ETransferState.Resolved;
        },
      );
    }
    return okAsync(ETransferState.Active);
  }

  /**
   * Given a (vector) transfer @ IFullTransferState, return the transfer type (as ETransferType)
   * @param transfer the transfer to get the transfer type of
   */
  public getTransferType(
    transfer: IFullTransferState,
  ): ResultAsync<ETransferType, VectorError | BlockchainUnavailableError> {
    // TransferDefinition here is the ETH address of the transfer
    // We need to get the registered transfer definitions as canonical by the browser node
    return this._getRegisteredTransfers(ChainId(transfer.chainId)).map(
      (registeredTransfers) => {
        const transferMap: Map<EthereumContractAddress, string> = new Map();
        for (const registeredTransfer of registeredTransfers) {
          transferMap.set(
            EthereumContractAddress(registeredTransfer.definition),
            registeredTransfer.name,
          );
        }

        // If the transfer address is not one we know, we don't know what this is
        if (
          !transferMap.has(EthereumContractAddress(transfer.transferDefinition))
        ) {
          this.logUtils.log(
            `Transfer type not recognized. Transfer definition: ${
              transfer.transferDefinition
            }, transferMap: ${JSON.stringify(transferMap)}`,
          );
          return ETransferType.Unrecognized;
        } else {
          // This is a transfer we know about, but not necessarily one we want.
          // Narrow down to insurance, parameterized, or  offer/messagetransfer
          const thisTransfer = transferMap.get(
            EthereumContractAddress(transfer.transferDefinition),
          );
          if (thisTransfer == null) {
            throw new LogicalError(
              "Transfer type not unrecognized, but not in transfer map!",
            );
          }

          // Now we know it's either insurance, parameterized, or messageTransfer
          if (thisTransfer === this.insuranceTransferTypeName) {
            return ETransferType.Insurance;
          } else if (thisTransfer === this.parameterizedTransferTypeName) {
            return ETransferType.Parameterized;
          } else if (thisTransfer === this.messageTransferTypeName) {
            const message: IMessageTransferData = JSON.parse(
              (transfer as IFullTransferState<MessageState>).transferState
                .message,
            );
            if (message.messageType == EMessageTransferType.OFFER) {
              return ETransferType.Offer;
            } else if (
              message.messageType == EMessageTransferType.PULLPAYMENT
            ) {
              return ETransferType.PullRecord;
            } else {
              this.logUtils.warning(
                `Message transfer was not of type OFFER or PULLPAYMENT, got: ${message.messageType}`,
              );
              return ETransferType.Unrecognized;
            }
          } else {
            // It's a recognized transfer type- like Withdraw- that we just don't care about
            return ETransferType.Unrecognized;
          }
        }
      },
    );
  }

  /**
   * Exactly the same as getTransferType but also returns the source transfer,
   * useful when dealing with combine() and other contexts where it is easy
   * to loose track of which transfer you are getting the type for.
   */
  public getTransferTypeWithTransfer(
    transfer: IFullTransferState,
  ): ResultAsync<
    { transferType: ETransferType; transfer: IFullTransferState },
    VectorError | BlockchainUnavailableError
  > {
    return this.getTransferType(transfer).map((transferType) => {
      return { transferType, transfer };
    });
  }

  public getAllActiveTransfers(): ResultAsync<
    IFullTransferState[],
    VectorError | BlockchainUnavailableError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.contextProvider.getInitializedContext(),
    ])
      .andThen((vals) => {
        const [browserNode, context] = vals;

        const activeTransferResults = context.activeStateChannels.map(
          (activeStateChannel) => {
            return browserNode.getActiveTransfers(
              activeStateChannel.channelAddress,
            );
          },
        );

        return ResultUtils.combine(activeTransferResults);
      })
      .map((arrArr) => {
        return new Array<IFullTransferState>().concat(...arrArr);
      });
  }

  private registeredTransfersResult: ResultAsync<
    IRegisteredTransfer[],
    BlockchainUnavailableError | VectorError
  > | null = null;
  protected _getRegisteredTransfers(
    chainId: ChainId,
  ): ResultAsync<
    IRegisteredTransfer[],
    BlockchainUnavailableError | VectorError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
    ]).andThen((vals) => {
      const [browserNode, config] = vals;

      // If the registered transfers already exist, we can just use the cached versions
      if (this.registeredTransfersResult == null) {
        // The registered transfers don't exists
        this.registeredTransfersResult =
          browserNode.getRegisteredTransfers(chainId);
      }

      return this.registeredTransfersResult;
    });
  }

  protected _getStateChannel(
    channelAddress: EthereumContractAddress,
    browserNode: IBrowserNode,
  ): ResultAsync<IFullChannelState, RouterChannelUnknownError | VectorError> {
    return browserNode.getStateChannel(channelAddress).andThen((channel) => {
      if (channel == null) {
        return errAsync(new RouterChannelUnknownError());
      }
      return okAsync(channel);
    });
  }
}
