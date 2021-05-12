import {
  CeramicError,
  BlockchainUnavailableError,
  AuthorizedMerchantsSchema,
} from "@hypernetlabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { ICeramicListener } from "@interfaces/api";
import { ICeramicUtils } from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";

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
      /* return this.ceramicUtils.initiateDefinitions().andThen((data) => {
        console.log("initiateDefinitions doneee", data);
        const seedKey = data[0].id.toString();
        console.log("IDX setup created with definition ID:", seedKey);
        return okAsync(undefined);
      }); */

      /* this.ceramicUtils
        .writeRecord(
          AuthorizedMerchantsSchema.properties.authorizedMerchants.title,
          {
            authorizedMerchants: [
              {
                merchantUrl: "http://localhost:5010",
                authorizationSignature: "0x1111",
              },
            ],
          },
        )
        .map((data) => {
          console.log("writeDocument data: ", data);
        })
        .mapErr((err) => {
          console.log("mapErr err: ", err);
        }); */

      /* this.ceramicUtils
        .readRecord(
          AuthorizedMerchantsSchema.properties.authorizedMerchants.title,
        )
        .map((data) => {
          console.log("readRecord data: ", data);
        })
        .mapErr((err) => {
          console.log("mapErr err: ", err);
        }); */
      return okAsync(undefined);
    });
  }
}
