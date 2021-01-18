import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

client.renderAuthentication();
client.renderTransactionList();

declare let window: any;
