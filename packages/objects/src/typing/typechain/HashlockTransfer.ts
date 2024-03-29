/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

export interface HashlockTransferInterface extends ethers.utils.Interface {
  functions: {
    "EncodedCancel()": FunctionFragment;
    "Name()": FunctionFragment;
    "ResolverEncoding()": FunctionFragment;
    "StateEncoding()": FunctionFragment;
    "create(bytes,bytes)": FunctionFragment;
    "getRegistryInformation()": FunctionFragment;
    "resolve(bytes,bytes,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "EncodedCancel",
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: "Name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ResolverEncoding",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "StateEncoding",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "create",
    values: [BytesLike, BytesLike],
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistryInformation",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "resolve",
    values: [BytesLike, BytesLike, BytesLike],
  ): string;

  decodeFunctionResult(
    functionFragment: "EncodedCancel",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "Name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ResolverEncoding",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "StateEncoding",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRegistryInformation",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "resolve", data: BytesLike): Result;

  events: {};
}

export class HashlockTransfer extends Contract {}
