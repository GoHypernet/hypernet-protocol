import { PrivateCredentials } from "@hypernetlabs/objects";
import { InvalidParametersError } from "@hypernetlabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { InternalProvider } from "@implementations/utilities";
import { IInternalProvider, IConfigProvider } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";

export class InternalProviderFactory implements IInternalProviderFactory {
  constructor(protected configProvider: IConfigProvider) {}

  public factoryInternalProvider(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<IInternalProvider, InvalidParametersError> {
    if (!privateCredentials.privateKey && !privateCredentials.mnemonic) {
      return errAsync(new InvalidParametersError("You must provide a mnemonic or private key"));
    }
    return okAsync(new InternalProvider(this.configProvider, privateCredentials));
  }
}
