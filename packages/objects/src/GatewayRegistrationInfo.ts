import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { Signature } from "@objects/Signature";

export class GatewayRegistrationInfo {
  constructor(
    public url: GatewayUrl,
    public address: EthereumAccountAddress,
    public signature: Signature,
  ) {}
}
