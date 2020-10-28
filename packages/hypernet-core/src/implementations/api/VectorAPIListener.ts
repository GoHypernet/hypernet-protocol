import { EngineEvents, SetupPayload } from "@connext/vector-types";
import { IBrowserNodeProvider } from "@interfaces/utilities";
import {Observable} from "rxjs";

export class VectorAPIListener {
    constructor(protected browserNodeProvider: IBrowserNodeProvider) {}

    public setup(): Observable<SetupPayload> {
        return new Observable(subscriber => {
            this.browserNodeProvider.getBrowserNode().then((browserNode) => {
                browserNode.on(EngineEvents.SETUP, (payload: SetupPayload) => {
                    subscriber.next(payload);
                });
            });
        });
    }
}