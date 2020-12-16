import { Result } from "@connext/vector-types";
import { AccountService, DevelopmentService, LinkService, PaymentService } from "@implementations/business";
import { AccountsRepository, PaymentRepository, VectorLinkRepository } from "@implementations/data";
import {
  BrowserNodeProvider,
  ConfigProvider,
  ContextProvider,
  EthersBlockchainProvider,
  LinkUtils,
  PaymentUtils,
  VectorUtils,
} from "@implementations/utilities";
import { IAccountService, IDevelopmentService, ILinkService, IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository, IPaymentRepository } from "@interfaces/data";
import { IHypernetCore } from "@interfaces/IHypernetCore";
import {
  Balances,
  BigNumber,
  ControlClaim,
  Either,
  EthereumAddress,
  HypernetConfig,
  HypernetLink,
  Payment,
  PublicIdentifier,
  PublicKey,
  PullPayment,
  PushPayment,
} from "@interfaces/objects";
import { CoreUninitializedError } from "@interfaces/objects/errors";
import { EBlockchainNetwork } from "@interfaces/types";
import {
  IBlockchainProvider,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  ILinkUtils,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { IVectorListener } from "@interfaces/api";
import { Subject } from "rxjs";
import { VectorAPIListener } from "./api";

/**
 * The top-level class-definition for Hypernet Core.
 */
export class HypernetCore implements IHypernetCore {
  // RXJS Observables
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentProposed: Subject<PushPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentProposed: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPullPaymentApproved: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;

  // Utils Layer Stuff
  protected blockchainProvider: IBlockchainProvider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected browserNodeProvider: IBrowserNodeProvider;
  protected vectorUtils: IVectorUtils;
  protected paymentUtils: IPaymentUtils;
  protected linkUtils: ILinkUtils;

  // Data Layer Stuff
  protected accountRepository: IAccountsRepository;
  protected linkRepository: ILinkRepository;
  protected paymentRepository: IPaymentRepository;

  // Business Layer Stuff
  protected accountService: IAccountService;
  protected paymentService: IPaymentService;
  protected linkService: ILinkService;
  protected developmentService: IDevelopmentService;

  // API
  protected vectorAPIListener: IVectorListener;

  protected _initializedPromise: Promise<void>;
  protected _initializeResolve: (() => void) | undefined;
  protected _inControl: boolean;

  /**
   * Returns an instance of HypernetCore.
   * @param network the network to attach to
   * @param config optional config, defaults to localhost/dev config
   */
  constructor(network: EBlockchainNetwork = EBlockchainNetwork.Main, config?: HypernetConfig) {
    this._initializedPromise = new Promise((resolve) => {
      this._initializeResolve = resolve;
    });
    this._inControl = false;

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();

    this.onControlClaimed.subscribe({
      next: () => {
        this._inControl = true;
      },
    });

    this.onControlYielded.subscribe({
      next: () => {
        this._inControl = false;
      },
    });

    this.blockchainProvider = new EthersBlockchainProvider();
    this.configProvider = new ConfigProvider(network, config);
    this.paymentUtils = new PaymentUtils(this.configProvider);
    this.linkUtils = new LinkUtils();

    this.contextProvider = new ContextProvider(
      this.onControlClaimed,
      this.onControlYielded,
      this.onPushPaymentProposed,
      this.onPullPaymentProposed,
      this.onPushPaymentReceived,
      this.onPullPaymentApproved,
      this.onPushPaymentUpdated,
      this.onPullPaymentUpdated,
      this.onBalancesChanged,
    );

    this.browserNodeProvider = new BrowserNodeProvider(this.configProvider, this.contextProvider);
    this.vectorUtils = new VectorUtils(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.blockchainProvider,
    );

    this.accountRepository = new AccountsRepository(
      this.blockchainProvider,
      this.vectorUtils,
      this.browserNodeProvider,
    );

    this.paymentRepository = new PaymentRepository(
      this.browserNodeProvider,
      this.vectorUtils,
      this.configProvider,
      this.contextProvider,
      this.paymentUtils,
    );

    this.linkRepository = new VectorLinkRepository(
      this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.paymentUtils,
      this.linkUtils,
    );

    this.paymentService = new PaymentService(
      this.linkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
    );

    this.accountService = new AccountService(this.accountRepository, this.contextProvider);
    this.linkService = new LinkService(this.linkRepository);
    this.developmentService = new DevelopmentService(this.accountRepository);

    this.vectorAPIListener = new VectorAPIListener(
      this.browserNodeProvider,
      this.paymentService,
      this.vectorUtils,
      this.contextProvider,
      this.paymentUtils,
    );
  }

  /**
   * Returns the initialized status of this instance of Hypernet Core.
   */
  public initialized(): Promise<void> {
    return this._initializedPromise;
  }

  /**
   * Whether or not this instance of Hypernet Core is currently the one in control.
   */
  public inControl(): boolean {
    return this._inControl;
  }

  /**
   * Returns a list of Ethereum accounts associated with this instance of Hypernet Core.
   */
  public async getEthereumAccounts(): Promise<EthereumAddress[]> {
    return this.accountService.getAccounts();
  }

  /**
   * Returns the (vector) pubId associated with this instance of HypernetCore.
   */
  public async getPublicIdentifier(): Promise<Either<CoreUninitializedError, PublicIdentifier>> {
    const context = await this.contextProvider.getInitializedContext();
    return context.applyOnSuccess((c) => c.publicIdentifier);
  }

  /**
   * Deposit funds into Hypernet Core.
   * @param assetAddress the Ethereum address of the token to deposit
   * @param amount the amount of the token to deposit
   */
  public async depositFunds(assetAddress: string, amount: BigNumber): Promise<Balances> {
    // console.log(`HypernetCore:depositFunds:assetAddress:${assetAddress}`)
    return this.accountService.depositFunds(assetAddress, amount);
  }

  /**
   * Withdraw funds from Hypernet Core to a specified destination (Ethereum) address.
   * @param assetAddress the address of the token to withdraw
   * @param amount the amount of the token to withdraw
   * @param destinationAddress the (Ethereum) address to withdraw to
   */
  public async withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): Promise<Balances> {
    return this.accountService.withdrawFunds(assetAddress, amount, destinationAddress);
  }

  /**
   * Returns the current balances for this instance of Hypernet Core.
   */
  public async getBalances(): Promise<Balances> {
    return this.accountService.getBalances();
  }

  /**
   * Return all Hypernet Links.
   */
  public async getLinks(): Promise<HypernetLink[]> {
    return this.linkService.getLinks();
  }

  /**
   * Return all *active* Hypernet Links.
   */
  public async getActiveLinks(): Promise<HypernetLink[]> {
    return this.linkService.getLinks();
  }

  /**
   * Returns all links with a specified counterparty.
   * @param counterPartyAccount
   */
  public async getLinkByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Sends funds on a provided link.
   * Internally, this is a three-step process. First, the consumer will notify the provider of the
   * proposed terms of the payment (amount, required stake, and payment token). If the provider
   * accepts these terms, they will create an insurance payment for the stake, and then the consumer
   * finishes by creating a parameterized payment for the amount. The provider can immediately finalize
   * the payment.
   * @param linkId
   * @param amount
   * @param requiredStake the amount of stake that the provider must put up as part of the insurancepayment
   * @param paymentToken
   */
  public async sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    // Send payment terms to provider & request provider make insurance payment
    const payment = await this.paymentService.sendFunds(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    );

    return payment;
  }

  /**
   * Accepts the terms of a push payment, and puts up the stake/insurance transfer.
   * @param paymentId
   */
  public async acceptFunds(paymentIds: string[]): Promise<Result<Payment, Error>[]> {
    // console.log(`HypernetCore:acceptFunds: attempting to accept funds for paymentIds: ${paymentIds}`)
    const results = await this.paymentService.acceptFunds(paymentIds);

    return results;
  }

  /**
   * Sends the parameterized payment internally for payments in state "Staked".
   * Internally, calls paymentService.stakePosted()
   * @param paymentIds the list of payment ids for which to complete the payments for
   */
  public async completePayments(paymentIds: string[]): Promise<void> {
    await this.paymentService.stakesPosted(paymentIds);
    //const results = await this.paymentService.stakesPosted(paymentIds);

    // @todo change return type to Promise<Result<Payment, Error>[]>
    // (note that this will require us to also change the underlying stakePosted function in paymentService!)
  }

  /**
   * Authorizes funds to a specified counterparty, with an amount, rate, & expiration date.
   * @param counterPartyAccount the public identifier of the counterparty to authorize funds to
   * @param totalAuthorized the total amount the counterparty is allowed to "pull"
   * @param expirationDate the latest time in which the counterparty can pull funds
   * @param requiredStake the amount of stake the counterparyt must put up as insurance
   * @param paymentToken the (Ethereum) address of the payment token
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public async authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Pull funds for a given payment
   * @param paymentId the payment for which to pull funds from
   * @param amount the amount of funds to pull
   */
  public async pullFunds(paymentId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Finalize a pull-payment.
   */
  public async finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Finalize a push-payment; internally, resolves the ParameterizedPayment transfer
   * @param paymentId the payment to finalize
   */
  public async finalizePushPayment(paymentId: string): Promise<void> {
    await this.paymentService.paymentPosted(paymentId);
    // @todo change return type to Promise<HypernetLink>
  }

  /**
   * Initiat a dispute for a particular payment.
   * @param paymentId the payment for which to dispute
   * @param metadata the data provided to the dispute mediator about this dispute
   */
  public async initiateDispute(paymentId: string, metadata: string): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Initialize this instance of Hypernet Core
   * @param account: the ethereum account to initialize with
   */
  public async initialize(account: string): Promise<void> {
    const context = await this.contextProvider.getContext();
    const publicIdentifier = await this.accountService.getPublicIdentifier();
    context.account = account;
    context.publicIdentifier = publicIdentifier;
    this.contextProvider.setContext(context);

    await this.vectorAPIListener.setup();

    // const messagingListener = this.messagingListener.initialize();
    // await Promise.all([messagingListener]);
    // This should always be the last thing we do, after everything else is initialized
    // await this.controlService.claimControl();

    // Set the status bit
    if (this._initializeResolve != null) {
      this._initializeResolve();
    }
  }

  /**
   * Mints the test token to the Ethereum address associated with the Core account.
   * @param amount the amount of test token to mint
   */
  public async mintTestToken(amount: BigNumber): Promise<void> {
    let account = (await this.contextProvider.getContext()).account;

    if (account === null) {
      throw new Error("Need an account to send funds to!");
    }

    this.developmentService.mintTestToken(amount, account);
  }
}
