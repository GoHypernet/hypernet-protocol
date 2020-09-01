import { EthereumAddress, PublicKey, HypernetLink } from "@interfaces/objects";

export interface ILinkUtils {
  checkExistingLink(
    consumer: EthereumAddress,
    provider: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    links: HypernetLink[],
  ): HypernetLink | null;
}
