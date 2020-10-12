import { TestToken } from "@connext/vector-contracts";
import { Contract, utils } from "ethers";

import { sugarDaddy, tokenAddress } from "../constants";

export const fundAddress = async (recipient: string): Promise<void> => {
  const value = utils.parseEther("100");

  const ethTx = await sugarDaddy.sendTransaction({
    to: recipient,
    value,
  });
  if (!ethTx.hash) throw new Error(`Couldn't fund account ${recipient}`);
  await ethTx.wait();

  const tokenTx = await new Contract(tokenAddress, TestToken.abi, sugarDaddy).transfer(recipient, value);
  await tokenTx.wait();
};
