export enum EPaymentState {
  Proposed, // Offer made
  Rejected, // Offer rejected
  InvalidProposal, // Issues with the offer phase
  Staked, // Valid insurance posted
  InvalidStake, // Invalid insurance posted
  Approved, // Valid payment posted
  InvalidFunds, // Invalid payment posted
  Accepted, // Payment resolved
  InsuranceReleased, // Insurance resolved
  Finalized, // Offer resolved
  Borked, // Unknown or broken state. Recovery will be attempted.
}
