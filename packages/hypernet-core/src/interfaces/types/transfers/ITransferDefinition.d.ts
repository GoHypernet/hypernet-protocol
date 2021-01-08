/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction } from "ethers";
import { Contract, ContractTransaction, CallOverrides } from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface ITransferDefinitionInterface extends ethers.utils.Interface {
  functions: {
    "Name()": FunctionFragment;
    "ResolverEncoding()": FunctionFragment;
    "StateEncoding()": FunctionFragment;
    "create(bytes,bytes)": FunctionFragment;
    "getRegistryInformation()": FunctionFragment;
    "resolve(bytes,bytes,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "Name", values?: undefined): string;
  encodeFunctionData(functionFragment: "ResolverEncoding", values?: undefined): string;
  encodeFunctionData(functionFragment: "StateEncoding", values?: undefined): string;
  encodeFunctionData(functionFragment: "create", values: [BytesLike, BytesLike]): string;
  encodeFunctionData(functionFragment: "getRegistryInformation", values?: undefined): string;
  encodeFunctionData(functionFragment: "resolve", values: [BytesLike, BytesLike, BytesLike]): string;

  decodeFunctionResult(functionFragment: "Name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ResolverEncoding", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "StateEncoding", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRegistryInformation", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "resolve", data: BytesLike): Result;

  events: {};
}

export class ITransferDefinition extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ITransferDefinitionInterface;

  functions: {
    Name(
      overrides?: CallOverrides,
    ): Promise<{
      0: string;
    }>;

    "Name()"(
      overrides?: CallOverrides,
    ): Promise<{
      0: string;
    }>;

    ResolverEncoding(
      overrides?: CallOverrides,
    ): Promise<{
      0: string;
    }>;

    "ResolverEncoding()"(
      overrides?: CallOverrides,
    ): Promise<{
      0: string;
    }>;

    StateEncoding(
      overrides?: CallOverrides,
    ): Promise<{
      0: string;
    }>;

    "StateEncoding()"(
      overrides?: CallOverrides,
    ): Promise<{
      0: string;
    }>;

    create(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides,
    ): Promise<{
      0: boolean;
    }>;

    "create(bytes,bytes)"(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides,
    ): Promise<{
      0: boolean;
    }>;

    getRegistryInformation(
      overrides?: CallOverrides,
    ): Promise<{
      0: {
        name: string;
        definition: string;
        stateEncoding: string;
        resolverEncoding: string;
        0: string;
        1: string;
        2: string;
        3: string;
      };
    }>;

    "getRegistryInformation()"(
      overrides?: CallOverrides,
    ): Promise<{
      0: {
        name: string;
        definition: string;
        stateEncoding: string;
        resolverEncoding: string;
        0: string;
        1: string;
        2: string;
        3: string;
      };
    }>;

    resolve(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<{
      0: {
        amount: [BigNumber, BigNumber];
        to: [string, string];
        0: [BigNumber, BigNumber];
        1: [string, string];
      };
    }>;

    "resolve(bytes,bytes,bytes)"(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<{
      0: {
        amount: [BigNumber, BigNumber];
        to: [string, string];
        0: [BigNumber, BigNumber];
        1: [string, string];
      };
    }>;
  };

  Name(overrides?: CallOverrides): Promise<string>;

  "Name()"(overrides?: CallOverrides): Promise<string>;

  ResolverEncoding(overrides?: CallOverrides): Promise<string>;

  "ResolverEncoding()"(overrides?: CallOverrides): Promise<string>;

  StateEncoding(overrides?: CallOverrides): Promise<string>;

  "StateEncoding()"(overrides?: CallOverrides): Promise<string>;

  create(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  "create(bytes,bytes)"(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  getRegistryInformation(
    overrides?: CallOverrides,
  ): Promise<{
    name: string;
    definition: string;
    stateEncoding: string;
    resolverEncoding: string;
    0: string;
    1: string;
    2: string;
    3: string;
  }>;

  "getRegistryInformation()"(
    overrides?: CallOverrides,
  ): Promise<{
    name: string;
    definition: string;
    stateEncoding: string;
    resolverEncoding: string;
    0: string;
    1: string;
    2: string;
    3: string;
  }>;

  resolve(
    encodedBalance: BytesLike,
    arg1: BytesLike,
    arg2: BytesLike,
    overrides?: CallOverrides,
  ): Promise<{
    amount: [BigNumber, BigNumber];
    to: [string, string];
    0: [BigNumber, BigNumber];
    1: [string, string];
  }>;

  "resolve(bytes,bytes,bytes)"(
    encodedBalance: BytesLike,
    arg1: BytesLike,
    arg2: BytesLike,
    overrides?: CallOverrides,
  ): Promise<{
    amount: [BigNumber, BigNumber];
    to: [string, string];
    0: [BigNumber, BigNumber];
    1: [string, string];
  }>;

  callStatic: {
    Name(overrides?: CallOverrides): Promise<string>;

    "Name()"(overrides?: CallOverrides): Promise<string>;

    ResolverEncoding(overrides?: CallOverrides): Promise<string>;

    "ResolverEncoding()"(overrides?: CallOverrides): Promise<string>;

    StateEncoding(overrides?: CallOverrides): Promise<string>;

    "StateEncoding()"(overrides?: CallOverrides): Promise<string>;

    create(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    "create(bytes,bytes)"(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    getRegistryInformation(
      overrides?: CallOverrides,
    ): Promise<{
      name: string;
      definition: string;
      stateEncoding: string;
      resolverEncoding: string;
      0: string;
      1: string;
      2: string;
      3: string;
    }>;

    "getRegistryInformation()"(
      overrides?: CallOverrides,
    ): Promise<{
      name: string;
      definition: string;
      stateEncoding: string;
      resolverEncoding: string;
      0: string;
      1: string;
      2: string;
      3: string;
    }>;

    resolve(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<{
      amount: [BigNumber, BigNumber];
      to: [string, string];
      0: [BigNumber, BigNumber];
      1: [string, string];
    }>;

    "resolve(bytes,bytes,bytes)"(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<{
      amount: [BigNumber, BigNumber];
      to: [string, string];
      0: [BigNumber, BigNumber];
      1: [string, string];
    }>;
  };

  filters: {};

  estimateGas: {
    Name(overrides?: CallOverrides): Promise<BigNumber>;

    "Name()"(overrides?: CallOverrides): Promise<BigNumber>;

    ResolverEncoding(overrides?: CallOverrides): Promise<BigNumber>;

    "ResolverEncoding()"(overrides?: CallOverrides): Promise<BigNumber>;

    StateEncoding(overrides?: CallOverrides): Promise<BigNumber>;

    "StateEncoding()"(overrides?: CallOverrides): Promise<BigNumber>;

    create(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "create(bytes,bytes)"(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getRegistryInformation(overrides?: CallOverrides): Promise<BigNumber>;

    "getRegistryInformation()"(overrides?: CallOverrides): Promise<BigNumber>;

    resolve(encodedBalance: BytesLike, arg1: BytesLike, arg2: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "resolve(bytes,bytes,bytes)"(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    Name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "Name()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ResolverEncoding(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "ResolverEncoding()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    StateEncoding(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "StateEncoding()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    create(encodedBalance: BytesLike, arg1: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "create(bytes,bytes)"(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getRegistryInformation(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getRegistryInformation()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    resolve(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "resolve(bytes,bytes,bytes)"(
      encodedBalance: BytesLike,
      arg1: BytesLike,
      arg2: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
