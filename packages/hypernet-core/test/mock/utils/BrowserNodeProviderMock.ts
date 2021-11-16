import { DEFAULT_CHANNEL_TIMEOUT } from "@connext/vector-types";
import {
  BlockchainUnavailableError,
  VectorError,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawResponse,
  UtilityMessageSignature,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { IBrowserNode, IBrowserNodeProvider } from "@interfaces/utilities";
import {
  publicIdentifier,
  routerChannelAddress,
  ethereumAddress,
  erc20AssetAddress,
  commonAmount,
  destinationAddress,
  offerTransferId,
  insuranceTransferId,
  parameterizedTransferId,
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
  activeOfferTransfer,
  activeInsuranceTransfer,
  activeParameterizedTransfer,
  channelState,
} from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";
import td from "testdouble";

export class BrowserNodeProviderMock implements IBrowserNodeProvider {
  public browserNode: IBrowserNode;
  public stateChannels = new Map<EthereumContractAddress, IFullChannelState>();

  constructor(
    includeOfferTransfer = true,
    includeInsuranceTransfer = true,
    includeParameterizedTransfer = true,
    browserNode: IBrowserNode | null = null,
    existingStateChannel = true,
  ) {
    if (existingStateChannel) {
      // Create the default set of state channels
      this.stateChannels.set(routerChannelAddress, channelState);
    }

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

      td.when(
        this.browserNode.restoreState(routerPublicIdentifier, chainId),
      ).thenReturn(okAsync(undefined));

      td.when(this.browserNode.getStateChannels()).thenReturn(
        okAsync(Array.from(this.stateChannels.keys())),
      );

      for (const stateChannel of this.stateChannels.values()) {
        td.when(
          this.browserNode.getStateChannel(
            EthereumContractAddress(stateChannel.channelAddress),
          ),
        ).thenReturn(
          okAsync(
            this.stateChannels.get(
              EthereumContractAddress(stateChannel.channelAddress),
            ),
          ),
        );
      }

      td.when(
        this.browserNode.getStateChannelByParticipants(
          routerPublicIdentifier,
          chainId,
        ),
      ).thenReturn(okAsync(channelState));

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
        okAsync(activeOfferTransfer),
      );
      td.when(this.browserNode.getTransfer(insuranceTransferId)).thenReturn(
        okAsync(activeInsuranceTransfer),
      );
      td.when(this.browserNode.getTransfer(parameterizedTransferId)).thenReturn(
        okAsync(activeParameterizedTransfer),
      );

      const transfers = new Array<IFullTransferState>();
      if (includeOfferTransfer) {
        transfers.push(activeOfferTransfer);
      }
      if (includeInsuranceTransfer) {
        transfers.push(activeInsuranceTransfer);
      }
      if (includeParameterizedTransfer) {
        transfers.push(activeParameterizedTransfer);
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

      td.when(this.browserNode.getRegisteredTransfers(chainId)).thenReturn(
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

      td.when(
        this.browserNode.signUtilityMessage(td.matchers.anything()),
      ).thenReturn(okAsync(UtilityMessageSignature("signature")));
    } else {
      this.browserNode = browserNode;
    }
  }

  public getBrowserNode(): ResultAsync<
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
