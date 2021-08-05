import {
  PrivateCredentials,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IInternalProvider } from "@interfaces/utilities";

export interface IInternalProviderFactory {
  factoryInternalProvider(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<IInternalProvider, InvalidParametersError>;
}

export const IInternalProviderFactoryType = Symbol.for(
  "IInternalProviderFactory",
);
