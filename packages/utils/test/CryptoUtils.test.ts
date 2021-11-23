import { CryptoUtils } from "@hypernetlabs/utils";

describe("CryptoUtils tests", () => {
  test("xmur3 should return a consistent set of hashes", () => {
    // Arrange

    // Act
    const hashFunc1 = CryptoUtils.xmur3("test");
    const result1 = hashFunc1();
    const result2 = hashFunc1();
    const result3 = hashFunc1();
    const result4 = hashFunc1();

    const hashFunc2 = CryptoUtils.xmur3("test2");
    const result5 = hashFunc2();
    const result6 = hashFunc2();
    const result7 = hashFunc2();
    const result8 = hashFunc2();

    // Assert
    expect(result1).toBe(2974430664);
    expect(result2).toBe(1305844984);
    expect(result3).toBe(734072121);
    expect(result4).toBe(1536723475);
    expect(result5).toBe(1658787369);
    expect(result6).toBe(3368432903);
    expect(result7).toBe(3387464765);
    expect(result8).toBe(3471636620);
  });

  test("sfc32 should return a consistent set of random numbers from a given set of seed values", () => {
    // Arrange

    // Act
    const randFunc = CryptoUtils.sfc32(
      1658787369,
      3368432903,
      3387464765,
      3471636620,
    );
    const result1 = randFunc();
    const result2 = randFunc();
    const result3 = randFunc();
    const result4 = randFunc();

    // Assert
    expect(result1).toBe(0.9787943207193166);
    expect(result2).toBe(0.6903808601200581);
    expect(result3).toBe(0.4871583266649395);
    expect(result4).toBe(0.5197842947673053);
  });

  test("randomBytes should return a consistent array from a given seed", () => {
    // Arrange

    // Act
    const result = CryptoUtils.randomBytes(32, "test");

    // Assert
    console.log(result);
    expect(result).toStrictEqual(
      new Uint8Array([
        90, 51, 245, 205, 202, 238, 187, 97, 191, 116, 156, 253, 85, 123, 158,
        39, 142, 24, 41, 208, 150, 237, 154, 115, 211, 168, 206, 55, 154, 179,
        249, 170,
      ]),
    );
  });
});
