import { HypernetContext } from "@interfaces/objects";

export interface IContextProvider {
  getContext(): Promise<HypernetContext>;
  setContext(context: HypernetContext): void;
}
