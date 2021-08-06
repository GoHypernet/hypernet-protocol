import { GatewayUrl } from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { DisplayService } from "@gateway-iframe/implementations/business";
import { IDisplayService } from "@gateway-iframe/interfaces/business";
import { IHypernetCoreRepository } from "@gateway-iframe/interfaces/data";

class DisplayServiceMocks {
  public hypernetCoreRepository = td.object<IHypernetCoreRepository>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");

  constructor() {
    td.when(this.hypernetCoreRepository.emitDisplayRequested()).thenReturn(
      okAsync(undefined),
    );
    td.when(this.hypernetCoreRepository.emitCloseRequested()).thenReturn(
      okAsync(undefined),
    );
  }

  public factoryDisplayService(): IDisplayService {
    return new DisplayService(this.hypernetCoreRepository);
  }
}

describe("DisplayService tests", () => {
  test("Should displayRequested works without errors", async () => {
    // Arrange
    const DisplayServiceMock = new DisplayServiceMocks();
    const DisplayService = DisplayServiceMock.factoryDisplayService();

    // Act
    const response = await DisplayService.displayRequested();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should closeRequested works without errors", async () => {
    // Arrange
    const DisplayServiceMock = new DisplayServiceMocks();
    const DisplayService = DisplayServiceMock.factoryDisplayService();

    // Act
    const response = await DisplayService.closeRequested();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });
});
