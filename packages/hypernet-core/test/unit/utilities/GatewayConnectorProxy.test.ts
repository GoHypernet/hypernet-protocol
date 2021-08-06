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

// jest.mock("postmate", () => {
//   return class Postmate {
//     constructor() {
//       return Promise.resolve({
//         on: function (str, callback) {
//           if (str === "callSuccess") {
//             callback();
//           }
//         },
//         call: function () {},
//       });
//     }
//   };
// });

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
//   test("activateConnector should return ProxyError if proxy is not activated", async () => {
//     //Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();

//     //Act
//     const result = await gatewayConnectorProxy.activateConnector(
//       gatewayConnectorProxyMocks.publicIdentifier,
//       gatewayConnectorProxyMocks.balances,
//     );
//     const err = result._unsafeUnwrapErr();

//     //Assert
//     expect(result).toBeDefined();
//     expect(result.isErr()).toBeTruthy();
//     expect(err).toBeInstanceOf(ProxyError);
//   });

//   test("activateConnector should activate connector code and return void", async () => {
//     //Arrange
//     const gatewayConnectorProxyMocks = new GatewayConnectorProxyMocks();
//     const gatewayConnectorProxy =
//       gatewayConnectorProxyMocks.factoryGatewayConnectorProxy();
//     //Act
//     const ss = await gatewayConnectorProxy.activateProxy();
//     console.log("ss: ", ss._unsafeUnwrap());
//     //await gatewayConnectorProxy.activate();
//     const result = await gatewayConnectorProxy.activateConnector(
//       gatewayConnectorProxyMocks.publicIdentifier,
//       gatewayConnectorProxyMocks.balances,
//     );
//     const res = result._unsafeUnwrap();
//     console.log("res", res);

//     //Assert
//     expect(result).toBeDefined();
//     expect(result.isErr()).toBeTruthy();
//     expect(res).toBe(undefined);
//   });
// });
