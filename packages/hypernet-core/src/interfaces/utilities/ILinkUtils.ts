import { EthereumAddress, PublicKey, HypernetLedger } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface ILinkUtils {

  /**
   * 
   * @param linkId
   * @param consumer
   * @param provider
   * @param paymentToken
   * @param disputeMediator
   * @param links
   */
  checkExistingLink(
    linkId: string | null,
    consumer: EthereumAddress,
    provider: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    links: HypernetLedger[],
  ): HypernetLedger | null;
}
