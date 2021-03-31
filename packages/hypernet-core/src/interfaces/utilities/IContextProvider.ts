import { HypernetContext, InitializedHypernetContext } from "@hypernetlabs/objects";
import { CoreUninitializedError, LogicalError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IContextProvider {
  /**
   *
   */
  getContext(): ResultAsync<HypernetContext, never>;

  /**
   *
   */
  getInitializedContext(): ResultAsync<InitializedHypernetContext, CoreUninitializedError>;

  /**
   *
   */
  setContext(context: HypernetContext): ResultAsync<void, never>;
}
