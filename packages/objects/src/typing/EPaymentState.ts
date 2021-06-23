export enum EPaymentState {
  Proposed = 0, // Offer made
  Rejected = 1, // Offer rejected
  InvalidProposal = 2, // Issues with the offer phase
  Staked = 3, // Valid insurance posted
  InvalidStake = 4, // Invalid insurance posted
  Approved = 5, // Valid payment posted
  InvalidFunds = 6, // Invalid payment posted
  Accepted = 7, // Payment resolved
  InsuranceReleased = 8, // Insurance resolved
  Finalized = 9, // Offer resolved
  Borked = 10, // Unknown or broken state. Recovery will be attempted.
}
