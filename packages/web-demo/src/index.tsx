import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";

import "./GalileoFrontend";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

client.renderAuthentication();
client.renderTransactionList();

declare let window: any;
