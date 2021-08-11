import { EthereumAddress, GatewayUrl, Signature, TransferAbis } from "@hypernetlabs/objects";
import { Contract, ethers } from "ethers";

export class BlockchainRepository {
  protected privateKey: string;
  protected provider: ethers.providers.JsonRpcProvider;
  protected wallet: ethers.Wallet;
  protected gatewayRegistryAddress = "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a";
  protected signature: Signature | null = null;
  protected address: EthereumAddress;

  constructor() {
    // This private key is from the ethers documentation, don't use it except for testing.
    this.privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";

    // Create a provider and connect it to the local blockchain
    this.provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

    // Create a wallet using that provider. Wallet combines a provider and a signer.
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);

    this.address = EthereumAddress(this.wallet.address);
    console.log(`Address: ${this.address}`);
  }

  public async setConnector(gatewayUrl: GatewayUrl, connector: string): Promise<void> {
    // Sign the connector
    this.signature = await this.signMessage(connector);

    console.log(`Signature: ${this.signature}`);

    const mocRegistryContract = new Contract(this.gatewayRegistryAddress, TransferAbis.MocRegistry.abi, this.wallet);

    const registryEntry: IGatewayRegistryEntry = {
      address: this.address,
      signature: this.signature,
    };

    const txResponse = await mocRegistryContract.setGateway(gatewayUrl, JSON.stringify(registryEntry));

    const receipt = await txResponse.wait();

    console.log(receipt);
  }

  public async signMessage(message: string): Promise<Signature> {
    return Signature(await this.wallet.signMessage(message));
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
