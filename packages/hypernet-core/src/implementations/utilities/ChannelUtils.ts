import { EthereumAddress } from "@interfaces/objects";
import sjcl from "sjcl";

export class ChannelUtils {
  public static getChannelId(consumerAddress: EthereumAddress, providerAddress: EthereumAddress): string {
    const combinedAddress = `${consumerAddress} ${providerAddress}`;

    const hashBits = sjcl.hash.sha256.hash(combinedAddress);

    return sjcl.codec.base64.fromBits(hashBits);
  }
}
