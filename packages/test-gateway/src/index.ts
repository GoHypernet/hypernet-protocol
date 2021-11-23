import fs from "fs";
import net from "net";

import { GatewayUrl } from "@hypernetlabs/objects";
import cors from "cors";
import express from "express";

import { BlockchainRepository } from "@test-gateway/BlockchainRepository";

const app = express();

app.use(cors());
//app.options('*', cors());

const gatewayUrl = GatewayUrl(process.env.__GATEWAY_URL__ || "http://localhost:5010");

const blockchainRepository = new BlockchainRepository();

let connector = "";

// Read the webpacked connector file.
const filename = __dirname + "/connector.js";

fs.readFile(filename, "utf8", (err, data) => {
  connector = data;

  // Sign the connector
  blockchainRepository.setConnector(gatewayUrl, connector);
});

app.get("/connector", (req, res) => {
  res.end(connector);
});

const server = app.listen(5010, () => {
  const addressInfo = server.address() as net.AddressInfo;
  if (addressInfo != null) {
    const host = addressInfo.address;
    const port = addressInfo.port;
    console.log("Example Gateway listening at http://%s:%s", host, port);
    console.log(`filename: ${filename}`);
  }
});
