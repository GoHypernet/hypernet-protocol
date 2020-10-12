import { ControlClaim } from "@interfaces/objects";

export interface IControlService {
  /**
   * Should be called after the Hypernet Core is ready to assume control
   * of an account.
   */
  claimControl(): Promise<void>;

  /**
   * Processes an incoming control claim. Basically just yields control.
   */
  processControlClaim(controlClaim: ControlClaim): Promise<void>;
}
