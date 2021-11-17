import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

export const paymentSigningDomain = {
  name: "Hypernet Protocol",
  version: "1",
} as TypedDataDomain;

export const pushPaymentSigningTypes: Record<string, TypedDataField[]> = {
  PushPayment: [
    { name: "requestIdentifier", type: "string" },
    { name: "paymentId", type: "string" },
    { name: "channelAddress", type: "address" },
    { name: "recipientPublicIdentifier", type: "string" },
    { name: "amount", type: "string" },
    { name: "expirationDate", type: "uint32" },
    { name: "requiredStake", type: "string" },
    { name: "paymentToken", type: "address" },
    { name: "metadata", type: "string" },
  ],
};

export const pullPaymentSigningTypes: Record<string, TypedDataField[]> = {
  PullPayment: [
    { name: "requestIdentifier", type: "string" },
    { name: "paymentId", type: "string" },
    { name: "channelAddress", type: "address" },
    { name: "recipientPublicIdentifier", type: "string" },
    { name: "totalAuthorized", type: "string" },
    { name: "expirationDate", type: "uint32" },
    { name: "deltaAmount", type: "string" },
    { name: "deltaTime", type: "uint32" },
    { name: "requiredStake", type: "string" },
    { name: "paymentToken", type: "address" },
    { name: "metadata", type: "string" },
  ],
};
