import {
  BigNumberString,
  EMessageTransferType,
  EthereumAddress,
  GatewayUrl,
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
  PublicIdentifier,
  Signature,
  TransferId,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { constants } from "ethers";

export const account = EthereumAddress("0xDEADBEEF");
export const account2 = EthereumAddress("0xBEEFDEAD");
export const publicIdentifier = PublicIdentifier("vectorDEADBEEF");
export const publicIdentifier2 = PublicIdentifier("vectorBEEFDEAD");
export const publicIdentifier3 = PublicIdentifier("vectorDEADPORK");
export const routerChannelAddress = EthereumAddress(
  "0x0afd1c03a0373b4c99233cbb0719ab0cbe8258eb",
);
export const routerPublicIdentifier = PublicIdentifier("vectorROUTERPUBLICID");
export const ethereumAddress = EthereumAddress(
  "0x0000000000000000000000000000000000000000",
);
export const chainId = 1337;
export const hyperTokenAddress = EthereumAddress(constants.AddressZero);
export const commonAmount = BigNumberString("1");
export const destinationAddress = EthereumAddress(
  "0x0afd1c03a0373b4c99233cbb0719ab0cbe6374gt",
);
export const erc20AssetAddress = EthereumAddress(
  "0x9FBDa871d559710256a2502A2517b794B482Db40",
);
export const commonPaymentId = PaymentId(
  "See, this doesn't have to be legit data if it's never checked!",
);
export const offerTransferId = TransferId("OfferTransferId");
export const insuranceTransferId = TransferId("InsuranceTransferId");
export const parameterizedTransferId = TransferId("ParameterizedTransferId");
export const unixPast = UnixTimestamp(1318870398); // Less that defaultExpirationlength before now
export const unixNow = UnixTimestamp(1318874398);
export const defaultExpirationLength = 5000;
export const expirationDate = UnixTimestamp(unixNow + defaultExpirationLength);
export const nowFormatted = "2021-02-03T04:28:09+03:00";
export const gatewayUrl = GatewayUrl("https://example.gateway.com/");
export const gatewayUrl2 = GatewayUrl("https://example2.gateway.com/");
export const gatewayAddress = EthereumAddress("0xMediatorEthereumAddress");
export const gatewayAddress2 = EthereumAddress("0xMediatorEthereumAddress2");
export const gatewaySignature = Signature("0xgatewaySignature");

export const messageTransferDefinitionAddress = EthereumAddress(
  "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6",
);
export const messageTransferEncodedCancel = HexString(
  "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
);
export const messageTransferResolverEncoding = "tuple(string message)";

export const insuranceTransferDefinitionAddress = EthereumAddress(
  "0x30753E4A8aad7F8597332E813735Def5dD395028",
);
export const insuranceTransferEncodedCancel = HexString(
  "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
);
export const insuranceTransferResolverEncoding =
  "tuple(tuple(uint256 amount, bytes32 UUID) data, bytes signature)";

export const parameterizedTransferDefinitionAddress = EthereumAddress(
  "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4",
);
export const parameterizedTransferEncodedCancel = HexString(
  "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000041000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
);
export const parameterizedTransferResolverEncoding =
  "tuple(tuple(bytes32 UUID, uint256 paymentAmountTaken) data, bytes payeeSignature)";

export const offerDetails: IHypernetOfferDetails = {
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

export const activeOfferTransfer: IFullTransferState<MessageState> = {
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
    message: JSON.stringify(offerDetails),
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
};

export const canceledOfferTransfer: IFullTransferState<MessageState> = {
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
    message: "",
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
  transferResolver: { message: "" } as MessageResolver,
};

export const resolvedOfferTransfer: IFullTransferState<MessageState> = {
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
    message: "",
  },
  channelNonce: 1,
  initiatorIdentifier: publicIdentifier,
  responderIdentifier: publicIdentifier2,
  transferResolver: { message: "Reply" } as MessageResolver,
};

export const activeInsuranceTransfer: IFullTransferState<InsuranceState> = {
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

export const canceledInsuranceTransfer: IFullTransferState<InsuranceState> = {
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
  transferResolver: {
    data: {
      amount:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      UUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    signature:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  } as InsuranceResolver,
};

export const resolvedInsuranceTransfer: IFullTransferState<InsuranceState> = {
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
  transferResolver: {
    data: {
      amount:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      UUID: "0x0000000000000000000000000000000000000000000000000000000000000001",
    },
    signature:
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
  } as InsuranceResolver,
};

export const activeParameterizedTransfer = {
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

export const canceledParameterizedTransfer: IFullTransferState<ParameterizedState> =
  {
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
    transferResolver: {
      data: {
        paymentAmountTaken:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        UUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
      payeeSignature:
        "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    } as ParameterizedResolver,
  };

export const resolvedParameterizedTransfer: IFullTransferState<ParameterizedState> =
  {
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
    transferResolver: {
      data: {
        paymentAmountTaken:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        UUID: "0x0000000000000000000000000000000000000000000000000000000000000001",
      },
      payeeSignature:
        "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
    } as ParameterizedResolver,
  };

export const channelState = {
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
    chainId: 1337,
    channelFactoryAddress: "channelFactoryAddress",
    transferRegistryAddress: "transferRegistryAddress",
  },
  defundNonces: [],
  inDispute: false,
} as IFullChannelState;
