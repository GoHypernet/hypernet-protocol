import { Brand, make } from "ts-brand";

export type RegistryTokenId = Brand<string, "RegistryTokenId">;
export const RegistryTokenId = make<RegistryTokenId>();
