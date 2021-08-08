import { GatewayUrl, EthereumAddress, Signature } from "@hypernetlabs/objects";
import td from "testdouble";
import Postmate from "postmate";

import { HypernetCoreRepository } from "@gateway-iframe/implementations/data";
import { IHypernetCoreRepository } from "@gateway-iframe/interfaces/data";
import { ContextProvider } from "@gateway-iframe/implementations/utils";
import {
  authorizeFundsRequest,
  resolveInsuranceRequest,
  sendFundsRequest,
} from "@mock/mocks";

class HypernetCoreRepositoryMocks {
  public postmateChildApi = td.object<Postmate.ChildAPI>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");
  public gatewayAddress = EthereumAddress("gatewayAddress");
  public gatewaySignature = Signature("gatewaySignature");
  public contextProvider = new ContextProvider(
    this.gatewayUrl,
    this.gatewayAddress,
    this.gatewaySignature,
  );

  constructor() {
    td.when(
      this.postmateChildApi.emit("sendFundsRequested", sendFundsRequest),
    ).thenReturn(undefined);
    td.when(
      this.postmateChildApi.emit(
        "authorizeFundsRequested",
        authorizeFundsRequest,
      ),
    ).thenReturn(undefined);
    td.when(
      this.postmateChildApi.emit(
        "resolveInsuranceRequested",
        resolveInsuranceRequest,
      ),
    ).thenReturn(undefined);

    td.when(this.postmateChildApi.emit("emitDisplayRequested")).thenReturn(
      undefined,
    );

    td.when(this.postmateChildApi.emit("emitDisplayRequested")).thenReturn(
      undefined,
    );

    td.when(
      this.postmateChildApi.emit("emitSignMessageRequested", "message"),
    ).thenReturn(undefined);
  }

  public factoryHypernetCoreRepository(): IHypernetCoreRepository {
    return new HypernetCoreRepository(this.contextProvider);
  }
}

describe("HypernetCoreRepository tests", () => {
  test("Should emitSendFundsRequest works without errors", async () => {
    // Arrange
    const HypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      HypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    HypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        HypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitSendFundsRequest(
      sendFundsRequest,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should emitAuthorizeFundsRequest works without errors", async () => {
    // Arrange
    const HypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      HypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    HypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        HypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitAuthorizeFundsRequest(
      authorizeFundsRequest,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should emitResolveInsuranceRequest works without errors", async () => {
    // Arrange
    const HypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      HypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    HypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        HypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitResolveInsuranceRequest(
      resolveInsuranceRequest,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should emitDisplayRequested works without errors", async () => {
    // Arrange
    const HypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      HypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    HypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        HypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitDisplayRequested();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should emitCloseRequested works without errors", async () => {
    // Arrange
    const HypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      HypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    HypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        HypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitCloseRequested();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should emitCloseRequested works without errors", async () => {
    // Arrange
    const HypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      HypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    HypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        HypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitSignMessageRequested(
      "message",
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });
});
