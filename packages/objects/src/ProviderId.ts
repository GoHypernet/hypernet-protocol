import { Brand, make } from "ts-brand";

export type ProviderId = Brand<string, "ProviderId">;
export const ProviderId = make<ProviderId>();
