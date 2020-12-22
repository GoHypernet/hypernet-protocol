import { ConditionalTransferCreatedPayload, EngineEvents, SetupPayload } from "@connext/vector-types";
import { IVectorListener } from "@interfaces/api";
import { IPaymentService } from "@interfaces/business";
import { IHypernetTransferMetadata } from "@interfaces/objects";
import { ETransferType } from "@interfaces/types";
import { IBrowserNodeProvider, IContextProvider, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";

/**
 *
 */
export class VectorAPIListener implements IVectorListener {
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected paymentService: IPaymentService,
    protected vectorUtils: IVectorUtils,
    protected contextProvider: IContextProvider,
    protected paymentUtils: IPaymentUtils,
  ) {}

  /**
   *
   */
  public async setup(): Promise<void> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();

    // When the browser node notifies us that a conditional transfer has been created
    // (via Vector), this handles it. If we created the transfer, we do nothing.
    // If we didn't create the transfer, then we need to handle it. Thus we call down
    // into the appropriate method on the PaymentService to handle it.
    browserNode.on(EngineEvents.CONDITIONAL_TRANSFER_CREATED, async (payload: ConditionalTransferCreatedPayload) => {
      const context = await this.contextProvider.getInitializedContext();

      // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
      // or a UUID as part of transferState.message (message transfer type)
      let paymentId: string
      const transfer = payload.transfer
      const transferType = await this.paymentUtils.getTransferType(transfer, browserNode)
      const from = transfer.initiator

      if (transferType == ETransferType.Offer) { // @todo also add in PullRecord type)
        let metadata: IHypernetTransferMetadata = JSON.parse(transfer.transferState.message)
        paymentId = metadata.paymentId
      } else if (transferType == ETransferType.Insurance || transferType == ETransferType.Parameterized) {
        paymentId = transfer.transferState.UUID
      } else {
        console.log(`Transfer type was not recognized, doing nothing. TransferType: '${transferType}'`)
        return;
      }

      if (!(await this.paymentUtils.isHypernetDomain(paymentId))) {
        console.log(`Ignoring transfer that is not in the Hypernet Domain: transferID of ${transfer.transferId}, initiator: ${transfer.initiator}`)
        return;
      }
      
      if (transferType === ETransferType.Offer) {
        // if the transfer is an offer transfer, we need to notify the payment service
        // than an offer has been received. it will then attempt to provide stake (via an insurance transfer)
        this.paymentService.offerReceived(paymentId);
      } else if (transferType === ETransferType.Insurance) {
        // if the transfer is an insurance transfer, we need to notify the payment service
        // that stake has been posted, which will then attempt to create the parameterized transfer
        this.paymentService.stakePosted(paymentId);
      } else if (transferType === ETransferType.Parameterized) {
        // if the transfer is the parameterized transfer, we need to notify the payment service
        // that the last step has been completed, and the transfer can now be finalized
        this.paymentService.paymentPosted(paymentId);
      } else if (transferType === ETransferType.PullRecord) {
        this.paymentService.pullRecorded(paymentId);
      } else {
        throw new Error("Unrecognized transfer type!");
      }
    });

    // Convert a Vector event into an external event for publishing
    /*return new Observable(subscriber => {
            .then((browserNode) => {
                browserNode.on(EngineEvents.SETUP, (payload: SetupPayload) => {
                    subscriber.next(payload);
                });
            });
        });*/
  }
}
