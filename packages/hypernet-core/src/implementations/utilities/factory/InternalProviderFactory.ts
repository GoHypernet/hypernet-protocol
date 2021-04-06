import { IInternalProvider } from "@interfaces/utilities";
import { IInternalProviderFactory } from "@interfaces/utilities/factory";
import { okAsync, ResultAsync } from "neverthrow";
import { InternalProvider } from "@implementations/utilities";
import { IPrivateCredentials } from "@hypernetlabs/objects";

export class InternalProviderFactory implements IInternalProviderFactory {
  public factoryInternalProvider(privateCredentials: IPrivateCredentials): ResultAsync<IInternalProvider, never> {
    return okAsync(new InternalProvider(privateCredentials));
  }
}
