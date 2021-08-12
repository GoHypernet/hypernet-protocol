import {
  BigNumberString,
  EthereumAddress,
  GatewayUrl,
  PaymentId,
  PublicIdentifier,
  Signature,
  TransferId,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { constants } from "ethers";
import {
  ISendFundsRequest,
  IAuthorizeFundsRequest,
  IResolveInsuranceRequest,
} from "@hypernetlabs/gateway-connector";

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
export const uncommonAmount = BigNumberString("2");
export const lockedAmount = BigNumberString("0");
export const destinationAddress = EthereumAddress(
  "0x0afd1c03a0373b4c99233cbb0719ab0cbe6374gt",
);
export const erc20AssetAddress = EthereumAddress(
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
export const defaultExpirationLength = 5000;
export const expirationDate = UnixTimestamp(unixNow + defaultExpirationLength);
export const nowFormatted = "2021-02-03T04:28:09+03:00";
export const gatewayUrl = GatewayUrl("https://example.gateway.com/");
export const gatewayUrl2 = GatewayUrl("https://example2.gateway.com/");
export const gatewayAddress = EthereumAddress("0xMediatorEthereumAddress");
export const gatewayAddress2 = EthereumAddress("0xMediatorEthereumAddress2");
export const gatewaySignature = Signature("0xgatewaySignature");
export const validDomain = "Hypernet";

export const sendFundsRequest: ISendFundsRequest = {
  channelAddress: routerChannelAddress,
  recipientPublicIdentifier: publicIdentifier,
  amount: commonAmount,
  expirationDate: expirationDate,
  requiredStake: commonAmount,
  paymentToken: ethereumAddress,
  metadata: "metadata",
};

export const authorizeFundsRequest: IAuthorizeFundsRequest = {
  channelAddress: routerChannelAddress,
  recipientPublicIdentifier: publicIdentifier,
  totalAuthorized: commonAmount,
  expirationDate: expirationDate,
  deltaAmount: commonAmount,
  deltaTime: 1,
  requiredStake: commonAmount,
  paymentToken: ethereumAddress,
  metadata: "metadata",
};

export const resolveInsuranceRequest: IResolveInsuranceRequest = {
  paymentId: validPaymentId,
  gatewaySignature: gatewaySignature,
  amount: commonAmount,
};
