import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";
import { CoreUninitializedError } from "@interfaces/objects/errors";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IContextProvider {
  /**
   *
   */
  getContext(): Promise<HypernetContext>;

  /**
   *
   */
  getInitializedContext(): ResultAsync<InitializedHypernetContext, CoreUninitializedError>;

  /**
   *
   */
  setContext(context: HypernetContext): void;
}
