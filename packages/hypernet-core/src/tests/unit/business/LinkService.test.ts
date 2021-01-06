import { mock, instance, verify, when } from "ts-mockito";

import { HypernetLink } from "@interfaces/objects";
import { LinkService } from "@implementations/business";
import { VectorLinkRepository } from "@implementations/data";

describe("LinkService tests", () => {
  test("Should getLinks return links", async () => {
    // Arrange
    const linkRepository: VectorLinkRepository = mock(VectorLinkRepository);
    const linkRepositoryInstance: VectorLinkRepository = instance(linkRepository);

    const hypernetLink: HypernetLink = mock(HypernetLink);
    const hypernetLinkInstance: HypernetLink = instance(hypernetLink);

    const linkService = new LinkService(linkRepositoryInstance);

    // Act
    when(linkRepository.getHypernetLinks()).thenResolve([hypernetLinkInstance]);
    const linkServiceResponse = await linkService.getLinks();

    // Assert
    verify(linkRepository.getHypernetLinks()).once();
    expect(linkServiceResponse).toStrictEqual([hypernetLinkInstance]);
  });
});
