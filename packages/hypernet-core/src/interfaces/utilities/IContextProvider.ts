import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";

export interface IContextProvider {
  getContext(): Promise<HypernetContext>;
  getInitializedContext(): Promise<InitializedHypernetContext>;
  setContext(context: HypernetContext): void;
}
