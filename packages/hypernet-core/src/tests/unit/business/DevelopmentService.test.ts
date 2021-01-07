import { verify } from "ts-mockito";

import { BigNumber } from "@interfaces/objects";
import DevelopmentServiceMocks from "../../mock/unit/business/DevelopmentServiceMocks";

describe("DevelopmentService tests", () => {
  test("Should mintTestToken", async () => {
    // Arrange
    const developmentServiceMock = new DevelopmentServiceMocks();
    const amount = BigNumber.from("42");
    const to = "ethereumAddress";

    // Act
    developmentServiceMock.getServiceFactory().mintTestToken(amount, to);

    // Assert
    verify(developmentServiceMock.accountRepository.mintTestToken(amount, to)).once();
  });
});
