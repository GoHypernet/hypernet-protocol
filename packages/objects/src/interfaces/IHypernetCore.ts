import { ResultAsync, Result } from "neverthrow";
import { Subject } from "rxjs";

import { ActiveStateChannel } from "@objects/ActiveStateChannel";
import { Balances } from "@objects/Balances";
import { ChainId } from "@objects/ChainId";
import { ControlClaim } from "@objects/ControlClaim";
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  ProxyError,
  GovernanceSignerUnavailableError,
  CoreInitializationErrors,
} from "@objects/errors";
import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { PullPayment } from "@objects/PullPayment";
import { PushPayment } from "@objects/PushPayment";
import { ProviderId } from "@objects/ProviderId";
import { InitializeStatus } from "@objects/InitializeStatus";
import { ChainInformation } from "@objects/ChainInformation";
import { IHypernetPayments } from "@objects/interfaces/IHypernetPayments";
import { IHypernetGovernance } from "@objects/interfaces/IHypernetGovernance";
import { IHypernetRegistries } from "@objects/interfaces/IHypernetRegistries";

/**
 * HypernetCore is a single instance of the Hypernet Protocol, representing a single
 * user account. The user can be /both/ a consumer and a provider.
 */
export interface IHypernetCore {
  initialized(chainId?: ChainId): ResultAsync<boolean, ProxyError>;

  waitInitialized(chainId?: ChainId): ResultAsync<void, ProxyError>;

  /**
   * Probably can be removed, but leaving as a reminder in case we need to solve
   * the multiple-instance-of-Hypernet-core issue
   */
  inControl(): Result<boolean, never>;

  /**
   * This returns the linked Ethereum accounts via your installed wallet (ie: Metamask)
   */
  getEthereumAccounts(): ResultAsync<
    EthereumAccountAddress[],
    BlockchainUnavailableError | ProxyError
  >;

  /**
   * This must be called before most other calls; it is used to specify what account addres
   * hypernet core will be representing.
   * @param account The address that says who this instance of HypernetCore is representing.
   */
  initialize(
    chainId?: ChainId,
  ): ResultAsync<InitializeStatus, CoreInitializationErrors>;

  getInitializationStatus(): ResultAsync<InitializeStatus, ProxyError>;

  providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError | ProxyError>;

  provideProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError | ProxyError>;

  rejectProviderIdRequest(): ResultAsync<void, ProxyError>;

  getBlockNumber(): ResultAsync<
    number,
    BlockchainUnavailableError | ProxyError
  >;

  retrieveChainInformationList(): ResultAsync<
    Map<ChainId, ChainInformation>,
    ProxyError
  >;

  retrieveGovernanceChainInformation(): ResultAsync<
    ChainInformation,
    ProxyError
  >;

  initializeForChainId(
    chainId: ChainId,
  ): ResultAsync<void, CoreInitializationErrors>;

  switchProviderNetwork(
    chainId: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError | ProxyError>;

  getMainProviderChainId(): ResultAsync<
    ChainId,
    BlockchainUnavailableError | ProxyError
  >;

  payments: IHypernetPayments;

  governance: IHypernetGovernance;

  registries: IHypernetRegistries;

  /**
   * Observables for seeing what's going on
   */
  onControlClaimed: Subject<ControlClaim>;
  onControlYielded: Subject<ControlClaim>;
  onPushPaymentSent: Subject<PushPayment>;
  onPullPaymentSent: Subject<PullPayment>;
  onPushPaymentUpdated: Subject<PushPayment>;
  onPullPaymentUpdated: Subject<PullPayment>;
  onPushPaymentReceived: Subject<PushPayment>;
  onPullPaymentReceived: Subject<PullPayment>;
  onPushPaymentDelayed: Subject<PushPayment>;
  onPullPaymentDelayed: Subject<PullPayment>;
  onPushPaymentCanceled: Subject<PushPayment>;
  onPullPaymentCanceled: Subject<PullPayment>;
  onBalancesChanged: Subject<Balances>;
  onCeramicAuthenticationStarted: Subject<void>;
  onCeramicAuthenticationSucceeded: Subject<void>;
  onCeramicFailed: Subject<Error>;
  onGatewayAuthorized: Subject<GatewayUrl>;
  onGatewayDeauthorizationStarted: Subject<GatewayUrl>;
  onAuthorizedGatewayUpdated: Subject<GatewayUrl>;
  onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>;
  onGatewayIFrameDisplayRequested: Subject<GatewayUrl>;
  onGatewayIFrameCloseRequested: Subject<GatewayUrl>;
  onCoreIFrameDisplayRequested: Subject<void>;
  onCoreIFrameCloseRequested: Subject<void>;
  onInitializationRequired: Subject<void>;
  onPrivateCredentialsRequested: Subject<void>;
  onWalletConnectOptionsDisplayRequested: Subject<void>;
  onStateChannelCreated: Subject<ActiveStateChannel>;
  onChainConnected: Subject<ChainId>;
  onGovernanceChainConnected: Subject<ChainId>;
  onChainChanged: Subject<ChainId>;
  onAccountChanged: Subject<EthereumAccountAddress>;
  onGovernanceChainChanged: Subject<ChainId>;
  onGovernanceAccountChanged: Subject<EthereumAccountAddress>;
  onGovernanceSignerUnavailable: Subject<GovernanceSignerUnavailableError>;
}

export const IHypernetCoreType = Symbol.for("IHypernetCore");
