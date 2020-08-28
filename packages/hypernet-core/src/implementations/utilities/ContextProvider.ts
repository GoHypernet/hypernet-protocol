import { HypernetContext } from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  constructor() {
    this.context = new HypernetContext(null);
  }
  public async getContext(): Promise<HypernetContext> {
    return this.context;
  }

  public setContext(context: HypernetContext): void {
    this.context = context;
  }
}
