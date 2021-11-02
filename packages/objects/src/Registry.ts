import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAddress } from "@objects/EthereumAddress";
export class Registry {
  constructor(
    public registrarAddresses: EthereumAddress[],
    public registrarAdminAddresses: EthereumAddress[],
    public address: EthereumAddress,
    public name: string,
    public symbol: string,
    public numberOfEntries: number,
    public allowLazyRegister: boolean,
    public allowStorageUpdate: boolean,
    public allowLabelChange: boolean,
    public allowTransfers: boolean,
    public registrationToken: EthereumAddress,
    public registrationFee: BigNumberString,
    public burnAddress: EthereumAddress,
    public burnFee: number,
    public primaryRegistry: EthereumAddress,
    public index: number | null,
  ) {}
}
