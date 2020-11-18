import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";

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
  getInitializedContext(): Promise<InitializedHypernetContext>;

  /**
   * 
   */
  setContext(context: HypernetContext): void;
}
