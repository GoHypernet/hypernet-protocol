import { EthereumAddress, GatewayUrl, Signature, TransferAbis } from "@hypernetlabs/objects";
import { Contract, ethers } from "ethers";

export class BlockchainRepository {
  protected gatewayAccountPrivateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
  protected gatewayAccount = "0x14791697260E4c9A71f18484C9f997B308e59325";
  protected gatewayRegistryAddress = "0x633BaEfc98220497Eb7eE323480C87ce51a44955";

  protected provider: ethers.providers.JsonRpcProvider;
  protected wallet: ethers.Wallet;

  protected signature: Signature | null = null;
  protected address: EthereumAddress;

  constructor() {
    try {
      // Create a provider and connect it to the local blockchain
      this.provider = new ethers.providers.JsonRpcProvider("http://blockchain:8545");

      // Create a wallet using that provider. Wallet combines a provider and a signer.
      this.wallet = new ethers.Wallet(this.gatewayAccountPrivateKey, this.provider);

      this.address = EthereumAddress(this.wallet.address);
      console.log(`Address: ${this.address}`);
      console.log(this.gatewayAccount == this.address);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async setConnector(gatewayUrl: GatewayUrl, connector: string): Promise<void> {
    // Sign the connector
    this.signature = await this.signMessage(connector);

    console.log(`Signature: ${this.signature}`);

    try {
      console.log("Creating registry contract");
      const gatewayRegistryContract = new Contract(this.gatewayRegistryAddress, TransferAbis.ERC721.abi, this.wallet);

      const registryEntry: IGatewayRegistryEntry = {
        address: this.address,
        signature: this.signature,
      };

      console.log("Setting gateway registry info");
      const tokenId = await gatewayRegistryContract.registryMap(gatewayUrl);
      const registrationResponse = await gatewayRegistryContract.updateRegistration(
        tokenId,
        JSON.stringify(registryEntry),
      );

      const receipt = await registrationResponse.wait();

      console.log(receipt);
    } catch (e) {
      console.error("Failed to set the gateway registry information");
      console.error(e);
    }
  }

  public async signMessage(message: string): Promise<Signature> {
    try {
      return Signature(await this.wallet.signMessage(message));
    } catch (e) {
      console.error("Failed to sign message");
      throw e;
    }
  }

  public getSignature(): Signature {
    if (this.signature == null) {
      throw new Error("must call setConnector first!");
    }
    return this.signature;
  }
}

interface IGatewayRegistryEntry {
  address: EthereumAddress;
  signature: Signature;
}
