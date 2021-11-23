import { Brand, make } from "ts-brand";

export type TransferId = Brand<string, "TransferId">;
export const TransferId = make<TransferId>();
