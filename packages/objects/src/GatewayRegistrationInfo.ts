import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { Signature } from "@objects/Signature";

export class GatewayRegistrationInfo {
  constructor(
    public url: GatewayUrl,
    public address: EthereumAddress,
    public signature: Signature,
  ) {}
}
