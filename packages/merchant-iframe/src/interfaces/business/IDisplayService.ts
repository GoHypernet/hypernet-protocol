import { ResultAsync } from "neverthrow";
import { IFrameHeight } from "@hypernetlabs/objects";

export interface IDisplayService {
  displayRequested(): ResultAsync<void, never>;
  closeRequested(): ResultAsync<void, never>;
  heightUpdated(height: IFrameHeight): ResultAsync<void, never>;
}

export const IDisplayServiceType = Symbol.for("IDisplayService");
