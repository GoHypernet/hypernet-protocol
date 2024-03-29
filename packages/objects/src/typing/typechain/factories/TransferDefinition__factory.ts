/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { TransferDefinition } from "../TransferDefinition";

export class TransferDefinition__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): TransferDefinition {
    return new Contract(
      address,
      _abi,
      signerOrProvider,
    ) as unknown as TransferDefinition;
  }
}

const _abi = [
  {
    inputs: [],
    name: "EncodedCancel",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ResolverEncoding",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "StateEncoding",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedBalance",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegistryInformation",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "definition",
            type: "address",
          },
          {
            internalType: "string",
            name: "stateEncoding",
            type: "string",
          },
          {
            internalType: "string",
            name: "resolverEncoding",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "encodedCancel",
            type: "bytes",
          },
        ],
        internalType: "struct RegisteredTransfer",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedBalance",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "resolve",
    outputs: [
      {
        components: [
          {
            internalType: "uint256[2]",
            name: "amount",
            type: "uint256[2]",
          },
          {
            internalType: "address payable[2]",
            name: "to",
            type: "address[2]",
          },
        ],
        internalType: "struct Balance",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
