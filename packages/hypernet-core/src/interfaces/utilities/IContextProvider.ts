import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";
import { CoreUninitializedError, LogicalError } from "@interfaces/objects/errors";
import { ResultAsync } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IContextProvider {
  /**
   *
   */
  getContext(): ResultAsync<HypernetContext, LogicalError>;

  /**
   *
   */
  getInitializedContext(): ResultAsync<InitializedHypernetContext, CoreUninitializedError>;

  /**
   *
   */
  setContext(context: HypernetContext): ResultAsync<null, LogicalError>;
}
