import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
console.log("HypernetWebIntegration: ", HypernetWebIntegration);

const client: IHypernetWebIntegration = new HypernetWebIntegration();
console.log("bbbbbbb");

client.renderAuthentication();

client.renderTransactionList();

declare let window: any;
