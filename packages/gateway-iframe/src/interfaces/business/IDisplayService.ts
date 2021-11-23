import { ResultAsync } from "neverthrow";

export interface IDisplayService {
  displayRequested(): ResultAsync<void, never>;
  closeRequested(): ResultAsync<void, never>;
}

export const IDisplayServiceType = Symbol.for("IDisplayService");
