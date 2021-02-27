import td, { verify } from "testdouble";
require("testdouble-jest")(td, jest);
import {
  merchantUrl,
  account,
  account2,
  routerChannelAddress,
  insuranceTransferId,
  commonPaymentId,
  mediatorSignature,
  merchantPublicKey,
  merchantUrl2,
  merchantPublicKey2,
} from "@mock/mocks";
import { BlockchainProviderMock, ConfigProviderMock, ContextProviderMock } from "@mock/utils";
import {
  IVectorUtils,
  ILocalStorageUtils,
  IMerchantConnectorProxy,
  IBlockchainUtils,
  IBasicTransferResponse,
  ILogUtils,
  IBrowserNode,
} from "@interfaces/utilities";
import { MerchantConnectorError, MerchantValidationError, TransferResolutionError } from "@interfaces/objects/errors";
import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { okAsync, errAsync } from "neverthrow";
import { BrowserNodeProvider } from "@implementations/utilities/BrowserNodeProvider";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { IBrowserNodeFactory, IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { BigNumber } from "@interfaces/objects";
import { NonEIP712Message } from "@connext/vector-browser-node";

const validatedSignature = "0xValidatedSignature";
const newAuthorizationSignature = "0xNewAuthorizationSignature";
const authorizationSignature =
  "0x1e866e66e7f3a68658bd186bafbdc534d4a5022e14022fddfe8865e2236dc67d64eee05b4d8f340dffa1928efa517784b63cad6a3fb35d999cb9d722b34075071b";
const resolutionAmount = "1";

class BrowserNodeProviderMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock(null, null, account);
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public logUtils = td.object<ILogUtils>();
  public browserNodeFactory = td.object<IBrowserNodeFactory>();

  public browserNode = td.object<IBrowserNode>();

  public expectedSignerDomain = {
    name: "Hypernet Protocol",
    version: "1",
  };

  public expectedSignerTypes = {
    AuthorizedMerchant: [
      { name: "authorizedMerchantUrl", type: "string" },
      { name: "merchantValidatedSignature", type: "string" },
    ],
  };

  public expectedSignerValue = {
    authorizedMerchantUrl: merchantUrl,
    merchantValidatedSignature: validatedSignature,
  };

  constructor(stubSigner: boolean = true) {
    td.when(this.localStorageUtils.getSessionItem(`account-${account}-signature`)).thenReturn(null);

    td.when(this.browserNodeFactory.factoryBrowserNode()).thenReturn(okAsync(this.browserNode));

    if (stubSigner) {
      td.when(this.blockchainProvider.signer.getAddress()).thenResolve(account);
      td.when(this.blockchainProvider.signer.signMessage(NonEIP712Message)).thenResolve(authorizationSignature);
    }

    td.when(this.browserNode.init(authorizationSignature, account)).thenReturn(okAsync(undefined));
  }

  public factoryProvider(): IBrowserNodeProvider {
    return new BrowserNodeProvider(
      this.configProvider,
      this.contextProvider,
      this.blockchainProvider,
      this.logUtils,
      this.localStorageUtils,
      this.browserNodeFactory,
    );
  }
}

describe("BrowserNodeProvider tests", () => {
  test("getBrowserNode returns a returns a browser node from nothing", async () => {
    // Arrange
    const mocks = new BrowserNodeProviderMocks();
    const provider = mocks.factoryProvider();

    // Act
    const result = await provider.getBrowserNode();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const node = result._unsafeUnwrap();
    expect(node).toBe(mocks.browserNode);
    td.verify(mocks.localStorageUtils.setSessionItem(`account-${account}-signature`, authorizationSignature));
  });

  test("getBrowserNode returns a returns a browser node without signing message with existing signature", async () => {
    // Arrange
    const mocks = new BrowserNodeProviderMocks(false);

    td.when(mocks.localStorageUtils.getSessionItem(`account-${account}-signature`)).thenReturn(authorizationSignature);

    const provider = mocks.factoryProvider();

    // Act
    const result = await provider.getBrowserNode();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const node = result._unsafeUnwrap();
    expect(node).toBe(mocks.browserNode);
    td.verify(mocks.localStorageUtils.setSessionItem(`account-${account}-signature`, authorizationSignature));
    td.verify(mocks.blockchainProvider.signer.signMessage(NonEIP712Message), { times: 0 });
  });

  test("getBrowserNode returns the same browser node and only initializes once if called twice", async () => {
    // Arrange
    const mocks = new BrowserNodeProviderMocks();
    const provider = mocks.factoryProvider();

    // Act
    const result = await provider.getBrowserNode();
    const result2 = await provider.getBrowserNode();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const node1 = result._unsafeUnwrap();
    expect(node1).toBe(mocks.browserNode);
    td.verify(mocks.localStorageUtils.setSessionItem(`account-${account}-signature`, authorizationSignature));

    expect(result2).toBeDefined();
    expect(result2.isErr()).toBeFalsy();
    const node2 = result2._unsafeUnwrap();
    expect(node2).toBe(mocks.browserNode);
    expect(node2).toBe(node1);
  });
});
