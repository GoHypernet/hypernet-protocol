import { Brand, make } from "ts-brand";

export type GasUnits = Brand<number, "GasUnits">;
export const GasUnits = make<GasUnits>();
