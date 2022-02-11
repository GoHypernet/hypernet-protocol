import { Brand, make } from "ts-brand";

export type RegistryName = Brand<string, "RegistryName">;
export const RegistryName = make<RegistryName>();
