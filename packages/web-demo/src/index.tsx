import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";

// Just an implementation to have the front end galileo package for development purposes
// do npm login and yarn install @hypernetwork/galileo-frontend to make it work in your local
/* import "./GalileoFrontend"; */

const client: IHypernetWebIntegration = new HypernetWebIntegration();

client.renderAuthentication();
client.renderTransactionList();

declare let window: any;
