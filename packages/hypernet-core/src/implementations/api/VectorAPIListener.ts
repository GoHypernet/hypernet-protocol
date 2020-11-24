import { ConditionalTransferCreatedPayload, EngineEvents, SetupPayload } from "@connext/vector-types";
import { IVectorListener } from "@interfaces/api";
import { IPaymentService } from "@interfaces/business";
import { IHypernetTransferMetadata } from "@interfaces/objects";
import { ETransferType } from "@interfaces/types";
import { IBrowserNodeProvider, IContextProvider, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";

export class VectorAPIListener implements IVectorListener {
    constructor(protected browserNodeProvider: IBrowserNodeProvider,
        protected paymentService: IPaymentService,
        protected vectorUtils: IVectorUtils,
        protected contextProvider: IContextProvider,
        protected paymentUtils: IPaymentUtils) {}

    public async setup(): Promise<void> {
        const browserNode = await this.browserNodeProvider.getBrowserNode()
        
        browserNode.on(EngineEvents.CONDITIONAL_TRANSFER_CREATED, 
            async (payload: ConditionalTransferCreatedPayload) => {
            const context = await this.contextProvider.getInitializedContext();
            
            // Pull out the transfer itself
            const metadata = payload.transfer.meta as IHypernetTransferMetadata;
                        
            if (!(await this.paymentUtils.isHypernetDomain(metadata.paymentId))) {
                return;
            }

            // Determine if you sent the transfer, in which case you can ignore this
            if (metadata.from == context.account) {
                return;
            }

            // If you didn't send this transfer, you want to notify the user
            // that a payment is available for them to accept (insurance, paramterized, etc)
            const transferType = this.paymentUtils.getTransferType(payload.transfer);
            if (transferType == ETransferType.Offer) {
                this.paymentService.offerReceived(metadata.paymentId);
            } else if (transferType == ETransferType.Insurance) {
                this.paymentService.stakePosted(metadata.paymentId);
            } else if (transferType == ETransferType.Parameterized) {
                this.paymentService.paymentPosted(metadata.paymentId);
            } else if (transferType == ETransferType.PullRecord) {
                this.paymentService.pullRecorded(metadata.paymentId);
            } else{
                throw new Error('Unrecognized transfer type!');
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