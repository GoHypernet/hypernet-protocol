/* import { mock, instance } from "ts-mockito";

import { IControlService } from "@interfaces/business";
import { HypernetContext } from "@hypernetlabs/objects";
import { ControlService } from "@implementations/business";
import { IContextProvider } from "@interfaces/utilities";

export default class ControlServiceMocks {
  public contextProvider: IContextProvider = mock<IContextProvider>();
  public hypernetContext: HypernetContext = mock(HypernetContext);

  public getContextProviderFactory(): IContextProvider {
    return instance(this.contextProvider);
  }

  public getHypernetContextFactory(): HypernetContext {
    return instance(this.hypernetContext);
  }

  public factoryService(): IControlService {
    return new ControlService(this.getContextProviderFactory());
  }
} */
