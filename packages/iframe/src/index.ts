import {IHypernetCore, HypernetCore, EBlockchainNetwork} from "@hypernetlabs/hypernet-core";
import * as Postmate from "postmate";

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost);
let parent: Postmate.ChildAPI | undefined;

// Fire up the Postmate model, and wrap up the core as the model
const handshake = new Postmate.Model({
    initialize: async (account: string) => {
        const result = await core.initialize(account);

        if (parent != null) {
            parent.emit("initialized", result);
        }
    },
    test: () => {return "Hello world!";},
});

handshake.then(initializedParent => {
    parent = initializedParent;
    parent.emit("eventName", "This is an event");

});



// Load connectors