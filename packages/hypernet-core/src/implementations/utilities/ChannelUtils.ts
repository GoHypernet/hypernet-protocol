import { Address } from "@interfaces/objects";
import * as sjcl from "sjcl";

export class ChannelUtils {
    public static getChannelId(consumerAddress: Address, providerAddress: Address): string {
        const combinedAddress = `${consumerAddress} ${providerAddress}`;
        
        const hashBits = sjcl.hash.sha256.hash(combinedAddress);

        return sjcl.codec.base64.fromBits(hashBits);
    }

}