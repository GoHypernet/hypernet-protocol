import { Brand, make } from "ts-brand";

export type RegistryTokenId = Brand<number, "RegistryTokenId">;
export const RegistryTokenId = make<RegistryTokenId>();
