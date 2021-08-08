import { GatewayUrl } from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { IAjaxUtils } from "@hypernetlabs/utils";
import { GatewayConnectorRepository } from "@gateway-iframe/implementations/data";
import { IGatewayConnectorRepository } from "@gateway-iframe/interfaces/data";
import { gatewayUrl } from "@mock/mocks";

class GatewayConnectorRepositoryMocks {
  public ajaxUtils = td.object<IAjaxUtils>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");

  constructor() {
    td.when(
      this.ajaxUtils.get<string>(
        td.matchers.contains({
          href: gatewayUrl + "connector",
        }),
      ),
    ).thenReturn(okAsync("code"));
  }

  public factoryGatewayConnectorRepository(): IGatewayConnectorRepository {
    return new GatewayConnectorRepository(this.ajaxUtils);
  }
}

describe("GatewayConnectorRepository tests", () => {
  test("Should getGatewayCode works without errors and return gateway code", async () => {
    // Arrange
    const GatewayConnectorRepositoryMock =
      new GatewayConnectorRepositoryMocks();
    const GatewayConnectorRepository =
      GatewayConnectorRepositoryMock.factoryGatewayConnectorRepository();

    // Act
    const response = await GatewayConnectorRepository.getGatewayCode(
      gatewayUrl,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe("code");
  });
});
