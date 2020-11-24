import { HypernetLink, Payment } from "@interfaces/objects";

/**
 *
 */
export interface ILinkRepository {
  /**
   * Get all Hypernet Links for this client
   */
  getHypernetLinks(): Promise<HypernetLink[]>;

  /**
   * Given a linkId, return the associated Hypernet Link.
   * @param linkId The ID of the link to retrieve
   */
  getHypernetLink(linkId: string): Promise<HypernetLink>;

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayments with Vector.
   * @param paymentIds
   */
  provideAssets(paymentIds: string[]): Promise<Map<string, Payment>>;

  /**
   * Provides stakes for a given list of payment ids.
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentIds
   */
  provideStakes(paymentIds: string[]): Promise<Map<string, Payment>>;

  /**
   * Finalizes/confirms a list of payments.
   * Internally, this is what actually calls resolve() on Vector transfers -
   * be they insurancePayments or parameterizedPayments.
   * @param paymentIds
   */
  finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>>;
}
