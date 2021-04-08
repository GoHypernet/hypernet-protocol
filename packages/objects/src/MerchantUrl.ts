import { Brand, make } from "ts-brand";

export type MerchantUrl = Brand<string, "MerchantUrl">;
export const MerchantUrl = make<MerchantUrl>();
