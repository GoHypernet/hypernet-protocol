import {
  IHypernetOfferDetails,
  PullAmount,
  PullPayment,
  PushPayment,
  SortedTransfers,
  IFullTransferState,
  IHypernetPullPaymentDetails,
  BlockchainUnavailableError,
  PaymentId,
  UUID,
  TransferId,
  InvalidParametersError,
  InvalidPaymentError,
  InvalidPaymentIdError,
  VectorError,
  EPaymentState,
  EPaymentType,
  ETransferState,
  ETransferType,
  InsuranceState,
  MessageState,
  ParameterizedState,
  BigNumberString,
  UnixTimestamp,
  LogicalError,
  MessageResolver,
  InsuranceResolver,
  ParameterizedResolver,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ITimeUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { v4 as uuidv4 } from "uuid";

import {
  IBrowserNodeProvider,
  IConfigProvider,
  IPaymentIdUtils,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";

/**
 * A class for creating Hypernet-Payment objects from Vector transfers, verifying information
 * about payment Ids, sorting transfers, and other related stuff.
 */
export class PaymentUtils implements IPaymentUtils {
  /**
   * Return an instance of PaymentUtils.
   */
  constructor(
    protected configProvider: IConfigProvider,
    protected logUtils: ILogUtils,
    protected paymentIdUtils: IPaymentIdUtils,
    protected vectorUtils: IVectorUtils,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected timeUtils: ITimeUtils,
  ) {}

  /**
   * Verifies that the paymentId provided has domain matching Hypernet's domain name.
   * @param paymentId the payment ID to check
   */
  public isHypernetDomain(
    paymentId: PaymentId,
  ): ResultAsync<boolean, InvalidPaymentIdError> {
    return this.configProvider.getConfig().andThen((config) => {
      const domainRes = this.paymentIdUtils.getDomain(paymentId);

      if (domainRes.isErr()) {
        return errAsync(domainRes.error);
      }
      return okAsync(domainRes.value === config.hypernetProtocolDomain);
    });
  }

  /**
   * Creates a 32 byte payment ID of format:
   * <domain-10-bytes><payment-type-6-bytes><UUID-16-bytes>
   * @param paymentType the payment type for the id - PUSH or PULL
   */
  public createPaymentId(
    paymentType: EPaymentType,
  ): ResultAsync<PaymentId, InvalidParametersError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this.paymentIdUtils.makePaymentId(
        config.hypernetProtocolDomain,
        paymentType,
        UUID(uuidv4()),
      );
    });
  }

  /**
   * Given a SortedTransfers object and associated data about the payment, return a PushPayment object.
   * @param paymentId the paymentId for the provided SortedTransfers
   * @param to the destination public id for the payment
   * @param from the sender public id for the payment
   * @param state the current payment state
   * @param sortedTransfers the set of SortedTransfers for this payment
   * @param metadata the IHypernetOfferDetails for this payment
   */
  public transfersToPushPayment(
    paymentId: PaymentId,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PushPayment, never> {
    /**
     * Push payments consist of 3 transfers:
     * MessageTransfer - 0 value, represents an offer
     * InsuranceTransfer - service operator puts up to guarantee the sender's funds
     * ParameterizedPayment - the payment to the service operator
     */
    let offerDetails: IHypernetOfferDetails;

    // If payment is Borked it may have no offerTransfers
    if (sortedTransfers?.offerTransfers[0] == null) {
      offerDetails = {} as IHypernetOfferDetails;
    } else {
      offerDetails = JSON.parse(
        (sortedTransfers.offerTransfers[0].transferState as MessageState)
          .message,
      );
    }

    let amountStaked = BigNumberString("0");
    let insuranceTransferId: TransferId | null = null;
    if (sortedTransfers.insuranceTransfers.length > 0) {
      amountStaked = BigNumberString(
        sortedTransfers.insuranceTransfers[0].balance.amount[0],
      );
      insuranceTransferId = TransferId(
        sortedTransfers.insuranceTransfers[0].transferId,
      );
    }
    const paymentAmount = offerDetails.paymentAmount;

    let amountTransfered = BigNumberString("0");
    let parameterizedTransferId: TransferId | null = null;
    let paymentToken = offerDetails.paymentToken;
    if (sortedTransfers.parameterizedTransfers.length > 0) {
      amountTransfered = BigNumberString(
        sortedTransfers.parameterizedTransfers[0].balance.amount[0],
      );
      parameterizedTransferId = TransferId(
        sortedTransfers.parameterizedTransfers[0].transferId,
      );
      paymentToken = EthereumContractAddress(
        sortedTransfers.parameterizedTransfers[0].assetId,
      );
    }

    return okAsync(
      new PushPayment(
        paymentId,
        offerDetails.routerPublicIdentifier,
        offerDetails.chainId,
        offerDetails.to,
        offerDetails.from,
        state,
        paymentToken,
        offerDetails.requiredStake,
        amountStaked,
        offerDetails.expirationDate,
        offerDetails.creationDate,
        this.timeUtils.getUnixNow(),
        BigNumberString("0"),
        offerDetails.gatewayUrl,
        sortedTransfers,
        offerDetails.metadata,
        paymentAmount,
        amountTransfered,
      ),
    );
  }

  /**
   * Given a SortedTransfers object and associated data about the payment, return a PullPayment object.
   * @param paymentId the paymentId for the provided SortedTransfers
   * @param to the destination public id for the payment
   * @param from the sender public id for the payment
   * @param state the current payment state
   * @param sortedTransfers the set of SortedTransfers for this payment
   * @param metadata the IHypernetOfferDetails for this payment
   */
  public transfersToPullPayment(
    paymentId: PaymentId,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PullPayment, never> {
    /**
     * Pull payments consist of 3+ transfers, a null transfer for 0 value that represents the
     * offer, an insurance payment, and a parameterized payment.
     */
    let amountStaked = BigNumberString("0");
    let insuranceTransferId: TransferId | null = null;
    if (sortedTransfers.insuranceTransfers.length > 0) {
      amountStaked = BigNumberString(
        sortedTransfers.insuranceTransfers[0].balance.amount[0],
      );
      insuranceTransferId = TransferId(
        sortedTransfers.insuranceTransfers[0].transferId,
      );
    }

    let offerDetails: IHypernetOfferDetails;

    // If payment is Borked it may have no offerTransfers
    if (sortedTransfers?.offerTransfers[0] == null) {
      offerDetails = {} as IHypernetOfferDetails;
    } else {
      offerDetails = JSON.parse(
        (sortedTransfers.offerTransfers[0].transferState as MessageState)
          .message,
      );
    }

    // Get deltaAmount & deltaTime from the parameterized payment
    if (offerDetails.rate == null) {
      throw new LogicalError(
        "Pull payment offer does not include rate information",
      );
    }

    const deltaAmount = BigNumber.from(offerDetails.rate.deltaAmount);
    const deltaTime = offerDetails.rate.deltaTime;
    let vestedAmount: BigNumber;
    let parameterizedTransferId: TransferId | null = null;

    if (sortedTransfers.parameterizedTransfers.length == 0) {
      // No paramterized transfer, no vested amount!
      vestedAmount = BigNumber.from(0);
    } else {
      // Calculate vestedAmount
      const now = this.timeUtils.getUnixNow();
      const timePassed =
        now -
        Number(sortedTransfers.parameterizedTransfers[0].transferState.start);
      vestedAmount = deltaAmount.div(deltaTime).mul(timePassed);
      parameterizedTransferId = TransferId(
        sortedTransfers.parameterizedTransfers[0].transferId,
      );
    }

    // Convert the PullRecords to PullAmounts
    const pullAmounts = new Array<PullAmount>();

    for (const pullRecord of sortedTransfers.pullRecordTransfers) {
      // Payment might be borked and has no message
      if (pullRecord.transferState != null) {
        const message = JSON.parse(
          pullRecord.transferState.message,
        ) as IHypernetPullPaymentDetails;

        pullAmounts.push(
          new PullAmount(
            BigNumber.from(message.pullPaymentAmount),
            this.vectorUtils.getTimestampFromTransfer(pullRecord),
          ),
        );
      }
    }

    const paymentToken =
      sortedTransfers.parameterizedTransfers.length > 0
        ? EthereumContractAddress(
            sortedTransfers.parameterizedTransfers[0].assetId,
          )
        : offerDetails.paymentToken;

    return okAsync(
      new PullPayment(
        paymentId,
        offerDetails.routerPublicIdentifier,
        offerDetails.chainId,
        offerDetails.to,
        offerDetails.from,
        state,
        paymentToken,
        offerDetails.requiredStake,
        amountStaked,
        UnixTimestamp(this.timeUtils.getUnixNow() + 60 * 60), // 1 hour
        offerDetails.creationDate,
        this.timeUtils.getUnixNow(),
        BigNumberString("0"),
        offerDetails.gatewayUrl,
        sortedTransfers,
        offerDetails.metadata,
        offerDetails.paymentAmount,
        BigNumberString("0"),
        BigNumberString(vestedAmount.toString()),
        deltaTime,
        BigNumberString(deltaAmount.toString()),
        pullAmounts,
      ),
    );
  }

  /**
   * Given a set of Vector transfers that we /know/ are for one specific payment,
   * return the associated payment object.
   * @param paymentId the payment associated with the provided transfers
   * @param transfers the transfers as IFullTransferState
   * @param config instance of HypernetConfig
   * @param browserNode instance of IBrowserNode
   */
  public transfersToPayment(
    paymentId: PaymentId,
    transfers: IFullTransferState[],
  ): ResultAsync<
    PushPayment | PullPayment,
    InvalidPaymentError | InvalidParametersError
  > {
    let paymentType: EPaymentType;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // const signerAddress = getSignerAddressFromPublicIdentifier(context.publicIdentifier);
        const domainRes = this.paymentIdUtils.getDomain(paymentId);
        const paymentTypeRes = this.paymentIdUtils.getType(paymentId);
        const idRes = this.paymentIdUtils.getUUID(paymentId);

        if (domainRes.isErr()) {
          return errAsync<SortedTransfers, InvalidPaymentIdError>(
            domainRes.error,
          );
        }

        // TODO: This should probably be encapsulated down lower; getDomain() is probably unnecessary and and invalid domain should just result in an InvalidPaymentIdError from getType and getUUID.
        if (domainRes.value !== config.hypernetProtocolDomain) {
          return errAsync<SortedTransfers, InvalidParametersError>(
            new InvalidParametersError(
              `Invalid payment domain: '${domainRes.value}'`,
            ),
          );
        }

        if (paymentTypeRes.isErr()) {
          return errAsync<SortedTransfers, InvalidPaymentIdError>(
            paymentTypeRes.error,
          );
        } else {
          paymentType = paymentTypeRes.value;
        }

        if (idRes.isErr()) {
          return errAsync<SortedTransfers, InvalidPaymentIdError>(idRes.error);
        }

        return this.sortTransfers(paymentId, transfers);
      })
      .andThen((sortedTransfers) => {
        return this.getPaymentState(sortedTransfers).andThen((paymentState) => {
          if (paymentType === EPaymentType.Pull) {
            return this.transfersToPullPayment(
              paymentId,
              paymentState,
              sortedTransfers,
            );
          } else if (paymentType === EPaymentType.Push) {
            return this.transfersToPushPayment(
              paymentId,
              paymentState,
              sortedTransfers,
            );
          }

          return errAsync(
            new InvalidPaymentError(
              `Payment type ${paymentType} is unsupported!`,
            ),
          );
        });
      });
  }

  /**
   * Determine the state of the payment. There is really a flowchart for doing this,
   * payments move through a set of states.
   * whether the transfer is resolved or active, and whether or not the transfer
   * matches the terms of the offer.
   *
   * @param sortedTransfers
   * @returns EPaymentState
   */
  public getPaymentState(
    sortedTransfers: SortedTransfers,
  ): ResultAsync<EPaymentState, BlockchainUnavailableError> {
    // We are going to remove all canceled transfers from consideration.
    // Canceled transfers are irrelevant; artifacts of things gone wonky.
    return ResultUtils.combine([
      ResultUtils.map(sortedTransfers.offerTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return { transfer: val, transferState: transferState };
          });
      }),
      ResultUtils.map(sortedTransfers.insuranceTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return { transfer: val, transferState: transferState };
          });
      }),
      ResultUtils.map(sortedTransfers.parameterizedTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return { transfer: val, transferState: transferState };
          });
      }),
      ResultUtils.map(sortedTransfers.pullRecordTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return { transfer: val, transferState: transferState };
          });
      }),
    ]).map((vals) => {
      const [
        offerTransfers,
        insuranceTransfers,
        parameterizedTransfers,
        pullRecordTransfers,
      ] = vals;

      // First thing that can disqualify everything else is if there is no offer transfer
      // at all. This will probably error at higher levels but we should check it here just
      // in case
      if (sortedTransfers.offerTransfers.length == 0) {
        return EPaymentState.Borked;
      }

      // If there are more than 1 offer transfer that is not canceled, that's an invalid proposal
      const nonCanceledOfferTransfers = offerTransfers.filter(
        (val) => val.transferState != ETransferState.Canceled,
      );
      const nonCanceledInsuranceTransfers = insuranceTransfers.filter(
        (val) => val.transferState != ETransferState.Canceled,
      );
      const nonCanceledParameterizedTransfers = parameterizedTransfers.filter(
        (val) => val.transferState != ETransferState.Canceled,
      );

      if (
        nonCanceledOfferTransfers.length > 1 ||
        nonCanceledInsuranceTransfers.length > 1 ||
        nonCanceledParameterizedTransfers.length > 1
      ) {
        return EPaymentState.Borked;
      }

      // If the only offer transfer was canceled, then the whole payment was canceled.
      if (nonCanceledOfferTransfers.length == 0) {
        return EPaymentState.Canceled;
      }

      const offerState = nonCanceledOfferTransfers[0].transferState;

      // The details of the offer are encoded in the transfer state, we'll pull it out
      // and deserialize it to get the hypernet transfer metadata
      const offerDetails: IHypernetOfferDetails = JSON.parse(
        (nonCanceledOfferTransfers[0].transfer.transferState as MessageState)
          .message,
      );

      const hasInsurance = nonCanceledInsuranceTransfers.length == 1;
      const hasParameterized = nonCanceledParameterizedTransfers.length == 1;

      // Payments that only have an offer
      if (!hasInsurance && !hasParameterized) {
        // Now we know we have something we can use. The first state it can be in is Proposed
        if (offerState == ETransferState.Active) {
          return EPaymentState.Proposed;
        }

        // It could also be rejected
        if (offerState == ETransferState.Resolved) {
          return EPaymentState.Rejected;
        }
      }

      // States with insurance
      if (hasInsurance) {
        const insuranceTransfer = nonCanceledInsuranceTransfers[0].transfer;
        const insuranceState = nonCanceledInsuranceTransfers[0].transferState;
        const insuranceValid = this.validateInsuranceTransfer(
          insuranceTransfer,
          offerDetails,
        );

        // Insurance but no parameterized payment
        if (!hasParameterized) {
          // If the insurance is resolved and the offer state is resolved or canceled,
          // then the payment was canceled.
          if (
            offerState == ETransferState.Canceled &&
            insuranceState == ETransferState.Resolved
          ) {
            return EPaymentState.Canceled;
          }

          if (
            offerState == ETransferState.Active &&
            insuranceState == ETransferState.Active &&
            insuranceValid
          ) {
            return EPaymentState.Staked;
          }

          if (
            offerState == ETransferState.Active &&
            insuranceState == ETransferState.Active &&
            !insuranceValid
          ) {
            return EPaymentState.InvalidStake;
          }

          // If there is a resolved insurance payment but no parameterized payemnt,
          // what are we dealing with? TODO
        }

        // Now we can do states with all 3 payments
        if (hasParameterized && insuranceValid) {
          const paymentState =
            nonCanceledParameterizedTransfers[0].transferState;
          const paymentTransfer = nonCanceledParameterizedTransfers[0].transfer;
          const paymentValid = this.validatePaymentTransfer(
            paymentTransfer,
            offerDetails,
          );

          if (
            offerState == ETransferState.Canceled &&
            (insuranceState == ETransferState.Resolved ||
              insuranceState == ETransferState.Canceled) &&
            (paymentState == ETransferState.Resolved ||
              paymentState == ETransferState.Canceled)
          ) {
            return EPaymentState.Canceled;
          }

          if (
            offerState == ETransferState.Active &&
            insuranceState == ETransferState.Active &&
            paymentState == ETransferState.Active &&
            paymentValid
          ) {
            return EPaymentState.Approved;
          }

          if (
            offerState == ETransferState.Active &&
            insuranceState == ETransferState.Active &&
            paymentState == ETransferState.Active &&
            !paymentValid
          ) {
            return EPaymentState.InvalidFunds;
          }

          if (
            offerState == ETransferState.Active &&
            insuranceState == ETransferState.Active &&
            paymentState == ETransferState.Resolved &&
            paymentValid
          ) {
            return EPaymentState.Accepted;
          }

          if (
            offerState == ETransferState.Active &&
            insuranceState == ETransferState.Resolved &&
            paymentState == ETransferState.Resolved &&
            paymentValid
          ) {
            return EPaymentState.InsuranceReleased;
          }

          if (
            offerState == ETransferState.Resolved &&
            insuranceState == ETransferState.Resolved &&
            paymentState == ETransferState.Resolved &&
            paymentValid
          ) {
            return EPaymentState.Finalized;
          }
        }
      }

      // If none of the above states match, the payment is well and truly EPaymentState.Borked
      return EPaymentState.Borked;
    });
  }

  // Returns true if the insurance transfer is
  public validateInsuranceTransfer(
    transfer: IFullTransferState<InsuranceState>,
    offerDetails: IHypernetOfferDetails,
  ): boolean {
    return (
      BigNumber.from(transfer.transferState.collateral).eq(
        BigNumber.from(offerDetails.requiredStake),
      ) && transfer.assetId == offerDetails.insuranceToken
    );
  }

  public validatePaymentTransfer(
    transfer: IFullTransferState<ParameterizedState>,
    offerDetails: IHypernetOfferDetails,
  ): boolean {
    let total = BigNumber.from(0);
    for (const amount of transfer.balance.amount) {
      total = total.add(amount);
    }

    return (
      total.eq(BigNumber.from(offerDetails.paymentAmount)) &&
      transfer.assetId == offerDetails.paymentToken
    );

    // TODO: Validate the rate is set correctly
    // && transfer.transferState.rate == offerDetails.;
  }

  /**
   * Given an array of (unsorted) Vector transfers, return the corresponding Hypernet Payments
   * @param transfers array of unsorted Vector transfers as IFullTransferState
   * @param config instance of HypernetConfig
   * @param _context instance of HypernetContext
   * @param browserNode instance of the IBrowserNode
   */
  public transfersToPayments(
    transfers: IFullTransferState[],
  ): ResultAsync<
    (PushPayment | PullPayment)[],
    VectorError | InvalidPaymentError | InvalidParametersError
  > {
    // First step, get the transfer types for all the transfers
    const transferTypeResults = transfers.map((transfer) => {
      return this.vectorUtils.getTransferTypeWithTransfer(transfer);
    });

    return ResultUtils.combine(transferTypeResults).andThen(
      (transferTypesWithTransfers) => {
        const transfersByPaymentId = new Map<PaymentId, IFullTransferState[]>();
        for (const { transferType, transfer } of transferTypesWithTransfers) {
          let paymentId: PaymentId;
          if (transferType === ETransferType.Offer) {
            // @todo also add in PullRecord type)
            const offerDetails: IHypernetOfferDetails = JSON.parse(
              (transfer as IFullTransferState<MessageState, MessageResolver>)
                .transferState.message,
            );
            paymentId = offerDetails.paymentId;
          } else if (
            transferType === ETransferType.Insurance ||
            transferType === ETransferType.Parameterized
          ) {
            paymentId = (
              transfer as IFullTransferState<
                InsuranceState | ParameterizedState,
                InsuranceResolver | ParameterizedResolver
              >
            ).transferState.UUID;
          } else {
            this.logUtils.log(
              `Transfer type was not recognized, doing nothing. TransferType: '${transfer.transferDefinition}'`,
            );
            continue;
          }

          // Get the existing array of payments. Initialize it if it's not there.
          let transferArray = transfersByPaymentId.get(paymentId);
          if (transferArray === undefined) {
            transferArray = [];
            transfersByPaymentId.set(paymentId, transferArray);
          }

          transferArray.push(transfer);
        }

        // Now we have the transfers sorted by their payment ID.
        // Loop over them and convert them to proper payments.
        // This is all async, so we can do the whole thing in parallel.
        return ResultUtils.combine(
          Array.from(transfersByPaymentId.entries()).map(
            ([paymentId, transferArray]) => {
              return this.transfersToPayment(paymentId, transferArray);
            },
          ),
        );
      },
    );
  }

  /**
   * Given a paymentID and matching transfers for this paymentId, return the SortedTransfers object associated.
   * SortedTransfers is an object containing all Offer, Insurance, Parameterized, PullRecord, and
   * the metadata associated with this payment (as IHypernetOfferDetails).
   * @param _paymentId the paymentId for the provided transfers
   * @param transfers the transfers to sort
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public sortTransfers(
    _paymentId: string,
    transfers: IFullTransferState[],
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError> {
    const offerTransfers: IFullTransferState<MessageState, MessageResolver>[] =
      [];
    const insuranceTransfers: IFullTransferState<
      InsuranceState,
      InsuranceResolver
    >[] = [];
    const parameterizedTransfers: IFullTransferState<
      ParameterizedState,
      ParameterizedResolver
    >[] = [];
    const pullTransfers: IFullTransferState<MessageState, MessageResolver>[] =
      [];
    const unrecognizedTransfers: IFullTransferState[] = [];

    const transferTypeResults = transfers.map((transfer) => {
      return this.vectorUtils.getTransferType(transfer).map((transferType) => {
        if (transferType === ETransferType.Offer) {
          offerTransfers.push(
            transfer as IFullTransferState<MessageState, MessageResolver>,
          );
        } else if (transferType === ETransferType.Insurance) {
          insuranceTransfers.push(
            transfer as IFullTransferState<InsuranceState, InsuranceResolver>,
          );
        } else if (transferType === ETransferType.Parameterized) {
          parameterizedTransfers.push(
            transfer as IFullTransferState<
              ParameterizedState,
              ParameterizedResolver
            >,
          );
        } else if (transferType === ETransferType.PullRecord) {
          pullTransfers.push(
            transfer as IFullTransferState<MessageState, MessageResolver>,
          );
        } else if (transferType === ETransferType.Unrecognized) {
          unrecognizedTransfers.push(transfer);
        } else {
          this.logUtils.log("Unreachable code reached!");
          unrecognizedTransfers.push(transfer);
        }
      });
    });

    return ResultUtils.combine(transferTypeResults).map(() => {
      return new SortedTransfers(
        offerTransfers,
        insuranceTransfers,
        parameterizedTransfers,
        pullTransfers,
      );
    });
  }

  public getEarliestDateFromTransfers(
    transfers: IFullTransferState[],
  ): UnixTimestamp {
    // If there are no transfers, the earliest transfer would be now
    if (transfers.length == 0) {
      return this.timeUtils.getUnixNow();
    }

    // The earliest date should be a message transfer. We put the creation date
    // in each transfer's metadata to make this easier though.
    transfers.sort((a, b) => {
      const aTime = this.vectorUtils.getTimestampFromTransfer(a);
      const bTime = this.vectorUtils.getTimestampFromTransfer(b);

      return aTime > bTime ? 1 : -1;
    });

    return this.vectorUtils.getTimestampFromTransfer(transfers[0]);
  }

  public getFirstTransfer(transfers: IFullTransferState[]): IFullTransferState {
    if (transfers.length == 0) {
      throw new Error("No transfers provided!");
    }

    const earliestDate = this.getEarliestDateFromTransfers(transfers);
    const transfer = transfers.find((val) => {
      return this.vectorUtils.getTimestampFromTransfer(val) == earliestDate;
    });
    if (transfer == null) {
      throw new Error(
        "Offer with earliest timestamp doesn't actually exist...",
      );
    }
    return transfer;
  }
}
