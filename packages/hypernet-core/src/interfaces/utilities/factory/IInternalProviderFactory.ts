import {
  PrivateCredentials,
  InvalidParametersError,
  ChainInformation,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IInternalProvider } from "@interfaces/utilities";

export interface IInternalProviderFactory {
  factoryInternalProvider(
    privateCredentials: PrivateCredentials,
    governanceChainInfo: ChainInformation,
  ): ResultAsync<IInternalProvider, InvalidParametersError>;
}

export const IInternalProviderFactoryType = Symbol.for(
  "IInternalProviderFactory",
);
