import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { ICeramicListener } from "@interfaces/api";
import { ICeramicUtils } from "@interfaces/utilities";

export class CeramicListener implements ICeramicListener {
  constructor(
    protected ceramicUtils: ICeramicUtils,
    protected logUtils: ILogUtils,
  ) {}
  public initialize(): ResultAsync<
    void,
    CeramicError | BlockchainUnavailableError
  > {
    return this.ceramicUtils.authenticateUser();
  }
}
