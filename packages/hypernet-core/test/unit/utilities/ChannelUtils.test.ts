import { ChannelUtils } from "@implementations/utilities/ChannelUtils";
import { EthereumAddress } from "@objects/EthereumAddress";

test("ChannelUtils.getChannelAddress", () => {
  const address = ChannelUtils.getChannelId(
    EthereumAddress("asdf"),
    EthereumAddress("blah"),
  );

  expect(address).toBe("La/hGzkuFblLPPVg0Y1e7VEKeDh45ms48RDaGsqcjww=");
});
