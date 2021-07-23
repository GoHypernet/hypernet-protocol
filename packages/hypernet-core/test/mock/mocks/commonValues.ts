import {
  BigNumberString,
  EthereumAddress,
  GatewayUrl,
  HexString,
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
export const nowFormatted = "2021-02-03T04:28:09+03:00";
export const defaultExpirationLength = 5000;
export const gatewayUrl = GatewayUrl("https://example.gateway.com/");
export const gatewayUrl2 = GatewayUrl("https://example2.gateway.com/");
export const gatewayAddress = EthereumAddress("0xMediatorEthereumAddress");
export const gatewayAddress2 = EthereumAddress("0xMediatorEthereumAddress2");
export const gatewaySignature = "0xgatewaySignature";

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
