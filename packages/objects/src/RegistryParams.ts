import { EthereumAddress } from "@objects/EthereumAddress";
import { BigNumberString } from "@objects/BigNumberString";

export class RegistryParams {
  constructor(
    public name: string,
    public allowLazyRegister: boolean | null,
    public allowStorageUpdate: boolean | null,
    public allowLabelChange: boolean | null,
    public allowTransfers: boolean | null,
    public registrationToken: EthereumAddress | null,
    public registrationFee: BigNumberString | null,
    public burnAddress: EthereumAddress | null,
    public burnFee: BigNumberString | null,
    public primaryRegistry: EthereumAddress | null,
  ) {}
}
