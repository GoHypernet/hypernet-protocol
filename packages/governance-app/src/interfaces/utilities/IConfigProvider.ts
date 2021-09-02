import { GovernanceAppConfig } from "@governance-app/interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IConfigProvider {
  getConfig(): ResultAsync<GovernanceAppConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
