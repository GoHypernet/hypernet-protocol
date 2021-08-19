import { GatewayUrl } from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { PaymentService } from "@gateway-iframe/implementations/business";
import { IPaymentService } from "@gateway-iframe/interfaces/business";
import { IHypernetCoreRepository } from "@gateway-iframe/interfaces/data";
import {
  sendFundsRequest,
  authorizeFundsRequest,
  resolveInsuranceRequest,
} from "@mock/mocks";

class PaymentServiceMocks {
  public hypernetCoreRepository = td.object<IHypernetCoreRepository>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");

  constructor() {
    td.when(
      this.hypernetCoreRepository.emitSendFundsRequest(sendFundsRequest),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.hypernetCoreRepository.emitAuthorizeFundsRequest(
        authorizeFundsRequest,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.hypernetCoreRepository.emitResolveInsuranceRequest(
        resolveInsuranceRequest,
      ),
    ).thenReturn(okAsync(undefined));
  }

  public factoryPaymentService(): IPaymentService {
    return new PaymentService(this.hypernetCoreRepository);
  }
}

describe("PaymentService tests", () => {
  test("Should sendFunds works without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(sendFundsRequest);
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should authorizeFunds works without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.authorizeFunds(authorizeFundsRequest);
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should resolveInsurance works without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.resolveInsurance(
      resolveInsuranceRequest,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });
});
