import express from "express";
import fs from "fs";
import net from "net";
import { ethers } from "ethers";
import cors from "cors";

var app = express();

app.use(cors());
//app.options('*', cors());

// This private key is from the ethers documentation, don't use it except for testing.
const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";

// Create a provider and connect it to the local blockchain
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

// Create a wallet using that provider. Wallet combines a provider and a signer.
const wallet = new ethers.Wallet(privateKey, provider);

let connector: string = "";
let signature: string = "unknown";
let address: string = wallet.address;

// Read the webpacked connector file. 
const filename = __dirname + "/connector/index.js";

fs.readFile(filename, 'utf8', (err, data) => {
   connector = data;

   // Sign the connector
   wallet.signMessage(connector).then((sig) => {
      console.log(`Signature: ${sig}`);
      signature = sig;
   });
});


app.get('/connector', (req, res) => {
   res.end(connector);
});

app.get('/signature', (req, res) => {
   res.end(signature);
});

app.get('/publicKey', (req, res) => {
   res.end(address);
})

const server = app.listen(5010, () => {
   const addressInfo = server.address() as net.AddressInfo;
   if (addressInfo != null) {
      var host = addressInfo.address;
      var port = addressInfo.port;
      console.log("Example Merchant listening at http://%s:%s", host, port);
      console.log(`filename: ${filename}`);
   }
});