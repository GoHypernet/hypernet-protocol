import { HexString } from "@connext/vector-types";
import { FunctionFragment, EventFragment, ParamType } from "@ethersproject/abi";

import * as ChannelFactory from "../artifacts/src.sol/ChannelFactory.sol/ChannelFactory.json";
import * as ChannelMastercopy from "../artifacts/src.sol/ChannelMastercopy.sol/ChannelMastercopy.json";
import * as CMCAsset from "../artifacts/src.sol/CMCAsset.sol/CMCAsset.json";
import * as FailingToken from "../artifacts/src.sol/testing/FailingToken.sol/FailingToken.json";
import * as HashlockTransfer from "../artifacts/src.sol/transferDefinitions/HashlockTransfer.sol/HashlockTransfer.json";
import * as NonconformingToken from "../artifacts/src.sol/testing/NonconformingToken.sol/NonconformingToken.json";
import * as TestChannel from "../artifacts/src.sol/testing/TestChannel.sol/TestChannel.json";
import * as TestChannelFactory from "../artifacts/src.sol/testing/TestChannelFactory.sol/TestChannelFactory.json";
import * as TestToken from "../artifacts/src.sol/testing/TestToken.sol/TestToken.json";
import * as TransferDefinition from "../artifacts/src.sol/interfaces/ITransferDefinition.sol/ITransferDefinition.json";
import * as TransferRegistry from "../artifacts/src.sol/TransferRegistry.sol/TransferRegistry.json";
import * as VectorChannel from "../artifacts/src.sol/interfaces/IVectorChannel.sol/IVectorChannel.json";
import * as Withdraw from "../artifacts/src.sol/transferDefinitions/Withdraw.sol/Withdraw.json";
import * as Parameterized from "../artifacts/src.sol/transferDefinitions/Parameterized.sol/Parameterized.json";
import * as Insurance from "../artifacts/src.sol/transferDefinitions/Insurance.sol/Insurance.json";
import * as Message from "../artifacts/src.sol/transferDefinitions/Message.sol/Message.json";
import * as TestLibIterableMapping from "../artifacts/src.sol/testing/TestLibIterableMapping.sol/TestLibIterableMapping.json";
import * as ReentrantToken from "../artifacts/src.sol/testing/ReentrantToken.sol/ReentrantToken.json";
import * as StableSwap from "../artifacts/src.sol/amm/StableSwap.sol/StableSwap.json";

type Abi = Array<string | FunctionFragment | EventFragment | ParamType>;

type Artifact = {
  contractName: string;
  abi: Abi;
  bytecode: HexString;
  deployedBytecode: HexString;
};

type Artifacts = { [contractName: string]: Artifact };

export const artifacts: Artifacts = {
  ChannelFactory,
  ChannelMastercopy,
  CMCAsset,
  FailingToken,
  HashlockTransfer,
  NonconformingToken,
  ReentrantToken,
  TestChannel,
  TestChannelFactory,
  TestLibIterableMapping,
  TestToken,
  TransferDefinition,
  TransferRegistry,
  VectorChannel,
  Withdraw,
  StableSwap,
  Parameterized,
  Insurance,
  Message,
} as any;

export {
  ChannelFactory,
  ChannelMastercopy,
  CMCAsset,
  FailingToken,
  HashlockTransfer,
  NonconformingToken,
  ReentrantToken,
  TestChannel,
  TestChannelFactory,
  TestLibIterableMapping,
  TestToken,
  TransferDefinition,
  TransferRegistry,
  VectorChannel,
  Withdraw,
  StableSwap,
  Parameterized,
  Insurance,
  Message,
};