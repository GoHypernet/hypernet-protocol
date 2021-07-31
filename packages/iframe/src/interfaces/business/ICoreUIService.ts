import { ResultAsync } from "neverthrow";

export interface ICoreUIService {
  renderDeStorageAuthenticationUI(): ResultAsync<void, never>;
  renderDeStorageAuthenticationFailedUI(): ResultAsync<void, never>;
  renderDeStorageAuthenticationSucceededUI(): ResultAsync<void, never>;
}

export const ICoreUIServiceType = Symbol.for("ICoreUIService");
