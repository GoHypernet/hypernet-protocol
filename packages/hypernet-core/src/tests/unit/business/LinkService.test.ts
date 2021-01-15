import { okAsync } from "neverthrow";
import { verify, when } from "ts-mockito";

import LinkServiceMocks from "../../mock/business/LinkServiceMocks";

describe("LinkService tests", () => {
  test("Should getLinks return links without errors", async () => {
    // Arrange
    const linkServiceMock = new LinkServiceMocks();

    // Act
    when(linkServiceMock.linkRepository.getHypernetLinks()).thenReturn(
      okAsync([linkServiceMock.getHypernetLinkFactory()]),
    );
    const getLinksResponse = await linkServiceMock.getServiceFactory().getLinks();

    // Assert
    verify(linkServiceMock.linkRepository.getHypernetLinks()).once();
    expect(getLinksResponse._unsafeUnwrap()).toStrictEqual([linkServiceMock.getHypernetLinkFactory()]);
  });
});
