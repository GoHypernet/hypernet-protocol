import {
  BigNumberString,
  BlockchainUnavailableError,
  Signature,
  TransferAbis,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import {
  gatewayUrl,
  messageTransferEncodedCancel,
  erc20AssetAddress,
  routerChannelAddress,
  errorRouterChannelAddress,
  commonAmount,
  TransactionReceiptMock,
  account,
  errorAccount,
  TransactionResponseMock,
  defaultGovernanceChainInformation,
} from "@mock/mocks";
import { ethers } from "ethers";
import td from "testdouble";

import { EthersBlockchainUtils } from "@implementations/utilities";
import { IBlockchainUtils } from "@interfaces/utilities";
import { BlockchainProviderMock, ConfigProviderMock } from "@tests/mock/utils";

const gatewayRegistryTokenIndex = 1;
const registryEntry = '{ "foo": "bar" }';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

jest.mock("ethers", () => {
  let mockEthers = {};
  Object.keys(jest.requireActual("ethers")).forEach((key) => {
    mockEthers = {
      ...mockEthers,
      [key]: jest.requireActual("ethers")[key],
    };
  });
  return {
    ...mockEthers,
    Contract: class Contract {
      constructor() {}
      public transfer(routerChannelAddress: string, amount: BigNumberString) {
        return new Promise((resolve, reject) => {
          if (routerChannelAddress === errorRouterChannelAddress) {
            reject(new BlockchainUnavailableError());
          }
          resolve(new TransactionReceiptMock());
        });
      }
      public mint(to: EthereumAccountAddress, _: BigNumberString) {
        return new Promise((resolve, reject) => {
          if (to === errorAccount) {
            reject(new BlockchainUnavailableError());
          }
          resolve(new TransactionResponseMock());
        });
      }
      public ResolverEncoding() {
        return new Promise((resolve, reject) => {
          resolve(hexString);
        });
      }
      public EncodedCancel() {
        return new Promise((resolve, reject) => {
          resolve(hexString);
        });
      }

      public registryMap(key: string) {
        return new Promise((resolve, reject) => {
          if (key === gatewayUrl) {
            resolve(gatewayRegistryTokenIndex);
          }

          reject(new Error());
        });
      }

      public tokenURI(index: number) {
        return new Promise((resolve, reject) => {
          if (index === gatewayRegistryTokenIndex) {
            resolve(registryEntry);
          }

          reject(new Error());
        });
      }
    },
  };
});

const hexString = "hexString";
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

  test("erc20Transfer should return TransactionReceiptMock", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const result = await utils.erc20Transfer(
      erc20AssetAddress,
      routerChannelAddress,
      commonAmount,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(new TransactionReceiptMock());
  });

  test("erc20Transfer should return BlockchainUnavailableError", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const result = await utils.erc20Transfer(
      erc20AssetAddress,
      errorRouterChannelAddress,
      commonAmount,
    );
    const wrappedResponse = result._unsafeUnwrapErr();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(wrappedResponse).toBeInstanceOf(BlockchainUnavailableError);
    expect(wrappedResponse).toStrictEqual(
      new BlockchainUnavailableError(
        "Unable to complete an ERC20 token transfer",
      ),
    );
  });

  test("mintToken should return TransactionResponse", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const result = await utils.mintToken(commonAmount, account);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(new TransactionResponseMock());
  });

  test("mintToken should return BlockchainUnavailableError", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const result = await utils.mintToken(commonAmount, errorAccount);
    const wrappedResponse = result._unsafeUnwrapErr();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(wrappedResponse).toBeInstanceOf(BlockchainUnavailableError);
    expect(wrappedResponse).toStrictEqual(
      new BlockchainUnavailableError("Unable to mint test token"),
    );
  });

  test("getMessageTransferEncodedCancelData() decode test", async () => {
    // Arrange
    const inter = new ethers.utils.Interface(TransferAbis.MessageTransfer.abi);
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const decoded = inter.decodeFunctionResult(
      "EncodedCancel",
      messageTransferEncodedCancel,
    );
    const result = await utils.getMessageTransferEncodedCancelData(
      defaultGovernanceChainInformation,
    );

    // Assert
    expect(decoded.length).toBe(1);
    expect(decoded[0]).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    );
    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual([hexString, hexString]);
  });

  test("getInsuranceTransferEncodedCancelData() should return [string, HexString]", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const result = await utils.getInsuranceTransferEncodedCancelData(
      defaultGovernanceChainInformation,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual([hexString, hexString]);
  });

  test("getParameterizedTransferEncodedCancelData() should return [string, HexString]", async () => {
    // Arrange
    const mocks = new EthersBlockchainUtilsMocks();
    const utils = mocks.factoryUtils();

    // Act
    const result = await utils.getParameterizedTransferEncodedCancelData(
      defaultGovernanceChainInformation,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual([hexString, hexString]);
  });
});
