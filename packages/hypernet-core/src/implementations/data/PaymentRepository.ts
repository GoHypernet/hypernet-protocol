import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import { BigNumber, IHypernetTransferMetadata, Payment, PublicIdentifier } from "@interfaces/objects";
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

export class PaymentRepository implements IPaymentRepository {
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected vectorUtils: IVectorUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected paymentUtils: IPaymentUtils,
  ) {}

  /**
   *
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

    let [browserNode, config, context] = await Promise.all([browserNodePromise, configPromise, contextPromise]);

    // Create a null transfer, with the terms of the payment in the metadata.
    const paymentId = await this.paymentUtils.createPaymentId(EPaymentType.Push);
    const transfer = await this.vectorUtils.createNullTransfer(counterPartyAccount, {
      paymentId: paymentId,
      creationDate: moment().unix(),
      to: counterPartyAccount,
      from: context.account,
      requiredStake: requiredStake.toString(),
      paymentAmount: amount.toString(),
      expirationDate: expirationDate,
      paymentToken: paymentToken,
      disputeMediator: disputeMediator,
    } as IHypernetTransferMetadata);

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

    let [browserNode, channelAddress, config, context] = await Promise.all([
      browserNodePromise,
      channelAddressPromise,
      configPromise,
      contextPromise,
    ]);

    const activeTransfersRes = await browserNode.getActiveTransfers({ channelAddress: channelAddress });

    if (activeTransfersRes.isError) {
      const error = activeTransfersRes.getError();
      throw error;
    }

    const activeTransfers = activeTransfersRes.getValue().filter((val) => {
      return paymentIds.includes(val.meta.paymentId);
    });

    const payments = await this.paymentUtils.transfersToPayments(activeTransfers, config, context, browserNode);

    return payments.reduce((map, obj) => {
      map.set(obj.id, obj);
      return map;
    }, new Map<string, Payment>());
  }
}
