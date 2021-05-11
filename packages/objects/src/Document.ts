import CeramicClient from "@ceramicnetwork/http-client";

export class Document {
  constructor(
    public family: string,
    public content: object,
    public controllers?: string[],
    public type?: any,
  ) {
    if (!this.type) {
      this.type = "tile";
    }
  }
}
