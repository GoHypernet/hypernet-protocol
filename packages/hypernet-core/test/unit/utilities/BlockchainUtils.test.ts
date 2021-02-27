import td, { verify } from "testdouble";
require("testdouble-jest")(td, jest);
import { ethers } from "ethers";
import { EthersBlockchainUtils } from "@implementations/utilities";
import { merchantUrl } from "@mock/mocks";
import { IBlockchainUtils } from "@interfaces/utilities";
import { BlockchainProviderMock } from "@tests/mock/utils";

const validatedSignature = "0xValidatedSignature";
const validatedSignature2 = "0xInvalidatedSignature";
const domain = {
  name: "Hypernet Protocol",
  version: "1",
};

const types = {
  AuthorizedMerchant: [
    { name: "authorizedMerchantUrl", type: "string" },
    { name: "merchantValidatedSignature", type: "string" },
  ],
};

const value = {
  authorizedMerchantUrl: merchantUrl,
  merchantValidatedSignature: validatedSignature,
};

class EthersBlockchainUtilsMocks {
  public blockchainProvider: BlockchainProviderMock;

  constructor() {
    this.blockchainProvider = new BlockchainProviderMock();
  }

  public factoryUtils(): IBlockchainUtils {
    return new EthersBlockchainUtils(this.blockchainProvider);
  }
}

describe("EthersBlockchainUtils tests", () => {
  test("_signTypedData & verifyTypedData sanity check", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // This private key is from the ethers documentation, don't use it except for testing.
    const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";

    const wallet = new ethers.Wallet(privateKey);

    let signature = await wallet._signTypedData(domain, types, value);

    // Act
    const result = utils.verifyTypedData(domain, types, value, signature);

    // Assert
    expect(result).toBe(wallet.address);
  });

  test("_signTypedData & verifyTypedData insanity check", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // This private key is from the ethers documentation, don't use it except for testing.
    const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";

    const wallet = new ethers.Wallet(privateKey);

    let signature = await wallet._signTypedData(domain, types, value);

    // Act
    const value2 = {
      authorizedMerchantUrl: merchantUrl,
      merchantValidatedSignature: validatedSignature2,
    };
    const result = utils.verifyTypedData(domain, types, value2, signature);

    // Assert
    expect(result).not.toBe(wallet.address);
  });
});
