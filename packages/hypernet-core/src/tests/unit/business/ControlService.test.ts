import { verify, when } from "ts-mockito";
import { Subject } from "rxjs";

import { ControlClaim } from "@interfaces/objects";
import ControlServiceMocks from "../../mock/unit/business/ControlServiceMocks";

describe("ControlService tests", () => {
  test("Should claimControl update context inControl", async () => {
    // Arrange
    const controlServiceMock = new ControlServiceMocks();
    const hypernetContextInstance = controlServiceMock.getHypernetContextFactory();
    hypernetContextInstance.account = "account";

    const controlService = controlServiceMock.getServiceFactory();

    // Act
    when(controlServiceMock.contextProvider.getContext()).thenResolve(hypernetContextInstance);
    when(controlServiceMock.hypernetContext.onControlClaimed).thenReturn(new Subject<ControlClaim>());
    await controlService.claimControl();

    // Assert
    expect(hypernetContextInstance.inControl).toBe(true);
    verify(controlServiceMock.contextProvider.setContext(hypernetContextInstance)).once();
  });
});
