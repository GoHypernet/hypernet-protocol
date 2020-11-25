import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import { BigNumber, IHypernetTransferMetadata, Payment, PublicIdentifier, PullPayment, PushPayment } from "@interfaces/objects";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { EPaymentType } from "@interfaces/types";
import { EthereumAddress, PublicKey } from "@interfaces/objects";
import moment from "moment";
import { FullTransferState, NodeResponses } from "@connext/vector-types";
import { BrowserNode } from "@connext/vector-browser-node";

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
      from: context.account,
      requiredStake: requiredStake.toString(),
      paymentAmount: amount.toString(),
      expirationDate,
      paymentToken,
      disputeMediator
    }

    const transferInfo = await this.vectorUtils.createMessageTransfer(
      counterPartyAccount,
      message
    )

    let transferResult = await browserNode.getTransfer({transferId: transferInfo.transferId})

    if (transferResult.isError) {
      throw new Error('Could not get newly created transfer.')
    }

    let transfer = transferResult.getValue() as FullTransferState

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
      const error = activeTransfersRes.getError();
      throw error;
    }

    const activeTransfers = activeTransfersRes.getValue().filter((val) => {
      return paymentIds.includes(val.meta.paymentId);
    });

    const payments = await this.paymentUtils.transfersToPayments(activeTransfers as FullTransferState[], 
        config, context, browserNode);

    return payments.reduce((map, obj) => {
      map.set(obj.id, obj);
      return map;
    }, new Map<string, Payment>());
  }

  /**
   * Singular version of getPaymentsByIds
   */
  public async getPaymentById(paymentId: string): Promise<Payment> {
    let payments = await this.getPaymentsByIds([paymentId])
    let payment = payments.get(paymentId)

    if (payment == null) {
      throw new Error('Cuold not get payment.')
    }

    return payment
  }

  /**
   * Provides stakes for a given list of payment ids.
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentIds the payment ids to provide stake for
   */
  public async provideStakes(paymentIds: string[]): Promise<Map<string, Payment>> {




    throw new Error("Method not yet implemented");
  }

  /**
   *
   * @param paymentIds
   */
  public async finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>> {
    throw new Error("Method not yet implemented");
  }

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayments with Vector.
   * @param paymentIds
   */
  public async provideAssets(paymentIds: string[]): Promise<Map<string, Payment>> {
    throw new Error("Method not yet implemented")
  }

  /**
   * Singular version of provideAssets
   * Internally, creates a parameterizedPayment with Vector,
   * and returns a payment of state 'Approved'
   * @param paymentId 
   */
  public async provideAsset(paymentId: string): Promise<Payment> {
    let browserNode = await this.browserNodeProvider.getBrowserNode()
    let config = await this.configProvider.getConfig()
    let payment = await this.getPaymentById(paymentId)

    if (!(payment instanceof PushPayment || payment instanceof PullPayment)) {
      throw new Error('Payment was neither Push nor Pull')
    }

    let paymentTokenAddress = payment.paymentToken
    let paymentTokenAmount = payment instanceof PushPayment ? payment.paymentAmount : payment.authorizedAmount
    let paymentRecipient = payment.to
    let paymentID = payment.id
    let paymentStart = `${Math.floor(moment.now() / 1000)}`
    let paymentExpiration = `${paymentStart + config.defaultPaymentExpiryLength}`

    // Use vectorUtils to create the parameterizedPayment
    let transferInfo = await this.vectorUtils.createPaymentTransfer(
      payment instanceof PushPayment ? EPaymentType.Push : EPaymentType.Pull,
      paymentRecipient,
      paymentTokenAmount,
      paymentTokenAddress,
      paymentID,
      paymentStart,
      paymentExpiration
    )

    let transferResult = await browserNode.getTransfer({transferId: transferInfo.transferId})

    if (transferResult.isError) {
      throw new Error('Could not get newly created transfer.')
    }

    let transfer = transferResult.getValue() as FullTransferState

    // Transfer has been created successfully; return the updated payment.
    let updatedPayment = this.paymentUtils.transfersToPayment(
      transferInfo.transferId,
      [transfer],
      config,
      browserNode
    )
    
    return updatedPayment
  }
}