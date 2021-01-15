import { when } from "ts-mockito";

import { BigNumber } from "@interfaces/objects";
import DevelopmentServiceMocks from "../../mock/business/DevelopmentServiceMocks";
import { mockUtils } from "../../mock/utils";
import { okAsync } from "neverthrow";

describe("DevelopmentService tests", () => {
  test("Should mintTestToken without errors", async () => {
    // Arrange
    const developmentServiceMock = new DevelopmentServiceMocks();
    const amount = BigNumber.from("42");
    const to = mockUtils.generateRandomEtherAdress();

    // Act
    when(developmentServiceMock.accountRepository.mintTestToken(amount, to)).thenReturn(okAsync(undefined));

    // Assert
    expect((await developmentServiceMock.getServiceFactory().mintTestToken(amount, to))._unsafeUnwrap()).toStrictEqual(
      undefined,
    );
  });
});
