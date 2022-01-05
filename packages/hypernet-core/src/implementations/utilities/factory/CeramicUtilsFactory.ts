import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ICeramicUtilsFactory } from "@interfaces/utilities/factory";
import { CeramicUtils } from "@implementations/utilities";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import {
  ICeramicUtils,
  IConfigProvider,
  IContextProvider,
  IBrowserNodeProvider,
  IConfigProviderType,
  IContextProviderType,
  IBrowserNodeProviderType,
} from "@interfaces/utilities";

@injectable()
export class CeramicUtilsFactory implements ICeramicUtilsFactory {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public factoryCeramicUtils(): ResultAsync<ICeramicUtils, never> {
    return okAsync(
      new CeramicUtils(
        this.configProvider,
        this.contextProvider,
        this.browserNodeProvider,
        this.logUtils,
      ),
    );
  }
}
