import { PrivateCredentials } from "@hypernetlabs/objects";
import { InvalidParametersError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IInternalProvider } from "@interfaces/utilities";

export interface IInternalProviderFactory {
  factoryInternalProvider(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<IInternalProvider, InvalidParametersError>;
}
