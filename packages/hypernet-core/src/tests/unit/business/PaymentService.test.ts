import { when } from "ts-mockito";
import { Subject } from "rxjs";
import moment from "moment";

import {
  BigNumber,
  PushPayment,
  Payment,
  PullAmount,
  HypernetConfig,
  AssetBalance,
  PullPayment,
} from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import PaymentServiceMocks from "../../mock/business/PaymentServiceMocks";
import { mkPublicIdentifier } from "@connext/vector-utils";
import { mockUtils } from "../../mock/utils";
import { constants } from "ethers";
import { ChainProviders } from "@connext/vector-types";
import { okAsync, ok, err } from "neverthrow";
import {
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  OfferMismatchError,
} from "@interfaces/objects/errors";
const { when: jestWhen } = require("jest-when");

const publicIdentifier = mkPublicIdentifier();
const amount = "42";
const paymentExpirationDate = Number(new Date());
const requiredStake = "42";
const amountStaked = BigNumber.from("42");
const paymentToken = mockUtils.generateRandomPaymentToken();
const disputeMediator = mockUtils.generateRandomEtherAdress();
const paymentId = mockUtils.generateRandomPaymentId();
const expirationDate = moment(moment().format());
const to = mockUtils.generateRandomEtherAdress();
const from = mockUtils.generateRandomEtherAdress();
const paymentState = EPaymentState.Proposed;
const finalized = false;
const paymentRequiredStake = BigNumber.from("42");
const createdTimestamp = moment(moment().format());
const updatedTimestamp = moment(moment().format());
const collateralRecovered = BigNumber.from("42");
const paymentAmount = BigNumber.from("42");
const authorizedAmount = BigNumber.from("42");
const transferedAmount = BigNumber.from("42");
const ledger: PullAmount[] = [];

describe("PaymentService tests", () => {
  test("Should sendFunds return payment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      paymentState,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.createPushPayment)
      .calledWith(publicIdentifier, amount, expirationDate, requiredStake, paymentToken, disputeMediator)
      .mockResolvedValue(okAsync(payment));

    // Assert
    expect(
      (
        await paymentServiceMock
          .getServiceFactory()
          .sendFunds(publicIdentifier, amount, expirationDate, requiredStake, paymentToken, disputeMediator)
      )._unsafeUnwrap(),
    ).toStrictEqual(payment);
  });

  test("Should offerReceived works without any errors if payment was found", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      paymentState,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getInitializedContext()).thenReturn(
      okAsync(paymentServiceMock.getInitializedHypernetContextFactory()),
    );
    when(paymentServiceMock.initializedHypernetContext.onPushPaymentProposed).thenReturn(new Subject<PushPayment>());

    // Assert
    expect((await paymentServiceMock.getServiceFactory().offerReceived(paymentId))._unsafeUnwrap()).toEqual(undefined);
  });

  test("Should offerReceived return an error if payment was not found", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const returnedPaymentsMap = new Map<any, any>([[null, null]]);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getInitializedContext()).thenReturn(
      okAsync(paymentServiceMock.getInitializedHypernetContextFactory()),
    );
    when(paymentServiceMock.initializedHypernetContext.onPushPaymentProposed).thenReturn(new Subject<PushPayment>());

    const throwenError = new Error(`PaymentService:offerReceived():Could not get payment!`);

    // Assert
    expect((await paymentServiceMock.getServiceFactory().offerReceived(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should acceptFunds return Payment without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const chainProvider: ChainProviders = {
      [1337]: "http://localhost:8545",
    };

    const hyperTokenAddress = constants.AddressZero;
    const hypernetConfig = new HypernetConfig(
      "http://localhost:5000", // iframeSource
      mockUtils.defaultMnemonic,
      "", // routerPublicIdentifier
      1337, // Chain ID
      "localhost:8008", // Router address
      hyperTokenAddress, // Hypertoken address,
      "Hypernet", // Hypernet ProtocogetPaymentsByIdsl Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      chainProvider,
    );
    const paymentIds = [paymentId];
    const payment = new PushPayment(
      paymentIds[0],
      to,
      from,
      paymentState,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    const returnedPaymentsMap = new Map<string, Payment>();
    for (const paymentId of paymentIds) {
      returnedPaymentsMap.set(paymentId, payment);
    }

    const assetBalance = new AssetBalance(hyperTokenAddress, paymentAmount, BigNumber.from(0), paymentAmount);

    // Act
    when(paymentServiceMock.configProvider.getConfig()).thenReturn(okAsync(hypernetConfig));
    when(paymentServiceMock.accountRepository.getBalanceByAsset(hyperTokenAddress)).thenReturn(okAsync(assetBalance));
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith(paymentIds)
      .mockReturnValue(okAsync(returnedPaymentsMap));
    for (const paymentId of paymentIds) {
      jestWhen(paymentServiceMock.paymentRepository.prototype.provideStake)
        .calledWith(paymentId)
        .mockReturnValue(okAsync(payment));
    }

    // Assert
    expect((await paymentServiceMock.getServiceFactory().acceptFunds(paymentIds))._unsafeUnwrap()).toStrictEqual([
      ok(payment),
    ]);
  });

  test("Should acceptFunds return error if payment state is not Proposed", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const chainProvider: ChainProviders = {
      [1337]: "http://localhost:8545",
    };

    const hyperTokenAddress = constants.AddressZero;
    const hypernetConfig = new HypernetConfig(
      "http://localhost:5000", // iframeSource
      mockUtils.defaultMnemonic,
      "", // routerPublicIdentifier
      1337, // Chain ID
      "localhost:8008", // Router address
      hyperTokenAddress, // Hypertoken address,
      "Hypernet", // Hypernet ProtocogetPaymentsByIdsl Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      chainProvider,
    );
    const paymentIds = [paymentId];
    const payment = new PushPayment(
      paymentIds[0],
      to,
      from,
      EPaymentState.Approved,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    const returnedPaymentsMap = new Map<string, Payment>();
    for (const paymentId of paymentIds) {
      returnedPaymentsMap.set(paymentId, payment);
    }

    const assetBalance = new AssetBalance(hyperTokenAddress, paymentAmount, BigNumber.from(0), paymentAmount);

    // Act
    when(paymentServiceMock.configProvider.getConfig()).thenReturn(okAsync(hypernetConfig));
    when(paymentServiceMock.accountRepository.getBalanceByAsset(hyperTokenAddress)).thenReturn(okAsync(assetBalance));
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith(paymentIds)
      .mockReturnValue(okAsync(returnedPaymentsMap));
    for (const paymentId of paymentIds) {
      jestWhen(paymentServiceMock.paymentRepository.prototype.provideStake)
        .calledWith(paymentId)
        .mockReturnValue(okAsync(payment));
    }

    const throwenError = new AcceptPaymentError(
      `Cannot accept payment ${paymentIds[0]}, it is not in the Proposed state`,
    );

    // Assert
    expect((await paymentServiceMock.getServiceFactory().acceptFunds(paymentIds))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should acceptFunds return error if freeAmount is less than totalStakeRequired", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const chainProvider: ChainProviders = {
      [1337]: "http://localhost:8545",
    };

    const hyperTokenAddress = constants.AddressZero;
    const hypernetConfig = new HypernetConfig(
      "http://localhost:5000", // iframeSource
      mockUtils.defaultMnemonic,
      "", // routerPublicIdentifier
      1337, // Chain ID
      "localhost:8008", // Router address
      hyperTokenAddress, // Hypertoken address,
      "Hypernet", // Hypernet ProtocogetPaymentsByIdsl Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      chainProvider,
    );
    const paymentIds = [paymentId];
    const payment = new PushPayment(
      paymentIds[0],
      to,
      from,
      paymentState,
      paymentToken,
      BigNumber.from("43"),
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    const returnedPaymentsMap = new Map<string, Payment>();
    for (const paymentId of paymentIds) {
      returnedPaymentsMap.set(paymentId, payment);
    }

    const assetBalance = new AssetBalance(hyperTokenAddress, paymentAmount, BigNumber.from(0), paymentAmount);

    // Act
    when(paymentServiceMock.configProvider.getConfig()).thenReturn(okAsync(hypernetConfig));
    when(paymentServiceMock.accountRepository.getBalanceByAsset(hyperTokenAddress)).thenReturn(okAsync(assetBalance));
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith(paymentIds)
      .mockReturnValue(okAsync(returnedPaymentsMap));

    const throwenError = new InsufficientBalanceError("Not enough Hypertoken to cover provided payments.");

    // Assert
    expect((await paymentServiceMock.getServiceFactory().acceptFunds(paymentIds))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  // TODO: check acceptFunds for this test case, it looks like the function is not returning an actuall error, instead it returnes an array of ok<Error[]>
  test("Should acceptFunds return error if provideStake fails", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const chainProvider: ChainProviders = {
      [1337]: "http://localhost:8545",
    };

    const hyperTokenAddress = constants.AddressZero;
    const hypernetConfig = new HypernetConfig(
      "http://localhost:5000", // iframeSource
      mockUtils.defaultMnemonic,
      "", // routerPublicIdentifier
      1337, // Chain ID
      "localhost:8008", // Router address
      hyperTokenAddress, // Hypertoken address,
      "Hypernet", // Hypernet ProtocogetPaymentsByIdsl Domain for Transfers
      5 * 24 * 60 * 60, // 5 days as the default payment expiration time
      chainProvider,
    );
    const paymentIds = [paymentId];
    const payment = new PushPayment(
      paymentIds[0],
      to,
      from,
      paymentState,
      paymentToken,
      paymentAmount,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    const returnedPaymentsMap = new Map<string, Payment>();
    for (const paymentId of paymentIds) {
      returnedPaymentsMap.set(paymentId, payment);
    }

    const assetBalance = new AssetBalance(hyperTokenAddress, paymentAmount, BigNumber.from(0), paymentAmount);

    // Act
    when(paymentServiceMock.configProvider.getConfig()).thenReturn(okAsync(hypernetConfig));
    when(paymentServiceMock.accountRepository.getBalanceByAsset(hyperTokenAddress)).thenReturn(okAsync(assetBalance));
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith(paymentIds)
      .mockReturnValue(okAsync(returnedPaymentsMap));

    const throwenError = new AcceptPaymentError(
      `Payment ${paymentIds[0]} could not be staked! Source exception: error`,
    );

    for (const paymentId of paymentIds) {
      jestWhen(paymentServiceMock.paymentRepository.prototype.provideStake)
        .calledWith(paymentId)
        .mockReturnValue(err(throwenError));
    }

    // Assert
    expect((await paymentServiceMock.getServiceFactory().acceptFunds(paymentIds))._unsafeUnwrap()).toEqual([
      err(new AcceptPaymentError(`Payment ${paymentIds[0]} could not be staked! Source exception: ${throwenError}`)),
    ]);
  });

  test("Should stakePosted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Staked,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = from;
    hypernetContext.onPushPaymentUpdated = new Subject<PushPayment>();

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    jestWhen(paymentServiceMock.paymentRepository.prototype.provideAsset)
      .calledWith(paymentId)
      .mockReturnValue(okAsync(payment));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().stakePosted(paymentId))._unsafeUnwrap()).toEqual(undefined);
  });

  test("Should stakePosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = null;
    const returnedPaymentsMap = new Map<string, Payment | null>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(`Invalid payment ID!`);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().stakePosted(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should stakePosted return error if requiredStake is equal to the amountStaked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Staked,
      paymentToken,
      BigNumber.from("1"),
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new OfferMismatchError(`Invalid stake provided for payment ${paymentId}`);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().stakePosted(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should stakePosted return error if payment state is not Staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Approved,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(
      `Invalid payment ${paymentId}, it must be in the staked status. Cannot provide payment!`,
    );

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().stakePosted(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should stakePosted return null if payment from address is different from conext publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Staked,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(
      `Invalid payment ${paymentId}, it must be in the staked status. Cannot provide payment!`,
    );

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().stakePosted(paymentId))._unsafeUnwrap()).toEqual(undefined);
  });

  test("Should paymentPosted run without errors when payment from is equal to publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Approved,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = from;

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentPosted(paymentId))._unsafeUnwrap()).toEqual(undefined);
  });

  test("Should paymentPosted run without errors when payment from is not equal to publicIdentifier and payment is PushPayment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Approved,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = from;

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));
    jestWhen(paymentServiceMock.paymentRepository.prototype.finalizePayment)
      .calledWith(paymentId, payment.paymentAmount.toString())
      .mockReturnValue(okAsync(null));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentPosted(paymentId))._unsafeUnwrap()).toEqual(undefined);
  });

  test("Should paymentPosted run without errors when payment from is not equal to publicIdentifier and payment is PullPayment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PullPayment(
      paymentId,
      to,
      from,
      EPaymentState.Approved,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      authorizedAmount,
      transferedAmount,
      ledger,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = from;
    hypernetContext.onPullPaymentApproved = new Subject<PullPayment>();

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentPosted(paymentId))._unsafeUnwrap()).toEqual(undefined);
  });

  test("Should paymentPosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = null;
    const returnedPaymentsMap = new Map<string, Payment | null>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(`Invalid payment ID!`);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentPosted(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should paymentPosted return error if payment state is not Approved", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Proposed,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(
      `Invalid payment ${paymentId}, it must be in the approved status. Cannot provide payment!`,
    );

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentPosted(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should paymentCompleted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      EPaymentState.Staked,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = from;
    hypernetContext.onPushPaymentReceived = new Subject<PushPayment>();

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentCompleted(paymentId))._unsafeUnwrap()).toEqual(
      undefined,
    );
  });

  test("Should paymentCompleted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = null;
    const returnedPaymentsMap = new Map<string, Payment | null>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(`Invalid payment ID!`);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().paymentCompleted(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });

  test("Should pullRecorded return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = null;
    const returnedPaymentsMap = new Map<string, Payment | null>([[paymentId, payment]]);

    const hypernetContext = paymentServiceMock.getHypernetContextFactory();
    hypernetContext.publicIdentifier = publicIdentifier;

    const throwenError = new InvalidParametersError(`Invalid payment ID!`);

    // Act
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockReturnValue(okAsync(returnedPaymentsMap));
    when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Assert
    expect((await paymentServiceMock.getServiceFactory().pullRecorded(paymentId))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });
});
