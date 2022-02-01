import {
  PrivateCredentials,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import { InternalProvider } from "@implementations/utilities";
import {
  IContextProvider,
  IContextProviderType,
  IInternalProvider,
} from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";

@injectable()
export class InternalProviderFactory implements IInternalProviderFactory {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
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

    return this.contextProvider.getContext().map((context) => {
      return new InternalProvider(
        context.governanceChainInformation,
        privateCredentials,
      );
    });
  }
}
