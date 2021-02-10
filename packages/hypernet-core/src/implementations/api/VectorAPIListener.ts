import { IVectorListener } from "@interfaces/api";
import { IPaymentService } from "@interfaces/business";
import { IHypernetOfferDetails, ResultAsync } from "@interfaces/objects";
import { LogicalError } from "@interfaces/objects/errors";
import { IHypernetPullPaymentDetails } from "@interfaces/objects/HypernetPullPaymentDetails";
import { ETransferType, MessageState } from "@interfaces/types";
import {
  IBrowserNodeProvider,
  IConditionalTransferCreatedPayload,
  IConditionalTransferResolvedPayload,
  IContextProvider,
  ILogUtils,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { errAsync, okAsync } from "neverthrow";

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
    protected logUtils: ILogUtils,
  ) {}

  /**
   *
   */
  public setup(): ResultAsync<void, LogicalError> {
    return this.browserNodeProvider.getBrowserNode().map((browserNode) => {
      // When the browser node notifies us that a conditional transfer has been *resolved,
      // (via Vector), this handles it. We call down into the appropriate method on the
      // PaymentService to handle it.
      browserNode.onConditionalTransferResolved((payload: IConditionalTransferResolvedPayload) => {
        // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
        // or a UUID as part of transferState.message (message transfer type)

        this.paymentUtils.getTransferType(payload.transfer).andThen((transferType) => {
          let paymentId: string;
          const transfer = payload.transfer;

          if (transferType === ETransferType.Offer) {
            // @todo also add in PullRecord type)
            const offerDetails: IHypernetOfferDetails = JSON.parse((transfer.transferState as MessageState).message);
            paymentId = offerDetails.paymentId;
          } else if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
            paymentId = transfer.transferState.UUID;
          } else {
            this.logUtils.log(`Transfer type was not recognized, doing nothing. TransferType: '${transferType}'`);
            return okAsync(null);
          }

          return this.paymentUtils.isHypernetDomain(paymentId).andThen((isHypernetDomain) => {
            if (!isHypernetDomain) {
              this.logUtils.log(
                `Ignoring transfer that is not in the Hypernet Domain: transferID of ${transfer.transferId}, initiator: ${transfer.initiator}`,
              );
              return okAsync(null);
            }

            if (transferType === ETransferType.Offer) {
              // if the transfer is an offer transfer, we need to notify the payment service
              // than an offer has been resolved.
              // @todo create methods in payment service
              return errAsync(new LogicalError("Method not yet implemented!"));
            } else if (transferType === ETransferType.Insurance) {
              // if the transfer is an insurance transfer, we need to notify the payment service
              // that stake has been resolved.
              // @todo create methods in payment service
              return errAsync(new LogicalError("Method not yet implemented!"));
            } else if (transferType === ETransferType.Parameterized) {
              // if the transfer is the parameterized transfer, we need to notify the payment service
              // that the parameterized payment has been resolved.
              return this.paymentService.paymentCompleted(paymentId);
            } else if (transferType === ETransferType.PullRecord) {
              // @todo create methods in payment service
              return errAsync(new LogicalError("Method not yet implemented!"));
            } else {
              return errAsync(new LogicalError("Unrecognized transfer type!"));
            }
          });
        });
      });

      // When the browser node notifies us that a conditional transfer has been created
      // (via Vector), this handles it. We call down into the appropriate method on the
      // PaymentService to handle it.
      browserNode.onConditionalTransferCreated((payload: IConditionalTransferCreatedPayload) => {
        // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
        // or a UUID as part of transferState.message (message transfer type)

        this.paymentUtils.getTransferType(payload.transfer).andThen((transferType) => {
          let paymentId: string;
          const transfer = payload.transfer;

          if (transferType === ETransferType.Offer) {
            const message: IHypernetOfferDetails = JSON.parse(transfer.transferState.message);
            paymentId = message.paymentId;
          } else if (transferType === ETransferType.PullRecord) {
            const message: IHypernetPullPaymentDetails = JSON.parse(transfer.transferState.message);
            paymentId = message.paymentId;
          } else if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
            paymentId = transfer.transferState.UUID;
          } else {
            this.logUtils.log(`Transfer type was not recognized, doing nothing. TransferType: '${transferType}'`);
            return okAsync(null);
          }

          return this.paymentUtils.isHypernetDomain(paymentId).andThen((isHypernetDomain) => {
            if (!isHypernetDomain) {
              this.logUtils.log(
                `Ignoring transfer that is not in the Hypernet Domain: transferID of ${transfer.transferId}, initiator: ${transfer.initiator}`,
              );
              return okAsync(null);
            }

            // Notify the service to process the event
            if (transferType === ETransferType.PullRecord) {
              return this.paymentService.pullRecorded(paymentId);
            } else if (transferType === ETransferType.Offer) {
              return this.paymentService.offerReceived(paymentId);
            } else if (transferType === ETransferType.Parameterized) {
              return this.paymentService.paymentPosted(paymentId);
            } else if (transferType === ETransferType.Insurance) {
              return this.paymentService.stakePosted(paymentId);
            }

            return okAsync(null);
          });
        });

        // Convert a Vector event into an external event for publishing
        /*return new Observable(subscriber => {
                  .then((browserNode) => {
                      browserNode.on(EngineEvents.SETUP, (payload: SetupPayload) => {
                          subscriber.next(payload);
                      });
                  });
              });*/
      });
    });
  }
}
