import { ResultAsync } from "neverthrow";
import { IPrivateCredentials } from "@hypernetlabs/objects";
import { IInternalProvider } from "@interfaces/utilities";

export interface IInternalProviderFactory {
  factoryInternalProvider(privateCredentials: IPrivateCredentials): ResultAsync<IInternalProvider, never>;
}
