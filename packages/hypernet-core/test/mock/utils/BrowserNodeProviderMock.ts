import { DEFAULT_CHANNEL_TIMEOUT } from "@connext/vector-types";
import {
  BlockchainUnavailableError,
  EthereumAddress,
  UnixTimestamp,
  VectorError,
  InsuranceState,
  ParameterizedState,
  MessageState,
  IHypernetOfferDetails,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawResponse,
  EMessageTransferType,
} from "@hypernetlabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import td from "testdouble";

import { IBrowserNode, IBrowserNodeProvider } from "@interfaces/utilities";
import {
  publicIdentifier,
  routerChannelAddress,
  ethereumAddress,
  erc20AssetAddress,
  commonAmount,
  destinationAddress,
  commonPaymentId,
  publicIdentifier2,
  offerTransferId,
  insuranceTransferId,
  parameterizedTransferId,
  defaultExpirationLength,
  gatewayUrl,
  unixPast,
  routerPublicIdentifier,
  chainId,
  messageTransferDefinitionAddress,
  insuranceTransferDefinitionAddress,
  parameterizedTransferDefinitionAddress,
  parameterizedTransferResolverEncoding,
  parameterizedTransferEncodedCancel,
  insuranceTransferEncodedCancel,
  insuranceTransferResolverEncoding,
  messageTransferEncodedCancel,
  messageTransferResolverEncoding,
} from "@mock/mocks";

export class BrowserNodeProviderMock implements IBrowserNodeProvider {
  public browserNode: IBrowserNode;
  public stateChannels = new Map<EthereumAddress, IFullChannelState>();
  public offerTransfer: IFullTransferState<MessageState>;
  public insuranceTransfer: IFullTransferState<InsuranceState>;
  public parameterizedTransfer: IFullTransferState<ParameterizedState>;
  public offerDetails: IHypernetOfferDetails;

  constructor(
    includeOfferTransfer = true,
    includeInsuranceTransfer = true,
    includeParameterizedTransfer = true,
    browserNode: IBrowserNode | null = null,
  ) {
    // Create the default set of state channels
    this.stateChannels.set(routerChannelAddress, {
      assetIds: [erc20AssetAddress],
      balances: [
        {
          amount: ["43", "43"],
          to: [destinationAddress],
        },
      ],
      channelAddress: routerChannelAddress,
      alice: "aliceAddress",
      bob: "bobAddress",
      merkleRoot: "merkleRoot",
      nonce: 0,
      processedDepositsA: [],
      processedDepositsB: [],
      timeout: "timeout",
      aliceIdentifier: "routerPublicIdentifier",
      bobIdentifier: "bobIdentifier",
      latestUpdate: {
        channelAddress: "channelAddress",
        fromIdentifier: "",
        toIdentifier: "",
        type: "setup",
        balance: { to: [""], amount: [""] },
        assetId: "assetId",
        nonce: 0,
        details: {},
      },
      networkContext: {
        chainId: 1337,
        channelFactoryAddress: "channelFactoryAddress",
        transferRegistryAddress: "transferRegistryAddress",
      },
      defundNonces: [],
      inDispute: false,
    });

    this.offerDetails = {
      messageType: EMessageTransferType.OFFER,
      requireOnline: false,
      paymentId: commonPaymentId,
      creationDate: unixPast,
      to: publicIdentifier2,
      from: publicIdentifier,
      requiredStake: commonAmount,
      paymentAmount: commonAmount,
      gatewayUrl: gatewayUrl,
      paymentToken: erc20AssetAddress,
      expirationDate: UnixTimestamp(unixPast + defaultExpirationLength),
      metadata: null,
    };

    this.offerTransfer = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: messageTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: JSON.stringify(this.offerDetails),
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
    };

    this.insuranceTransfer = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: insuranceTransferId,
      transferDefinition: insuranceTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        receiver: publicIdentifier,
        mediator: gatewayUrl,
        collateral: "1",
        expiration: (unixPast + defaultExpirationLength).toString(),
        UUID: commonPaymentId,
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
    };

    this.parameterizedTransfer = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: parameterizedTransferId,
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
          deltaAmount: "1",
          deltaTime: "1",
        },
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
    };

    // If we were not provided with a specific browser node, set up a mock one.
    if (browserNode == null) {
      this.browserNode = td.object<IBrowserNode>();
      td.when(
        this.browserNode.setup(
          routerPublicIdentifier,
          chainId,
          DEFAULT_CHANNEL_TIMEOUT.toString(),
        ),
      ).thenReturn(okAsync({ channelAddress: routerChannelAddress }));
      td.when(this.browserNode.getStateChannels()).thenReturn(
        okAsync(Array.from(this.stateChannels.keys())),
      );

      for (const stateChannel of this.stateChannels.values()) {
        td.when(
          this.browserNode.getStateChannel(
            EthereumAddress(stateChannel.channelAddress),
          ),
        ).thenReturn(
          okAsync(
            this.stateChannels.get(
              EthereumAddress(stateChannel.channelAddress),
            ),
          ),
        );
      }

      // @todo: Figure out if there is a better way to stub get properties
      (this.browserNode as any).publicIdentifier = publicIdentifier;

      td.when(
        this.browserNode.reconcileDeposit(
          ethereumAddress,
          routerChannelAddress,
        ),
      ).thenReturn(okAsync(routerChannelAddress));
      td.when(
        this.browserNode.reconcileDeposit(
          erc20AssetAddress,
          routerChannelAddress,
        ),
      ).thenReturn(okAsync(routerChannelAddress));

      td.when(
        this.browserNode.withdraw(
          routerChannelAddress,
          commonAmount,
          ethereumAddress,
          destinationAddress,
        ),
      ).thenReturn(okAsync({} as IWithdrawResponse));

      td.when(
        this.browserNode.withdraw(
          routerChannelAddress,
          commonAmount,
          erc20AssetAddress,
          destinationAddress,
        ),
      ).thenReturn(okAsync({} as IWithdrawResponse));

      td.when(this.browserNode.getTransfer(offerTransferId)).thenReturn(
        okAsync(this.offerTransfer),
      );
      td.when(this.browserNode.getTransfer(insuranceTransferId)).thenReturn(
        okAsync(this.insuranceTransfer),
      );
      td.when(this.browserNode.getTransfer(parameterizedTransferId)).thenReturn(
        okAsync(this.parameterizedTransfer),
      );

      const transfers = new Array<IFullTransferState>();
      if (includeOfferTransfer) {
        transfers.push(this.offerTransfer);
      }
      if (includeInsuranceTransfer) {
        transfers.push(this.insuranceTransfer);
      }
      if (includeParameterizedTransfer) {
        transfers.push(this.parameterizedTransfer);
      }
      td.when(
        this.browserNode.getActiveTransfers(routerChannelAddress),
      ).thenReturn(okAsync(transfers));
      td.when(
        this.browserNode.getTransfers(
          td.matchers.isA(Number),
          td.matchers.isA(Number),
        ),
      ).thenReturn(okAsync(transfers));

      td.when(
        this.browserNode.getRegisteredTransfers(this.offerTransfer.chainId),
      ).thenReturn(
        okAsync([
          {
            definition: "0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF",
            encodedCancel:
              "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            name: "Withdraw",
            resolverEncoding: "tuple(bytes responderSignature)",
            stateEncoding:
              "tuple(bytes initiatorSignature, address initiator, address responder, bytes32 data, uint256 nonce, uint256 fee, address callTo, bytes callData)",
          } as IRegisteredTransfer,
          {
            definition: "0x345cA3e014Aaf5dcA488057592ee47305D9B3e10",
            encodedCancel:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            name: "HashlockTransfer",
            resolverEncoding: "tuple(bytes32 preImage)",
            stateEncoding: "tuple(bytes32 lockHash, uint256 expiry)",
          } as IRegisteredTransfer,
          {
            definition: parameterizedTransferDefinitionAddress,
            encodedCancel: parameterizedTransferEncodedCancel,
            name: "Parameterized",
            resolverEncoding: parameterizedTransferResolverEncoding,
            stateEncoding:
              "tuple(address receiver, uint256 start, uint256 expiration, bytes32 UUID, tuple(uint256 deltaAmount, uint256 deltaTime) rate)",
          } as IRegisteredTransfer,
          {
            definition: insuranceTransferDefinitionAddress,
            encodedCancel: insuranceTransferEncodedCancel,
            name: "Insurance",
            resolverEncoding: insuranceTransferResolverEncoding,
            stateEncoding:
              "tuple(address receiver, address mediator, uint256 collateral, uint256 expiration, bytes32 UUID)",
          } as IRegisteredTransfer,
          {
            definition: messageTransferDefinitionAddress,
            encodedCancel: messageTransferEncodedCancel,
            name: "MessageTransfer",
            resolverEncoding: messageTransferResolverEncoding,
            stateEncoding: "tuple(string message)",
          } as IRegisteredTransfer,
        ]),
      );
    } else {
      this.browserNode = browserNode;
    }
  }

  getBrowserNode(): ResultAsync<
    IBrowserNode,
    VectorError | BlockchainUnavailableError
  > {
    const result = okAsync<
      IBrowserNode,
      VectorError | BlockchainUnavailableError
    >(this.browserNode);
    return result;
  }
}
