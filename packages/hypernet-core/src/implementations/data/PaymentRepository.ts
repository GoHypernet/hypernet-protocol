import { FullTransferState } from "@connext/vector-types";
import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber, EthereumAddress, IHypernetTransferMetadata,
  Payment, PublicIdentifier, PublicKey, PullPayment, PushPayment, SortedTransfers
} from "@interfaces/objects";
import { EPaymentType, ETransferType } from "@interfaces/types";
import {
  IBrowserNodeProvider, IConfigProvider,
  IContextProvider, IPaymentUtils, IVectorUtils
} from "@interfaces/utilities";
import moment from "moment";

/**
 * Contains methods for creating push, pull, etc payments,
 * as well as retrieving them, and finalizing them.
 */
export class PaymentRepository implements IPaymentRepository {

  /**
   * Returns an instance of PaymentRepository
   */
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected vectorUtils: IVectorUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected paymentUtils: IPaymentUtils,
  ) { }

  /**
   * Creates a push payment and returns it. Nothing moves until
   * the payment is accepted; the payment will return with the
   * "PROPOSED" status. This function just creates an OfferTransfer.
   * @param counterPartyAccount the public identifier of the account to pay
   * @param amount the amount to pay the counterparty
   * @param expirationDate the date (in unix time) at which point the payment will expire & revert
   * @param requiredStake the amount of insurance the counterparty must put up for this payment
   * @param paymentToken the (Ethereum) address of the payment token
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public async createPushPayment(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    const configPromise = await this.configProvider.getConfig();
    const contextPromise = await this.contextProvider.getInitializedContext();

    const [browserNode, config, context] = await Promise.all([browserNodePromise, configPromise, contextPromise]);

    // Create a null transfer, with the terms of the payment in the metadata.
    const paymentId = await this.paymentUtils.createPaymentId(EPaymentType.Push);

    const message: IHypernetTransferMetadata = {
      paymentId: paymentId,
      creationDate: moment().unix(),
      to: counterPartyAccount,
      from: context.publicIdentifier,
      requiredStake: requiredStake.toString(),
      paymentAmount: amount.toString(),
      expirationDate: expirationDate.unix(),
      paymentToken,
      disputeMediator,
    };

    const transferInfo = await this.vectorUtils.createMessageTransfer(counterPartyAccount, message);
    let transferResult = await browserNode.getTransfer({ transferId: transferInfo.transferId });

    if (transferResult.isError) {
      throw new Error("Could not get newly created transfer.");
    }

    let transfer = transferResult.getValue() as FullTransferState;

    // Return the payment
    const payment = this.paymentUtils.transfersToPayment(paymentId, [transfer], config, browserNode);

    return payment;
  }

  /**
   * Given a paymentId, return the component transfers.
   * @param paymentId the payment to get transfers for
   */
  public async getTransfersByPaymentId(paymentId: string): Promise<FullTransferState[]> {
    const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    const channelAddressPromise = await this.vectorUtils.getRouterChannelAddress();
    const configPromise = await this.configProvider.getConfig();
    const contextPromise = await this.contextProvider.getInitializedContext();

    const [browserNode, channelAddress, config, context] =
      await Promise.all([browserNodePromise,
        channelAddressPromise,
        configPromise,
        contextPromise]);

    const activeTransfersRes = await browserNode.getActiveTransfers({ channelAddress });

    if (activeTransfersRes.isError) {
      console.log('PaymentRepository: getPaymentsByIds: Error getting active transfers')
      const error = activeTransfersRes.getError();
      throw error;
    }

    const activeTransfers = activeTransfersRes.getValue()
    let relevantTransfers: FullTransferState[] = []

    for (let transfer of activeTransfers) {
      if (transfer.meta && paymentId == transfer.meta.paymentId) {
        relevantTransfers.push(transfer)
      } else {
        let transferType = await this.paymentUtils.getTransferType(transfer, browserNode)
        if (transferType == ETransferType.Insurance || transferType == ETransferType.Parameterized) {
          if (paymentId == transfer.transferState.UUID) {
            relevantTransfers.push(transfer)
          } else {
            console.log(`Transfer not relevant in PaymentRepository, transferId: ${transfer.transferId}`)
          }
        } else {
          console.log(`Unrecognized transfer in PaymentRepository, transferId: ${transfer.transferId}`)
        }
      }
    }

    return relevantTransfers;
  }

  /**
   * Given a list of payment Ids, return the associated payments.
   * @param paymentIds the list of payments to get
   */
  public async getPaymentsByIds(paymentIds: string[]): Promise<Map<string, Payment>> {
    const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    const channelAddressPromise = await this.vectorUtils.getRouterChannelAddress();
    const configPromise = await this.configProvider.getConfig();
    const contextPromise = await this.contextProvider.getInitializedContext();

    const [browserNode, channelAddress, config, context] = await Promise.all([
      browserNodePromise,
      channelAddressPromise,
      configPromise,
      contextPromise,
    ]);

    const activeTransfersRes = await browserNode.getActiveTransfers({ channelAddress });

    if (activeTransfersRes.isError) {
      console.log('PaymentRepository: getPaymentsByIds: Error getting active transfers')
      const error = activeTransfersRes.getError();
      throw error;
    }

    // console.log(`PaymentRepository: getPaymentsByIds: activeTransfersResLength: ${activeTransfersRes.getValue().length}`)
    // console.log(activeTransfersRes.getValue())

    // Remember, the offer transfer is the only one that we actually use the metadata for
    // For Insurance & Parameterized, we put the paymentId in the state itself
    const activeTransfers = activeTransfersRes.getValue()
    let relevantTransfers: FullTransferState[] = []

    for (let transfer of activeTransfers) {
      if (transfer.meta && paymentIds.includes(transfer.meta.paymentId)) {
        relevantTransfers.push(transfer)
      } else {
        let transferType = await this.paymentUtils.getTransferType(transfer, browserNode)
        if (transferType == ETransferType.Insurance ||
          transferType == ETransferType.Parameterized) {
          if (paymentIds.includes(transfer.transferState.UUID)) {
            relevantTransfers.push(transfer)
          } else {
            console.log(`Transfer not relevant in PaymentRepository, transferId: ${transfer.transferId}`)
          }
        } else {
          console.log(`Unrecognized transfer or not relevant to this payment in PaymentRepository, transferId: ${transfer.transferId}`)
        }
      }
    }

    // console.log(`PaymentRepository: getPaymentsByIds: activeTransfersLength: ${activeTransfers.length}`)

    const payments = await this.paymentUtils.transfersToPayments(
      relevantTransfers,
      config,
      context,
      browserNode,
    );

    return payments.reduce((map, obj) => {
      map.set(obj.id, obj);
      return map;
    }, new Map<string, Payment>());
  }

  /**
   * Singular version of getPaymentsByIds
   * @param paymentId the payment to get
   */
  public async getPaymentById(paymentId: string): Promise<Payment> {
    let payments = await this.getPaymentsByIds([paymentId]);
    let payment = payments.get(paymentId);

    if (payment == null) {
      throw new Error(`PaymentRepository:getPaymentById():Could not get payment!`);
    }

    return payment;
  }

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId the payment to finalize
   * @param amount the amount of the payment to finalize for
   */
  public async finalizePayment(paymentId: string, amount: string): Promise<Payment> {
    let browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    let configPromise = await this.configProvider.getConfig();
    let paymentPromise = await this.getPaymentById(paymentId);
    let existingTransfersPromise = await this.getTransfersByPaymentId(paymentId);

    let [browserNode, config, payment, existingTransfers] =
      await Promise.all([browserNodePromise,
        configPromise,
        paymentPromise,
        existingTransfersPromise]);

    console.log(`Finalizing payment ${paymentId}`)

    // get the transfer id from the paymentId
    // use payment utils for this
    let sortedTransfers = await this.paymentUtils.sortTransfers(paymentId, existingTransfers, browserNode)

    if (sortedTransfers.parameterizedTransfer == null) {
      throw new Error(`Cannot finalize payment ${paymentId}, no parameterized transfer exists for this!`)
    }

    let transferId = sortedTransfers.parameterizedTransfer.transferId

    await this.vectorUtils.resolvePaymentTransfer(transferId, paymentId, amount)
    let transferResult = await browserNode.getTransfer({ transferId: sortedTransfers.parameterizedTransfer.transferId });

    if (transferResult.isError) {
      throw new Error("Could not get newly created transfer.");
    }

    let transfer = transferResult.getValue() as FullTransferState;

    // Remove the parameterized payment
    existingTransfers = existingTransfers.filter(obj => obj.transferId != transferId)
    existingTransfers.push(transfer)

    // Transfer has been resolved successfully; return the updated payment.
    let updatedPayment = this.paymentUtils.transfersToPayment(paymentId, existingTransfers, config, browserNode);

    return updatedPayment;
  }

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId the payment for which to provide stake for
   */
  public async provideStake(paymentId: string): Promise<Payment> {
    let browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    let configPromise = await this.configProvider.getConfig();
    let paymentPromise = await this.getPaymentById(paymentId);
    let existingTransfersPromise = await this.getTransfersByPaymentId(paymentId);


    let [browserNode, config, payment, existingTransfers] =
      await Promise.all([browserNodePromise,
        configPromise,
        paymentPromise,
        existingTransfersPromise]);

    let paymentMediator = payment.disputeMediator;
    let paymentSender = payment.from;
    let paymentID = payment.id;
    let paymentStart = `${Math.floor(moment.now() / 1000)}`;
    let paymentExpiration = `${paymentStart + config.defaultPaymentExpiryLength}`;

    console.log(`PaymentRepository:provideStake: Creating insurance transfer for paymentId: ${paymentId}`)
    let transferInfo = await this.vectorUtils.createInsuranceTransfer(
      paymentSender,
      paymentMediator,
      payment.requiredStake,
      paymentExpiration,
      paymentID,
    );

    let transferResult = await browserNode.getTransfer({ transferId: transferInfo.transferId });

    if (transferResult.isError) {
      throw new Error("Could not get newly created transfer.");
    }

    let transfer = transferResult.getValue() as FullTransferState;
    let allTransfers = [transfer, ...existingTransfers]

    // Transfer has been created successfully; return the updated payment.
    let updatedPayment = this.paymentUtils.transfersToPayment(paymentId, allTransfers, config, browserNode);

    return updatedPayment;
  }

  /**
   * Singular version of provideAssets
   * Internally, creates a parameterizedPayment with Vector,
   * and returns a payment of state 'Approved'
   * @param paymentId the payment for which to provide an asset for
   */
  public async provideAsset(paymentId: string): Promise<Payment> {
    let browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    let configPromise = await this.configProvider.getConfig();
    let paymentPromise = await this.getPaymentById(paymentId);
    let existingTransfersPromise = await this.getTransfersByPaymentId(paymentId);

    let [browserNode, config, payment, existingTransfers] =
      await Promise.all([browserNodePromise,
        configPromise,
        paymentPromise,
        existingTransfersPromise]);

    if (!(payment instanceof PushPayment || payment instanceof PullPayment)) {
      throw new Error("Payment was neither Push nor Pull");
    }

    let paymentTokenAddress = payment.paymentToken;
    let paymentTokenAmount = payment instanceof PushPayment ? payment.paymentAmount : payment.authorizedAmount;
    let paymentRecipient = payment.to;
    let paymentID = payment.id;
    let paymentStart = `${Math.floor(moment.now() / 1000)}`;
    let paymentExpiration = `${paymentStart + config.defaultPaymentExpiryLength}`;

    // Use vectorUtils to create the parameterizedPayment
    let transferInfo = await this.vectorUtils.createPaymentTransfer(
      payment instanceof PushPayment ? EPaymentType.Push : EPaymentType.Pull,
      paymentRecipient,
      paymentTokenAmount,
      paymentTokenAddress,
      paymentID,
      paymentStart,
      paymentExpiration,
    );

    let transferResult = await browserNode.getTransfer({ transferId: transferInfo.transferId });

    if (transferResult.isError) {
      throw new Error("Could not get newly created transfer.");
    }

    let transfer = transferResult.getValue() as FullTransferState;
    let allTransfers = [transfer, ...existingTransfers]

    // Transfer has been created successfully; return the updated payment.
    let updatedPayment = this.paymentUtils.transfersToPayment(paymentID, allTransfers, config, browserNode);

    return updatedPayment;
  }
}
