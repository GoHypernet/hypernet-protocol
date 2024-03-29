import { EthereumAccountAddress } from "@hypernetlabs/objects";

import { ChannelUtils } from "@implementations/utilities/ChannelUtils";

test("ChannelUtils.getChannelAddress", () => {
  const address = ChannelUtils.getChannelId(
    EthereumAccountAddress("asdf"),
    EthereumAccountAddress("blah"),
  );

  expect(address).toBe("La/hGzkuFblLPPVg0Y1e7VEKeDh45ms48RDaGsqcjww=");
});
