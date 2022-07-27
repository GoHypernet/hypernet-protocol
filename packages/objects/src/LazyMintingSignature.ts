import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { RegistryTokenId } from "@objects/RegistryTokenId";
import { Signature } from "@objects/Signature";

export class LazyMintingSignature {
  constructor(
    public registryAddress: EthereumContractAddress,
    public mintingSignature: Signature,
    public tokenId: RegistryTokenId,
    public ownerAccountAddress: EthereumAccountAddress,
    public registrationData: string,
    public registrarAddress: EthereumAccountAddress,
    public tokenClaimed: boolean,
  ) {}
}
