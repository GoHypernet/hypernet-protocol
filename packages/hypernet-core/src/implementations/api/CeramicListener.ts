import {
  CeramicError,
  BlockchainUnavailableError,
  AuthorizedMerchantsSchema,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";

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
    return this.ceramicUtils.authenticateUser().andThen(() => {
      /* this.ceramicUtils
        .initiateDefinitions()
        .map((data) => {
          console.log("initiateDefinitions doneee", data);
          const seedKey = data[0].id.toString();
          console.log("IDX setup created with definition ID:", seedKey);
        })
        .mapErr((err) => {
          console.log("mapErr err: ", err);
        }); */
      /* *************************************************** */
      /* *************************************************** */
      /* this.ceramicUtils
        .writeRecord(AuthorizedMerchantsSchema.title, [
          {
            merchantUrl: "http://localhost:5010",
            authorizationSignature:
              "0xfde764a212be245299325f8f8b3b7faf3ac1d712fa592c61b69e95f072e8fa5a67504bd123dd27f7445ee94485328e7b3888c9ebc3df7cc7ba5ed4174b041d7b1c",
          },
          {
            merchantUrl: "http://localhost:501022222",
            authorizationSignature: "0xadsadsad",
          },
        ])
        .map((data) => {
          console.log("writeDocument data: ", data);
        })
        .mapErr((err) => {
          console.log("mapErr err: ", err);
        }); */

      /* this.ceramicUtils
        .readRecord(AuthorizedMerchantsSchema.title)
        .map((data) => {
          console.log("readRecord data: ", data);
        })
        .mapErr((err) => {
          console.log("mapErr err: ", err);
        }); */

      /* this.ceramicUtils
        .removeRecord(AuthorizedMerchantsSchema.title)
        .map((data) => {
          console.log("removeRecord data: ", data);
        })
        .mapErr((err) => {
          console.log("mapErr err: ", err);
        }); */

      return okAsync(undefined);
    });
  }
}
