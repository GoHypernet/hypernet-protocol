import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { injectable } from "inversify";
import sjcl from "sjcl";

injectable();
export class ChannelUtils {
  public static getChannelId(
    consumerAddress: EthereumAccountAddress,
    providerAddress: EthereumAccountAddress,
  ): string {
    const combinedAddress = `${consumerAddress} ${providerAddress}`;

    const hashBits = sjcl.hash.sha256.hash(combinedAddress);

    return sjcl.codec.base64.fromBits(hashBits);
  }
}
