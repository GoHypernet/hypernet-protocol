import { EthereumAddress } from "3box";
import { BrowserNode } from "@connext/vector-browser-node";
import { FullTransferState, NodeResponses } from "@connext/vector-types";
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
  SortedTransfers
} from "@interfaces/objects";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import { IConfigProvider, IPaymentUtils } from "@interfaces/utilities";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

/**
 * An abstract class for creating & converting payment IDs, as well as verifying
 * correctness, and extracting information from the ID (such as type, domain, UUID)
 * 
 * A paymentID is a 64-length hexadecimal string:
 * characters 0-19: domain (encoded as ascii text --> hex)
 * characters 20-32: type  (encoded as ascii text --> hex)
 * characters 32-63: UUID  (encoded as hex)
 */
export abstract class PaymentIdUtils {
  
  /**
   * Returns an ascii representation of the domain portion of the paymentID string.
   * (characters 0-19 of the paymentIdString)
   * @param paymentIdString 
   */
  public static getDomain(paymentIdString: string): string {
    if (!this.isValidPaymentId(paymentIdString)) throw new Error(`Not a valid paymentId: '${paymentIdString}'`)
    const domainHex = paymentIdString.substr(2, 20)
    // console.log(`PaymentIdString: ${paymentIdString}`)
    // console.log(`DomainHex: ${domainHex}`)
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
    const typeHex = paymentIdString.substr(22, 12)
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
    const UUID = paymentIdString.substr(34, 32)
    return UUID
  }

  /**
   * A valid payment ID is exactly 64 characters, hexadecimal, refixed with 0x.
   * @param paymentIdString 
   */
  public static isValidPaymentId(paymentIdString: string): boolean {
    const overallRegex = /^0x[0-9A-Fa-f]{64}$/;
    if (!overallRegex.test(paymentIdString)) throw new Error(`Payment ID must be 64 hexadecimal characters (with 0x prefix)! Got: ${paymentIdString}`)
    return true
  }

  /**
   * Given domain, type, and uuid, returns the computed paymentId
   * @param domain Alphanumeric string of 10 characters or less
   * @param type Alphanumeric string of 6 characters or less
   * @param uuid Hex string of 32 characterx exactly
   */
  public static makePaymentId(domain: string, type: string, uuid: string): string {
    const domainRegex = /^[0-9A-Za-z]{1,10}$/;
    const typeRegex = /^[0-9A-Za-z]{1,6}$/;
    const uuidRegex = /^[0-9A-Fa-f]{32}$/;

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
    // console.log(`Domain: ${domain}`)
    // console.log(`DomainHex: ${domainHex}`)

    const typeHex = Buffer.from(type, "ascii").toString('hex')

    // Sanity check
    if (domainHex.length != 20) throw new Error(`Domain hex wasn't 20 chars long, got '${domainHex}'`)
    if (typeHex.length != 12) throw new Error(`Type hex wasn't 12 chars long, got '${typeHex}'`)
    
    let paymentId = ('0x'+domainHex + typeHex + uuid)
    if (!PaymentIdUtils.isValidPaymentId(paymentId)) throw new Error(`Invalid paymentId: '${paymentId}'`)

    return paymentId
  }
}

/**
 * A class for creating Hypernet-Payment objects from Vector transfers, verifying information
 * about payment Ids, sorting transfers, and other related stuff.
 */
export class PaymentUtils implements IPaymentUtils {

  /**
   * Return an instance of PaymentUtils.
   */
  constructor( protected configProvider: IConfigProvider ) { }

  /**
   * Verifies that the paymentId provided has domain matching Hypernet's domain name.
   * @param paymentId the payment ID to check
   */
  public async isHypernetDomain(paymentId: string): Promise<boolean> {
    const config = await this.configProvider.getConfig();
    return PaymentIdUtils.getDomain(paymentId) === config.hypernetProtocolDomain;
  }

  /**
   * Creates a 32 byte payment ID of format:
   * <domain-10-bytes><payment-type-6-bytes><UUID-16-bytes>
   * @param paymentType the payment type for the id - PUSH or PULL
   */
  public async createPaymentId(paymentType: EPaymentType): Promise<string> {
    const config = await this.configProvider.getConfig();
    const paymentId = PaymentIdUtils.makePaymentId(config.hypernetProtocolDomain, paymentType, uuidv4())
    return paymentId
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
  ): PushPayment {

    /**
     * Push payments consist of 3 transfers: 
     * MessageTransfer - 0 value, represents an offer
     * InsuranceTransfer - service operator puts up to guarantee the sender's funds
     * ParameterizedPayment - the payment to the service operator
     */

    if (sortedTransfers.pullRecordTransfers.length > 0) {
      throw new Error("Push payment has pull transfers!");
    }

    const amountStaked = sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

    return new PushPayment(
      paymentId,
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
      paymentId,
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
   * Given a set of Vector transfers that we /know/ are for one specific payment,
   * return the associated payment object.
   * @param paymentId the payment associated with the provided transfers
   * @param transfers the transfers as FullTransferState
   * @param config instance of HypernetConfig
   * @param browserNode instance of BrowserNode
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
   * Given an array of (unsorted) Vector transfers, return the corresponding Hypernet Payments
   * @param transfers array of unsorted Vector transfers as FullTransferState
   * @param config instance of HypernetConfig
   * @param _context instance of HypernetContext
   * @param browserNode instance of the BrowserNode
   */
  public async transfersToPayments(
    transfers: FullTransferState[],
    config: HypernetConfig,
    _context: InitializedHypernetContext,
    browserNode: BrowserNode,
  ): Promise<Payment[]> {
    // First, we are going to sort the transfers into buckets based on their paymentId
    const transfersByPaymentId = new Map<string, FullTransferState[]>();
    for (const transfer of transfers) {

      // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
      // or a UUID as part of transferState.message (message transfer type)
      let paymentId: string
      let transferType = await this.getTransferType(transfer, browserNode)

      if (transferType == ETransferType.Offer) { // @todo also add in PullRecord type)
        let metadata: IHypernetTransferMetadata = JSON.parse(transfer.transferState.message)
        paymentId = metadata.paymentId
      } else if (transferType == ETransferType.Insurance || transferType == ETransferType.Parameterized) {
        paymentId = transfer.transferState.UUID
      } else {
        console.log(`Transfer type was not recognized, doing nothing. TransferType: '${transfer.transferDefinition}'`)
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
   * Given a (vector) transfer @ FullTransferState, return the transfer type (as ETransferType)
   * @param transfer the transfer to get the transfer type of
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  public async getTransferType(transfer: FullTransferState, browserNode: BrowserNode): Promise<ETransferType> {
    // TransferDefinition here is the ETH address of the transfer
    // We need to get the registered transfer definitions as canonical by the browser node
    let registeredTransfersRes = await browserNode.getRegisteredTransfers({chainId: 1337})
    if (registeredTransfersRes.isError) throw new Error(`Could not get transfer type for transfer: ${transfer}`)

    let registeredTransfers: NodeResponses.GetRegisteredTransfers = registeredTransfersRes.getValue()

    // registeredTransfers.name = 'Insurance', registeredTransfers.definition = <address>, transfer.transferDefinition = <address>
    let transferMap: Map<EthereumAddress, string> = new Map
    for (const transfer of registeredTransfers) {
      transferMap.set(transfer.definition, transfer.name)
    }

    // If the transfer address is not one we know, we don't know what this is
    if (!transferMap.has(transfer.transferDefinition)) {
      console.log(`Transfer type not recognized. Transfer definition: ${transfer.transferDefinition}, transferMap: ${JSON.stringify(transferMap)}`)
      return ETransferType.Unrecognized
    } else {
      // This is a transfer we know about, but not necessarily one we want.
      // Narrow down to insurance, parameterized, or  offer/messagetransfer
      let thisTransfer = transferMap.get(transfer.transferDefinition)
      if (thisTransfer == null) throw new Error('Transfer type not unrecognized, but not in transfer map!')

      // Now we know it's either insurance, parameterized, or messageTransfer
      if (thisTransfer == 'Insurance') {
        return ETransferType.Insurance
      } else if (thisTransfer == 'Parameterized') {
        return ETransferType.Parameterized
      } else if (thisTransfer == 'MessageTransfer') {
        // @todo check if this is a PullRecord vs an Offer subtype!
        return ETransferType.Offer
      } else {
        throw new Error('Unreachable code was not unreachable!')
      }
    }
  }

  /**
   * Given a paymentID and matching transfers for this paymentId, return the SortedTransfers object associated.
   * SortedTransfers is an object containing up to 1 of each of Offer, Insurance, Parameterized, PullRecord, and
   * the metadata associated with this payment (as IHypernetTransferMetadata).
   * @param _paymentId the paymentId for the provided transfers
   * @param transfers the transfers to sort
   * @param browserNode instance of a browserNode so that we can query for registered transfer addresses
   */
  protected async sortTransfers(
    _paymentId: string,
    transfers: FullTransferState[],
    browserNode: BrowserNode,
  ): Promise<SortedTransfers> {

    // @todo We need to do a lookup for non-active transfers for the payment ID.
    // let inactiveTransfers = await browserNode.getTransfers((transfer) => {return transfer.meta.paymentId == fullPaymentId;});
    // transfers.concat(inactiveTransfers);

    let offerTransfers: FullTransferState[] = []
    let insuranceTransfers: FullTransferState[] = []
    let parameterizedTransfers: FullTransferState[] = []
    let pullTransfers: FullTransferState[] = []
    let unrecognizedTransfers: FullTransferState[] = []

    for (let transfer of transfers) {
      let transferType = await this.getTransferType(transfer, browserNode)

      if (transferType === ETransferType.Offer) {
        offerTransfers.push(transfer)
      } else if (transferType === ETransferType.Insurance) {
        insuranceTransfers.push(transfer)
      } else if (transferType === ETransferType.Parameterized) {
        parameterizedTransfers.push(transfer)
      } else if (transferType === ETransferType.PullRecord) {
        pullTransfers.push(transfer)
      } else if (transferType === ETransferType.Unrecognized) {
        unrecognizedTransfers.push(transfer)
      } else {
        throw new Error('Unreachable code reached!')
      }
    }

    console.log(`
      PaymentUtils:sortTransfers

      offerTransfers: ${offerTransfers.length}
      insuranceTransfers: ${insuranceTransfers.length}
      parameterizedTransfers: ${parameterizedTransfers.length}
      pullTransfers: ${pullTransfers.length}
      unrecognizedTransfers: ${unrecognizedTransfers.length}
    `)

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