import {
  InvalidParametersError,
  PrivateCredentials,
  ProviderId,
} from "@hypernetlabs/objects";
import { ILocalStorageUtils, ILogUtils } from "@hypernetlabs/utils";
import { chainId, injectedProviderId } from "@mock/mocks";
import { ethers } from "ethers";
import { Err, Ok, okAsync } from "neverthrow";
import td from "testdouble";

import {
  BlockchainProvider,
  CeramicEIP1193Bridge,
} from "@implementations/utilities";
import { IBlockchainProvider } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";
import { ConfigProviderMock, ContextProviderMock } from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

jest.mock("web3modal", () => {
  return class Web3Modal {
    constructor() {}

    public cachedProvider = injectedProviderId;

    public connectTo(providerId: ProviderId) {
      return new Promise((resolve, _) => {
        resolve(providerId);
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
    return new BlockchainProvider(
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

  test("getProvider returns Must call BlockchainProvider.initialize() first. error", async () => {
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
      new Error("Must call BlockchainProvider.initialize() first."),
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

  test("getSigner returns Must call BlockchainProvider.initialize() first. error", async () => {
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
      new Error("Must call BlockchainProvider.initialize() first."),
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

  test("getGovernanceProvider returns Must call BlockchainProvider.initialize() first. error", async () => {
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
      new Error("Must call BlockchainProvider.initialize() first."),
    );
  });

  test("getCeramicEIP1193Provider returns a CeramicEIP1193Bridge", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    await blockchainProvider.initialize();
    const result = await blockchainProvider.getCeramicEIP1193Provider();
    const wrappedResponse = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(wrappedResponse).toBeInstanceOf(CeramicEIP1193Bridge);
  });

  test("getCeramicEIP1193Provider returns Must call BlockchainProvider.initialize() first. error", async () => {
    // Arrange
    const mocks = new BlockchainProviderMocks();
    const blockchainProvider = mocks.factoryProvider();

    // Act
    let result;
    try {
      await blockchainProvider.getCeramicEIP1193Provider();
    } catch (err) {
      result = err;
    }

    // Assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Error);
    expect(result).toStrictEqual(
      new Error("Must call BlockchainProvider.initialize() first."),
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
