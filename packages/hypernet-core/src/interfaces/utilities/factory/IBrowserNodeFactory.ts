import { VectorError } from "@interfaces/objects/errors";
import { IBrowserNode } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";

export interface IBrowserNodeFactory {
  factoryBrowserNode(): ResultAsync<IBrowserNode, VectorError>;
}
