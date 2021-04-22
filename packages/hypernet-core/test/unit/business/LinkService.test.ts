import { HypernetLink } from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { LinkService } from "@implementations/business/LinkService";
import { ILinkService } from "@interfaces/business/ILinkService";
import { ILinkRepository } from "@interfaces/data";

class LinkServiceMocks {
  public linkRepository = td.object<ILinkRepository>();
  public hypernetLinks = new Array<HypernetLink>();

  constructor() {
    td.when(this.linkRepository.getHypernetLinks()).thenReturn(
      okAsync(this.hypernetLinks),
    );
  }

  public factoryLinkService(): ILinkService {
    return new LinkService(this.linkRepository);
  }
}

describe("LinkService tests", () => {
  test("Should getLinks return links without errors", async () => {
    // Arrange
    const linkServiceMock = new LinkServiceMocks();

    const linkService = linkServiceMock.factoryLinkService();

    // Act
    const response = await linkService.getLinks();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(linkServiceMock.hypernetLinks);
  });
});
