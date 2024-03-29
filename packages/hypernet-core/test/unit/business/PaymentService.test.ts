import {
  PushPayment,
  AssetBalance,
  PullPayment,
  PublicIdentifier,
  PaymentId,
  GatewayUrl,
  Signature,
  Balances,
  EPaymentState,
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  BigNumberString,
  InvalidPaymentError,
  GatewayRegistrationInfo,
  SortedTransfers,
  ETransferState,
  IFullTransferState,
  TransferId,
  InsuranceState,
  ParameterizedState,
  MessageState,
  PaymentCreationError,
  EPaymentType,
  paymentSigningDomain,
  pushPaymentSigningTypes,
} from "@hypernetlabs/objects";
import { ILogUtils, IValidationUtils } from "@hypernetlabs/utils";
import { PaymentService } from "@implementations/business/PaymentService";
import { IPaymentService } from "@interfaces/business/IPaymentService";
import {
  IAccountsRepository,
  ILinkRepository,
  IGatewayConnectorRepository,
  IPaymentRepository,
  IGatewayRegistrationRepository,
} from "@interfaces/data";
import {
  defaultExpirationLength,
  gatewayUrl,
  hyperTokenAddress,
  insuranceTransferId,
  publicIdentifier,
  publicIdentifier2,
  unixNow,
  gatewaySignature,
  activeInsuranceTransfer,
  activeOfferTransfer,
  activeParameterizedTransfer,
  destinationAddress,
  erc20AssetAddress,
  routerChannelAddress,
  insuranceTransferDefinitionAddress,
  chainId,
  commonAmount,
  unixPast,
  commonPaymentId,
  parameterizedTransferDefinitionAddress,
  messageTransferDefinitionAddress,
  offerDetails,
  activeInsuranceTransfer2,
  insuranceTransferId2,
  activeParameterizedTransfer2,
  parameterizedTransferId,
  parameterizedTransferId2,
  routerPublicIdentifier,
  requestIdentifier1,
  gatewayAccount,
  errorAccount,
  validPaymentId,
  expirationDate,
} from "@mock/mocks";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import {
  IBlockchainTimeUtils,
  IBlockchainUtils,
  IGatewayConnectorProxy,
  IPaymentUtils,
} from "@interfaces/utilities";
import {
  ConfigProviderMock,
  ContextProviderMock,
  VectorUtilsMockFactory,
} from "@tests/mock/utils";

const nonExistentPaymentId = PaymentId("This payment is not mocked");
const validatedSignature = Signature("0xValidatedSignature");

class PaymentServiceMocks {
  public vectorLinkRepository = td.object<ILinkRepository>();
  public accountRepository = td.object<IAccountsRepository>();
  public contextProvider = new ContextProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public vectorUtils = VectorUtilsMockFactory.factoryVectorUtils();
  public paymentUtils = td.object<IPaymentUtils>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public paymentRepository = td.object<IPaymentRepository>();
  public gatewayConnectorRepository = td.object<IGatewayConnectorRepository>();
  public gatewayRegistrationRepository =
    td.object<IGatewayRegistrationRepository>();
  public blockchainTimeUtils = td.object<IBlockchainTimeUtils>();
  public validationUtils = td.object<IValidationUtils>();

  public proposedPushPayment: PushPayment;
  public stakedPushPayment: PushPayment;
  public approvedPushPayment: PushPayment;
  public finalizedPushPayment: PushPayment;

  public assetBalance: AssetBalance;
  public gatewayRegistrationInfo: GatewayRegistrationInfo;
  public gatewayConnectorProxy: IGatewayConnectorProxy;

  constructor(hypertokenBalance: BigNumberString = commonAmount) {
    this.proposedPushPayment = this.factoryPushPayment();
    this.stakedPushPayment = this.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
      commonAmount,
    );
    this.approvedPushPayment = this.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Approved,
      commonAmount,
    );
    this.finalizedPushPayment = this.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Finalized,
      commonAmount,
    );

    this.assetBalance = new AssetBalance(
      routerChannelAddress,
      hyperTokenAddress,
      "PhoebeCoin",
      "BEEP",
      4,
      hypertokenBalance,
      BigNumberString("0"),
      hypertokenBalance,
    );

    td.when(
      this.paymentRepository.createPushPayment(
        commonPaymentId,
        routerChannelAddress,
        publicIdentifier,
        commonAmount,
        expirationDate,
        commonAmount,
        hyperTokenAddress,
        gatewayUrl,
        null,
      ),
    ).thenReturn(okAsync(this.proposedPushPayment));

    // By default, there is a proposed push payment existing
    this.setExistingPayments([this.proposedPushPayment]);
    td.when(
      this.paymentRepository.getPaymentsByIds(
        td.matchers.contains(nonExistentPaymentId),
      ),
    ).thenReturn(okAsync(new Map<PaymentId, PushPayment | PullPayment>()));

    td.when(
      this.paymentRepository.provideStake(commonPaymentId, gatewayAccount),
    ).thenReturn(okAsync(this.stakedPushPayment));

    td.when(
      this.accountRepository.getBalanceByAsset(
        routerChannelAddress,
        hyperTokenAddress,
      ),
    ).thenReturn(okAsync(this.assetBalance));

    td.when(this.accountRepository.getBalances()).thenReturn(
      okAsync(new Balances([this.assetBalance])),
    );

    td.when(this.paymentRepository.provideAsset(commonPaymentId)).thenReturn(
      okAsync(this.approvedPushPayment),
    );

    td.when(
      this.paymentRepository.acceptPayment(commonPaymentId, commonAmount),
    ).thenReturn(okAsync(this.finalizedPushPayment));

    td.when(
      this.paymentRepository.getReservedPaymentIdByRequestId(
        requestIdentifier1,
      ),
    ).thenReturn(okAsync(commonPaymentId));

    td.when(
      this.paymentRepository.addReservedPaymentId(
        requestIdentifier1,
        commonPaymentId,
      ),
    ).thenReturn(okAsync(undefined));

    this.gatewayRegistrationInfo = new GatewayRegistrationInfo(
      gatewayUrl,
      gatewayAccount,
      gatewaySignature,
    );
    this.gatewayConnectorProxy = td.object<IGatewayConnectorProxy>();
    this.gatewayConnectorProxy.gatewayUrl = gatewayUrl;
    td.when(
      this.gatewayConnectorProxy.getConnectorActivationStatus(),
    ).thenReturn(true);
    td.when(
      this.gatewayConnectorProxy.notifyRepairRequested(td.matchers.anything()),
    ).thenReturn(okAsync(undefined));

    const gatewayRegistrationInfoMap = new Map<
      GatewayUrl,
      GatewayRegistrationInfo
    >();
    gatewayRegistrationInfoMap.set(gatewayUrl, this.gatewayRegistrationInfo);
    td.when(
      this.gatewayRegistrationRepository.getGatewayRegistrationInfo(
        td.matchers.contains(gatewayUrl),
      ),
    ).thenReturn(okAsync(gatewayRegistrationInfoMap));

    td.when(this.gatewayConnectorRepository.getAuthorizedGateways()).thenReturn(
      okAsync(new Map([[gatewayUrl, validatedSignature]])),
    );
    td.when(
      this.gatewayConnectorRepository.getGatewayProxy(gatewayUrl),
    ).thenReturn(okAsync(this.gatewayConnectorProxy));

    td.when(
      this.paymentRepository.resolveInsurance(
        commonPaymentId,
        insuranceTransferId,
        BigNumberString("0"),
        null,
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Active));

    td.when(
      this.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer),
    ).thenReturn(okAsync(ETransferState.Active));

    td.when(
      this.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer2),
    ).thenReturn(okAsync(ETransferState.Active));

    td.when(
      this.vectorUtils.getTransferStateFromTransfer(
        activeParameterizedTransfer,
      ),
    ).thenReturn(okAsync(ETransferState.Active));

    td.when(
      this.vectorUtils.getTransferStateFromTransfer(
        activeParameterizedTransfer2,
      ),
    ).thenReturn(okAsync(ETransferState.Active));

    td.when(
      this.vectorUtils.cancelInsuranceTransfer(insuranceTransferId),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: insuranceTransferId,
      }),
    );

    td.when(
      this.vectorUtils.cancelInsuranceTransfer(insuranceTransferId2),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: insuranceTransferId2,
      }),
    );

    td.when(
      this.vectorUtils.cancelParameterizedTransfer(parameterizedTransferId),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: parameterizedTransferId,
      }),
    );

    td.when(
      this.vectorUtils.cancelParameterizedTransfer(parameterizedTransferId2),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: parameterizedTransferId2,
      }),
    );

    td.when(
      this.paymentUtils.validateInsuranceTransfer(
        activeInsuranceTransfer,
        td.matchers.contains(offerDetails),
      ),
    ).thenReturn(true);

    td.when(
      this.paymentUtils.validateInsuranceTransfer(
        activeInsuranceTransfer2,
        td.matchers.contains(offerDetails),
      ),
    ).thenReturn(true);

    td.when(
      this.paymentUtils.validatePaymentTransfer(
        activeParameterizedTransfer,
        td.matchers.contains(offerDetails),
      ),
    ).thenReturn(true);

    td.when(
      this.paymentUtils.validatePaymentTransfer(
        activeParameterizedTransfer2,
        td.matchers.contains(offerDetails),
      ),
    ).thenReturn(true);

    td.when(
      this.paymentUtils.getFirstTransfer(
        td.matchers.argThat((arr) => {
          if (Array.isArray(arr)) {
            return arr.includes(activeOfferTransfer);
          }
          return false;
        }),
      ),
    ).thenReturn(activeOfferTransfer);

    td.when(
      this.paymentUtils.getFirstTransfer(
        td.matchers.argThat((arr) => {
          if (Array.isArray(arr)) {
            return arr.includes(activeInsuranceTransfer);
          }
          return false;
        }),
      ),
    ).thenReturn(activeInsuranceTransfer);

    td.when(
      this.paymentUtils.getFirstTransfer(
        td.matchers.argThat((arr) => {
          if (Array.isArray(arr)) {
            return arr.includes(activeParameterizedTransfer);
          }
          return false;
        }),
      ),
    ).thenReturn(activeParameterizedTransfer);

    td.when(this.paymentUtils.createPaymentId(EPaymentType.Push)).thenReturn(
      okAsync(commonPaymentId),
    );

    td.when(
      this.blockchainUtils.verifyTypedData(
        paymentSigningDomain,
        pushPaymentSigningTypes,
        td.matchers.contains({
          requestIdentifier: requestIdentifier1,
          paymentId: commonPaymentId,
          channelAddress: routerChannelAddress,
          recipientPublicIdentifier: publicIdentifier,
          amount: commonAmount,
          expirationDate: expirationDate,
          requiredStake: commonAmount,
          paymentToken: hyperTokenAddress,
          metadata: "",
        }),
        gatewaySignature,
      ),
    ).thenReturn(gatewayAccount as never);

    td.when(this.blockchainTimeUtils.getBlockchainTimestamp()).thenReturn(
      okAsync(unixNow),
    );
    td.when(this.validationUtils.validatePaymentId(commonPaymentId)).thenReturn(
      true,
    );
    td.when(
      this.validationUtils.validatePublicIdentifier(publicIdentifier),
    ).thenReturn(true);
    td.when(
      this.validationUtils.validatePublicIdentifier(publicIdentifier2),
    ).thenReturn(true);
    td.when(
      this.validationUtils.validateEthereumAddress(routerChannelAddress),
    ).thenReturn(true);
  }

  public factoryPaymentService(): IPaymentService {
    return new PaymentService(
      this.vectorLinkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
      this.gatewayConnectorRepository,
      this.gatewayRegistrationRepository,
      this.vectorUtils,
      this.paymentUtils,
      this.blockchainUtils,
      this.blockchainTimeUtils,
      this.validationUtils,
      this.logUtils,
    );
  }

  public setExistingPayments(payments: (PushPayment | PullPayment)[]) {
    const returnedPaymentsMap = new Map<PaymentId, PushPayment | PullPayment>();
    const paymentIds = new Array<string>();

    for (const payment of payments) {
      returnedPaymentsMap.set(payment.id, payment);
      paymentIds.push(payment.id);
    }

    td.when(
      this.paymentRepository.getPaymentsByIds(td.matchers.contains(paymentIds)),
    ).thenReturn(okAsync(returnedPaymentsMap));
  }

  public factoryPushPayment(
    to: PublicIdentifier = publicIdentifier2,
    from: PublicIdentifier = publicIdentifier,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: BigNumberString = BigNumberString("0"),
    details: SortedTransfers | null = null,
  ): PushPayment {
    if (details == null) {
      details = new SortedTransfers(
        [activeOfferTransfer],
        [activeInsuranceTransfer],
        [activeParameterizedTransfer],
        [],
      );
    }

    return new PushPayment(
      commonPaymentId,
      routerPublicIdentifier,
      chainId,
      to,
      from,
      state,
      hyperTokenAddress,
      commonAmount,
      amountStaked,
      expirationDate,
      unixNow,
      unixNow,
      BigNumberString("0"),
      gatewayUrl,
      details,
      null,
      commonAmount,
      BigNumberString("0"),
    );
  }

  public factoryPullPayment(
    to: PublicIdentifier = publicIdentifier2,
    from: PublicIdentifier = publicIdentifier,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: BigNumberString = BigNumberString("0"),
    details: SortedTransfers | null = null,
  ): PullPayment {
    if (details == null) {
      details = new SortedTransfers(
        [activeOfferTransfer],
        [activeInsuranceTransfer],
        [activeParameterizedTransfer],
        [],
      );
    }

    return new PullPayment(
      commonPaymentId,
      routerPublicIdentifier,
      chainId,
      to,
      from,
      state,
      hyperTokenAddress,
      commonAmount,
      amountStaked,
      expirationDate,
      unixNow,
      unixNow,
      BigNumberString("0"),
      gatewayUrl,
      details,
      null,
      commonAmount,
      BigNumberString("0"),
      BigNumberString("0"), // vestedAmount
      1, // deltaTime
      BigNumberString("1"), // deltaAmount
      [], // ledger
    );
  }

  public factoryMessageTransfer(
    transferId: TransferId,
  ): IFullTransferState<MessageState> {
    return {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: transferId,
      transferDefinition: messageTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: JSON.stringify(offerDetails),
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
    };
  }

  public factoryInsuranceTransfer(
    transferId: TransferId,
    collateralAmount: BigNumberString = commonAmount,
  ): IFullTransferState<InsuranceState> {
    return {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: transferId,
      transferDefinition: insuranceTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: chainId,
      transferEncodings: ["string"],
      transferState: {
        receiver: publicIdentifier,
        mediator: gatewayUrl,
        collateral: collateralAmount,
        expiration: (unixPast + defaultExpirationLength).toString(),
        UUID: commonPaymentId,
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
    };
  }

  public factoryParameterizedTransfer(
    transferId: TransferId,
    amount: BigNumberString = commonAmount,
  ): IFullTransferState<ParameterizedState> {
    return {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: transferId,
      transferDefinition: parameterizedTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        receiver: publicIdentifier2,
        start: unixPast.toString(),
        expiration: (unixPast + defaultExpirationLength).toString(),
        UUID: commonPaymentId,
        rate: {
          deltaAmount: amount,
          deltaTime: "1",
        },
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
    };
  }
}

describe("PaymentService tests", () => {
  test("initiateSendFunds returns a paymentId", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.initiateSendFunds(
      gatewayUrl,
      requestIdentifier1,
      routerChannelAddress,
      publicIdentifier,
      commonAmount,
      expirationDate,
      commonAmount,
      hyperTokenAddress,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const initiationResponse = response._unsafeUnwrap();
    expect(initiationResponse.paymentId).toBe(commonPaymentId);
    expect(initiationResponse.requestIdentifier).toBe(requestIdentifier1);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  // test("initiateSendFunds returns an error", async () => {
  //   // Arrange
  //   const paymentServiceMock = new PaymentServiceMocks();

  //   td.when(this.paymentUtils.createPaymentId(EPaymentType.Push)).thenReturn(
  //     okAsync(commonPaymentId),
  //   );

  //   const paymentService = paymentServiceMock.factoryPaymentService();

  //   // Act
  //   const response = await paymentService.initiateSendFunds(
  //     gatewayUrl,
  //     requestIdentifier1,
  //     routerChannelAddress,
  //     publicIdentifier,
  //     commonAmount,
  //     expirationDate,
  //     commonAmount,
  //     hyperTokenAddress,
  //     null,
  //   );

  //   // Assert
  //   expect(response).toBeDefined();
  //   expect(response.isErr()).toBeFalsy();
  //   const initiationResponse = response._unsafeUnwrap();
  //   expect(initiationResponse.paymentId).toBe(commonPaymentId);
  //   expect(initiationResponse.requestIdentifier).toBe(requestIdentifier1);
  //   paymentServiceMock.contextProvider.assertEventCounts({});
  // });

  test("sendFunds returns payment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(
      requestIdentifier1,
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier,
      commonAmount,
      expirationDate,
      commonAmount,
      hyperTokenAddress,
      gatewayUrl,
      gatewaySignature,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(
      paymentServiceMock.proposedPushPayment,
    );
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentSent: 1,
    });
  });

  test("sendFunds returns error if gateway is invalid", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    td.when(
      paymentServiceMock.gatewayRegistrationRepository.getGatewayRegistrationInfo(
        td.matchers.contains(gatewayUrl),
      ),
    ).thenReturn(okAsync(new Map()));

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(
      requestIdentifier1,
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier,
      commonAmount,
      expirationDate,
      commonAmount,
      hyperTokenAddress,
      gatewayUrl,
      gatewaySignature,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(response._unsafeUnwrapErr()).toBeInstanceOf(PaymentCreationError);
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentSent: 0,
    });
  });

  test("sendFunds returns error if request ID was not reserved", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    td.when(
      paymentServiceMock.paymentRepository.getReservedPaymentIdByRequestId(
        requestIdentifier1,
      ),
    ).thenReturn(okAsync(null));

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(
      requestIdentifier1,
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier,
      commonAmount,
      expirationDate,
      commonAmount,
      hyperTokenAddress,
      gatewayUrl,
      gatewaySignature,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(response._unsafeUnwrapErr()).toBeInstanceOf(PaymentCreationError);
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentSent: 0,
    });
  });

  test("sendFunds returns error if request was for a different payment Id", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    td.when(
      paymentServiceMock.paymentRepository.getReservedPaymentIdByRequestId(
        requestIdentifier1,
      ),
    ).thenReturn(okAsync(validPaymentId));

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(
      requestIdentifier1,
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier,
      commonAmount,
      expirationDate,
      commonAmount,
      hyperTokenAddress,
      gatewayUrl,
      gatewaySignature,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(response._unsafeUnwrapErr()).toBeInstanceOf(PaymentCreationError);
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentSent: 0,
    });
  });

  test("sendFunds returns error if signature does not verify", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    td.when(
      paymentServiceMock.blockchainUtils.verifyTypedData(
        paymentSigningDomain,
        pushPaymentSigningTypes,
        td.matchers.contains({
          requestIdentifier: requestIdentifier1,
          paymentId: commonPaymentId,
          channelAddress: routerChannelAddress,
          recipientPublicIdentifier: publicIdentifier,
          amount: commonAmount,
          expirationDate: expirationDate,
          requiredStake: commonAmount,
          paymentToken: hyperTokenAddress,
          metadata: "",
        }),
        gatewaySignature,
      ),
    ).thenReturn(errorAccount as never);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(
      requestIdentifier1,
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier,
      commonAmount,
      expirationDate,
      commonAmount,
      hyperTokenAddress,
      gatewayUrl,
      gatewaySignature,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(response._unsafeUnwrapErr()).toBeInstanceOf(PaymentCreationError);
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentSent: 0,
    });
  });

  test("offerReceived generates no events when we sent the offer", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("offerReceived generates an event when we received the offer", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const pushPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
    );
    paymentServiceMock.setExistingPayments([pushPayment]);
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentReceived: 1,
      onBalancesChanged: 1,
    });
  });

  test("Should offerReceived return an error if payment was not found", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidPaymentError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should acceptOffer return Payment without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffer(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const payment = result._unsafeUnwrap();
    expect(payment).toBe(paymentServiceMock.stakedPushPayment);
    paymentServiceMock.contextProvider.assertEventCounts({
      onBalancesChanged: 1,
    });
  });

  test("Should acceptOffer return error if payment is not exist", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    paymentServiceMock.setExistingPayments([]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffer(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(AcceptPaymentError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should acceptOffer return error if freeAmount is less than totalStakeRequired", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks(BigNumberString("0"));
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffer(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InsufficientBalanceError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("acceptOffer should return an error if provideStake fails", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier2,
      EPaymentState.Staked,
    );
    paymentServiceMock.setExistingPayments([payment]);

    td.when(
      paymentServiceMock.paymentRepository.provideStake(
        commonPaymentId,
        gatewayAccount,
      ),
    ).thenReturn(errAsync(new InvalidPaymentError("test error")));

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffer(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(Error);
  });

  test("Should stakePosted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
      commonAmount,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 2,
      onBalancesChanged: 0,
    });
  });

  test("Should stakePosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidPaymentError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should stakePosted return null if payment from address is different from context publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Staked,
      commonAmount,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
  });

  test("Should paymentPosted run without errors when payment from is equal to publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Approved,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        updatedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments[1]).toBe(
      paymentServiceMock.finalizedPushPayment,
    );
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 2,
    });
  });

  test("Should paymentPosted run without errors when payment from is not equal to publicIdentifier and payment is PushPayment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Approved,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
  });

  test("Should paymentPosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should paymentCompleted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentCompleted(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
    expect(receivedPushPayments[0]).toBe(
      paymentServiceMock.proposedPushPayment,
    );
  });

  test("Should paymentCompleted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentCompleted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should advancePayments provide asset if payment is staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
    );
    paymentServiceMock.setExistingPayments([payment]);
    paymentServiceMock.contextProvider.context.publicIdentifier =
      publicIdentifier;

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.advancePayments([commonPaymentId]);
    const provideAssetCallingcount = td.explain(
      paymentServiceMock.paymentRepository.provideAsset,
    ).callCount;

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
    expect(provideAssetCallingcount).toBe(1);
    expect(receivedPushPayments[0]).toBe(
      paymentServiceMock.approvedPushPayment,
    );
  });

  test("Should advancePayments finalize payments if payment is approved", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Approved,
    );
    paymentServiceMock.setExistingPayments([payment]);
    paymentServiceMock.contextProvider.context.publicIdentifier =
      publicIdentifier;

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.advancePayments([commonPaymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
    expect(receivedPushPayments[0]).toBe(
      paymentServiceMock.finalizedPushPayment,
    );
  });

  test("Should advancePayments pass and trigger onPushPaymentDelayed if payment gateway is inactive", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
    );
    paymentServiceMock.setExistingPayments([payment]);
    td.when(
      paymentServiceMock.gatewayConnectorProxy.getConnectorActivationStatus(),
    ).thenReturn(false);
    paymentServiceMock.contextProvider.context.publicIdentifier =
      publicIdentifier;

    const delayedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentDelayed.subscribe(
      (val: PushPayment) => {
        delayedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.advancePayments([commonPaymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentDelayed: 1,
      onBalancesChanged: 1,
    });
    expect(delayedPushPayments[0]).toStrictEqual(
      paymentServiceMock.proposedPushPayment,
    );
  });

  test("Should resolveInsurance works without any errors if payment is accepted and has amount staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();
    const acceptedPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Accepted,
      commonAmount,
    );
    paymentServiceMock.setExistingPayments([acceptedPayment]);

    // Act
    const result = await paymentService.resolveInsurance(
      acceptedPayment.id,
      BigNumberString("0"),
      null,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(acceptedPayment);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should resolveInsurance fails if payment is not accepted", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.resolveInsurance(
      commonPaymentId,
      BigNumberString("0"),
      null,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should resolveInsurance fails if payment requiered stake is not equal to amount staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();
    const acceptedPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Accepted,
      commonAmount,
    );
    acceptedPayment.amountStaked = BigNumberString("10");
    paymentServiceMock.setExistingPayments([acceptedPayment]);

    // Act
    const result = await paymentService.resolveInsurance(
      acceptedPayment.id,
      BigNumberString("0"),
      null,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("repairPayments returns immediately if payment is not actually borked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.repairPayments([commonPaymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("repairPayments cancels second insurance transfer if duplicates are detected", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const borkedPushPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Borked,
      undefined,
      new SortedTransfers(
        [activeOfferTransfer],
        [activeInsuranceTransfer, activeInsuranceTransfer2],
        [],
        [],
      ),
    );

    td.when(
      paymentServiceMock.paymentRepository.getPaymentsByIds(
        td.matchers.contains(commonPaymentId),
      ),
    ).thenReturn(
      okAsync(new Map([[commonPaymentId, borkedPushPayment]])),
      okAsync(
        new Map([[commonPaymentId, paymentServiceMock.stakedPushPayment]]),
      ),
    );
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.repairPayments([commonPaymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const retPayments = result._unsafeUnwrap();
    expect(retPayments).toContain(paymentServiceMock.stakedPushPayment);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("repairPayments cancels second payment transfer if duplicates are detected", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const borkedPushPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Borked,
      undefined,
      new SortedTransfers(
        [activeOfferTransfer],
        [activeInsuranceTransfer],
        [activeParameterizedTransfer, activeParameterizedTransfer2],
        [],
      ),
    );

    td.when(
      paymentServiceMock.paymentRepository.getPaymentsByIds(
        td.matchers.contains(commonPaymentId),
      ),
    ).thenReturn(
      okAsync(new Map([[commonPaymentId, borkedPushPayment]])),
      okAsync(
        new Map([[commonPaymentId, paymentServiceMock.approvedPushPayment]]),
      ),
    );
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.repairPayments([commonPaymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const retPayments = result._unsafeUnwrap();
    expect(retPayments).toContain(paymentServiceMock.approvedPushPayment);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });
});
