import {
  GatewayUrl,
  Signature,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import Postmate from "postmate";
import td from "testdouble";

import { HypernetCoreRepository } from "@gateway-iframe/implementations/data";
import { ContextProvider } from "@gateway-iframe/implementations/utils";
import { IHypernetCoreRepository } from "@gateway-iframe/interfaces/data";
import {
  authorizeFundsRequest,
  resolveInsuranceRequest,
  sendFundsRequest,
} from "@mock/mocks";

class HypernetCoreRepositoryMocks {
  public postmateChildApi = td.object<Postmate.ChildAPI>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");
  public gatewayAddress = EthereumAccountAddress("gatewayAddress");
  public gatewaySignature = Signature("gatewaySignature");
  public contextProvider = new ContextProvider(
    this.gatewayUrl,
    this.gatewayAddress,
    this.gatewaySignature,
  );

  constructor() {}

  public factoryHypernetCoreRepository(): IHypernetCoreRepository {
    return new HypernetCoreRepository(this.contextProvider);
  }
}

describe("HypernetCoreRepository tests", () => {
  test("Should emitSendFundsRequest works without errors", async () => {
    // Arrange
    const hypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      hypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    hypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        hypernetCoreRepositoryMock.postmateChildApi,
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
    td.verify(
      hypernetCoreRepositoryMock.postmateChildApi.emit(
        "sendFundsRequested",
        sendFundsRequest,
      ),
    );
  });

  test("Should emitAuthorizeFundsRequest works without errors", async () => {
    // Arrange
    const hypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      hypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    hypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        hypernetCoreRepositoryMock.postmateChildApi,
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
    td.verify(
      hypernetCoreRepositoryMock.postmateChildApi.emit(
        "authorizeFundsRequested",
        authorizeFundsRequest,
      ),
    );
  });

  test("Should emitResolveInsuranceRequest works without errors", async () => {
    // Arrange
    const hypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      hypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    hypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        hypernetCoreRepositoryMock.postmateChildApi,
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
    td.verify(
      hypernetCoreRepositoryMock.postmateChildApi.emit(
        "resolveInsuranceRequested",
        resolveInsuranceRequest,
      ),
    );
  });

  test("Should emitDisplayRequested works without errors", async () => {
    // Arrange
    const hypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      hypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    hypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        hypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitDisplayRequested();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
    td.verify(
      hypernetCoreRepositoryMock.postmateChildApi.emit(
        "displayRequested",
        hypernetCoreRepositoryMock.gatewayUrl,
      ),
    );
  });

  test("Should emitCloseRequested works without errors", async () => {
    // Arrange
    const hypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      hypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    hypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        hypernetCoreRepositoryMock.postmateChildApi,
      );

    // Act
    const response = await HypernetCoreRepository.emitCloseRequested();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
    td.verify(
      hypernetCoreRepositoryMock.postmateChildApi.emit(
        "closeRequested",
        hypernetCoreRepositoryMock.gatewayUrl,
      ),
    );
  });

  test("Should emitSignMessageRequested works without errors", async () => {
    // Arrange
    const hypernetCoreRepositoryMock = new HypernetCoreRepositoryMocks();
    const HypernetCoreRepository =
      hypernetCoreRepositoryMock.factoryHypernetCoreRepository();
    hypernetCoreRepositoryMock.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(
        hypernetCoreRepositoryMock.postmateChildApi,
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
    td.verify(
      hypernetCoreRepositoryMock.postmateChildApi.emit(
        "signMessageRequested",
        "message",
      ),
    );
  });
});
