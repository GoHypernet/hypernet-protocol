import {
  PrivateCredentials,
  InvalidParametersError,
  ChainInformation,
} from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { InternalProvider } from "@implementations/utilities";
import {
  IConfigProvider,
  IConfigProviderType,
  IInternalProvider,
} from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";

@injectable()
export class InternalProviderFactory implements IInternalProviderFactory {
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public factoryInternalProvider(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<IInternalProvider, InvalidParametersError> {
    if (!privateCredentials.privateKey && !privateCredentials.mnemonic) {
      return errAsync(
        new InvalidParametersError(
          "You must provide a mnemonic or private key",
        ),
      );
    }

    return this.configProvider.getConfig().map((config) => {
      return new InternalProvider(
        config.governanceChainInformation,
        privateCredentials,
      );
    });
  }
}
