/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { HashlockTransfer } from "../HashlockTransfer";

export class HashlockTransfer__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  // deploy(overrides?: Overrides): Promise<HashlockTransfer> {
  //   return super.deploy(overrides || {}) as Promise<HashlockTransfer>;
  // }
  // getDeployTransaction(overrides?: Overrides): TransactionRequest {
  //   return super.getDeployTransaction(overrides || {});
  // }
  // attach(address: string): HashlockTransfer {
  //   return super.attach(address) as HashlockTransfer;
  // }
  // connect(signer: Signer): HashlockTransfer__factory {
  //   return super.connect(signer) as HashlockTransfer__factory;
  // }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): HashlockTransfer {
    return new HashlockTransfer(address, _abi, signerOrProvider);
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
    stateMutability: "pure",
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
        name: "encodedState",
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
        name: "encodedState",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "encodedResolver",
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

const _bytecode =
  "0x608060405234801561001057600080fd5b50610d6c806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638052474d1161005b5780638052474d146100bd5780638de8b77e146100c55780638ef98a7e146100cd57806394184ba9146100ed5761007d565b80630528aa1c14610082578063206162be146100a05780633722aff9146100b5575b600080fd5b61008a61010d565b6040516100979190610a10565b60405180910390f35b6100a8610141565b6040516100979190610c1e565b61008a61034d565b61008a610386565b61008a6103b2565b6100e06100db3660046107ae565b6103ce565b6040516100979190610bb4565b6101006100fb366004610745565b61050e565b60405161009791906109fc565b60606101176105da565b6000815260405161012c908290602001610cae565b60405160208183030381529060405291505090565b6101496105ec565b6040518060a00160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b15801561018d57600080fd5b505afa1580156101a1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101c99190810190610844565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561021657600080fd5b505afa15801561022a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102529190810190610844565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b15801561029057600080fd5b505afa1580156102a4573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102cc9190810190610844565b8152602001306001600160a01b0316630528aa1c6040518163ffffffff1660e01b815260040160006040518083038186803b15801561030a57600080fd5b505afa15801561031e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103469190810190610844565b9052905090565b6040518060400160405280601781526020017f7475706c65286279746573333220707265496d6167652900000000000000000081525081565b6040518060400160405280601081526020016f2430b9b43637b1b5aa3930b739b332b960811b81525081565b604051806060016040528060278152602001610d106027913981565b6103d6610624565b6103de610649565b6103ea85870187610981565b90506103f46105da565b6104008486018661095c565b905061040a610624565b610416898b018b61087f565b82519091501561050157602083015115806104345750428360200151115b6104595760405162461bcd60e51b815260040161045090610b3e565b60405180910390fd5b6000600283600001516040516020016104729190610a07565b60408051601f198184030181529082905261048c916109e0565b602060405180830381855afa1580156104a9573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052508101906104cc919061072d565b845190915081146104ef5760405162461bcd60e51b815260040161045090610a75565b50805180516020909101528051600090525b9998505050505050505050565b6000610518610649565b61052483850185610981565b905061052e610624565b61053a8688018861087f565b80515190915061055c5760405162461bcd60e51b815260040161045090610ab7565b8051602001511561057f5760405162461bcd60e51b815260040161045090610a2a565b815161059d5760405162461bcd60e51b815260040161045090610b7f565b602082015115806105b15750428260200151115b6105cd5760405162461bcd60e51b815260040161045090610afc565b5060019695505050505050565b60408051602081019091526000815290565b6040518060a001604052806060815260200160006001600160a01b031681526020016060815260200160608152602001606081525090565b6040518060400160405280610637610660565b8152602001610644610660565b905290565b604080518082019091526000808252602082015290565b60405180604001604052806002906020820280368337509192915050565b60008083601f84011261068f578182fd5b50813567ffffffffffffffff8111156106a6578182fd5b6020830191508360208285010111156106be57600080fd5b9250929050565b600082601f8301126106d5578081fd5b815167ffffffffffffffff8111156106eb578182fd5b6106fe601f8201601f1916602001610cb8565b915080825283602082850101111561071557600080fd5b610726816020840160208601610cdf565b5092915050565b60006020828403121561073e578081fd5b5051919050565b6000806000806040858703121561075a578283fd5b843567ffffffffffffffff80821115610771578485fd5b61077d8883890161067e565b90965094506020870135915080821115610795578384fd5b506107a28782880161067e565b95989497509550505050565b600080600080600080606087890312156107c6578182fd5b863567ffffffffffffffff808211156107dd578384fd5b6107e98a838b0161067e565b90985096506020890135915080821115610801578384fd5b61080d8a838b0161067e565b90965094506040890135915080821115610825578384fd5b5061083289828a0161067e565b979a9699509497509295939492505050565b600060208284031215610855578081fd5b815167ffffffffffffffff81111561086b578182fd5b610877848285016106c5565b949350505050565b600060808284031215610890578081fd5b61089a6040610cb8565b83601f8401126108a8578182fd5b6108b26040610cb8565b808460408601878111156108c4578586fd5b855b60028110156108e55782358552602094850194909201916001016108c6565b5082855287605f8801126108f7578586fd5b6109016040610cb8565b9350839250905060808601871015610917578485fd5b845b600281101561094d5781356001600160a01b0381168114610938578687fd5b84526020938401939190910190600101610919565b50506020830152509392505050565b60006020828403121561096d578081fd5b6109776020610cb8565b9135825250919050565b600060408284031215610992578081fd5b61099c6040610cb8565b82358152602083013560208201528091505092915050565b600081518084526109cc816020860160208601610cdf565b601f01601f19169290920160200192915050565b600082516109f2818460208701610cdf565b9190910192915050565b901515815260200190565b90815260200190565b600060208252610a2360208301846109b4565b9392505050565b6020808252602b908201527f486173686c6f636b5472616e736665723a204e4f4e5a45524f5f52454349504960408201526a454e545f42414c414e434560a81b606082015260800190565b60208082526022908201527f486173686c6f636b5472616e736665723a20494e56414c49445f505245494d41604082015261474560f01b606082015260800190565b60208082526025908201527f486173686c6f636b5472616e736665723a205a4552305f53454e4445525f42416040820152644c414e434560d81b606082015260800190565b60208082526022908201527f486173686c6f636b5472616e736665723a20455850495245445f54494d454c4f604082015261434b60f01b606082015260800190565b60208082526021908201527f486173686c6f636b5472616e736665723a205041594d454e545f4558504952456040820152601160fa1b606082015260800190565b6020808252818101527f486173686c6f636b5472616e736665723a20454d5054595f4c4f434b48415348604082015260600190565b815160808201908260005b6002811015610bde578251825260209283019290910190600101610bbf565b5050506020808401516040840160005b6002811015610c145782516001600160a01b031682529183019190830190600101610bee565b5050505092915050565b600060208252825160a06020840152610c3a60c08401826109b4565b905060018060a01b0360208501511660408401526040840151601f1980858403016060860152610c6a83836109b4565b92506060860151915080858403016080860152610c8783836109b4565b925060808601519150808584030160a086015250610ca582826109b4565b95945050505050565b9051815260200190565b60405181810167ffffffffffffffff81118282101715610cd757600080fd5b604052919050565b60005b83811015610cfa578181015183820152602001610ce2565b83811115610d09576000848401525b5050505056fe7475706c652862797465733332206c6f636b486173682c2075696e743235362065787069727929a2646970667358221220228e5dcdab02bdaa3c809d67f6eaaf0e22e4ee53d848f29a709eef2f8b60371064736f6c63430007010033";
