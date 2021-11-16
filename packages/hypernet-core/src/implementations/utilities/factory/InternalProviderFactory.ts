import {
  PrivateCredentials,
  InvalidParametersError,
  ChainInformation,
} from "@hypernetlabs/objects";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { InternalProvider } from "@implementations/utilities";
import { IInternalProvider } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";

@injectable()
export class InternalProviderFactory implements IInternalProviderFactory {
  constructor() {}

  public factoryInternalProvider(
    privateCredentials: PrivateCredentials,
    governanceChainInfo: ChainInformation,
  ): ResultAsync<IInternalProvider, InvalidParametersError> {
    if (!privateCredentials.privateKey && !privateCredentials.mnemonic) {
      return errAsync(
        new InvalidParametersError(
          "You must provide a mnemonic or private key",
        ),
      );
    }

    return okAsync(
      new InternalProvider(governanceChainInfo, privateCredentials),
    );
  }
}
