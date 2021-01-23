import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import "./GalileoFrontend";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

client.getReady().then(async (proxy) => {
  // core initialized
  console.log("initialzed23");

  // client wants to get the balances and show it in a design of his design
  proxy.getBalances().map((balances) => {
    console.log("get balances from proxy inside ready: ", balances.assets);
  });

  // client wants to get the widget component ready with the data
  client.renderBalancesWidget();

  client.renderFundWidget();
});

// try to call the proxy not just in ready but after some time in an async way
setTimeout(() => {
  //client.renderBalancesWidget();
}, 10000);

declare let window: any;
