import {
  IHypernetOfferDetails,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  IHypernetPullPaymentDetails,
  IFullTransferState,
  IBasicTransferResponse,
  PaymentId,
  GatewayUrl,
  TransferId,
  PaymentFinalizeError,
  PaymentStakeError,
  TransferResolutionError,
  VectorError,
  InvalidParametersError,
  TransferCreationError,
  InvalidPaymentError,
  PaymentCreationError,
  BlockchainUnavailableError,
  EPaymentType,
  ETransferType,
  MessageState,
  EMessageTransferType,
  BigNumberString,
  UnixTimestamp,
  EPaymentState,
  Signature,
  LogicalError,
  InsuranceState,
  ParameterizedState,
  ChainId,
  InvalidPaymentIdError,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  ILogUtils,
  ITimeUtils,
  ILogUtilsType,
  ITimeUtilsType,
} from "@hypernetlabs/utils";
import { IPaymentRepository } from "@interfaces/data";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IBlockchainTimeUtils,
  IBlockchainTimeUtilsType,
  IBrowserNode,
  IBrowserNodeProvider,
  IBrowserNodeProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IPaymentUtils,
  IPaymentUtilsType,
  IVectorUtils,
  IVectorUtilsType,
} from "@interfaces/utilities";

/**
 * Contains methods for creating push, pull, etc payments,
 * as well as retrieving them, and finalizing them.
 */
@injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IPaymentUtilsType) protected paymentUtils: IPaymentUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(IBlockchainTimeUtilsType)
    protected blockchainTimeUtils: IBlockchainTimeUtils,
  ) {}

  public createPullRecord(
    paymentId: PaymentId,
    amount: string,
  ): ResultAsync<PullPayment, PaymentCreationError> {
    return ResultUtils.combine([
      this._getTransfersByPaymentId(paymentId),
      this.browserNodeProvider.getBrowserNode(),
      this.contextProvider.getInitializedContext(),
      this.configProvider.getConfig(),
    ])
      .andThen(([transfers, browserNode, context, config]) => {
        return this.paymentUtils
          .transfersToPayment(paymentId, transfers)
          .andThen((payment) => {
            // Get the state channel to use
            const stateChannel = context.activeStateChannels.find((asc) => {
              return (
                asc.chainId == payment.chainId &&
                asc.routerPublicIdentifier == payment.routerPublicIdentifier
              );
            });

            if (stateChannel == null) {
              return errAsync<
                IBasicTransferResponse,
                | InvalidParametersError
                | TransferCreationError
                | PaymentCreationError
              >(new PaymentCreationError(`State channel does not exist`));
            }

            // Lookup the chain info
            const paymentChainInfo = config.chainInformation.get(
              payment.chainId,
            );

            if (paymentChainInfo == null) {
              return errAsync<IBasicTransferResponse, PaymentCreationError>(
                new PaymentCreationError(
                  `No registration info for chain id ${payment.chainId} found, although payment ${payment.id} claims to use that chain`,
                ),
              );
            }

            const message: IHypernetPullPaymentDetails = {
              messageType: EMessageTransferType.PULLPAYMENT,
              requireOnline: config.requireOnline,
              paymentId: paymentId,
              to: payment.to,
              from: payment.from,
              paymentToken: payment.paymentToken,
              pullPaymentAmount: amount,
            };

            return this.vectorUtils.createPullNotificationTransfer(
              stateChannel.channelAddress,
              paymentChainInfo,
              payment.to,
              message,
            );
          })
          .andThen((transferResponse) => {
            // Get the newly minted transfer
            return browserNode.getTransfer(
              TransferId(transferResponse.transferId),
            );
          })
          .andThen((newTransfer) => {
            // Add the new transfer to the list
            transfers.push(newTransfer);

            // Convert the list of transfers to a payment (again)
            return this.paymentUtils.transfersToPayment(paymentId, transfers);
          })
          .map((payment) => {
            if (payment instanceof PullPayment) {
              return payment;
            }
            throw new Error(
              "Somehow, we were able to add a pull record to a non-PullPayment",
            );
          });
      })

      .mapErr((err) => new PaymentCreationError(err?.message, err));
  }

  public createPullPayment(
    paymentId: PaymentId,
    channelAddress: EthereumContractAddress,
    counterPartyAccount: PublicIdentifier,
    maximumAmount: BigNumberString,
    deltaTime: number,
    deltaAmount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<
    PullPayment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.contextProvider.getInitializedContext(),
      this.blockchainTimeUtils.getBlockchainTimestamp(),
      this.configProvider.getConfig(),
    ]).andThen(([browserNode, context, timestamp, config]) => {
      // Get the state channel to use
      const stateChannel = context.activeStateChannels.find((asc) => {
        return asc.channelAddress == channelAddress;
      });

      if (stateChannel == null) {
        return errAsync(
          new PaymentCreationError(`State channel does not exist`),
        );
      }

      const chainInfo = config.chainInformation.get(stateChannel.chainId);

      if (chainInfo == null) {
        return errAsync(
          new PaymentCreationError(
            `Can not create a payment on chain ${stateChannel.chainId}, no configuration information exists for this chain.`,
          ),
        );
      }

      const message: IHypernetOfferDetails = {
        routerPublicIdentifier: stateChannel.routerPublicIdentifier,
        chainId: stateChannel.chainId,
        messageType: EMessageTransferType.OFFER,
        requireOnline: config.requireOnline,
        paymentId,
        creationDate: timestamp,
        to: counterPartyAccount,
        from: context.publicIdentifier,
        requiredStake,
        paymentAmount: maximumAmount,
        expirationDate,
        paymentToken,
        insuranceToken: chainInfo.hypertokenAddress,
        gatewayUrl,
        metadata,
        rate: {
          deltaAmount,
          deltaTime,
        },
      };

      // Create a message transfer, with the terms of the payment in the metadata.
      return this.vectorUtils
        .createOfferTransfer(
          stateChannel.channelAddress,
          counterPartyAccount,
          message,
        )
        .andThen((transferInfo) => {
          return browserNode.getTransfer(TransferId(transferInfo.transferId));
        })
        .andThen((transfer) => {
          // Return the payment
          return this.paymentUtils.transfersToPayment(paymentId, [transfer]);
        })
        .map((payment) => {
          return payment as PullPayment;
        })
        .mapErr((err) => new PaymentCreationError(err?.message, err));
    });
  }

  /**
   * Creates a push payment and returns it. Nothing moves until
   * the payment is accepted; the payment will return with the
   * "PROPOSED" status. This function just creates an OfferTransfer.
   * @param counterPartyAccount the public identifier of the account to pay
   * @param amount the amount to pay the counterparty
   * @param expirationDate the date (in unix time) at which point the payment will expire & revert
   * @param requiredStake the amount of insurance the counterparty must put up for this payment
   * @param paymentToken the (Ethereum) address of the payment token
   * @param gatewayUrl the registered URL for the gateway that will resolve any disputes.
   */
  public createPushPayment(
    paymentId: PaymentId,
    channelAddress: EthereumContractAddress,
    counterPartyAccount: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<
    PushPayment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.contextProvider.getInitializedContext(),
      this.blockchainTimeUtils.getBlockchainTimestamp(),
      this.configProvider.getConfig(),
    ]).andThen(([browserNode, context, timestamp, config]) => {
      // Get the state channel to use
      const stateChannel = context.activeStateChannels.find((asc) => {
        return asc.channelAddress == channelAddress;
      });

      if (stateChannel == null) {
        return errAsync(
          new PaymentCreationError(`State channel does not exist`),
        );
      }

      const chainInfo = config.chainInformation.get(stateChannel.chainId);

      if (chainInfo == null) {
        return errAsync(
          new PaymentCreationError(
            `Can not create a payment on chain ${stateChannel.chainId}, no configuration information exists for this chain.`,
          ),
        );
      }

      const message: IHypernetOfferDetails = {
        routerPublicIdentifier: stateChannel.routerPublicIdentifier,
        chainId: stateChannel.chainId,
        messageType: EMessageTransferType.OFFER,
        paymentId,
        creationDate: timestamp,
        to: counterPartyAccount,
        from: context.publicIdentifier,
        requiredStake: requiredStake,
        paymentAmount: amount,
        expirationDate: expirationDate,
        paymentToken,
        insuranceToken: chainInfo.hypertokenAddress,
        gatewayUrl,
        metadata,
        requireOnline: config.requireOnline,
      };

      // Create a message transfer, with the terms of the payment in the metadata.
      return this.vectorUtils
        .createOfferTransfer(
          stateChannel.channelAddress,
          counterPartyAccount,
          message,
        )
        .andThen((transferInfo) => {
          return browserNode.getTransfer(TransferId(transferInfo.transferId));
        })
        .andThen((transfer) => {
          // Return the payment
          return this.paymentUtils.transfersToPayment(paymentId, [transfer]);
        })
        .map((payment) => {
          return payment as PushPayment;
        })
        .mapErr((err) => new PaymentCreationError(err?.message, err));
    });
  }

  /**
   * Given a paymentId, return the component transfers.
   * @param paymentId the payment to get transfers for
   */
  protected _getTransfersByPaymentId(
    paymentId: PaymentId,
  ): ResultAsync<
    IFullTransferState[],
    VectorError | BlockchainUnavailableError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.vectorUtils.getAllActiveTransfers(),
    ])
      .andThen((vals) => {
        const [browserNode, activeTransfers] = vals;

        // We also need to look for potentially resolved transfers
        const earliestDate =
          this.paymentUtils.getEarliestDateFromTransfers(activeTransfers);

        return browserNode.getTransfers(
          earliestDate,
          this.timeUtils.getUnixNow(),
        );
      })
      .andThen((transfers) => {
        // This new list is complete- it should include active and inactive transfers
        // after the earliest active transfer
        const transferTypeResults = new Array<
          ResultAsync<
            {
              transferType: ETransferType;
              transfer: IFullTransferState;
            },
            VectorError | BlockchainUnavailableError
          >
        >();
        for (const transfer of transfers) {
          transferTypeResults.push(
            this.vectorUtils.getTransferTypeWithTransfer(transfer),
          );
        }

        return ResultUtils.combine(transferTypeResults);
      })
      .andThen((tranferTypesWithTransfers) => {
        // For each transfer, we are either just going to know it's relevant
        // from the data in the metadata, or we are going to check if it's an
        // insurance payment and we have more bulletproof ways to check
        const relevantTransfers: IFullTransferState[] = [];
        for (const transferTypeWithTransfer of tranferTypesWithTransfers) {
          const { transferType, transfer } = transferTypeWithTransfer;

          if (transferType === ETransferType.Offer) {
            const offerDetails: IHypernetOfferDetails = JSON.parse(
              (transfer as IFullTransferState<MessageState>).transferState
                .message,
            );

            if (offerDetails.paymentId === paymentId) {
              relevantTransfers.push(transfer);
            }
          } else if (
            transferType === ETransferType.Insurance ||
            transferType === ETransferType.Parameterized
          ) {
            if (
              paymentId ===
              (
                transfer as IFullTransferState<
                  InsuranceState | ParameterizedState
                >
              ).transferState.UUID
            ) {
              relevantTransfers.push(transfer);
            } else {
              this.logUtils.debug(
                `Transfer not relevant to payment ${paymentId}, transferId: ${transfer.transferId}`,
              );
            }
          } else {
            this.logUtils.debug(
              `Unrecognized transfer in PaymentRepository, transferId: ${transfer.transferId}`,
            );
          }
        }

        return okAsync(relevantTransfers);
      });
  }

  /**
   * Given a list of payment Ids, return the associated payments.
   * @param paymentIds the list of payments to get
   */
  public getPaymentsByIds(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Map<PaymentId, PushPayment | PullPayment>,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | InvalidPaymentIdError
  > {
    return ResultUtils.combine([
      this.vectorUtils.getAllActiveTransfers(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        const [activeTransfers, browserNode] = vals;
        // We also need to look for potentially resolved transfers
        const earliestDate =
          this.paymentUtils.getEarliestDateFromTransfers(activeTransfers);

        return browserNode.getTransfers(
          earliestDate,
          this.timeUtils.getUnixNow(),
        );
      })
      .andThen((transfers) => {
        const transferTypeResults = new Array<
          ResultAsync<
            {
              transferType: ETransferType;
              transfer: IFullTransferState;
            },
            VectorError | BlockchainUnavailableError
          >
        >();
        for (const transfer of transfers) {
          transferTypeResults.push(
            this.vectorUtils.getTransferTypeWithTransfer(transfer),
          );
        }

        return ResultUtils.combine(transferTypeResults);
      })
      .andThen((tranferTypesWithTransfers) => {
        // For each transfer, we are either just going to know it's relevant
        // from the data in the metadata, or we are going to check if it's an
        // insurance payment and we have more bulletproof ways to check
        const relevantTransfers: IFullTransferState[] = [];
        for (const transferTypeWithTransfer of tranferTypesWithTransfers) {
          const { transferType, transfer } = transferTypeWithTransfer;

          if (transferType === ETransferType.Offer) {
            const offerDetails: IHypernetOfferDetails = JSON.parse(
              (transfer as IFullTransferState<MessageState>).transferState
                .message,
            );
            if (paymentIds.includes(offerDetails.paymentId)) {
              relevantTransfers.push(transfer);
            }
          } else {
            if (
              transferType === ETransferType.Insurance ||
              transferType === ETransferType.Parameterized
            ) {
              if (
                paymentIds.includes(
                  (
                    transfer as IFullTransferState<
                      InsuranceState | ParameterizedState
                    >
                  ).transferState.UUID,
                )
              ) {
                relevantTransfers.push(transfer);
              } else {
                this.logUtils.debug(
                  `Transfer not relevant in PaymentRepository, transferId: ${transfer.transferId}`,
                );
              }
            } else {
              this.logUtils.warning(
                `Unrecognized transfer in PaymentRepository, transferId: ${transfer.transferId}`,
              );
            }
          }
        }

        return this.paymentUtils.transfersToPayments(relevantTransfers);
      })
      .map((payments) => {
        return payments.reduce((map, obj) => {
          map.set(obj.id, obj);
          return map;
        }, new Map<PaymentId, PushPayment | PullPayment>());
      });
  }

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId the payment to finalize
   * @param amount the amount of the payment to finalize for
   */
  public acceptPayment(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<
    PushPayment | PullPayment,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
    | PaymentFinalizeError
    | InvalidPaymentIdError
  > {
    let browserNode: IBrowserNode;
    let existingTransfers: IFullTransferState[];
    let parameterizedTransferId: TransferId;

    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this._getTransfersByPaymentId(paymentId),
    ])
      .andThen((vals) => {
        [browserNode, existingTransfers] = vals;

        this.logUtils.debug(`Accepting payment ${paymentId}`);

        // get the transfer id from the paymentId
        // use payment utils for this
        return this.paymentUtils.sortTransfers(paymentId, existingTransfers);
      })
      .andThen((sortedTransfers) => {
        return this.paymentUtils
          .getPaymentState(sortedTransfers)
          .andThen((paymentState) => {
            if (paymentState != EPaymentState.Approved) {
              return errAsync<
                IBasicTransferResponse,
                | VectorError
                | BlockchainUnavailableError
                | InvalidPaymentError
                | InvalidParametersError
                | TransferResolutionError
                | PaymentFinalizeError
              >(
                new PaymentFinalizeError(
                  `Cannot finalize payment ${paymentId}, no parameterized transfer exists for this!`,
                ),
              );
            }

            parameterizedTransferId = TransferId(
              sortedTransfers.parameterizedTransfers[0].transferId,
            );

            return this.vectorUtils.resolveParameterizedTransfer(
              parameterizedTransferId,
              paymentId,
              amount,
            );
          })
          .andThen(() => {
            return browserNode.getTransfer(parameterizedTransferId);
          })
          .andThen((transfer) => {
            // Remove the parameterized transfer, and replace it
            // with this latest transfer
            existingTransfers = existingTransfers.filter(
              (obj) => obj.transferId !== parameterizedTransferId,
            );
            existingTransfers.push(transfer);

            // Transfer has been resolved successfully; return the updated payment.
            const updatedPayment = this.paymentUtils.transfersToPayment(
              paymentId,
              existingTransfers,
            );

            return updatedPayment;
          });
      });
  }

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId the payment for which to provide stake for
   */
  public provideStake(
    paymentId: PaymentId,
    gatewayAddress: EthereumAccountAddress,
  ): ResultAsync<
    PushPayment | PullPayment,
    | BlockchainUnavailableError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | InvalidPaymentIdError
    | PaymentCreationError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this._getTransfersByPaymentId(paymentId),
      this.blockchainTimeUtils.getBlockchainTimestamp(),
    ]).andThen(
      ([browserNode, config, context, existingTransfers, timestamp]) => {
        return this.paymentUtils
          .transfersToPayment(paymentId, existingTransfers)
          .andThen((payment) => {
            const paymentSender = payment.from;
            const paymentID = payment.id;
            const paymentStart = timestamp;
            const paymentExpiration = UnixTimestamp(
              paymentStart + config.defaultPaymentExpiryLength,
            );

            // Get the state channel to use
            const stateChannel = context.activeStateChannels.find((asc) => {
              return (
                asc.chainId == payment.chainId &&
                asc.routerPublicIdentifier == payment.routerPublicIdentifier
              );
            });

            if (stateChannel == null) {
              return errAsync(
                new PaymentStakeError(
                  `State channel for payment ${payment.id} does not exist`,
                ),
              );
            }

            // Lookup the chain info
            const paymentChainInfo = config.chainInformation.get(
              payment.chainId,
            );

            if (paymentChainInfo == null) {
              return errAsync(
                new PaymentCreationError(
                  `No registration info for chain id ${payment.chainId} found, although payment ${payment.id} claims to use that chain`,
                ),
              );
            }

            this.logUtils.log(
              `PaymentRepository:provideStake: Creating insurance transfer for paymentId: ${paymentId}`,
            );
            return this.vectorUtils.createInsuranceTransfer(
              stateChannel.channelAddress,
              paymentChainInfo,
              paymentSender,
              gatewayAddress,
              payment.requiredStake,
              paymentExpiration,
              paymentID,
            );
          })
          .andThen((transferInfo) => {
            return browserNode.getTransfer(TransferId(transferInfo.transferId));
          })
          .andThen((transfer) => {
            const allTransfers = [transfer, ...existingTransfers];

            // Transfer has been created successfully; return the updated payment.
            return this.paymentUtils.transfersToPayment(
              paymentId,
              allTransfers,
            );
          });
      },
    );
  }

  /**
   * Singular version of provideAssets
   * Internally, creates a parameterizedPayment with Vector,
   * and returns a payment of state 'Approved'
   * @param paymentId the payment for which to provide an asset for
   */
  public provideAsset(
    paymentId: PaymentId,
  ): ResultAsync<
    PushPayment | PullPayment,
    | BlockchainUnavailableError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | InvalidPaymentIdError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this._getTransfersByPaymentId(paymentId),
      this.blockchainTimeUtils.getBlockchainTimestamp(),
    ]).andThen((vals) => {
      const [browserNode, config, context, existingTransfers, timestamp] = vals;

      return this.paymentUtils
        .transfersToPayment(paymentId, existingTransfers)
        .andThen((payment) => {
          const paymentTokenAddress = payment.paymentToken;
          let paymentTokenAmount: BigNumberString;
          if (payment instanceof PushPayment) {
            paymentTokenAmount = payment.paymentAmount;
          } else if (payment instanceof PullPayment) {
            paymentTokenAmount = payment.authorizedAmount;
          } else {
            this.logUtils.error(
              `Payment was not instance of push or pull payment!`,
            );
            throw new LogicalError(
              "Payment was not instance of push or pull payment!",
            );
          }

          const paymentRecipient = payment.to;
          const paymentID = payment.id;

          // The -1 here is critical to avoiding resolution errors down the road.
          // The way that a parameterized payment's value is calculated, is the blocktime
          // minus the start time. If this is 0, then you have big issues (according to
          // "mathematicians", you can't divide by 0. What do they know?).
          // Since we don't have any assurance that a block has passed between creating the
          // transfer and resolving it, this offset assures this will never happen.
          const paymentStart = UnixTimestamp(timestamp - 1);
          const paymentExpiration = UnixTimestamp(
            timestamp + config.defaultPaymentExpiryLength,
          );

          this.logUtils.log(
            `Providing a payment amount of ${paymentTokenAmount}`,
          );

          // Get the state channel to use
          const stateChannel = context.activeStateChannels.find((asc) => {
            return (
              asc.chainId == payment.chainId &&
              asc.routerPublicIdentifier == payment.routerPublicIdentifier
            );
          });

          if (stateChannel == null) {
            return errAsync<IBasicTransferResponse, InvalidParametersError>(
              new InvalidParametersError(
                `State channel for payment ${payment.id} does not exist`,
              ),
            );
          }

          // Use vectorUtils to create the parameterizedPayment
          return this.vectorUtils.createParameterizedTransfer(
            stateChannel.channelAddress,
            payment instanceof PushPayment
              ? EPaymentType.Push
              : EPaymentType.Pull,
            paymentRecipient,
            paymentTokenAmount,
            paymentTokenAddress,
            paymentID,
            paymentStart,
            paymentExpiration,
            payment instanceof PullPayment ? payment.deltaTime : undefined,
            payment instanceof PullPayment ? payment.deltaAmount : undefined,
          );
        })
        .andThen((transferInfo) => {
          return browserNode.getTransfer(TransferId(transferInfo.transferId));
        })
        .andThen((transfer) => {
          const allTransfers = [transfer, ...existingTransfers];

          // Transfer has been created successfully; return the updated payment.
          return this.paymentUtils.transfersToPayment(paymentId, allTransfers);
        });
    });
  }

  /**
   * Release transfer insurance with 0 value
   * @param paymentId the payment for which to resolve insurance for
   * @param transferId the transferId for which to resolve insurance for
   * @param amount the value of insurance to resolve, usually 0.
   * @param gatewaySignature if resolving for more than 0, this will be non-null, with a signature provided by the gateway.
   */
  public resolveInsurance(
    paymentId: PaymentId,
    transferId: TransferId,
    amount: BigNumberString,
    gatewaySignature: Signature | null,
  ): ResultAsync<void, TransferResolutionError> {
    return this.vectorUtils
      .resolveInsuranceTransfer(transferId, paymentId, gatewaySignature, amount)
      .map(() => {});
  }

  public finalizePayment(
    payment: PushPayment | PullPayment,
  ): ResultAsync<
    void,
    TransferResolutionError | VectorError | BlockchainUnavailableError
  > {
    return this.vectorUtils
      .resolveMessageTransfer(
        TransferId(payment.details.offerTransfers[0].transferId),
      )
      .map(() => {});
  }

  protected reservedPaymentMap = new Map<string, PaymentId>();
  public addReservedPaymentId(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, never> {
    this.reservedPaymentMap.set(requestId, paymentId);
    return okAsync(undefined);
  }

  public getReservedPaymentIdByRequestId(
    requestId: string,
  ): ResultAsync<PaymentId | null, never> {
    return okAsync(this.reservedPaymentMap.get(requestId) ?? null);
  }
}
