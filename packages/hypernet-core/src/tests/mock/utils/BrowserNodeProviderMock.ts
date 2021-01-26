import { VectorError } from "@interfaces/objects/errors";
import { IBrowserNode, IBrowserNodeProvider } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";

export default class BrowserNodeProviderMock implements IBrowserNodeProvider {
  getBrowserNode(): ResultAsync<IBrowserNode, VectorError | Error> {
    throw new Error("Method not implemented.");
  }
}
