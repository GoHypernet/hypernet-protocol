import {
  Balance,
  HashlockTransferResolverEncoding,
  HashlockTransferStateEncoding,
  HashlockTransferState,
  HashlockTransferResolver,
} from "@connext/vector-types";
import {
  getRandomAddress,
  getRandomBytes32,
  keyify,
  expect,
  encodeTransferResolver,
  encodeTransferState,
  encodeBalance,
} from "@connext/vector-utils";
import { HashZero, Zero } from "@ethersproject/constants";
import { Contract, ContractFactory, Wallet, utils, BigNumber } from "ethers";

import { HashlockTransfer } from "../../artifacts";
import { provider } from "../constants";

describe("HashlockTransfer", () => {
  let deployer: Wallet;
  let definition: Contract;

  const createlockHash = (preImage: string): string => {
    return utils.soliditySha256(["bytes32"], [preImage]);
  };

  beforeEach(async () => {
    deployer = provider.getWallets()[0];
    definition = await new ContractFactory(HashlockTransfer.abi, HashlockTransfer.bytecode, deployer).deploy();
    await definition.deployed();
  });

  const createInitialState = async (preImage: string): Promise<{ state: HashlockTransferState; balance: Balance }> => {
    const senderAddr = getRandomAddress();
    const receiverAddr = getRandomAddress();
    const transferAmount = "10000";
    const lockHash = createlockHash(preImage);
    const expiry = "0";
    return {
      balance: {
        amount: [transferAmount, Zero.toString()],
        to: [senderAddr, receiverAddr],
      },
      state: { lockHash, expiry },
    };
  };

  const createTransfer = async (balance: Balance, initialState: HashlockTransferState): Promise<boolean> => {
    const encodedState = encodeTransferState(initialState, HashlockTransferStateEncoding);
    const encodedBalance = encodeBalance(balance);
    return definition.functions.create(encodedBalance, encodedState);
  };

  const resolveTransfer = async (
    balance: Balance,
    initialState: HashlockTransferState,
    resolver: HashlockTransferResolver,
  ): Promise<Balance> => {
    const encodedState = encodeTransferState(initialState, HashlockTransferStateEncoding);
    const encodedResolver = encodeTransferResolver(resolver, HashlockTransferResolverEncoding);
    const encodedBalance = encodeBalance(balance);
    const ret = (await definition.functions.resolve(encodedBalance, encodedState, encodedResolver))[0];
    return keyify(balance, ret);
  };

  const validateResult = async (
    balance: Balance,
    initialState: HashlockTransferState,
    resolver: HashlockTransferResolver,
    result: Balance,
  ): Promise<void> => {
    if (
      resolver.preImage !== HashZero &&
      (initialState.expiry === "0" || BigNumber.from(initialState.expiry).gt(await provider.getBlockNumber()))
    ) {
      // Payment completed
      expect(result.to).to.deep.equal(balance.to);
      expect(result.amount[0].toString()).to.eq("0");
      expect(result.amount[1].toString()).to.eq(balance.amount[0]);
    } else {
      // Payment reverted
      expect(result.to).to.deep.equal(balance.to);
      expect(result.amount[0].toString()).to.eq(balance.amount[0]);
      expect(result.amount[1].toString()).to.eq(balance.amount[1]);
    }
  };

  it("should deploy", async () => {
    expect(definition.address).to.be.a("string");
  });

  describe("Create", () => {
    it("should create successfully", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      const res = await createTransfer(balance, state);
      expect((res as any)[0]).to.be.true;
    });

    it("should fail create if receiver balance is nonzero", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      balance.amount[1] = balance.amount[0];
      await expect(createTransfer(balance, state)).revertedWith(
        "Cannot create hashlock transfer with nonzero recipient balance",
      );
    });

    it("should fail create if lockHash is empty", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      state.lockHash = HashZero;
      await expect(createTransfer(balance, state)).revertedWith("Cannot create hashlock transfer with empty lockHash");
    });

    it("should fail create if expiry is nonzero and expired", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      state.expiry = "1";
      await expect(createTransfer(balance, state)).revertedWith(
        "Cannot create hashlock transfer with expired timelock",
      );
    });

    it("should create successfully if expiry is nonzero and not expired", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      state.expiry = ((await provider.getBlockNumber()) + 1).toString();
      const res = await createTransfer(balance, state);
      expect((res as any)[0]).to.be.true;
    });
  });

  describe("Resolve", () => {
    it("should resolve successfully with zero expiry", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      const result = await resolveTransfer(balance, state, { preImage });
      await validateResult(balance, state, { preImage }, result);
    });

    it("should resolve successfully with nonzero expiry that is not expired", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      state.expiry = ((await provider.getBlockNumber()) + 1).toString();
      const result = await resolveTransfer(balance, state, { preImage });
      await validateResult(balance, state, { preImage }, result);
    });

    it("should refund if preimage is HashZero", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      const result = await resolveTransfer(balance, state, { preImage: HashZero });
      await validateResult(balance, state, { preImage: HashZero }, result);
    });

    it("should refund if expiry is nonzero and is expired", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      state.expiry = "1";
      const result = await resolveTransfer(balance, state, { preImage: HashZero });
      await validateResult(balance, state, { preImage: HashZero }, result);
    });

    it("should fail if the hash generated does not match preimage", async () => {
      const preImage = getRandomBytes32();
      const { state, balance } = await createInitialState(preImage);
      const incorrectPreImage = getRandomBytes32();
      await expect(resolveTransfer(balance, state, { preImage: incorrectPreImage })).revertedWith(
        "Hash generated from preimage does not match hash in state",
      );
    });
  });
});
