import { Brand, make } from "ts-brand";

export type DefinitionName = Brand<string, "DefinitionName">;
export const DefinitionName = make<DefinitionName>();
