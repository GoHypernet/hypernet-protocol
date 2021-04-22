import { ControlClaim } from "@hypernetlabs/objects";
import {
  BlockchainUnavailableError,
  LogicalError,
  ThreeBoxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IControlService {
  /**
   * Should be called after the Hypernet Core is ready to assume control
   * of an account.
   * @todo Describe the purpose of this function - what does it do?
   */
  claimControl(): ResultAsync<
    void,
    BlockchainUnavailableError | ThreeBoxError | LogicalError
  >;

  /**
   * Processes an incoming control claim. Basically just yields control.
   */
  processControlClaim(
    controlClaim: ControlClaim,
  ): ResultAsync<void, LogicalError>;
}
