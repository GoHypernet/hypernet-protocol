import { CeramicError, BlockchainUnavailableError } from "@hypernetlabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { ICeramicListener } from "@interfaces/api";
import { ICeramicUtils } from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";

export class CeramicListener implements ICeramicListener {
  constructor(protected ceramicUtils: ICeramicUtils, protected logUtils: ILogUtils) {}
  public initialize(): ResultAsync<void, CeramicError | BlockchainUnavailableError> {
    return this.ceramicUtils.AuthenticateUser().andThen(() => {
      return okAsync(undefined);
    });
  }
}
