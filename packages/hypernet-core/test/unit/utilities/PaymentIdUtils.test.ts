import { InvalidParametersError, InvalidPaymentIdError } from "@hypernetlabs/objects/errors";
import { PaymentIdUtils } from "@implementations/utilities/PaymentIdUtils";
import { EPaymentType } from "@hypernetlabs/objects/types";

describe("PaymentIdUtils tests", () => {
  const validPaymentId = "0x48797065726e6574202050555348202037074ce539ff4b81b4cb43dcfe3f4513";
  const invalidPaymentId = "0x48797065726e6574202050555348202037074ce539ff4b81b4cb43dcfe3f4513Z";
  const invalidPaymentIdWithBadType = "0x48797065726e6574202051555348202037074ce539ff4b81b4cb43dcfe3f4513";
  const validDomain = "Hypernet";
  const invalidDomain = "BlahBlahBlah";
  const validUuid = "37074ce5-39ff-4b81-b4cb-43dcfe3f4513";
  const invalidUuid = "37074ce5-39ff-4b81-b4cb-43dcfe3f4513Z";

  test("makePaymentId creates a valid hex string", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.makePaymentId(validDomain, EPaymentType.Push, validUuid);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const paymentIdHex = result._unsafeUnwrap();
    expect(paymentIdHex).toStrictEqual(validPaymentId);
  });

  test("makePaymentId resolves to an error with an invalid domain", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.makePaymentId(invalidDomain, EPaymentType.Push, validUuid);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidParametersError);
  });

  test("makePaymentId resolves to an error with an invalid type", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.makePaymentId(validDomain, "1234567", validUuid);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidParametersError);
  });

  test("makePaymentId resolves to an error with an invalid uuid", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.makePaymentId(validDomain, EPaymentType.Push, invalidUuid);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidParametersError);
  });

  test("getDomain returns domain", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getDomain(validPaymentId);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const domain = result._unsafeUnwrap();
    expect(domain).toStrictEqual(validDomain);
  });

  test("getDomain returns an error with an invalid payment ID", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getDomain(invalidPaymentId);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidPaymentIdError);
    expect(error.message).toBe(`Not a valid paymentId: '${invalidPaymentId}'`);
  });

  test("getType returns type", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getType(validPaymentId);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const type = result._unsafeUnwrap();
    expect(type).toStrictEqual(EPaymentType.Push);
  });

  test("getType returns an error with an invalid payment ID", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getType(invalidPaymentId);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidPaymentIdError);
    expect(error.message).toBe(`Not a valid paymentId: '${invalidPaymentId}'`);
  });

  test("getType returns an error with an unknown payment type", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getType(invalidPaymentIdWithBadType);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidPaymentIdError);
    expect(error.message).toBe("Type did not correspond to a known EPaymentType, got 'QUSH  '");
  });

  test("getUUID returns UUID", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getUUID(validPaymentId);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const uuid = result._unsafeUnwrap();
    // It comes out unformatted
    expect(uuid).toStrictEqual(validUuid.split("-").join(""));
  });

  test("getType returns an error with an invalid payment ID", () => {
    // Arrange
    const paymentIdUtils = new PaymentIdUtils();

    // Act
    const result = paymentIdUtils.getUUID(invalidPaymentId);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(InvalidPaymentIdError);
    expect(error.message).toBe(`Not a valid paymentId: '${invalidPaymentId}'`);
  });
});
