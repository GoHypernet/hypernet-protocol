import { Brand, make } from "ts-brand";

export type GatewayUrl = Brand<string, "GatewayUrl">;
export const GatewayUrl = make<GatewayUrl>();
