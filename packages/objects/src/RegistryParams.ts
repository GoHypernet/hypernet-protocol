import { EthereumAddress } from "./EthereumAddress";

export class RegistryParams {
  constructor(
    public name: string,
    public allowLazyRegister: boolean | null,
    public allowStorageUpdate: boolean | null,
    public allowLabelChange: boolean | null,
    public allowTransfers: boolean | null,
    public registrationToken: EthereumAddress | null,
    public registrationFee: number | null,
    public burnAddress: EthereumAddress | null,
    public burnFee: number | null,
    public primaryRegistry: EthereumAddress | null,
  ) {}
}
