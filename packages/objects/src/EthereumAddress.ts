import {Brand, make} from "ts-brand";

export type EthereumAddress = Brand<string, "EthereumAddress">;
export const EthereumAddress = make<EthereumAddress>();
