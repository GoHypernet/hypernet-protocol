import { ResultAsync } from "neverthrow";
import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { Document } from "@hypernetlabs/objects";
//import { Doctype } from "@ceramicnetwork/http-client/lib/document";

export interface ICeramicUtils {
  AuthenticateUser(): ResultAsync<
    void,
    CeramicError | BlockchainUnavailableError
  >;
  /* writeDocument(document: Document): ResultAsync<Doctype, CeramicError>;
  readDocument(documentFamilyName: string): ResultAsync<Doctype, CeramicError>; */
}
