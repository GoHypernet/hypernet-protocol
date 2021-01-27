import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { ControlClaim, InitializedHypernetContext, ResultAsync } from "@interfaces/objects";
import { IControlService } from "@interfaces/business/IControlService";
import { LogicalError } from "@interfaces/objects/errors";

export class ControlService implements IControlService {
  protected claimPeriod = 1000 * 60 * 5; // 5 minutes
  protected timeout: NodeJS.Timeout | null;
  protected lastControlClaim: ControlClaim | null;
  protected checkControlInterval: NodeJS.Timeout | null;

  constructor(protected contextProvider: IContextProvider, protected messagingRepo: IMessagingRepository) {
    this.timeout = null;
    this.lastControlClaim = null;
    this.checkControlInterval = null;
  }

  public claimControl(): ResultAsync<void, LogicalError> {
    let context: InitializedHypernetContext;
    let controlClaim: ControlClaim;

    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        // Create a new claim
        controlClaim = new ControlClaim(context.account, new Date().getTime());

        // Send the claim out to the other cores
        // await this.messagingRepo.sendControlClaim(controlClaim);

        // Update the context
        context.inControl = true;
        return this.contextProvider.setContext(context);
      })
      .map(() => {
        // We will continue to send control claims every 5 minutes
        this.timeout = setInterval(() => {
          // this.messagingRepo.sendControlClaim(controlClaim);
        }, this.claimPeriod);

        // Notify the world.
        context.onControlClaimed.next(controlClaim);
      });
  }

  /**
   * Processes an incoming control claim. Basically, if we get one,
   * SHUT DOWN EVERYTHING
   * @param controlClaim
   */
  public async processControlClaim(controlClaim: ControlClaim): Promise<void> {
    const context = await this.contextProvider.getContext();

    // set the last control claim time
    this.lastControlClaim = controlClaim;

    // Update the context
    context.inControl = false;
    this.contextProvider.setContext(context);

    // Cancel any notifications
    if (this.timeout != null) {
      clearInterval(this.timeout);
    }

    // While we are not in control, we are going to set a timeout
    // to try and regain control. If whoever is in control stops posting,
    // if we haven't heard from them after claimPeriod, then we will try
    // and take control
    const now = new Date().getTime();

    this.checkControlInterval = setInterval(() => {
      if (this.lastControlClaim != null && now - (this.lastControlClaim.timestamp + this.claimPeriod) > 5000) {
        // TODO: take control of our lives
      }
    }, this.claimPeriod);

    // Notify the world.
    context.onControlYielded.next(controlClaim);
  }
}
