import { BigNumberString } from "@hypernetlabs/objects";
import { DevelopmentService } from "@implementations/business";
import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { account } from "@tests/mock/mocks";
import { okAsync } from "neverthrow";
import td from "testdouble";

const amount = BigNumberString("42");

class DevelopmentServiceMocks {
  public accountRepository = td.object<IAccountsRepository>();

  constructor() {
    td.when(this.accountRepository.mintTestToken(amount, account)).thenReturn(
      okAsync(undefined),
    );
  }

  public factoryDevelopmentService(): IDevelopmentService {
    return new DevelopmentService(this.accountRepository);
  }
}

describe("DevelopmentService tests", () => {
  test("Should mintTestToken without errors", async () => {
    // Arrange
    const developmentServiceMock = new DevelopmentServiceMocks();

    const developmentService =
      developmentServiceMock.factoryDevelopmentService();

    // Act
    const response = await developmentService.mintTestToken(amount, account);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBeUndefined();
  });
});
