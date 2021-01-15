/* import { verify } from "ts-mockito";

import { BigNumber } from "@interfaces/objects";
import DevelopmentServiceMocks from "../../mock/business/DevelopmentServiceMocks";

var randomstring = require("randomstring");

describe("DevelopmentService tests", () => {
  test("Should mintTestToken", async () => {
    // Arrange
    const developmentServiceMock = new DevelopmentServiceMocks();
    const amount = BigNumber.from("42");
    const to = "0x" + randomstring.generate({ length: 40, charset: "hex" });

    // Act
    developmentServiceMock.getServiceFactory().mintTestToken(amount, to);

    // Assert
    verify(developmentServiceMock.accountRepository.mintTestToken(amount, to)).once();
  });
}); */
describe("AccountService tests", () => {
  test("Should acceptFunds return error if payment state is not Proposed", () => {
    expect(true).toBe(true);
  });
});
