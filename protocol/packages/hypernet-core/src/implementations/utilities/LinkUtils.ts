import { PublicKey, EthereumAddress, HypernetLink } from "@interfaces/objects";

export class LinkUtils {
  public checkExistingLink(
    linkId: string | null,
    consumer: EthereumAddress,
    provider: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    links: HypernetLink[],
  ): HypernetLink | null {
    const existingLinks = links.filter((val: HypernetLink) => {
      return (
        (linkId === val.id || linkId == null) &&
        consumer === val.consumer &&
        provider === val.provider &&
        paymentToken === val.paymentToken &&
        disputeMediator === val.disputeMediator
      );
    });

    if (existingLinks.length > 1) {
      throw new Error("Multiple identical links identified!");
    } else if (existingLinks.length === 0) {
      return existingLinks[0];
    }
    return null;
  }
}
