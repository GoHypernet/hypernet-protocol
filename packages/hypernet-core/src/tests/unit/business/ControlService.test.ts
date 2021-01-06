import { mock, instance, verify, when } from "ts-mockito";
import { Subject } from "rxjs";

import { ControlClaim, HypernetContext } from "@interfaces/objects";
import { ControlService } from "@implementations/business";
import { ContextProvider } from "@implementations/utilities";

describe("ControlService tests", () => {
  test("Should claimControl update context inControl", async () => {
    // Arrange
    const contextProvider: ContextProvider = mock(ContextProvider);
    const contextProviderInstance: ContextProvider = instance(contextProvider);

    const hypernetContext = mock(HypernetContext);
    const hypernetContextInstance = instance(hypernetContext);
    hypernetContextInstance.account = "account";

    const controlService = new ControlService(contextProviderInstance);

    // Act
    when(contextProvider.getContext()).thenResolve(hypernetContextInstance);
    when(hypernetContext.onControlClaimed).thenReturn(new Subject<ControlClaim>());
    await controlService.claimControl();

    // Assert
    expect(hypernetContextInstance.inControl).toBe(true);
    verify(contextProvider.setContext(hypernetContextInstance)).once();
  });
});
