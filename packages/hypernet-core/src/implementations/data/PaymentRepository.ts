import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber,
  IHypernetTransferMetadata,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
} from "@interfaces/objects";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { EPaymentType } from "@interfaces/types";
import { EthereumAddress, PublicKey } from "@interfaces/objects";
import { FullTransferState } from "@connext/vector-types";
import moment from "moment";

export class PaymentRepository implements IPaymentRepository {
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected vectorUtils: IVectorUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected paymentUtils: IPaymentUtils,
  ) {}

  /**
   * Creates a push payment and returns it. Nothing moves until
   * the payment is accepted; the payment will return with the
   * "PROPOSED" status. This function just creates an OfferTransfer.
   * @param counterPartyAccount
   * @param amount
   * @param expirationDate
   * @param requiredStake
   * @param paymentToken
   * @param disputeMediator
   */
  public async createPushPayment(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
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
      paymentId,
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
   *
   * @param paymentIds
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

    console.log(`PaymentRepository: getPaymentsByIds: activeTransfersResLength: ${activeTransfersRes.getValue().length}`)
    console.log(activeTransfersRes.getValue())

    const activeTransfers = activeTransfersRes.getValue().filter((val) => {
      console.log(`Filter step: val.meta.paymentId: ${val.meta.paymentId}`);
      console.log(`Filter step: paymentIds: ${paymentIds}`)
      return paymentIds.includes(val.meta.paymentId);
    });

    console.log(`PaymentRepository: getPaymentsByIds: activeTransfersLength: ${activeTransfers.length}`)

    const payments = await this.paymentUtils.transfersToPayments(
      activeTransfers as FullTransferState[],
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
   * @param paymentId
   */
  public async finalizePayment(paymentId: string): Promise<Payment> {
    let browserNode = await this.browserNodeProvider.getBrowserNode();
    let config = await this.configProvider.getConfig();
    let payment = await this.getPaymentById(paymentId);

    throw new Error("Method not yet implemented");
  }

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId
   */
  public async provideStake(paymentId: string): Promise<Payment> {
    let browserNode = await this.browserNodeProvider.getBrowserNode();
    let config = await this.configProvider.getConfig();
    let payment = await this.getPaymentById(paymentId);

    let paymentMediator = payment.disputeMediator;
    let paymentSender = payment.from;
    let paymentID = payment.id;
    let paymentStart = `${Math.floor(moment.now() / 1000)}`;
    let paymentExpiration = `${paymentStart + config.defaultPaymentExpiryLength}`;

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

    // Transfer has been created successfully; return the updated payment.
    let updatedPayment = this.paymentUtils.transfersToPayment(transferInfo.transferId, [transfer], config, browserNode);

    return updatedPayment;
  }

  /**
   * Singular version of provideAssets
   * Internally, creates a parameterizedPayment with Vector,
   * and returns a payment of state 'Approved'
   * @param paymentId
   */
  public async provideAsset(paymentId: string): Promise<Payment> {
    let browserNode = await this.browserNodeProvider.getBrowserNode();
    let config = await this.configProvider.getConfig();
    let payment = await this.getPaymentById(paymentId);

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

    // Transfer has been created successfully; return the updated payment.
    let updatedPayment = this.paymentUtils.transfersToPayment(transferInfo.transferId, [transfer], config, browserNode);

    return updatedPayment;
  }
}
