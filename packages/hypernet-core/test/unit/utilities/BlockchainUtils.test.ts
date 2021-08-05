import { Signature } from "@hypernetlabs/objects";
import { ethers } from "ethers";
import td from "testdouble";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

import { EthersBlockchainUtils } from "@implementations/utilities";
import { IBlockchainUtils } from "@interfaces/utilities";
import { gatewayUrl } from "@mock/mocks";
import { BlockchainProviderMock, ConfigProviderMock } from "@tests/mock/utils";

const validatedSignature = "0xValidatedSignature";
const validatedSignature2 = "0xInvalidatedSignature";
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

const value = {
  authorizedGatewayUrl: gatewayUrl,
  gatewayValidatedSignature: validatedSignature,
};

class EthersBlockchainUtilsMocks {
  public blockchainProvider: BlockchainProviderMock;
  public configProvider: ConfigProviderMock;

  constructor() {
    this.blockchainProvider = new BlockchainProviderMock();
    this.configProvider = new ConfigProviderMock();
  }

  public factoryUtils(): IBlockchainUtils {
    return new EthersBlockchainUtils(
      this.blockchainProvider,
      this.configProvider,
    );
  }
}

describe("EthersBlockchainUtils tests", () => {
  test("_signTypedData & verifyTypedData sanity check", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // This private key is from the ethers documentation, don't use it except for testing.
    const privateKey =
      "0x0123456789012345678901234567890123456789012345678901234567890123";

    const wallet = new ethers.Wallet(privateKey);

    const signature = Signature(
      await wallet._signTypedData(domain, types, value),
    );

    // Act
    const result = utils.verifyTypedData(
      domain,
      types,
      value,
      Signature(signature),
    );

    // Assert
    expect(result).toBe(wallet.address);
  });

  test("_signTypedData & verifyTypedData insanity check", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // This private key is from the ethers documentation, don't use it except for testing.
    const privateKey =
      "0x0123456789012345678901234567890123456789012345678901234567890123";

    const wallet = new ethers.Wallet(privateKey);

    const signature = Signature(
      await wallet._signTypedData(domain, types, value),
    );

    // Act
    const value2 = {
      authorizedGatewayUrl: gatewayUrl,
      gatewayValidatedSignature: validatedSignature2,
    };
    const result = utils.verifyTypedData(
      domain,
      types,
      value2,
      Signature(signature),
    );

    // Assert
    expect(result).not.toBe(wallet.address);
  });

  // test("getMessageTransferEncodedCancelData() decode test", async () => {
  //   // Arrange
  //   const inter = new ethers.utils.Interface(TransferAbis.MessageTransfer.abi);

  //   // Act
  //   const decoded = inter.decodeFunctionResult(
  //     "EncodedCancel",
  //     messageTransferEncodedCancel,
  //   );

  //   // Assert
  //   expect(decoded.length).toBe(1);
  //   expect(decoded[0]).toBe(
  //     "0x0000000000000000000000000000000000000000000000000000000000000000",
  //   );
  // });

  // test("getInsuranceTransferEncodedCancelData() decode test", async () => {
  //   // Arrange
  //   const inter = new ethers.utils.Interface(TransferAbis.Insurance.abi);

  //   // Act
  //   const decoded = inter.decodeFunctionResult(
  //     "EncodedCancel",
  //     insuranceTransferEncodedCancel,
  //   );

  //   // Assert
  //   console.log(decoded);
  //   expect(0).toBe(1);
  // });
});
