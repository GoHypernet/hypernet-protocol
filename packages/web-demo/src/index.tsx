import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";

import "./GalileoFrontend";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

client.ready.then(async () => {
  // core initialized
  console.log("initialzed23");

  try {
    const balances = await client.getBlances();
    console.log("balances await: ", balances);

    client.renderBalances();
    //client.renderTransactionList();
  } catch (err) {
    console.log("err: ", err);
  }
});

declare let window: any;
