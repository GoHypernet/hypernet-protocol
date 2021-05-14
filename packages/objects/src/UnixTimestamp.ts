import { Brand, make } from "ts-brand";

export type UnixTimestamp = Brand<number, "BigNumberString">;
export const UnixTimestamp = make<UnixTimestamp>();
