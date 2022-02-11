import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { RegistryName } from "@objects/RegistryName";

export class RegistryParams {
  constructor(
    public name: RegistryName,
    public allowStorageUpdate: boolean | null,
    public allowLabelChange: boolean | null,
    public allowTransfers: boolean | null,
    public registrationToken: EthereumContractAddress | null,
    public registrationFee: BigNumberString | null,
    public burnAddress: EthereumAccountAddress | null,
    public burnFee: number | null,
    public baseURI: string | null,
  ) {}
}
