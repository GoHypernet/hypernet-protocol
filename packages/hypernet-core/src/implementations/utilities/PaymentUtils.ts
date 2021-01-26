import {
  BigNumber,
  EthereumAddress,
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PullAmount,
  PullPayment,
  PushPayment,
  ResultAsync,
  SortedTransfers,
} from "@interfaces/objects";
import {
  InvalidParametersError,
  InvalidPaymentError,
  InvalidPaymentIdError,
  LogicalError,
  VectorError,
} from "@interfaces/objects/errors";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import {
  IBrowserNode,
  IConfigProvider,
  IFullTransferState,
  ILogUtils,
  IPaymentIdUtils,
  IPaymentUtils,
} from "@interfaces/utilities";
import moment from "moment";
import { combine, errAsync, okAsync } from "neverthrow";
import { v4 as uuidv4 } from "uuid";

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
  ) {}

  /**
   * Verifies that the paymentId provided has domain matching Hypernet's domain name.
   * @param paymentId the payment ID to check
   */
  public isHypernetDomain(paymentId: string): ResultAsync<boolean, InvalidPaymentIdError> {
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
  public createPaymentId(paymentType: EPaymentType): ResultAsync<string, InvalidParametersError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this.paymentIdUtils.makePaymentId(config.hypernetProtocolDomain, paymentType, uuidv4());
    });
  }

  /**
   * Given a SortedTransfers object and associated data about the payment, return a PushPayment object.
   * @param paymentId the paymentId for the provided SortedTransfers
   * @param to the destination public id for the payment
   * @param from the sender public id for the payment
   * @param state the current payment state
   * @param sortedTransfers the set of SortedTransfers for this payment
   * @param metadata the IHypernetTransferMetadata for this payment
   */
  public transfersToPushPayment(
    paymentId: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
    metadata: IHypernetTransferMetadata,
  ): ResultAsync<PushPayment, Error> {
    /**
     * Push payments consist of 3 transfers:
     * MessageTransfer - 0 value, represents an offer
     * InsuranceTransfer - service operator puts up to guarantee the sender's funds
     * ParameterizedPayment - the payment to the service operator
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new Error("Push payment has pull transfers!");
    }

    const amountStaked =
      sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

    return okAsync(
      new PushPayment(
        paymentId,
        to,
        from,
        state,
        sortedTransfers.offerTransfer.assetId,
        BigNumber.from(metadata.requiredStake),
        BigNumber.from(amountStaked),
        moment().unix() + 60 * 60,
        false,
        moment().unix(),
        moment().unix(),
        BigNumber.from(0),
        metadata.disputeMediator,
        BigNumber.from(metadata.paymentAmount),
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
   * @param metadata the IHypernetTransferMetadata for this payment
   */
  public transfersToPullPayment(
    paymentId: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
    metadata: IHypernetTransferMetadata,
  ): ResultAsync<PullPayment, Error> {
    /**
     * Push payments consist of 3 transfers, a null transfer for 0 value that represents the
     * offer, an insurance payment, and a parameterized payment.
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new Error("Push payment has pull transfers!");
    }

    const amountStaked =
      sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

    return okAsync(
      new PullPayment(
        paymentId,
        to,
        from,
        state,
        sortedTransfers.offerTransfer.assetId,
        BigNumber.from(metadata.requiredStake),
        BigNumber.from(amountStaked),
        moment().unix() + 60 * 60,
        false,
        moment.unix(metadata.creationDate).unix(),
        moment().unix(),
        BigNumber.from(0),
        metadata.disputeMediator,
        BigNumber.from(metadata.paymentAmount),
        BigNumber.from(0),
        new Array<PullAmount>(),
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
    paymentId: string,
    transfers: IFullTransferState[],
    config: HypernetConfig,
    browserNode: IBrowserNode,
  ): ResultAsync<Payment, InvalidPaymentError | InvalidParametersError> {
    // const signerAddress = getSignerAddressFromPublicIdentifier(context.publicIdentifier);
    const domainRes = this.paymentIdUtils.getDomain(paymentId);
    const paymentTypeRes = this.paymentIdUtils.getType(paymentId);
    const idRes = this.paymentIdUtils.getUUID(paymentId);

    if (domainRes.isErr()) {
      return errAsync(domainRes.error);
    }

    // TODO: This should probably be encapsulated down lower; getDomain() is probably unnecessary and and invalid domain should just result in an InvalidPaymentIdError from getType and getUUID.
    if (domainRes.value !== config.hypernetProtocolDomain) {
      return errAsync(new InvalidParametersError(`Invalid payment domain: '${domainRes.value}'`));
    }

    if (paymentTypeRes.isErr()) {
      return errAsync(paymentTypeRes.error);
    }

    if (idRes.isErr()) {
      return errAsync(idRes.error);
    }

    return this.sortTransfers(paymentId, transfers, browserNode).andThen((sortedTransfers) => {
      // Determine the state of the payment. All transfers we've been given are
      // "Active", therefore, not resolved. So we don't need to figure out if
      // the transfer is resolved, we know it's not.
      // Given that info, the payment state is never going to be Finalized,
      // because those transfers disappear.

      let paymentState = EPaymentState.Proposed;
      if (sortedTransfers.insuranceTransfer != null && sortedTransfers.parameterizedTransfer == null) {
        paymentState = EPaymentState.Staked;
      } else if (sortedTransfers.insuranceTransfer != null && sortedTransfers.parameterizedTransfer != null) {
        paymentState = EPaymentState.Approved;
      }

      // TODO: Figure out how to determine if the payment is Disputed

      if (paymentTypeRes.value === EPaymentType.Pull) {
        return this.transfersToPullPayment(
          paymentId,
          sortedTransfers.metadata.to,
          sortedTransfers.metadata.from,
          paymentState,
          sortedTransfers,
          sortedTransfers.offerTransfer.meta,
        );
      } else if (paymentTypeRes.value === EPaymentType.Push) {
        return this.transfersToPushPayment(
          paymentId,
          sortedTransfers.metadata.to,
          sortedTransfers.metadata.from,
          paymentState,
          sortedTransfers,
          sortedTransfers.offerTransfer.meta,
        );
      }

      return errAsync(new InvalidPaymentError(`Payment type ${paymentTypeRes.value} is unsupported!`));
    });
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
    config: HypernetConfig,
    _context: InitializedHypernetContext,
    browserNode: IBrowserNode,
  ): ResultAsync<Payment[], InvalidPaymentError> {
    // First step, get the transfer types for all the transfers
    const transferTypeResults = [];
    for (const transfer of transfers) {
      transferTypeResults.push(this.getTransferTypeWithTransfer(transfer, browserNode));
    }

    return combine(transferTypeResults).andThen((transferTypesWithTransfers) => {
      const transfersByPaymentId = new Map<string, IFullTransferState[]>();
      for (const { transferType, transfer } of transferTypesWithTransfers) {
        let paymentId: string;
        if (transferType === ETransferType.Offer) {
          // @todo also add in PullRecord type)
          const metadata: IHypernetTransferMetadata = JSON.parse(transfer.transferState.message);
          paymentId = metadata.paymentId;
        } else if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
          paymentId = transfer.transferState.UUID;
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
      const paymentResults = new Array<ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>>();
      transfersByPaymentId.forEach((transferArray, paymentId) => {
        const paymentResult = this.transfersToPayment(paymentId, transferArray, config, browserNode);
        paymentResults.push(paymentResult);
      });

      return combine(paymentResults);
    });
  }

  /**
   * Given a (vector) transfer @ IFullTransferState, return the transfer type (as ETransferType)
   * @param transfer the transfer to get the transfer type of
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public getTransferType(
    transfer: IFullTransferState,
    browserNode: IBrowserNode,
  ): ResultAsync<ETransferType, VectorError | LogicalError> {
    // TransferDefinition here is the ETH address of the transfer
    // We need to get the registered transfer definitions as canonical by the browser node
    return browserNode.getRegisteredTransfers(1337).andThen((registeredTransfers) => {
      // registeredTransfers.name = 'Insurance', registeredTransfers.definition = <address>, transfer.transferDefinition = <address>
      const transferMap: Map<EthereumAddress, string> = new Map();
      for (const registeredTransfer of registeredTransfers) {
        transferMap.set(registeredTransfer.definition, registeredTransfer.name);
      }

      // If the transfer address is not one we know, we don't know what this is
      if (!transferMap.has(transfer.transferDefinition)) {
        this.logUtils.log(
          `Transfer type not recognized. Transfer definition: ${
            transfer.transferDefinition
          }, transferMap: ${JSON.stringify(transferMap)}`,
        );
        return okAsync(ETransferType.Unrecognized);
      } else {
        // This is a transfer we know about, but not necessarily one we want.
        // Narrow down to insurance, parameterized, or  offer/messagetransfer
        const thisTransfer = transferMap.get(transfer.transferDefinition);
        if (thisTransfer == null) {
          return errAsync(new LogicalError("Transfer type not unrecognized, but not in transfer map!"));
        }

        // Now we know it's either insurance, parameterized, or messageTransfer
        if (thisTransfer === "Insurance") {
          return okAsync(ETransferType.Insurance);
        } else if (thisTransfer === "Parameterized") {
          return okAsync(ETransferType.Parameterized);
        } else if (thisTransfer === "MessageTransfer") {
          // @todo check if this is a PullRecord vs an Offer subtype!
          return okAsync(ETransferType.Offer);
        } else {
          return errAsync(new LogicalError("Unreachable code was not unreachable!"));
        }
      }
    });
  }

  /**
   * Exactly the same as getTransferType but also returns the source transfer,
   * useful when dealing with combine() and other contexts where it is easy
   * to loose track of which transfer you are getting the type for.
   */
  public getTransferTypeWithTransfer(
    transfer: IFullTransferState,
    browserNode: IBrowserNode,
  ): ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | Error> {
    return this.getTransferType(transfer, browserNode).map((transferType) => {
      return { transferType, transfer };
    });
  }

  /**
   * Given a paymentID and matching transfers for this paymentId, return the SortedTransfers object associated.
   * SortedTransfers is an object containing up to 1 of each of Offer, Insurance, Parameterized, PullRecord, and
   * the metadata associated with this payment (as IHypernetTransferMetadata).
   * @param _paymentId the paymentId for the provided transfers
   * @param transfers the transfers to sort
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public sortTransfers(
    _paymentId: string,
    transfers: IFullTransferState[],
    browserNode: IBrowserNode,
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError | Error> {
    // @todo We need to do a lookup for non-active transfers for the payment ID.
    // let inactiveTransfers = await browserNode.getTransfers((transfer) => {return transfer.meta.paymentId == fullPaymentId;});
    // transfers.concat(inactiveTransfers);

    const offerTransfers: IFullTransferState[] = [];
    const insuranceTransfers: IFullTransferState[] = [];
    const parameterizedTransfers: IFullTransferState[] = [];
    const pullTransfers: IFullTransferState[] = [];
    const unrecognizedTransfers: IFullTransferState[] = [];

    const transferTypeResults = new Array<
      ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | Error>
    >();
    for (const transfer of transfers) {
      transferTypeResults.push(this.getTransferTypeWithTransfer(transfer, browserNode));
    }

    return combine(transferTypeResults).andThen((transferTypesWithTransfers) => {
      for (const { transferType, transfer } of transferTypesWithTransfers) {
        if (transferType === ETransferType.Offer) {
          offerTransfers.push(transfer);
        } else if (transferType === ETransferType.Insurance) {
          insuranceTransfers.push(transfer);
        } else if (transferType === ETransferType.Parameterized) {
          parameterizedTransfers.push(transfer);
        } else if (transferType === ETransferType.PullRecord) {
          pullTransfers.push(transfer);
        } else if (transferType === ETransferType.Unrecognized) {
          unrecognizedTransfers.push(transfer);
        } else {
          this.logUtils.log("Unreachable code reached!");
          unrecognizedTransfers.push(transfer);
        }
      }

      this.logUtils.log(`
        PaymentUtils:sortTransfers
  
        offerTransfers: ${offerTransfers.length}
        insuranceTransfers: ${insuranceTransfers.length}
        parameterizedTransfers: ${parameterizedTransfers.length}
        pullTransfers: ${pullTransfers.length}
        unrecognizedTransfers: ${unrecognizedTransfers.length}
      `);

      if (unrecognizedTransfers.length > 0) {
        return errAsync(new InvalidPaymentError("Payment includes unrecognized transfer types!"));
      }

      if (offerTransfers.length !== 1) {
        // TODO: this could be handled more elegantly; if there's other payments
        // but no offer, it's still a valid payment
        return errAsync(new InvalidPaymentError("Invalid payment, no offer transfer!"));
      }
      const offerTransfer = offerTransfers[0];

      let insuranceTransfer: IFullTransferState | null = null;
      if (insuranceTransfers.length === 1) {
        insuranceTransfer = insuranceTransfers[0];
      } else if (insuranceTransfers.length > 1) {
        return errAsync(new InvalidPaymentError("Invalid payment, too many insurance transfers!"));
      }

      let parameterizedTransfer: IFullTransferState | null = null;
      if (parameterizedTransfers.length === 1) {
        parameterizedTransfer = parameterizedTransfers[0];
      } else if (parameterizedTransfers.length > 1) {
        return errAsync(new InvalidPaymentError("Invalid payment, too many parameterized transfers!"));
      }

      return okAsync(
        new SortedTransfers(offerTransfer, insuranceTransfer, parameterizedTransfer, pullTransfers, offerTransfer.meta),
      );
    });
  }
}
