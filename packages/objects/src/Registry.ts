import { EthereumAddress } from "./EthereumAddress";

export class Registry {
  constructor(
    public registrarAddresses: EthereumAddress[],
    public address: EthereumAddress,
    public name: string,
    public symbol: string,
    public numberOfEntries: number,
    public allowLazyRegister: boolean,
    public allowStorageUpdate: boolean,
    public allowLabelChange: boolean,
    public allowTransfers: boolean,
    public registrationToken: EthereumAddress,
    public registrationFee: number,
    public burnAddress: EthereumAddress,
    public burnFee: number,
    public primaryRegistry: EthereumAddress,
  ) {}
}
