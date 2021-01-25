import { HypernetLink, IHypernetCore, PublicIdentifier } from "@hypernetlabs/hypernet-core";

export class LinkParams {
  constructor(public core: IHypernetCore, public link: HypernetLink) {}
}

export class LinksParams {
  constructor(public core: IHypernetCore) {}
}
