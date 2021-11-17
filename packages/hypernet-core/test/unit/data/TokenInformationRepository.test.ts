import { INonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/contracts";
import {
  PushPayment,
  HypernetLink,
  Payment,
  VectorError,
  EPaymentState,
  BigNumberString,
  UnixTimestamp,
  SortedTransfers,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { TokenInformationRepository } from "@implementations/data";
import { ITokenInformationRepository } from "@interfaces/data";
import {
  tokenRegistryAddress,
  tokenRegistryEntry1,
  tokenRegistryEntry2,
} from "@mock/mocks";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { IContractFactory } from "@interfaces/utilities/factory";
import { ConfigProviderMock } from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

class TokenInformationRepositoryMocks {
  public contractFactory = td.object<IContractFactory>();
  public configProviderMock = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public contract =
    td.object<INonFungibleRegistryEnumerableUpgradeableContract>();

  constructor() {
    td.when(
      this.contractFactory.factoryNonFungibleRegistryEnumerableUpgradeableContract(
        tokenRegistryAddress,
      ),
    ).thenReturn(okAsync(this.contract));

    td.when(this.contract.totalSupply()).thenReturn(okAsync(2));

    td.when(this.contract.tokenByIndex(1)).thenReturn(
      okAsync(tokenRegistryId1),
    );

    td.when(this.contract.tokenByIndex(2)).thenReturn(
      okAsync(tokenRegistryId2),
    );

    td.when(
      this.contract.getRegistryEntryByTokenId(tokenRegistryId1),
    ).thenReturn(okAsync(tokenRegistryEntry1));

    td.when(
      this.contract.getRegistryEntryByTokenId(tokenRegistryId2),
    ).thenReturn(okAsync(tokenRegistryEntry2));
  }

  public factoryTokenInformationRepository(): ITokenInformationRepository {
    return new TokenInformationRepository(
      this.contractFactory,
      this.configProviderMock,
      this.logUtils,
    );
  }
}

describe("TokenInformationRepository tests", () => {
  test("initialize() returns without errors", async () => {
    // Arrange
    const mocks = new TokenInformationRepositoryMocks();
    const repo = mocks.factoryTokenInformationRepository();

    // Act
    const result = await repo.initialize();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });
});
