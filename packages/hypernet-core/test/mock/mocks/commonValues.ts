import {
  EthereumAddress,
  MerchantUrl,
  PaymentId,
  PublicIdentifier,
  TransferId,
} from "@hypernetlabs/objects";
import { BigNumber, constants } from "ethers";

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
export const commonAmount = BigNumber.from("1");
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
export const unixPast = 1318870398; // Less that defaultExpirationlength before now
export const unixNow = 1318874398;
export const nowFormatted = "2021-02-03T04:28:09+03:00";
export const defaultExpirationLength = 5000;
export const merchantUrl = MerchantUrl("https://example.merchant.com/");
export const merchantUrl2 = MerchantUrl("https://example2.merchant.com/");
export const merchantAddress = EthereumAddress("0xMediatorEthereumAddress");
export const merchantAddress2 = EthereumAddress("0xMediatorEthereumAddress2");
export const mediatorSignature = "0xMediatorSignature";
