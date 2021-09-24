import { Eip1193Bridge } from "@ethersproject/experimental";
import {
  InvalidParametersError,
  PrivateCredentials,
} from "@hypernetlabs/objects";
import { ILocalStorageUtils, ILogUtils } from "@hypernetlabs/utils";
import { chainId } from "@tests/mock/mocks";
import { ethers } from "ethers";
import { Err, Ok, okAsync } from "neverthrow";
import td from "testdouble";

import { EthersBlockchainProvider } from "@implementations/utilities";
import { IBlockchainProvider, IBrowserNode } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";
import { ConfigProviderMock, ContextProviderMock } from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

jest.mock("web3modal", () => {
  return class Web3Modal {
    constructor() {}

    public connect() {
      return new Promise((resolve, _) => {
        resolve(undefined);
      });
    }
  };
});

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
    providers: {
      JsonRpcProvider: class JsonRpcProvider {
        constructor() {}
      },
      Web3Provider: class Web3Provider {
        constructor() {}

        public getBlock() {
          return okAsync({} as ethers.providers.Block);
        }

        public getSigner() {
          return td.object<ethers.providers.JsonRpcSigner>();
        }

        public getNetwork(): Promise<ethers.providers.Network> {
          return Promise.resolve({
            name: "test",
            chainId: chainId,
          });
        }
      },
    },
  };
});

class BlockchainProviderMocks {
  public logUtils = td.object<ILogUtils>();
  public contextProvider = new ContextProviderMock();
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public configProvider = new ConfigProviderMock();
  public internalProviderFactory = td.object<IInternalProviderFactory>();

  constructor(stubSigner = true) {}

  public factoryProvider(): IBlockchainProvider {
    return new EthersBlockchainProvider(
      this.contextProvider,
      this.configProvider,
      this.localStorageUtils,
      this.internalProviderFactory,
      this.logUtils,
    );
  }
}

describe("BlockchainProvider tests", () => {
  test("getProvider returns a provider", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    const result = await blockchainProvider.initialize().andThen(() => {
      return blockchainProvider.getProvider();
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const wrappedResponse = result._unsafeUnwrap();
  });

  test("getProvider returns Must call BlockchainProvider.initialize() first before you can call getProvider()", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    let result;
    try {
      await blockchainProvider.getProvider();
    } catch (err) {
      result = err;
    }

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Error);
    expect(result).toStrictEqual(
      new Error(
        "Must call BlockchainProvider.initialize() first before you can call getProvider()",
      ),
    );
  });

  test("getSigner returns a signer", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act

    const result = await blockchainProvider.initialize().andThen(() => {
      return blockchainProvider.getSigner();
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("getSigner returns Must call BlockchainProvider.initialize() first before you can call getSigner()", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    let result;
    try {
      await blockchainProvider.getSigner();
    } catch (err) {
      result = err;
    }

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Error);
    expect(result).toStrictEqual(
      new Error(
        "Must call BlockchainProvider.initialize() first before you can call getSigner()",
      ),
    );
  });

  test("getGovernanceProvider returns a Provider", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    const result = await blockchainProvider.initialize().andThen(() => {
      return blockchainProvider.getGovernanceProvider();
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("getGovernanceProvider returns Must call BlockchainProvider.initialize() first before you can call getGovernanceProvider()", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    let result;
    try {
      await blockchainProvider.getGovernanceProvider();
    } catch (err) {
      result = err;
    }

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Error);
    expect(result).toStrictEqual(
      new Error(
        "Must call BlockchainProvider.initialize() first before you can call getGovernanceProvider()",
      ),
    );
  });

  test("getEIP1193Provider returns a Eip1193Bridge", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    await blockchainProvider.initialize();
    const result = await blockchainProvider.getEIP1193Provider();
    const wrappedResponse = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(wrappedResponse).toBeInstanceOf(Eip1193Bridge);
  });

  test("getEIP1193Provider returns Must call BlockchainProvider.initialize() first before you can call getEIP1193Provider()", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    let result;
    try {
      await blockchainProvider.getEIP1193Provider();
    } catch (err) {
      result = err;
    }

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Error);
    expect(result).toStrictEqual(
      new Error(
        "Must call BlockchainProvider.initialize() first before you can call getEIP1193Provider()",
      ),
    );
  });

  test("getLatestBlock returns a ethers.providers.Block", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    await blockchainProvider.initialize();
    const result = await blockchainProvider.getLatestBlock();
    const wrappedResponse = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(wrappedResponse).toBeInstanceOf(Ok);
  });

  test("supplyPrivateCredentials returns okAsync", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    const privateCredentials = new PrivateCredentials("privateKey", "mnemonic");
    await blockchainProvider.initialize();
    const result = await blockchainProvider.supplyPrivateCredentials(
      privateCredentials,
    );
    const wrappedResponse = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(wrappedResponse).toStrictEqual(undefined);
  });

  test("supplyPrivateCredentials returns InvalidParametersError", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    const privateCredentials = new PrivateCredentials(null, null);
    const result = await blockchainProvider.supplyPrivateCredentials(
      privateCredentials,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result).toBeInstanceOf(Err);
    expect(result._unsafeUnwrapErr()).toStrictEqual(
      new InvalidParametersError("You must provide a mnemonic or private key"),
    );
  });
});
