// /**
//  * @jest-environment jsdom
//  */

// import td from "testdouble";
// import {
//   UUID,
//   UnixTimestamp,
//   GatewayUrl,
//   Signature,
//   PublicIdentifier,
//   Balances,
//   AssetBalance,
//   EthereumAddress,
//   BigNumberString,
//   IFullChannelState,
//   ProxyError,
//   PaymentId,
// } from "@hypernetlabs/objects";
// import { errAsync, okAsync, ResultAsync } from "neverthrow";

// import {
//   BlockchainProviderMock,
//   BrowserNodeProviderMock,
//   ContextProviderMock,
// } from "@mock/utils";
// import { GatewayConnectorProxy } from "@implementations/utilities/GatewayConnectorProxy";
// import { IGatewayConnectorProxy } from "@interfaces/utilities";
// import { routerChannelAddress } from "@mock/mocks";

// class GatewayConnectorProxyMocks {
//   public blockchainProvider = new BlockchainProviderMock();
//   public contextProviderMock = new ContextProviderMock();
//   public browserNodeProvider = new BrowserNodeProviderMock();
//   public iframeUrl = "https://vector-iframe-dev.hypernetlabs.io";
//   public iframeName = "iframeName";
//   public gatewayUrl = GatewayUrl("iframeName");
//   public gatewayDeauthorizationTimeout = 1;
//   public publicIdentifier = PublicIdentifier("publicIdentifier");
//   public stateChannel: IFullChannelState | undefined;
//   public balances: Balances;

//   constructor() {
//     this.stateChannel =
//       this.browserNodeProvider.stateChannels.get(routerChannelAddress);

//     if (this.stateChannel == null) {
//       throw new Error();
//     }

//     // td.when(this.gatewayConnectorProxyObject.activate()).thenReturn(
//     //   errAsync(new ProxyError("")),
//     // );

//     this.balances = {
//       assets: [
//         new AssetBalance(
//           EthereumAddress(this.stateChannel?.assetIds[0]),
//           `Unknown Token (${EthereumAddress(this.stateChannel?.assetIds[0])})`,
//           "Unk",
//           0,
//           BigNumberString(this.stateChannel?.balances[0].amount[1]),
//           BigNumberString("0"),
//           BigNumberString(this.stateChannel?.balances[0].amount[1]),
//         ),
//       ],
//     };

//     // public balances = new Balances([
//     //   new AssetBalance(
//     //     EthereumAddress(this.stateChannel?.assetIds[0]),
//     //     `Unknown Token (${EthereumAddress(this.stateChannel?.assetIds[0])})`,
//     //     "Unk",
//     //     0,
//     //     BigNumberString(this.stateChannel?.balances[0].amount[1]),
//     //     BigNumberString("0"),
//     //     BigNumberString(this.stateChannel?.balances[0].amount[1]),
//     //   ),
//     // ],)
//   }

//   public factoryGatewayConnectorProxy(): IGatewayConnectorProxy {
//     return new GatewayConnectorProxy(
//       document.body,
//       this.iframeUrl,
//       this.gatewayUrl,
//       this.iframeName,
//       this.contextProviderMock,
//       this.gatewayDeauthorizationTimeout,
//       false,
//     );
//   }
// }

// describe("GatewayConnectorProxy tests", () => {
//   test("activateConnector should activate connector", async () => {
//     // Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();
//     // Act
//     // await gatewayConnectorProxy.activateProxy()
//     await gatewayConnectorProxy.activate();
//     const result = await gatewayConnectorProxy.activateConnector(
//       gatewayConnectorProxyMocks.publicIdentifier,
//       gatewayConnectorProxyMocks.balances,
//     );
//     console.log("result", result);
//     // Assert
//     expect(result).toBeDefined();
//     expect(result.isErr()).toBeFalsy();
//     expect(result._unsafeUnwrap()).toBe(undefined);
//   });
//   test("deauthorize should deauthorize", async () => {
//     // Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();
//     // Act
//     // await gatewayConnectorProxy.activateProxy()
//     const result = await gatewayConnectorProxy.deauthorize();
//     console.log("result", result);
//     // Assert
//     expect(result).toBeDefined();
//     expect(result.isErr()).toBeFalsy();
//     expect(result._unsafeUnwrap()).toBe(undefined);
//   });
//   test("getValidatedSignature should createCall with getValidatedSignature", async () => {
//     // Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();
//     // Act
//     // @ts-ignore
//     gatewayConnectorProxy.active = true;
//     const result = await gatewayConnectorProxy.getValidatedSignature();
//     console.log("result", result);
//     // Assert
//     expect(result).toBeDefined();
//     expect(result.isErr()).toBeFalsy();
//     expect(result._unsafeUnwrap()).toBe(undefined);
//   });
//   test("destroy should destroy connector", async () => {
//     // Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();
//     // Act
//     const result = await gatewayConnectorProxy.destroy();
//     console.log("result", result);
//     // Assert
//     expect(result).toBe(undefined);
//   });
//   test("messageSigned should return void", async () => {
//     // Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();
//     // Act
//     const result = await gatewayConnectorProxy.messageSigned(
//       "message",
//       Signature("signature"),
//     );
//     // Assert
//     expect(result).toBeDefined();
//     expect(result.isErr()).toBeFalsy();
//     expect(result._unsafeUnwrap()).toBe(undefined);
//   });
// });
