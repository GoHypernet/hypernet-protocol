import { ControlClaim, MessagingError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IControlService } from "@interfaces/business";
import { IMessagingRepository, IMessagingRepositoryType } from "@interfaces/data";
import { InitializedHypernetContext } from "@interfaces/objects";
import { IContextProvider, IContextProviderType, ITimeUtils, ITimeUtilsType } from "@interfaces/utilities";
import { inject, injectable } from "inversify";

@injectable()
export class ControlService implements IControlService {
  protected claimPeriod = 1000 * 60 * 5; // 5 minutes
  protected timeout: NodeJS.Timeout | null;
  protected lastControlClaim: ControlClaim | null;
  protected checkControlInterval: NodeJS.Timeout | null;

  constructor(
    @inject(IMessagingRepositoryType) protected messagingRepo: IMessagingRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {
    this.timeout = null;
    this.lastControlClaim = null;
    this.checkControlInterval = null;
  }

  public claimControl(): ResultAsync<
    void,
    MessagingError
  > {
    let context: InitializedHypernetContext;
    let controlClaim: ControlClaim;

    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        // Create a new claim
        controlClaim = new ControlClaim(context.publicIdentifier, this.timeUtils.getUnixNow());

        // Send the claim out to the other cores
        return this.messagingRepo.sendControlClaim(controlClaim);
      })
      .andThen(() => {
        // Update the context
        context.inControl = true;
        return this.contextProvider.setContext(context);
      })
      .map(() => {
        // We will continue to send control claims every 5 minutes
        this.timeout = (setInterval(() => {
          // this.messagingRepo.sendControlClaim(controlClaim);
        }, this.claimPeriod) as unknown) as NodeJS.Timeout;

        // Notify the world.
        context.onControlClaimed.next(controlClaim);
      });
  }

  /**
   * Processes an incoming control claim. Basically, if we get one,
   * SHUT DOWN EVERYTHING
   * @param controlClaim
   */
  public processControlClaim(
    controlClaim: ControlClaim,
  ): ResultAsync<void, never> {
    let context: InitializedHypernetContext;

    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        // set the last control claim time
        this.lastControlClaim = controlClaim;

        // Update the context
        context.inControl = false;
        return this.contextProvider.setContext(context);
      })
      .map(() => {
        // Cancel any notifications
        if (this.timeout != null) {
          clearInterval(this.timeout);
        }

        // While we are not in control, we are going to set a timeout
        // to try and regain control. If whoever is in control stops posting,
        // if we haven't heard from them after claimPeriod, then we will try
        // and take control
        const now = new Date().getTime();

        this.checkControlInterval = (setInterval(() => {
          if (
            this.lastControlClaim != null &&
            now - (this.lastControlClaim.timestamp + this.claimPeriod) > 5000
          ) {
            // TODO: take control of our lives
          }
        }, this.claimPeriod) as unknown) as NodeJS.Timeout;

        // Notify the world.
        context.onControlYielded.next(controlClaim);
      });
  }
}
