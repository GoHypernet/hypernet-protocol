import { EthereumAddress } from "./EthereumAddress";

export class Registry {
  constructor(
    public registrarAddresses: EthereumAddress[],
    public address: EthereumAddress,
    public name: string,
    public symbol: string,
    public numberOfEntries: number,
  ) {}
}
