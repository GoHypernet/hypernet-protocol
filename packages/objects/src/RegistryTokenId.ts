import { Brand, make } from "ts-brand";

export type RegistryTokenId = Brand<bigint, "RegistryTokenId">;
export const RegistryTokenId = make<RegistryTokenId>();
