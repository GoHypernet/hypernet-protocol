import { Brand, make } from "ts-brand";

// UtilityMessageSignature is for when you sign a message specifically with Vector, which prefixes the message with "\x17Utility Signed Message:\n" rather than "\x19Ethereum Signed Message:\n" as per EIP-191
export type UtilityMessageSignature = Brand<string, "UtilityMessageSignature">;
export const UtilityMessageSignature = make<UtilityMessageSignature>();
