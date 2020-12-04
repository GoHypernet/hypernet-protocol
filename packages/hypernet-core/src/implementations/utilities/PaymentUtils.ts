import { IConfigProvider, IPaymentUtils, IVectorUtils} from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";
import {
  BigNumber,
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PullAmount,
  PullPayment,
  PushPayment,
  SortedTransfers,
} from "@interfaces/objects";
import { FullTransferState } from "@connext/vector-types";
import { BrowserNode } from "@connext/vector-browser-node";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import moment from "moment";

export abstract class PaymentIdUtils {
  
  /**
   * Returns an ascii representation of the domain portion of the paymentID string.
   * (characters 0-19 of the paymentIdString)
   * @param paymentIdString 
   */
  public static getDomain(paymentIdString: string): string {
    if (!this.isValidPaymentId(paymentIdString)) throw new Error(`Not a valid paymentId: '${paymentIdString}'`)
    const domainHex = paymentIdString.substr(0, 20)
    const domain = Buffer.from(domainHex, 'hex').toString('ascii')
    if (domain.length != 10) throw new Error(`Domain was not 10 characters long, got '${domain}'`)
    return domain.trim()
  }

  /**
   * Returns an ascii representation of the type portion of the paymentID string.
   * (characters 20-31 of the paymentIdString)
   * @param paymentIdString 
   */
  public static getType(paymentIdString: string): string {
    if (!this.isValidPaymentId(paymentIdString)) throw new Error(`Not a valid paymentId: '${paymentIdString}'`)
    const typeHex = paymentIdString.substr(20, 12)
    const type = Buffer.from(typeHex, 'hex').toString('ascii')
    if (type.length != 6) throw new Error(`Type was not 6 characters long, got '${type}'`)
    return type.trim()
  }

  /**
   * Returns the UUID portion of the paymentID string.
   * (characters 32-63 of the paymentIdString)
   * @param paymentIdString 
   */
  public static getUUID(paymentIdString: string): string {
    if (!this.isValidPaymentId(paymentIdString)) throw new Error(`Not a valid paymentId: '${paymentIdString}'`)
    const UUID = paymentIdString.substr(32, 32)
    return UUID
  }

  /**
   * 
   * @param paymentIdString 
   */
  public static isValidPaymentId(paymentIdString: string): boolean {
    const overallRegex = /[0-9A-Fa-f]{64}$/;
    const domainRegex = /[0-9A-Fa-f]{1,20}$/;
    const typeRegex = /[0-9A-Fa-f]{1,12}$/;
    const uuidRegex = /[0-9A-Fa-f]{32}$/;

    if (!overallRegex.test(paymentIdString)) throw new Error(`Payment ID must be 64 hexadecimal characters! Got: ${overallRegex}`)

    // Bytes 0-9 are the domain (characters 0-19)
    // Bytes 10-15 are the type (characters 20-31)
    // Bytes 16-31 are the UUID (characters 32-63)

    const domain = paymentIdString.substr(0, 20)
    const type = paymentIdString.substr(20, 12)
    const uuid = paymentIdString.substr(32, 32)

    if (!domainRegex.test(domain)) throw new Error(`Domain must be exactly 10 hex characters or less, got ${domain}`)
    if (!typeRegex.test(type)) throw new Error(`Type must be 6 exactly hex characters or less, got ${type}`)
    if (!uuidRegex.test(uuid)) throw new Error(`UUID must be exactly 32 hex characters, got ${uuid}`)

    return true
  }

  /**
   * Given domain, type, and uuid, returns the computed paymentId
   * @param domain Alphanumeric string of 10 characters or less
   * @param type Alphanumeric string of 6 characters or less
   * @param uuid Hex string of 32 characterx exactly
   */
  public static makePaymentId(domain: string, type: string, uuid: string): string {
    const domainRegex = /[0-9A-Za-z]{1,10}$/;
    const typeRegex = /[0-9A-Za-z]{1,6}$/;
    const uuidRegex = /[0-9A-Fa-f]{32}$/;

    // strip out dashes from the uuid first
    uuid = uuid.split('-').join('')

    if (!domainRegex.test(domain)) throw new Error(`Domain must be 10 alphanumeric characters or less, got ${domain}`)
    if (!typeRegex.test(type)) throw new Error(`Type must be 6 alphanumeric characters or less, got ${type}`)
    if (!uuidRegex.test(uuid)) throw new Error(`UUID must be exactly 16 hex characters, got ${uuid}`)

    // Pad with spaces to reach static lengths
    domain = domain.padEnd(10)
    type = type.padEnd(6)

    // Convert domain and type to hex (/w ascii encoding)
    const domainHex = Buffer.from(domain, "ascii").toString('hex')
    const typeHex = Buffer.from(type, "ascii").toString('hex')

    // Sanity check
    if (domainHex.length != 20) throw new Error(`Domain hex wasn't 20 chars long, got '${domainHex}'`)
    if (typeHex.length != 12) throw new Error(`Type hex wasn't 12 chars long, got '${typeHex}'`)
    
    let paymentId = (domainHex + typeHex + uuid)
    if (!PaymentIdUtils.isValidPaymentId(paymentId)) throw new Error(`Invalid paymentId: '${paymentId}'`)

    return paymentId
  }
}

export class PaymentUtils implements IPaymentUtils {
  constructor(protected configProvider: IConfigProvider) {}

  /**
   *
   * @param paymentId
   */
  public async isHypernetDomain(paymentId: string): Promise<boolean> {
    const config = await this.configProvider.getConfig();
    return PaymentIdUtils.getDomain(paymentId) === config.hypernetProtocolDomain;
  }

  /**
   * Creates a 32 byte payment ID of format:
   * <domain-10-bytes><payment-type-6-bytes><UUID-16-bytes>
   * @param paymentType
   */
  public async createPaymentId(paymentType: EPaymentType): Promise<string> {
    const config = await this.configProvider.getConfig();
    const paymentId = PaymentIdUtils.makePaymentId(config.hypernetProtocolDomain, paymentType, uuidv4())
    return paymentId
  }

  /**
   *
   * @param id
   * @param to
   * @param from
   * @param state
   * @param sortedTransfers
   * @param metadata
   */
  public transfersToPushPayment(
    id: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
    metadata: IHypernetTransferMetadata,
  ): PushPayment {
    /**
     * Push payments consist of 3 transfers, a null transfer for 0 value that represents the
     * offer, an insurance payment, and a parameterized payment.
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new Error("Push payment has pull transfers!");
    }

    const amountStaked =
      sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

    return new PushPayment(
      id,
      to,
      from,
      state,
      sortedTransfers.offerTransfer.assetId,
      BigNumber.from(metadata.requiredStake),
      BigNumber.from(amountStaked),
      102,
      false,
      moment(),
      moment(),
      BigNumber.from(0),
      metadata.disputeMediator,
      BigNumber.from(metadata.paymentAmount),
    );
  }

  /**
   *
   * @param id
   * @param to
   * @param from
   * @param state
   * @param sortedTransfers
   * @param metadata
   */
  public transfersToPullPayment(
    id: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
    metadata: IHypernetTransferMetadata,
  ): PullPayment {
    /**
     * Push payments consist of 3 transfers, a null transfer for 0 value that represents the
     * offer, an insurance payment, and a parameterized payment.
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new Error("Push payment has pull transfers!");
    }

    const amountStaked =
      sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

    return new PullPayment(
      id,
      to,
      from,
      state,
      sortedTransfers.offerTransfer.assetId,
      BigNumber.from(metadata.requiredStake),
      BigNumber.from(amountStaked),
      102,
      false,
      moment.unix(metadata.creationDate),
      moment(),
      BigNumber.from(0),
      metadata.disputeMediator,
      BigNumber.from(metadata.paymentAmount),
      BigNumber.from(0),
      new Array<PullAmount>(),
    );
  }

  /**
   *
   * @param paymentId
   * @param transfers
   * @param config
   * @param browserNode
   */
  public async transfersToPayment(
    paymentId: string,
    transfers: FullTransferState[],
    config: HypernetConfig,
    browserNode: BrowserNode,
  ): Promise<Payment> {
    // const signerAddress = getSignerAddressFromPublicIdentifier(context.publicIdentifier);  
    const domain = PaymentIdUtils.getDomain(paymentId)
    const paymentType = PaymentIdUtils.getType(paymentId)
    const id = PaymentIdUtils.getUUID(paymentId)

    if (domain !== config.hypernetProtocolDomain) {
      throw new Error(`Invalid payment domain: '${domain}'`);
    }

    if (id === "" || id == null) {
      throw new Error(`Missing id component of paymentId`);
    }

    const sortedTransfers = await this.sortTransfers(paymentId, transfers, browserNode);

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

    if (paymentType === EPaymentType.Pull) {
      return this.transfersToPullPayment(
        paymentId,
        sortedTransfers.metadata.to,
        sortedTransfers.metadata.from,
        paymentState,
        sortedTransfers,
        sortedTransfers.offerTransfer.meta,
      );
    } else if (paymentType === EPaymentType.Push) {
      return this.transfersToPushPayment(
        paymentId,
        sortedTransfers.metadata.to,
        sortedTransfers.metadata.from,
        paymentState,
        sortedTransfers,
        sortedTransfers.offerTransfer.meta,
      );
    } else {
      throw new Error(`Unknown`);
    }
  }

  /**
   * Given an array of Vector transfers, return the corresponding Hypernet Payments
   * @param transfers
   * @param config
   * @param context
   * @param browserNode
   */
  public async transfersToPayments(
    transfers: FullTransferState[],
    config: HypernetConfig,
    context: InitializedHypernetContext,
    browserNode: BrowserNode,
  ): Promise<Payment[]> {
    // First, we are going to sort the transfers into buckets based on their payment_id
    const transfersByPaymentId = new Map<string, FullTransferState[]>();
    for (const transfer of transfers) {
      console.log(transfer.meta)
      if (!(transfer.meta && transfer.meta.paymentId)) continue;
      const paymentId = transfer.meta.paymentId;

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
    const paymentPromises = new Array<Promise<Payment>>();
    transfersByPaymentId.forEach(async (transferArray, paymentId) => {
      const payment = this.transfersToPayment(paymentId, transferArray, config, browserNode);

      paymentPromises.push(payment);
    });

    // Convert all the transfers to payments
    const payments = await Promise.all(paymentPromises);

    return payments;
  }

  /**
   *
   * @param transfer
   */
  public getTransferType(transfer: FullTransferState): ETransferType {
    // Have to jump through some hoops here
    // TODO: Fix this.
    return ETransferType.Offer;
  }

  /**
   *
   * @param paymentId
   * @param transfers
   * @param browserNode
   */
  protected async sortTransfers(
    paymentId: string,
    transfers: FullTransferState[],
    browserNode: BrowserNode,
  ): Promise<SortedTransfers> {
    // We need to do a lookup for non-active transfers for the payment ID.
    // TODO
    // let inactiveTransfers = await browserNode.getTransfers((transfer) => {return transfer.meta.paymentId == fullPaymentId;});
    // transfers.concat(inactiveTransfers);

    const offerTransfers = transfers.filter((val) => {
      return this.getTransferType(val) === ETransferType.Offer;
    });

    const insuranceTransfers = transfers.filter((val) => {
      return this.getTransferType(val) === ETransferType.Insurance;
    });

    const parameterizedTransfers = transfers.filter((val) => {
      return this.getTransferType(val) === ETransferType.Parameterized;
    });

    const pullTransfers = transfers.filter((val) => {
      return this.getTransferType(val) === ETransferType.PullRecord;
    });

    const unrecognizedTransfers = transfers.filter((val) => {
      return this.getTransferType(val) === ETransferType.Unrecognized;
    });

    if (unrecognizedTransfers.length > 0) {
      throw new Error("Payment includes unrecognized transfer types!");
    }

    if (offerTransfers.length !== 1) {
      // TODO: this could be handled more elegantly; if there's other payments
      // but no offer, it's still a valid payment
      throw new Error("Invalid payment, no offer transfer!");
    }
    const offerTransfer = offerTransfers[0];

    let insuranceTransfer: FullTransferState | null = null;
    if (insuranceTransfers.length === 1) {
      insuranceTransfer = insuranceTransfers[0];
    } else if (insuranceTransfers.length > 1) {
      throw new Error("Invalid payment, too many insurance transfers!");
    }

    let parameterizedTransfer: FullTransferState | null = null;
    if (parameterizedTransfers.length === 1) {
      parameterizedTransfer = parameterizedTransfers[0];
    } else if (parameterizedTransfers.length > 1) {
      throw new Error("Invalid payment, too many parameterized transfers!");
    }

    return new SortedTransfers(
      offerTransfer,
      insuranceTransfer,
      parameterizedTransfer,
      pullTransfers,
      offerTransfer.meta,
    );
  }
}
