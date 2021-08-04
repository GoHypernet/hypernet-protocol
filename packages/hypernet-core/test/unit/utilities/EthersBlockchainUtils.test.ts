import { Signature } from "@hypernetlabs/objects";
import { ethers } from "ethers";

import { EthersBlockchainUtils } from "@implementations/utilities/EthersBlockchainUtils";
import { IBlockchainUtils } from "@interfaces/utilities/IBlockchainUtils";
import { BlockchainProviderMock, ConfigProviderMock } from "@mock/utils";

const privateKey =
  "0x0123456789012345678901234567890123456789012345678901234567890123";
const provider = new ethers.providers.JsonRpcProvider();
const wallet = new ethers.Wallet(privateKey, provider);
const walletAddress: string = wallet.address;
const domain = {
  name: "Hypernet Protocol",
  version: "1",
};
const types = {
  AuthorizedGateway: [
    { name: "authorizedGatewayUrl", type: "string" },
    { name: "gatewayValidatedSignature", type: "string" },
  ],
};
const signedValue = {
  authorizedGatewayUrl: "authorizedGatewayUrl",
  gatewayValidatedSignature: "gatewaySignature",
} as Record<string, unknown>;

class EthersBlockchainUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();

  constructor(stubSigner = true) {
    //td.when(this.blockchainProvider.getSigner()).thenReturn(okAsync(provider));
  }

  public factoryProvider(): IBlockchainUtils {
    return new EthersBlockchainUtils(
      this.blockchainProvider,
      this.configProvider,
    );
  }
}

describe("EthersBlockchainUtils tests", () => {
  test("verifyTypedData should return signer address if signature is vaild", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryProvider();

    const signedMessage = await wallet._signTypedData(
      domain,
      types,
      signedValue,
    );

    // Act
    const result = await utils.verifyTypedData(
      domain,
      types,
      signedValue,
      Signature(signedMessage),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(walletAddress);
  });
});
