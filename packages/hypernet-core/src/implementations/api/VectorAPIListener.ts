import { IVectorListener } from "@interfaces/api";
import { IPaymentService } from "@interfaces/business";
import {
  IHypernetOfferDetails,
  IHypernetPullPaymentDetails,
  IConditionalTransferCreatedPayload,
  IConditionalTransferResolvedPayload,
  PaymentId,
  LogicalError,
  VectorError,
  BlockchainUnavailableError,
  InvalidPaymentIdError,
  PaymentFinalizeError,
  PaymentStakeError,
  TransferResolutionError,
  RouterChannelUnknownError,
  InvalidPaymentError,
  InvalidParametersError,
  TransferCreationError,
} from "@hypernetlabs/objects";
import { ETransferType, MessageState } from "@hypernetlabs/objects";
import { IBrowserNodeProvider, IContextProvider, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

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
  public setup(): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentIdError
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  > {
    return this.browserNodeProvider.getBrowserNode().map((browserNode) => {
      // When the browser node notifies us that a conditional transfer has been *resolved,
      // (via Vector), this handles it. We call down into the appropriate method on the
      // PaymentService to handle it.
      browserNode.onConditionalTransferResolved((payload: IConditionalTransferResolvedPayload) => {
        // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
        // or a UUID as part of transferState.message (message transfer type)

        this.paymentUtils
          .getTransferType(payload.transfer)
          .andThen((transferType) => {
            let paymentId: PaymentId;
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
                return this.paymentService.insuranceResolved(paymentId);
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
          })
          .mapErr((e) => {
            this.logUtils.error(e);
          });
      });

      // When the browser node notifies us that a conditional transfer has been created
      // (via Vector), this handles it. We call down into the appropriate method on the
      // PaymentService to handle it.
      browserNode.onConditionalTransferCreated((payload: IConditionalTransferCreatedPayload) => {
        // Filter out any transfer not containing a transfer with a UUID in the transferState (insurance & parameterized transfer types)
        // or a UUID as part of transferState.message (message transfer type)

        this.paymentUtils
          .getTransferType(payload.transfer)
          .andThen((transferType) => {
            let paymentId: PaymentId;
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
                return this.paymentService.paymentPosted(paymentId).map(() => {});
              } else if (transferType === ETransferType.Insurance) {
                return this.paymentService.stakePosted(paymentId).map(() => {});
              }

              return okAsync(null);
            });
          })
          .mapErr((e) => {
            this.logUtils.error(e);
          });
      });
    });
  }
}
