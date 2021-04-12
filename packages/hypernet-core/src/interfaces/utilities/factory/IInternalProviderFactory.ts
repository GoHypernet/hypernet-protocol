import { ResultAsync } from "neverthrow";
import { PrivateCredentials } from "@hypernetlabs/objects";
import { InvalidParametersError } from "@hypernetlabs/objects";
import { IInternalProvider } from "@interfaces/utilities";

export interface IInternalProviderFactory {
  factoryInternalProvider(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<IInternalProvider, InvalidParametersError>;
}
