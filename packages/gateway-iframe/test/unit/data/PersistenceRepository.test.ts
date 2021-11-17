import { GatewayUrl, Signature } from "@hypernetlabs/objects";
import { ILocalStorageUtils } from "@hypernetlabs/utils";
import td from "testdouble";

import { PersistenceRepository } from "@gateway-iframe/implementations/data";
import { IPersistenceRepository } from "@gateway-iframe/interfaces/data";
import { ExpectedRedirect } from "@gateway-iframe/interfaces/objects";

class PersistenceRepositoryMock {
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");
  public activatedGatewaySignatures = '["signature"]';
  public expectedRedirect = new ExpectedRedirect(
    this.gatewayUrl,
    "/redirect",
    "params values",
  );
  protected activatedGatewaySignaturesKey = "activatedGatewaySignatures";
  protected expectedRedirectKey = "expectedRedirect";

  constructor() {
    td.when(
      this.localStorageUtils.getSessionItem(this.activatedGatewaySignaturesKey),
    ).thenReturn(this.activatedGatewaySignatures);
    td.when(
      this.localStorageUtils.setSessionItem(
        this.activatedGatewaySignaturesKey,
        this.activatedGatewaySignatures,
      ),
    ).thenReturn(undefined);
    td.when(
      this.localStorageUtils.getSessionItem(this.expectedRedirectKey),
    ).thenReturn(JSON.stringify(this.expectedRedirect));
    td.when(
      this.localStorageUtils.setSessionItem(
        this.expectedRedirectKey,
        JSON.stringify(this.expectedRedirect),
      ),
    ).thenReturn(undefined);
  }

  public factoryPersistenceRepository(): IPersistenceRepository {
    return new PersistenceRepository(this.localStorageUtils);
  }
}

describe("PersistenceRepository tests", () => {
  test("Should getActivatedGatewaySignatures works without errors and return signatures", async () => {
    // Arrange
    const persistenceRepositoryMock = new PersistenceRepositoryMock();
    const persistenceRepository =
      persistenceRepositoryMock.factoryPersistenceRepository();

    // Act
    const response =
      await persistenceRepository.getActivatedGatewaySignatures();

    // Assert
    expect(response).toBeDefined();
    expect(response).toStrictEqual(
      JSON.parse(persistenceRepositoryMock.activatedGatewaySignatures),
    );
  });

  test("Should addActivatedGatewaySignature works without errors", async () => {
    // Arrange
    const persistenceRepositoryMock = new PersistenceRepositoryMock();
    const persistenceRepository =
      persistenceRepositoryMock.factoryPersistenceRepository();

    // Act
    const response = await persistenceRepository.addActivatedGatewaySignature(
      Signature("signature2"),
    );

    // Assert
    expect(response).toBeUndefined();
  });

  test("Should setExpectedRedirect works without errors", async () => {
    // Arrange
    const persistenceRepositoryMock = new PersistenceRepositoryMock();
    const persistenceRepository =
      persistenceRepositoryMock.factoryPersistenceRepository();

    // Act
    const response = await persistenceRepository.setExpectedRedirect(
      persistenceRepositoryMock.expectedRedirect,
    );

    // Assert
    expect(response).toBeUndefined();
  });

  test("Should getExpectedRedirect works without errors", async () => {
    // Arrange
    const persistenceRepositoryMock = new PersistenceRepositoryMock();
    const persistenceRepository =
      persistenceRepositoryMock.factoryPersistenceRepository();

    // Act
    const response = await persistenceRepository.getExpectedRedirect();

    // Assert
    expect(response).toBeDefined();
    expect(response).toStrictEqual(persistenceRepositoryMock.expectedRedirect);
  });
});
