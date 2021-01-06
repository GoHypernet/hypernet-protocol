import { mock, instance, verify } from "ts-mockito";

import { BigNumber } from "@interfaces/objects";
import { DevelopmentService } from "@implementations/business";
import { AccountsRepository } from "@implementations/data";

describe("DevelopmentService tests", () => {
  test("Should mintTestToken", async () => {
    // Arrange
    const accountRepository: AccountsRepository = mock(AccountsRepository);
    const accountRepositoryInstance: AccountsRepository = instance(accountRepository);

    const developmentService = new DevelopmentService(accountRepositoryInstance);

    const amount = BigNumber.from("42");
    const to = "ethereumAddress";

    // Act
    developmentService.mintTestToken(amount, to);

    // Assert
    verify(accountRepository.mintTestToken(amount, to)).once();
  });
});
