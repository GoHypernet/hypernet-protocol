import {
  ActiveStateChannel,
  BigNumberString,
  ChainId,
  EMessageTransferType,
  EthereumAccountAddress,
  EthereumContractAddress,
  GatewayRegistrationInfo,
  GatewayUrl,
  GovernanceChainInformation,
  HexString,
  IFullChannelState,
  IFullTransferState,
  IHypernetOfferDetails,
  InsuranceResolver,
  InsuranceState,
  MessageResolver,
  MessageState,
  ParameterizedResolver,
  ParameterizedState,
  PaymentId,
  ProviderId,
  ProviderUrl,
  PublicIdentifier,
  RegistryEntry,
  RegistryTokenId,
  Signature,
  TransferId,
  UnixTimestamp,
  RegistryModulesNames,
} from "@hypernetlabs/objects";

export const account = EthereumAccountAddress("account-address-1");
export const account2 = EthereumAccountAddress("account-address-2");
export const gatewayAccount = EthereumAccountAddress("gateway-account-address");
export const errorAccount = EthereumAccountAddress("error-account-address");
export const publicIdentifier = PublicIdentifier("public-identifier-1");
export const publicIdentifier2 = PublicIdentifier("public-identifier-2");
export const publicIdentifier3 = PublicIdentifier("public-identifier-3");
export const routerChannelAddress = EthereumContractAddress(
  "router-channel-address",
);
export const errorRouterChannelAddress = EthereumContractAddress(
  "router-channel-error-address",
);
export const routerPublicIdentifier = PublicIdentifier(
  "router-public-identifier",
);
export const ethereumAddress = EthereumContractAddress(
  "0x0000000000000000000000000000000000000000",
);
export const chainId = ChainId(1337);
export const injectedProviderId = ProviderId("injected"); // Metamask is an "injected" provider
export const hyperTokenAddress = EthereumContractAddress("0xhyperTokenAddress");
export const commonAmount = BigNumberString("1");
export const uncommonAmount = BigNumberString("2");
export const destinationAddress = EthereumAccountAddress(
  "0x0afd1c03a0373b4c99233cbb0719ab0cbe6374gt",
);
export const erc20AssetAddress = EthereumContractAddress(
  "0x9FBDa871d559710256a2502A2517b794B482Db40",
);
export const commonPaymentId = PaymentId(
  "See, this doesn't have to be legit data if it's never checked!",
);
export const validPaymentId = PaymentId(
  "0x48797065726e6574202050555348202037074ce539ff4b81b4cb43dcfe3f4513",
);
export const invalidPaymentId = PaymentId(
  "0x48797065726e6574202050555348202037074ce539ff4b81b4cb43dcfe3f4513Z",
);
export const invalidPaymentIdWithBadType = PaymentId(
  "0x48797065726e6574202051555348202037074ce539ff4b81b4cb43dcfe3f4513",
);
export const offerTransferId = TransferId("OfferTransferId");
export const offerTransferId2 = TransferId("OfferTransferId2");
export const insuranceTransferId = TransferId("InsuranceTransferId");
export const insuranceTransferId2 = TransferId("InsuranceTransferId2");
export const parameterizedTransferId = TransferId("ParameterizedTransferId");
export const parameterizedTransferId2 = TransferId("ParameterizedTransferId2");
export const unixPast = UnixTimestamp(1318870398); // Less that defaultExpirationlength before now
export const unixNow = UnixTimestamp(1318874398);
export const defaultExpirationLength = 3 * 24 * 60 * 60; // 3 days
export const expirationDate = UnixTimestamp(
  unixNow + defaultExpirationLength + 10,
); // Add a bit to not play on the edges
export const nowFormatted = "2021-02-03T04:28:09+03:00";
export const gatewayUrl = GatewayUrl("https://example.gateway.com/");
export const gatewayUrlError = GatewayUrl("gatewayUrlError");
export const gatewayUrl2 = GatewayUrl("https://example2.gateway.com/");
export const gatewayAddress = EthereumAccountAddress(
  "0xMediatorEthereumAddress",
);
export const gatewayAddress2 = EthereumAccountAddress(
  "0xMediatorEthereumAddress2",
);
export const gatewaySignature = Signature("0xgatewaySignature");
export const gatewaySignature2 = Signature("0xgatewaySignature2");
export const gatewaySignature3 = Signature("0xgatewaySignature3");
export const gatewayRegistrationInfo = new GatewayRegistrationInfo(
  gatewayUrl,
  gatewayAddress,
  gatewaySignature,
);
export const gatewayRegistrationInfo2 = new GatewayRegistrationInfo(
  gatewayUrl2,
  gatewayAddress2,
  gatewaySignature2,
);

export const requestIdentifier1 =
  "request-identifier-likely-hyperpay-internal-id";

export const channelFactoryAddress = EthereumContractAddress(
  "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
);
export const transferRegistryAddress = EthereumContractAddress(
  "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F",
);
export const messageTransferAddress = EthereumContractAddress(
  "messageTransferAddress",
);
export const insuranceTransferAddress = EthereumContractAddress(
  "insuranceTransferAddress",
);
export const parameterizedTransferAddress = EthereumContractAddress(
  "parameterizedTransferAddress",
);
export const gatewayRegistryAddress = EthereumContractAddress(
  "gatewayRegistryAddress",
);
export const liquidityRegistryAddress = EthereumContractAddress(
  "liquidityRegistryAddress",
);
export const tokenRegistryAddress = EthereumContractAddress(
  "tokenRegistryAddress",
);
export const chainRegistryAddress = EthereumContractAddress(
  "chainRegistryAddress",
);

export const hypernetProfileRegistryAddress = EthereumContractAddress(
  "hypernetProfileRegistryAddress",
);

export const modulesRegistryAddress = EthereumContractAddress(
  "modulesRegistryAddress",
);
export const hypernetGovernorAddress = EthereumContractAddress(
  "hypernetGovernorAddress",
);

export const registryFactoryAddress = EthereumContractAddress(
  "registryFactoryAddress",
);

const registryModulesNames = new RegistryModulesNames(
  "Batch Minting",
  "Lazy Minting",
  "Merkle Drop",
);

export const defaultGovernanceChainInformation = new GovernanceChainInformation(
  "Mock Chain",
  chainId,
  true,
  true,
  channelFactoryAddress,
  transferRegistryAddress,
  hyperTokenAddress,
  messageTransferAddress,
  insuranceTransferAddress,
  parameterizedTransferAddress,
  hypernetGovernorAddress,
  registryFactoryAddress,
  gatewayRegistryAddress,
  liquidityRegistryAddress,
  tokenRegistryAddress,
  chainRegistryAddress,
  hypernetProfileRegistryAddress,
  modulesRegistryAddress,
  registryModulesNames,
  [ProviderUrl("http://localhost:8545")],
);

export const tokenRegistryId1 = RegistryTokenId(BigInt(70916));
export const tokenRegistryId2 = RegistryTokenId(BigInt(103182));

export const tokenRegistryEntry1 = new RegistryEntry(
  "TokenRegistryEntry1",
  tokenRegistryId1,
  account,
  JSON.stringify({
    name: "Hypertoken",
    symbol: "HYP",
    chainId: chainId,
    address: hyperTokenAddress,
    nativeToken: false,
    erc20: true,
    decimals: 18,
    logoUrl: "",
  }),
  1,
);

export const tokenRegistryEntry2 = new RegistryEntry(
  "TokenRegistryEntry2",
  tokenRegistryId2,
  account,
  JSON.stringify({
    name: "Ethereum",
    symbol: "ETH",
    chainId: chainId,
    address: ethereumAddress,
    nativeToken: true,
    erc20: false,
    decimals: 18,
    logoUrl: "",
  }),
  2,
);

export const validDomain = "hypernetProtocolDomain";

export const messageTransferDefinitionAddress = EthereumContractAddress(
  "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6",
);
export const messageTransferEncodedCancel = HexString(
  "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
);
export const messageTransferResolverEncoding = "tuple(string message)";

export const insuranceTransferDefinitionAddress = EthereumContractAddress(
  "0x30753E4A8aad7F8597332E813735Def5dD395028",
);
export const insuranceTransferEncodedCancel = HexString(
  "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
);
export const insuranceTransferResolverEncoding =
  "tuple(tuple(uint256 amount, bytes32 UUID) data, bytes signature)";

export const parameterizedTransferDefinitionAddress = EthereumContractAddress(
  "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4",
);
export const parameterizedTransferEncodedCancel = HexString(
  "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
);
export const parameterizedTransferResolverEncoding =
  "tuple(tuple(bytes32 UUID, uint256 paymentAmountTaken) data, bytes payeeSignature)";

export const offerDetails: IHypernetOfferDetails = {
  routerPublicIdentifier: routerPublicIdentifier,
  chainId: chainId,
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
  insuranceToken: hyperTokenAddress,
  expirationDate: UnixTimestamp(unixPast + defaultExpirationLength),
  metadata: null,
};

export const activeOfferTransfer: IFullTransferState<
  MessageState,
  MessageResolver
> = {
  balance: {
    amount: [commonAmount],
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
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    message: JSON.stringify(offerDetails),
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
};

export const canceledOfferTransfer: IFullTransferState<
  MessageState,
  MessageResolver
> = {
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
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    message: JSON.stringify(offerDetails),
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
  transferResolver: { message: "" },
};

export const resolvedOfferTransfer: IFullTransferState<
  MessageState,
  MessageResolver
> = {
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
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    message: JSON.stringify(offerDetails),
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
  transferResolver: { message: "Reply" },
};

export const activeInsuranceTransfer: IFullTransferState<
  InsuranceState,
  InsuranceResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: hyperTokenAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: insuranceTransferId,
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
    collateral: commonAmount,
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier2,
  responderIdentifier: publicIdentifier,
  meta: {
    createdAt: unixNow,
  },
};

export const activeInsuranceTransfer2: IFullTransferState<
  InsuranceState,
  InsuranceResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: erc20AssetAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: insuranceTransferId2,
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
    collateral: commonAmount,
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier2,
  responderIdentifier: publicIdentifier,
  meta: {
    createdAt: unixNow,
  },
};

export const canceledInsuranceTransfer: IFullTransferState<
  InsuranceState,
  InsuranceResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: erc20AssetAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: offerTransferId,
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
    collateral: commonAmount,
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier2,
  responderIdentifier: publicIdentifier,
  transferResolver: {
    data: {
      amount: BigNumberString(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
      UUID: PaymentId(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
    },
    signature:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  },
  meta: {
    createdAt: unixNow,
  },
};

export const resolvedInsuranceTransfer: IFullTransferState<
  InsuranceState,
  InsuranceResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: erc20AssetAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: offerTransferId,
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
    collateral: commonAmount,
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier2,
  responderIdentifier: publicIdentifier,
  transferResolver: {
    data: {
      amount: BigNumberString(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
      UUID: PaymentId(
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ),
    },
    signature:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
  },
};

export const activeParameterizedTransfer: IFullTransferState<
  ParameterizedState,
  ParameterizedResolver
> = {
  balance: {
    amount: [commonAmount],
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
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    receiver: publicIdentifier2,
    start: unixPast.toString(),
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
    rate: {
      deltaAmount: commonAmount,
      deltaTime: "1",
    },
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
};

export const activeParameterizedTransfer2: IFullTransferState<
  ParameterizedState,
  ParameterizedResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: erc20AssetAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: parameterizedTransferId2,
  transferDefinition: parameterizedTransferDefinitionAddress,
  transferTimeout: "string",
  initialStateHash: "string",
  initiator: publicIdentifier,
  responder: publicIdentifier2,
  channelFactoryAddress: "channelFactoryAddress",
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    receiver: publicIdentifier2,
    start: unixPast.toString(),
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
    rate: {
      deltaAmount: commonAmount,
      deltaTime: "1",
    },
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
};

export const canceledParameterizedTransfer: IFullTransferState<
  ParameterizedState,
  ParameterizedResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: erc20AssetAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: offerTransferId,
  transferDefinition: parameterizedTransferDefinitionAddress,
  transferTimeout: "string",
  initialStateHash: "string",
  initiator: publicIdentifier,
  responder: publicIdentifier2,
  channelFactoryAddress: "channelFactoryAddress",
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    receiver: publicIdentifier2,
    start: unixPast.toString(),
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
    rate: {
      deltaAmount: commonAmount,
      deltaTime: "1",
    },
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
  transferResolver: {
    data: {
      paymentAmountTaken: BigNumberString(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
      UUID: PaymentId(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
    },
    payeeSignature:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  },
};

export const resolvedParameterizedTransfer: IFullTransferState<
  ParameterizedState,
  ParameterizedResolver
> = {
  balance: {
    amount: ["43", "43"],
    to: [destinationAddress],
  },
  assetId: erc20AssetAddress,
  channelAddress: routerChannelAddress,
  inDispute: false,
  transferId: offerTransferId,
  transferDefinition: parameterizedTransferDefinitionAddress,
  transferTimeout: "string",
  initialStateHash: "string",
  initiator: publicIdentifier,
  responder: publicIdentifier2,
  channelFactoryAddress: "channelFactoryAddress",
  chainId: chainId,
  transferEncodings: ["string"],
  transferState: {
    receiver: publicIdentifier2,
    start: unixPast.toString(),
    expiration: (unixPast + defaultExpirationLength).toString(),
    UUID: commonPaymentId,
    rate: {
      deltaAmount: commonAmount,
      deltaTime: "1",
    },
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
  transferResolver: {
    data: {
      paymentAmountTaken: BigNumberString(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
      UUID: PaymentId(
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ),
    },
    payeeSignature:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
  },
};

export const channelState: IFullChannelState = {
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
  aliceIdentifier: routerPublicIdentifier,
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
    chainId: chainId,
    channelFactoryAddress: "channelFactoryAddress",
    transferRegistryAddress: "transferRegistryAddress",
  },
  defundNonces: [],
  inDispute: false,
};

export const activeStateChannel = new ActiveStateChannel(
  ChainId(chainId),
  routerPublicIdentifier,
  routerChannelAddress,
);

export const activeRouters: PublicIdentifier[] = [routerPublicIdentifier];
