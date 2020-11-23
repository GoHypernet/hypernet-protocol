import { ConditionalTransferCreatedPayload, EngineEvents, SetupPayload } from "@connext/vector-types";
import { IVectorListener } from "@interfaces/api";
import { IPaymentService } from "@interfaces/business";
import { IHypernetTransferMetadata } from "@interfaces/objects";
import { IBrowserNodeProvider, IContextProvider } from "@interfaces/utilities";

export class VectorAPIListener implements IVectorListener {
    constructor(protected browserNodeProvider: IBrowserNodeProvider,
        protected paymentService: IPaymentService,
        protected contextProvider: IContextProvider) {}

    public async setup(): Promise<void> {
        const browserNode = await this.browserNodeProvider.getBrowserNode()
        
        browserNode.on(EngineEvents.CONDITIONAL_TRANSFER_CREATED, 
            async (payload: ConditionalTransferCreatedPayload) => {
            const context = await this.contextProvider.getInitializedContext();
            
            // Pull out the transfer itself
            let metadata = payload.transfer.meta as IHypernetTransferMetadata;

            // Determine if you sent the transfer, in which case you can ignore this
            if (metadata.from == context.account) {
                return
            }

            // If you didn't send this transfer, you want to notify the user
            // that a payment is available for them to accept (insurance, paramterized, etc)
            this.paymentService.offerReceived(metadata.paymentId);
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