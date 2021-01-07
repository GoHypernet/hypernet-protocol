import {
  FullChannelState,
  NodeParams,
  OptionalPublicIdentifier,
  NodeResponses,
  DEFAULT_CHANNEL_TIMEOUT,
  FullTransferState,
} from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata, InitializedHypernetContext, PublicIdentifier, PullAmount, ResultAsync } from "@interfaces/objects";
import {
  IBrowserNodeProvider,
  IContextProvider,
  IVectorUtils,
  IConfigProvider,
  IBlockchainProvider,
} from "@interfaces/utilities";
import { EPaymentType, InsuranceState, MessageState, Parameterized, ParameterizedState } from "@interfaces/types";
import { serialize } from "class-transformer";
import { ethers } from "ethers";
import { ParameterizedResolver, ParameterizedResolverData, Rate } from "@interfaces/types/transfers/ParameterizedTypes";
import { getSignerAddressFromPublicIdentifier } from "@connext/vector-utils/dist/identifiers";
import { PaymentIdUtils } from "./PaymentUtils";
import { encodeTransferState, encodeTransferResolver } from "@connext/vector-utils";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { CoreUninitializedError, RouterChannelUnknownError, RouterUnavailableError } from "@interfaces/objects/errors";
import { errAsync, okAsync } from "neverthrow";

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
  ) {
    this.getRouterChannelAddressSetup = null;
  }

  /**
   * Resolves a message/offer/null transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public async resolveMessageTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Resolves a parameterized payment transfer with Vector.
   * @param transferId the ID of the transfer to resolve
   */
  public async resolvePaymentTransfer(
    transferId: string,
    paymentId: string,
    amount: string,
  ): Promise<NodeResponses.ResolveTransfer> {
    const signer = await this.blockchainProvider.getSigner();
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();

    let resolverData: ParameterizedResolverData = {
      UUID: paymentId,
      paymentAmountTaken: amount,
    };

    let resolverDataEncoding = ["tuple(bytes32 UUID, uint256 paymentAmountTaken)"];
    let encodedResolverData = defaultAbiCoder.encode(resolverDataEncoding, [resolverData]);
    let hashedResolverData = keccak256(encodedResolverData);

    const signatureRes = await browserNode.signUtilityMessage({ message: hashedResolverData });
    if (signatureRes.isError) {
      throw signatureRes.getError();
    }

    const signature = signatureRes.getValue().signedMessage;

    let resolver: ParameterizedResolver = {
      data: resolverData,
      payeeSignature: signature,
    };

    let transferParams: OptionalPublicIdentifier<NodeParams.ResolveTransfer> = {
      channelAddress: channelAddress,
      transferId: transferId,
      transferResolver: resolver,
    };

    let result = await browserNode.resolveTransfer(transferParams);

    if (result.isError) {
      throw new Error(
        `VectorUtils:resolvePaymentTransfer: error while attempting to resolve paymentId ${paymentId}, ${result.getError()}`,
      );
    }

    return result.getValue();
  }

  /**
   * Resolves an insurance transfer with Vector.
   * @param transferId the ID of the tarnsfer to resolve
   */
  public async resolveInsuranceTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Creates a "Message" transfer with Vector.
   * @param toAddress the public identifier (not eth address!) of the intended recipient
   * @param message the message to send as IHypernetTransferMetadata
   */
  public async createMessageTransfer(
    toAddress: string,
    message: IHypernetTransferMetadata,
  ): Promise<NodeResponses.ConditionalTransfer> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();
    const config = await this.configProvider.getConfig();

    // Sanity check - make sure the paymentId is valid:
    if (!PaymentIdUtils.isValidPaymentId(message.paymentId))
      throw new Error(`CreateMessageTransfer: Invalid paymentId: '${message.paymentId}'`);

    let initialState: MessageState = {
      message: serialize(message),
    };

    // Create transfer params
    let transferParams = {
      recipient: toAddress,
      channelAddress: channelAddress,
      amount: "0",
      assetId: config.hypertokenAddress,
      type: "MessageTransfer",
      details: initialState,
      meta: message,
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

    let transfer = await browserNode.conditionalTransfer(transferParams);

    if (transfer.isError) {
      throw new Error(`
        Could not complete transfer, browser node threw an error:
        ${transfer.getError()}
        transferParams: ${JSON.stringify(transferParams)}  
      `);
    }

    let transferResult = transfer.getValue();

    return transferResult;
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
  public async createPaymentTransfer(
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumber,
    assetAddress: string,
    paymentId: string,
    start: string,
    expiration: string,
    rate?: Rate,
  ): Promise<NodeResponses.ConditionalTransfer> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();
    const config = await this.configProvider.getConfig();
    const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

    // @todo toEthAddress isn't really an eth address, it's the internal signing key
    // therefore we need to actually do the signing of the payment transfer (on resolve)
    // with this internal key!

    if (type == EPaymentType.Pull && rate == null) {
      throw new Error("Must provide rate for PullPaymentTransfer");
    }

    // Sanity check - make sure the paymentId is valid:
    if (!PaymentIdUtils.isValidPaymentId(paymentId))
      throw new Error(`CreatePaymentTransfer: Invalid paymentId: '${paymentId}'`);

    let infinite_rate = {
      deltaAmount: amount.toString(),
      deltaTime: "1",
    };

    let initialState: ParameterizedState = {
      receiver: toEthAddress,
      start: start,
      expiration: expiration,
      UUID: paymentId,
      rate: type == EPaymentType.Push ? infinite_rate : (rate as Rate),
    };

    // Create transfer params
    let transferParams = {
      recipient: toAddress,
      channelAddress: channelAddress,
      amount: amount.toString(),
      assetId: assetAddress,
      type: "Parameterized",
      details: initialState,
      meta: {}, // intentially left blank!
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

    let transfer = await browserNode.conditionalTransfer(transferParams);

    if (transfer.isError) {
      throw new Error(`Could not complete transfer, browser node threw an error: ${transfer.getError()}`);
    }

    let transferResult = transfer.getValue();

    return transferResult;
  }

  /**
   * Creates the actual Insurance transfer with Vector
   * @param toAddress the publicIdentifier of the person to send the transfer to
   * @param mediatorAddress the Ethereum address of the mediator
   * @param amount the amount of the token to commit into the InsuranceTransfer
   * @param expiration the expiration date of this InsuranceTransfer
   * @param paymentId a length-64 hexadecimal string; this becomes the UUID component of the InsuranceState
   */
  public async createInsuranceTransfer(
    toAddress: PublicIdentifier,
    mediatorAddress: string,
    amount: BigNumber,
    expiration: string,
    paymentId: string,
  ): Promise<NodeResponses.ConditionalTransfer> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();
    const config = await this.configProvider.getConfig();
    const toEthAddress = getSignerAddressFromPublicIdentifier(toAddress);

    // Sanity check - make sure the paymentId is valid:
    if (!PaymentIdUtils.isValidPaymentId(paymentId))
      throw new Error(`CreateInsuranceTransfer: Invalid paymentId: '${paymentId}'`);

    let initialState: InsuranceState = {
      receiver: toEthAddress,
      mediator: mediatorAddress,
      collateral: amount.toString(),
      expiration: expiration,
      UUID: paymentId,
    };

    // Create transfer params
    let transferParams = {
      recipient: toAddress,
      channelAddress: channelAddress,
      amount: amount.toString(),
      assetId: config.hypertokenAddress,
      type: "Insurance",
      details: initialState,
      meta: {}, // left intentionally blank!
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

    console.log(`CreateInsuranceTransfer transferParams: ${transferParams.toString()}`);
    let transfer = await browserNode.conditionalTransfer(transferParams);

    if (transfer.isError) {
      throw new Error(`Could not complete transfer, browser node threw an error: ${transfer.getError()}`);
    }

    let transferResult = transfer.getValue();

    return transferResult;
  }

  /**
   * Returns the address of the channel with the router, if exists.
   * Otherwise, attempts to create a channel with the router & return the address.
   */
  public async getRouterChannelAddress(): ResultAsync<string, RouterChannelUnknownError | CoreUninitializedError> {
    // If we already have the address, no need to do the rest
    if (this.getRouterChannelAddressSetup != null) {
      return this.getRouterChannelAddressSetup;
    }

    // Basic setup
    const configPromise = this.configProvider.getConfig();
    const contextRes = await this.contextProvider.getInitializedContext();
    const browserNodePromise = this.browserNodeProvider.getBrowserNode();
    const [config, browserNode] = await Promise.all([configPromise, browserNodePromise]);

    let context: InitializedHypernetContext;
    if (contextRes.isErr()) {
      return errAsync(contextRes.error);
    }
    else {
      context = contextRes.value;
    }

    console.log(`Core publicIdentifier: ${context.publicIdentifier}`);
    console.log(`Router publicIdentifier: ${config.routerPublicIdentifier}`);

    const channelsResult = await browserNode.getStateChannels();

    if (channelsResult.isError) {
      throw new Error("Cannot get channels!");
    }
    
    const channels = channelsResult.getValue();

    let channel: FullChannelState | null = null;
    for (const channelAddress of channels) {
      const channelResult = await browserNode.getStateChannel({ channelAddress });
      if (channelResult.isError) {
        return errAsync(new RouterChannelUnknownError(channelResult.getError()?.message));
      }

      channel = channelResult.getValue();

      if (channel != null) {
        // console.log(channel);
        if (channel.aliceIdentifier !== config.routerPublicIdentifier) {
          continue;
        }
        return okAsync(channel.channelAddress);
      }
    }

    // If a channel does not exist with the router, we need to create it.
    const setupResult = await browserNode.setup({
      chainId: 1337,
      counterpartyIdentifier: config.routerPublicIdentifier,
      timeout: DEFAULT_CHANNEL_TIMEOUT.toString(),
    });

    if (setupResult.isError) {
      return errAsync(new RouterUnavailableError(setupResult.getError()?.message));
    }

    const newChannel = setupResult.getValue();
    return okAsync(newChannel.channelAddress);
  }
}
