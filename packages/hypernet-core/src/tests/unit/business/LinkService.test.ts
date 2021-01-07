import { verify, when } from "ts-mockito";

import LinkServiceMocks from "../../mock/unit/business/LinkServiceMocks";

describe("LinkService tests", () => {
  test("Should getLinks return links", async () => {
    // Arrange
    const linkServiceMock = new LinkServiceMocks();

    // Act
    when(linkServiceMock.linkRepository.getHypernetLinks()).thenResolve([linkServiceMock.getHypernetLinkFactory()]);
    const getLinksResponse = await linkServiceMock.getServiceFactory().getLinks();

    // Assert
    verify(linkServiceMock.linkRepository.getHypernetLinks()).once();
    expect(getLinksResponse).toStrictEqual([linkServiceMock.getHypernetLinkFactory()]);
  });
});
