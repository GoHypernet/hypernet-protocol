import { DEFAULT_CHANNEL_TIMEOUT } from "@connext/vector-types";
import { BigNumber } from "ethers";
import {
  HypernetConfig,
  IHypernetOfferDetails,
  InitializedHypernetContext,
  PublicIdentifier,
  IHypernetPullPaymentDetails,
  IBasicTransferResponse,
  IFullChannelState,
  IFullTransferState,
  EthereumAddress,
  PaymentId,
  TransferId,
  Signature,
} from "@hypernetlabs/objects";
import {
  IBrowserNodeProvider,
  IContextProvider,
  IVectorUtils,
  IConfigProvider,
  IBlockchainProvider,
  ILogUtils,
  IPaymentIdUtils,
  IBrowserNode,
  ITimeUtils,
} from "@interfaces/utilities";
import {
  EPaymentType,
  ETransferState,
  InsuranceResolver,
  InsuranceResolverData,
  InsuranceState,
  MessageResolver,
  MessageState,
  ParameterizedState,
  EMessageTransferType,
} from "@hypernetlabs/objects";
import "reflect-metadata";
import { serialize } from "class-transformer";
import { ParameterizedResolver, ParameterizedResolverData, Rate } from "@hypernetlabs/objects/types/typechain";
import { getSignerAddressFromPublicIdentifier } from "@connext/vector-utils";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import {
  InvalidParametersError,
  RouterChannelUnknownError,
  RouterUnavailableError,
  TransferCreationError,
  TransferResolutionError,
  VectorError,
} from "@hypernetlabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "@hypernetlabs/utils";

/**
 * VectorUtils contains methods for interacting directly with the core Vector stuff -
 * creating transfers, resolving them, & dealing the with router channel.
 */
export class VectorUtils implements IVectorUtils {
  /**
   * Creates an instance of VectorUtils
   */
  protected getRouterChannelAddressSetup: ResultAsync<EthereumAddress, RouterUnavailableError> | null = null;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected paymentIdUtils: IPaymentIdUtils,
    protected logUtils: ILogUtils,
    protected timeUtils: ITimeUtils,
  ) {}

  /**
   * Resolves a message/offer/null transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public resolveMessageTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError | InvalidParametersError> {
    if (!transferId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    let channelAddress: EthereumAddress;
    let browserNode: IBrowserNode;

    return ResultUtils.combine([this.browserNodeProvider.getBrowserNode(), this.getRouterChannelAddress()])
      .andThen(() => {
        return browserNode.resolveTransfer(channelAddress, transferId, { message: "" } as MessageResolver);
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  /**
   * Resolves a parameterized payment transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public resolvePaymentTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    amount: string,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError | InvalidParametersError> {
    if (!transferId || !paymentId || !amount) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    const resolverData: ParameterizedResolverData = {
      UUID: paymentId,
      paymentAmountTaken: amount,
    };

    let channelAddress: EthereumAddress;
    let browserNode: IBrowserNode;

    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.getRouterChannelAddress(),
      this.blockchainProvider.getLatestBlock(),
    ])
      .andThen((vals) => {
        const [browserNodeVal, channelAddressVal, block] = vals;
        browserNode = browserNodeVal;
        channelAddress = channelAddressVal;

        this.logUtils.debug(`Current block timestamp: ${block.timestamp}`);

        const resolverDataEncoding = ["tuple(bytes32 UUID, uint256 paymentAmountTaken)"];
        const encodedResolverData = defaultAbiCoder.encode(resolverDataEncoding, [resolverData]);
        const hashedResolverData = keccak256(encodedResolverData);

        return browserNode.signUtilityMessage(hashedResolverData);
      })
      .andThen((signature) => {
        const resolver: ParameterizedResolver = {
          data: resolverData,
          payeeSignature: signature,
        };

        return browserNode.resolveTransfer(channelAddress, transferId, resolver);
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  /**
   * Resolves an insurance transfer with Vector.
   * @param transferId the ID of the tarnsfer to resolve
   */
  public resolveInsuranceTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    mediatorSignature?: Signature,
    amount?: BigNumber,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError | InvalidParametersError> {
    if (!transferId || !paymentId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    // If you do not provide an actual amount, then it resolves for nothing
    if (amount == null) {
      amount = BigNumber.from(0);
    }

    const resolverData: InsuranceResolverData = {
      amount: amount.toString(),
      UUID: paymentId,
    };

    let channelAddress: EthereumAddress;
    let browserNode: IBrowserNode;

    return ResultUtils.combine([this.browserNodeProvider.getBrowserNode(), this.getRouterChannelAddress()])
      .andThen((vals) => {
        const [browserNodeVal, channelAddressVal] = vals;
        browserNode = browserNodeVal;
        channelAddress = channelAddressVal;

        if (mediatorSignature == null) {
          const resolverDataEncoding = ["tuple(uint256 amount, bytes32 UUID)"];
          const encodedResolverData = defaultAbiCoder.encode(resolverDataEncoding, [resolverData]);
          const hashedResolverData = keccak256(encodedResolverData);

          return browserNode.signUtilityMessage(hashedResolverData);
        }
        return okAsync<string, TransferResolutionError>(mediatorSignature);
      })
      .andThen((signature) => {
        const resolver: InsuranceResolver = {
          data: resolverData,
          signature: signature,
        };

        return browserNode.resolveTransfer(channelAddress, transferId, resolver);
      })
      .mapErr((err) => new TransferResolutionError(err, err?.message));
  }

  /**
   * Creates a "Message" transfer with Vector, to notify the other party of a pull payment
   * @param toAddress the public identifier (not eth address!) of the intended recipient
   * @param message the message to send as IHypernetOfferDetails
   */
  public createPullNotificationTransfer(
    toAddress: PublicIdentifier,
    message: IHypernetPullPaymentDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError> {
    if (!toAddress || !message) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    // The message type has to be PULLPAYMENT
    message.messageType = EMessageTransferType.PULLPAYMENT;

    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(message.paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(
          new InvalidParametersError(`CreatePullNotificationTransfer: Invalid paymentId: '${message.paymentId}'`),
        );
      }
    }

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        const [config, channelAddress, browserNode] = vals;

        const initialState: MessageState = {
          message: serialize(message),
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          "0",
          config.hypertokenAddress,
          "MessageTransfer",
          initialState,
          toAddress,
          undefined, // CRITICAL- must be undefined
          undefined,
          undefined,
          message,
        );
      })
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  /**
   * Creates a "Message" transfer with Vector, to notify the other party of a payment creation
   * @param toAddress the public identifier (not eth address!) of the intended recipient
   * @param message the message to send as IHypernetOfferDetails
   */
  public createOfferTransfer(
    toAddress: PublicIdentifier,
    message: IHypernetOfferDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError> {
    if (!toAddress || !message) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    // The message type has to be OFFER
    message.messageType = EMessageTransferType.OFFER;

    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(message.paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(new InvalidParametersError(`CreateOfferTransfer: Invalid paymentId: '${message.paymentId}'`));
      }
    }

    return ResultUtils.combine([this.getRouterChannelAddress(), this.browserNodeProvider.getBrowserNode()])
      .andThen((vals) => {
        const [channelAddress, browserNode] = vals;

        const initialState: MessageState = {
          message: serialize(message),
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          "0",
          message.paymentToken, // The offer is always for 0, so we will make the asset ID in the payment token type, because why not?
          "MessageTransfer",
          initialState,
          toAddress,
          undefined, // CRITICAL- must be undefined
          undefined,
          undefined,
          message,
        );
      })
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  /**
   * Creates a "Parameterized" transfer with Vector.
   * @param type "PUSH" or "PULL"
   * @param toAddress the public identifier of the intended recipient of this transfer
   * @param amount the amount of tokens to commit to this transfer
   * @param assetAddress the address of the ERC20-token to transfer; zero-address for ETH
   * @param paymentId length-64 hexadecimal string; this becomes the UUID component of the InsuranceState
   * @param start the start time of this transfer (UNIX timestamp)
   * @param expiration the expiration time of this transfer (UNIX timestamp)
   * @param rate the maximum allowed rate of this transfer (deltaAmount/deltaTime)
   */
  public createPaymentTransfer(
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumber,
    assetAddress: EthereumAddress,
    paymentId: PaymentId,
    start: number,
    expiration: number,
    deltaTime?: number,
    deltaAmount?: string,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError> {
    if (!type || !toAddress || !amount || !assetAddress || !paymentId || !start || !expiration) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    // Sanity check
    if (type === EPaymentType.Pull && deltaTime === undefined) {
      this.logUtils.error("Must provide deltaTime for Pull payments");
      return errAsync(new InvalidParametersError("Must provide deltaTime for Pull payments"));
    }

    if (type === EPaymentType.Pull && deltaAmount === undefined) {
      this.logUtils.error("Must provide deltaAmount for Pull payments");
      return errAsync(new InvalidParametersError("Must provide deltaAmount for Pull payments"));
    }

    if (amount.isZero()) {
      this.logUtils.error("Amount cannot be zero.");
      return errAsync(new InvalidParametersError("Amount cannot be zero."));
    }

    // Make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(paymentId);
    if (validPayment.isErr()) {
      this.logUtils.error(validPayment.error);
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        this.logUtils.error(`CreatePaymentTransfer: Invalid paymentId: '${paymentId}'`);
        return errAsync(new InvalidParametersError(`CreatePaymentTransfer: Invalid paymentId: '${paymentId}'`));
      }
    }

    return ResultUtils.combine([this.getRouterChannelAddress(), this.browserNodeProvider.getBrowserNode()])
      .andThen((vals) => {
        const [channelAddress, browserNode] = vals;

        const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

        // @todo toEthAddress isn't really an eth address, it's the internal signing key
        // therefore we need to actually do the signing of the payment transfer (on resolve)
        // with this internal key!

        const infiniteRate = {
          deltaAmount: amount.toString(),
          deltaTime: "1",
        };

        let ourRate: Rate;
        // Have to throw this error, or the ourRate object below will complain that one
        // of the params is possibly undefined.
        if (type == EPaymentType.Pull) {
          if (deltaTime == null || deltaAmount == null) {
            this.logUtils.error("Somehow, deltaTime or deltaAmount were not set!");
            return errAsync(new InvalidParametersError("Somehow, deltaTime or deltaAmount were not set!"));
          }

          if (deltaTime == 0 || deltaAmount == "0") {
            this.logUtils.error("deltatime & deltaAmount cannot be zero!");
            return errAsync(new InvalidParametersError("deltatime & deltaAmount cannot be zero!"));
          }

          ourRate = {
            deltaTime: deltaTime?.toString(),
            deltaAmount: deltaAmount?.toString(),
          };
        } else {
          ourRate = infiniteRate;
        }

        const initialState: ParameterizedState = {
          receiver: toEthAddress,
          start: start.toString(),
          expiration: expiration.toString(),
          UUID: paymentId,
          rate: ourRate,
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          amount.toString(),
          assetAddress,
          "Parameterized",
          initialState,
          toAddress,
          undefined,
          undefined,
          undefined,
          {}, // intentially left blank!
        );
      })
      .map((val) => val as IBasicTransferResponse)
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  /**
   * Creates the actual Insurance transfer with Vector
   * @param toAddress the publicIdentifier of the person to send the transfer to
   * @param mediatorAddress the Ethereum address of the mediator
   * @param amount the amount of the token to commit into the InsuranceTransfer
   * @param expiration the expiration date of this InsuranceTransfer
   * @param paymentId a length-64 hexadecimal string; this becomes the UUID component of the InsuranceState
   */
  public createInsuranceTransfer(
    toAddress: PublicIdentifier,
    mediatorAddress: EthereumAddress,
    amount: BigNumber,
    expiration: number,
    paymentId: PaymentId,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError> {
    if (!toAddress || !mediatorAddress || !amount || !expiration || !paymentId) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    const validPayment = this.paymentIdUtils.isValidPaymentId(paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(new InvalidParametersError(`CreateInsuranceTransfer: Invalid paymentId: '${paymentId}'`));
      }
    }

    return ResultUtils.combine([
      this.configProvider.getConfig() as ResultAsync<any, any>,
      this.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        const [config, channelAddress, browserNode] = vals;

        const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

        const initialState: InsuranceState = {
          receiver: toEthAddress,
          mediator: mediatorAddress,
          collateral: amount.toString(),
          expiration: expiration.toString(),
          UUID: paymentId,
        };

        return browserNode.conditionalTransfer(
          channelAddress,
          amount.toString(),
          config.hypertokenAddress,
          "Insurance",
          initialState,
          toAddress,
          undefined,
          undefined,
          undefined,
          {}, // left intentionally blank!
        );
      })
      .mapErr((err) => new TransferCreationError(err, err?.message));
  }

  /**
   * Returns the address of the channel with the router, if exists.
   * Otherwise, attempts to create a channel with the router & return the address.
   */
  public getRouterChannelAddress(): ResultAsync<EthereumAddress, RouterChannelUnknownError | VectorError> {
    // If we already have the address, no need to do the rest
    if (this.getRouterChannelAddressSetup != null) {
      return this.getRouterChannelAddressSetup;
    }

    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let browserNode: IBrowserNode;

    this.getRouterChannelAddressSetup = ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        [config, context, browserNode] = vals;
        this.logUtils.log(`Core publicIdentifier: ${context.publicIdentifier}`);
        this.logUtils.log(`Router publicIdentifier: ${config.routerPublicIdentifier}`);
        return browserNode.getStateChannels();
      })
      .andThen((channelAddresses) => {
        const channelResults = new Array<ResultAsync<IFullChannelState, RouterChannelUnknownError | VectorError>>();
        for (const channelAddress of channelAddresses) {
          channelResults.push(this._getStateChannel(channelAddress, browserNode));
        }
        return ResultUtils.combine(channelResults);
      })
      .andThen((channels) => {
        for (const channel of channels) {
          if (!channel) {
            continue;
          }
          if (channel.aliceIdentifier !== config.routerPublicIdentifier) {
            continue;
          }
          return okAsync<EthereumAddress, RouterChannelUnknownError>(EthereumAddress(channel.channelAddress));
        }
        // If a channel does not exist with the router, we need to create it.
        return this._createRouterStateChannel(browserNode, config);
      });

    return this.getRouterChannelAddressSetup;
  }

  public getTimestampFromTransfer(transfer: IFullTransferState): number {
    if (!transfer) {
      throw new InvalidParametersError("Incorrectly provided arguments");
    }

    if (transfer.meta == null) {
      // We need to figure out the transfer type, I think; but for now we'll just say
      // that the transfer is right now
      return this.timeUtils.getUnixNow();
    }

    return transfer.meta.createdAt;
  }

  public getTransferStateFromTransfer(transfer: IFullTransferState): ETransferState {
    if (!transfer) {
      throw new InvalidParametersError("Incorrectly provided arguments");
    }

    // if (transfer.inDispute) {
    //   return ETransferState.Challenged;
    // }
    if (transfer.transferResolver != null) {
      return ETransferState.Resolved;
    }
    return ETransferState.Active;
  }

  /**
   *
   * @param browserNode
   * @param config
   * @returns
   */
  protected _createRouterStateChannel(
    browserNode: IBrowserNode,
    config: HypernetConfig,
  ): ResultAsync<EthereumAddress, VectorError | InvalidParametersError> {
    if (!browserNode || !(config instanceof HypernetConfig)) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return browserNode
      .setup(config.routerPublicIdentifier, config.chainId, DEFAULT_CHANNEL_TIMEOUT.toString())
      .map((response) => {
        return EthereumAddress(response.channelAddress);
      })
      .orElse((e) => {
        // Channel could be already set up, so we should try restoring the state
        this.logUtils.log("Channel setup with router failed, attempting to restore state and retry");
        return browserNode
          .restoreState(config.routerPublicIdentifier, config.chainId)
          .andThen(() => {
            return browserNode.getStateChannelByParticipants(config.routerPublicIdentifier, config.chainId);
          })
          .andThen((channel) => {
            if (channel == null) {
              return errAsync(e);
            }
            return okAsync(EthereumAddress(channel.channelAddress));
          });
      });
  }

  protected _getStateChannel(
    channelAddress: EthereumAddress,
    browserNode: IBrowserNode,
  ): ResultAsync<IFullChannelState, RouterChannelUnknownError | VectorError | InvalidParametersError> {
    if (!channelAddress || !browserNode) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return browserNode.getStateChannel(channelAddress).andThen((channel) => {
      if (channel == null) {
        return errAsync(new RouterChannelUnknownError());
      }
      return okAsync(channel);
    });
  }
}
