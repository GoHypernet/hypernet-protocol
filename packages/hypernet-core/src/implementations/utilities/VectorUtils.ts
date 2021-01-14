import {
  FullChannelState,
  NodeParams,
  OptionalPublicIdentifier,
  NodeResponses,
  DEFAULT_CHANNEL_TIMEOUT,
  FullTransferState,
  NodeError,
  Result,
} from "@connext/vector-types";
import {
  BigNumber,
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  PublicIdentifier,
  ResultAsync,
} from "@interfaces/objects";
import {
  IBrowserNodeProvider,
  IContextProvider,
  IVectorUtils,
  IConfigProvider,
  IBlockchainProvider,
  ILogUtils,
  IPaymentIdUtils,
} from "@interfaces/utilities";
import { EPaymentType, InsuranceState, MessageState, Parameterized, ParameterizedState } from "@interfaces/types";
import { serialize } from "class-transformer";
import { ParameterizedResolver, ParameterizedResolverData, Rate } from "@interfaces/types/typechain/ParameterizedTypes";
import { getSignerAddressFromPublicIdentifier } from "@connext/vector-utils/dist/identifiers";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import {
  CoreUninitializedError,
  InvalidParametersError,
  RouterChannelUnknownError,
  RouterUnavailableError,
  TransferCreationError,
  TransferResolutionError,
} from "@interfaces/objects/errors";
import { combine, errAsync, okAsync } from "neverthrow";
import { BrowserNode } from "@connext/vector-browser-node";

/**
 * VectorUtils contains methods for interacting directly with the core Vector stuff -
 * creating transfers, resolving them, & dealing the with router channel.
 */
export class VectorUtils implements IVectorUtils {
  /**
   * Creates an instance of VectorUtils
   */
  protected getRouterChannelAddressSetup: ResultAsync<string, RouterUnavailableError | CoreUninitializedError> | null;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected paymentIdUtils: IPaymentIdUtils,
    protected logUtils: ILogUtils,
  ) {
    this.getRouterChannelAddressSetup = null;
  }

  /**
   * Resolves a message/offer/null transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public resolveMessageTransfer(
    transferId: string,
  ): ResultAsync<NodeResponses.ResolveTransfer, TransferResolutionError> {
    return errAsync(new TransferResolutionError());
  }

  /**
   * Resolves a parameterized payment transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public resolvePaymentTransfer(
    transferId: string,
    paymentId: string,
    amount: string,
  ): ResultAsync<NodeResponses.ResolveTransfer, TransferResolutionError> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.getRouterChannelAddress() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, string],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    const resolverData: ParameterizedResolverData = {
      UUID: paymentId,
      paymentAmountTaken: amount,
    };

    let channelAddress: string;
    let browserNode: BrowserNode;

    return prerequisites
      .andThen((vals) => {
        const [browserNodeVal, channelAddressVal] = vals;
        browserNode = browserNodeVal;
        channelAddress = channelAddressVal;

        const resolverDataEncoding = ["tuple(bytes32 UUID, uint256 paymentAmountTaken)"];
        const encodedResolverData = defaultAbiCoder.encode(resolverDataEncoding, [resolverData]);
        const hashedResolverData = keccak256(encodedResolverData);

        return ResultAsync.fromPromise(browserNode.signUtilityMessage({ message: hashedResolverData }));
      })
      .andThen((signatureVal) => {
        const signatureRes = signatureVal as Result<NodeResponses.SignUtilityMessage, NodeError>;
        if (signatureRes.isError) {
          return errAsync(signatureRes.getError() as NodeError);
        }

        const signature = signatureRes.getValue().signedMessage;

        const resolver: ParameterizedResolver = {
          data: resolverData,
          payeeSignature: signature,
        };

        const transferParams: OptionalPublicIdentifier<NodeParams.ResolveTransfer> = {
          channelAddress,
          transferId,
          transferResolver: resolver,
        };

        return ResultAsync.fromPromise(browserNode.resolveTransfer(transferParams));
      })
      .andThen((resolveTransferVal) => {
        const resolveTransferRes = resolveTransferVal as Result<NodeResponses.ResolveTransfer, NodeError>;
        if (resolveTransferRes.isError) {
          return errAsync(
            new TransferResolutionError(
              `VectorUtils:resolvePaymentTransfer: error while attempting to resolve paymentId ${paymentId}, ${resolveTransferRes.getError()}`,
            ),
          );
        }

        return okAsync(resolveTransferRes.getValue());
      });
  }

  /**
   * Resolves an insurance transfer with Vector.
   * @param transferId the ID of the tarnsfer to resolve
   */
  public resolveInsuranceTransfer(
    transferId: string,
  ): ResultAsync<NodeResponses.ResolveTransfer, TransferResolutionError> {
    return errAsync(new TransferResolutionError());
  }

  /**
   * Creates a "Message" transfer with Vector.
   * @param toAddress the public identifier (not eth address!) of the intended recipient
   * @param message the message to send as IHypernetTransferMetadata
   */
  public createMessageTransfer(
    toAddress: string,
    message: IHypernetTransferMetadata,
  ): ResultAsync<NodeResponses.ConditionalTransfer, TransferCreationError | InvalidParametersError> {
    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(message.paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(new InvalidParametersError(`CreateMessageTransfer: Invalid paymentId: '${message.paymentId}'`));
      }
    }

    const prerequisites = (combine([
      this.configProvider.getConfig() as ResultAsync<any, any>,
      this.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ]) as unknown) as ResultAsync<
      [HypernetConfig, string, BrowserNode],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    return prerequisites
      .andThen((vals) => {
        const [config, channelAddress, browserNode] = vals;

        const initialState: MessageState = {
          message: serialize(message),
        };

        // Create transfer params
        const transferParams = {
          recipient: toAddress,
          channelAddress,
          amount: "0",
          assetId: config.hypertokenAddress,
          type: "MessageTransfer",
          details: initialState,
          meta: message,
        } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

        return ResultAsync.fromPromise(browserNode.conditionalTransfer(transferParams));
      })
      .andThen((transferRes) => {
        if (transferRes.isError) {
          return errAsync(new TransferCreationError());
        }

        return okAsync(transferRes.getValue());
      });
  }

  /**
   * Creates a "Parameterized" transfer with Vector.
   * @param type "PUSH" or "PULL"
   * @param toAddress the public identifier of the intended recipient of this transfer
   * @param amount the amount of tokens to commit to this transfer
   * @param assetAddress the address of the ERC20-token to transfer; zero-address for ETH
   * @param paymentIda length-64 hexadecimal string; this becomes the UUID component of the InsuranceState
   * @param start the start time of this transfer (UNIX timestamp)
   * @param expiration the expiration time of this transfer (UNIX timestamp)
   * @param rate the maximum allowed rate of this transfer (deltaAmount/deltaTime)
   */
  public createPaymentTransfer(
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumber,
    assetAddress: string,
    paymentId: string,
    start: string,
    expiration: string,
    rate?: Rate,
  ): ResultAsync<NodeResponses.ConditionalTransfer, TransferCreationError | InvalidParametersError> {
    // Sanity check
    if (type === EPaymentType.Pull && rate == null) {
      return errAsync(new InvalidParametersError("Must provide rate for Pull payments"));
    }

    // Make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(new InvalidParametersError(`CreatePaymentTransfer: Invalid paymentId: '${paymentId}'`));
      }
    }

    const prerequisites = (combine([
      this.getRouterChannelAddress() as ResultAsync<any, any>,
      this.browserNodeProvider.getBrowserNode(),
    ]) as unknown) as ResultAsync<
      [string, BrowserNode],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    return prerequisites
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

        const initialState: ParameterizedState = {
          receiver: toEthAddress,
          start,
          expiration,
          UUID: paymentId,
          rate: type === EPaymentType.Push ? infiniteRate : (rate as Rate),
        };

        // Create transfer params
        const transferParams = {
          recipient: toAddress,
          channelAddress,
          amount: amount.toString(),
          assetId: assetAddress,
          type: "Parameterized",
          details: initialState,
          meta: {}, // intentially left blank!
        } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

        return ResultAsync.fromPromise(browserNode.conditionalTransfer(transferParams));
      })
      .andThen((transferRes) => {
        if (transferRes.isError) {
          return errAsync(new TransferCreationError());
        }

        return okAsync(transferRes.getValue());
      });
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
    mediatorAddress: string,
    amount: BigNumber,
    expiration: string,
    paymentId: string,
  ): ResultAsync<NodeResponses.ConditionalTransfer, TransferCreationError | InvalidParametersError> {
    // Sanity check - make sure the paymentId is valid:
    const validPayment = this.paymentIdUtils.isValidPaymentId(paymentId);
    if (validPayment.isErr()) {
      return errAsync(validPayment.error);
    } else {
      if (!validPayment.value) {
        return errAsync(new InvalidParametersError(`CreateInsuranceTransfer: Invalid paymentId: '${paymentId}'`));
      }
    }

    const prerequisites = (combine([
      this.configProvider.getConfig() as ResultAsync<any, any>,
      this.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ]) as unknown) as ResultAsync<
      [HypernetConfig, string, BrowserNode],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    return prerequisites
      .andThen((vals) => {
        const [config, channelAddress, browserNode] = vals;

        const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

        const initialState: InsuranceState = {
          receiver: toEthAddress,
          mediator: mediatorAddress,
          collateral: amount.toString(),
          expiration,
          UUID: paymentId,
        };

        // Create transfer params
        const transferParams = {
          recipient: toAddress,
          channelAddress,
          amount: amount.toString(),
          assetId: config.hypertokenAddress,
          type: "Insurance",
          details: initialState,
          meta: {}, // left intentionally blank!
        } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

        this.logUtils.log(`CreateInsuranceTransfer transferParams: ${transferParams.toString()}`);
        return ResultAsync.fromPromise(browserNode.conditionalTransfer(transferParams));
      })
      .andThen((insuranceTransfer) => {
        if (insuranceTransfer.isError) {
          return errAsync(
            new TransferCreationError(
              `Could not complete transfer, browser node threw an error: ${insuranceTransfer.getError()}`,
            ),
          );
        }

        return okAsync(insuranceTransfer.getValue());
      });
  }

  /**
   * Returns the address of the channel with the router, if exists.
   * Otherwise, attempts to create a channel with the router & return the address.
   */
  public getRouterChannelAddress(): ResultAsync<string, RouterChannelUnknownError | CoreUninitializedError> {
    // If we already have the address, no need to do the rest
    if (this.getRouterChannelAddressSetup != null) {
      return this.getRouterChannelAddressSetup;
    }

    const prerequisites = (combine([
      this.configProvider.getConfig() as ResultAsync<any, any>,
      this.contextProvider.getInitializedContext(),
      this.browserNodeProvider.getBrowserNode(),
    ]) as unknown) as ResultAsync<
      [HypernetConfig, InitializedHypernetContext, BrowserNode],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let browserNode: BrowserNode;

    return prerequisites
      .andThen((vals) => {
        [config, context, browserNode] = vals;

        this.logUtils.log(`Core publicIdentifier: ${context.publicIdentifier}`);
        this.logUtils.log(`Router publicIdentifier: ${config.routerPublicIdentifier}`);

        return ResultAsync.fromPromise(browserNode.getStateChannels(), (err) => {
          return err as RouterUnavailableError;
        });
      })
      .andThen((channelsResult) => {
        if (channelsResult.isError) {
          return errAsync(channelsResult.getError() as NodeError);
        }

        const channelAddresses = channelsResult.getValue();

        // let channel: FullChannelState | null = null;
        const channelResults = new Array<
          ResultAsync<NodeResponses.GetChannelState, RouterChannelUnknownError | NodeError>
        >();
        for (const channelAddress of channelAddresses) {
          channelResults.push(this._getStateChannel(channelAddress, browserNode));
        }

        return combine(channelResults);
      })
      .andThen((channelsVal) => {
        const channels = channelsVal as NodeResponses.GetChannelState[];

        for (const channel of channels) {
          if (!channel) {
            continue;
          }
          if (channel.aliceIdentifier !== config.routerPublicIdentifier) {
            continue;
          }
          return okAsync(channel.channelAddress as string);
        }

        // If a channel does not exist with the router, we need to create it.
        return this._createRouterStateChannel(browserNode, config).map((routerChannel) => {
          return routerChannel.channelAddress;
        });
      });
  }

  protected _createRouterStateChannel(
    browserNode: BrowserNode,
    config: HypernetConfig,
  ): ResultAsync<NodeResponses.RequestSetup, NodeError> {
    return ResultAsync.fromPromise(
      browserNode.setup({
        chainId: 1337,
        counterpartyIdentifier: config.routerPublicIdentifier,
        timeout: DEFAULT_CHANNEL_TIMEOUT.toString(),
      }),
      (err) => {
        return err as NodeError;
      },
    ).andThen((setupResult) => {
      if (setupResult.isError) {
        return errAsync(setupResult.getError() as NodeError);
      }

      const newChannel = setupResult.getValue();
      return okAsync(newChannel);
    });
  }

  protected _getStateChannel(
    channelAddress: string,
    browserNode: BrowserNode,
  ): ResultAsync<NodeResponses.GetChannelState, RouterChannelUnknownError | NodeError> {
    return ResultAsync.fromPromise(browserNode.getStateChannel({ channelAddress }), (e) => {
      return e as RouterChannelUnknownError;
    }).andThen((channelResult) => {
      if (channelResult.isError) {
        return errAsync(channelResult.getError() as NodeError);
      }

      const channel = channelResult.getValue() as NodeResponses.GetChannelState | null;

      if (channel == null) {
        return errAsync(new RouterChannelUnknownError());
      }
      return okAsync(channel);
    });
  }
}
