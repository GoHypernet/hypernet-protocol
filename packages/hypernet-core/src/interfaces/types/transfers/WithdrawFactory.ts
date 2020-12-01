/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Withdraw } from "./Withdraw";

export class WithdrawFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Withdraw> {
    return super.deploy(overrides || {}) as Promise<Withdraw>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Withdraw {
    return super.attach(address) as Withdraw;
  }
  connect(signer: Signer): WithdrawFactory {
    return super.connect(signer) as WithdrawFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Withdraw {
    return new Contract(address, _abi, signerOrProvider) as Withdraw;
  }
}

const _abi = [
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
    stateMutability: "pure",
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
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611132806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063206162be146100675780633722aff9146100855780638052474d1461009a5780638de8b77e146100a25780638ef98a7e146100aa57806394184ba9146100ca575b600080fd5b61006f6100ea565b60405161007c9190610f70565b60405180910390f35b61008d61027c565b60405161007c9190610c6e565b61008d6102b5565b61008d6102d9565b6100bd6100b83660046108bc565b6102f5565b60405161007c9190610f06565b6100dd6100d8366004610853565b6103de565b60405161007c9190610c45565b6100f26106c4565b6040518060800160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b15801561013657600080fd5b505afa15801561014a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101729190810190610952565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b1580156101bf57600080fd5b505afa1580156101d3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101fb9190810190610952565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b15801561023957600080fd5b505afa15801561024d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102759190810190610952565b9052905090565b6040518060400160405280601f81526020017f7475706c6528627974657320726573706f6e6465725369676e6174757265290081525081565b60405180604001604052806008815260200167576974686472617760c01b81525081565b6040518060c00160405280608f815260200161106e608f913981565b6102fd6106f5565b61030561071a565b61031185870187610b02565b905061031b61077d565b61032784860186610a97565b90506103316106f5565b61033d898b018b6109c5565b604080516041808252608082019092529192506060919060208201818036833701905050905080805190602001208360000151805190602001201415610382576103d0565b82516040850151606086015161039992909161051c565b6103be5760405162461bcd60e51b81526004016103b590610d2d565b60405180910390fd5b60a08401518251602001528151600090525b509998505050505050505050565b60006103e861071a565b6103f483850185610b02565b90506103fe6106f5565b61040a868801886109c5565b805160200151909150156104305760405162461bcd60e51b81526004016103b590610e66565b60208201516001600160a01b031615801590610458575060408201516001600160a01b031615155b6104745760405162461bcd60e51b81526004016103b590610cf6565b60608201516104955760405162461bcd60e51b81526004016103b590610ea9565b60808201516104b65760405162461bcd60e51b81526004016103b590610ed7565b80515160a083015111156104dc5760405162461bcd60e51b81526004016103b590610ded565b8151602083015160608401516104f392909161051c565b61050f5760405162461bcd60e51b81526004016103b590610db6565b5060019695505050505050565b6000816001600160a01b03166105328585610544565b6001600160a01b031614949350505050565b60008061055084610566565b905061055c8184610596565b9150505b92915050565b6000816040516020016105799190610c14565b604051602081830303815290604052805190602001209050919050565b600081516041146105b95760405162461bcd60e51b81526004016103b590610cbf565b60208201516040830151606084015160001a7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a082111561060b5760405162461bcd60e51b81526004016103b590610d74565b8060ff16601b1415801561062357508060ff16601c14155b156106405760405162461bcd60e51b81526004016103b590610e24565b6000600187838686604051600081526020016040526040516106659493929190610c50565b6020604051602081039080840390855afa158015610687573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166106ba5760405162461bcd60e51b81526004016103b590610c88565b9695505050505050565b60405180608001604052806060815260200160006001600160a01b0316815260200160608152602001606081525090565b6040518060400160405280610708610790565b8152602001610715610790565b905290565b6040518061010001604052806060815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160008019168152602001600081526020016000815260200160006001600160a01b03168152602001606081525090565b6040518060200160405280606081525090565b60405180604001604052806002906020820280368337509192915050565b803561056081611055565b60008083601f8401126107ca578182fd5b50813567ffffffffffffffff8111156107e1578182fd5b6020830191508360208285010111156107f957600080fd5b9250929050565b600082601f830112610810578081fd5b813561082361081e82611001565b610fda565b915080825283602082850101111561083a57600080fd5b8060208401602084013760009082016020015292915050565b60008060008060408587031215610868578384fd5b843567ffffffffffffffff8082111561087f578586fd5b61088b888389016107b9565b909650945060208701359150808211156108a3578384fd5b506108b0878288016107b9565b95989497509550505050565b600080600080600080606087890312156108d4578182fd5b863567ffffffffffffffff808211156108eb578384fd5b6108f78a838b016107b9565b9098509650602089013591508082111561090f578384fd5b61091b8a838b016107b9565b90965094506040890135915080821115610933578384fd5b5061094089828a016107b9565b979a9699509497509295939492505050565b600060208284031215610963578081fd5b815167ffffffffffffffff811115610979578182fd5b8201601f81018413610989578182fd5b805161099761081e82611001565b8181528560208385010111156109ab578384fd5b6109bc826020830160208601611025565b95945050505050565b6000608082840312156109d6578081fd5b6109e06040610fda565b83601f8401126109ee578182fd5b6109f86040610fda565b80846040860187811115610a0a578586fd5b855b6002811015610a2b578235855260209485019490920191600101610a0c565b5082855287605f880112610a3d578586fd5b610a476040610fda565b9350839250905060808601871015610a5d578485fd5b845b6002811015610a88578135610a7381611055565b84526020938401939190910190600101610a5f565b50506020830152509392505050565b600060208284031215610aa8578081fd5b813567ffffffffffffffff80821115610abf578283fd5b9083019060208286031215610ad2578283fd5b610adc6020610fda565b823582811115610aea578485fd5b610af687828601610800565b82525095945050505050565b600060208284031215610b13578081fd5b813567ffffffffffffffff80821115610b2a578283fd5b8184019150610100808387031215610b40578384fd5b610b4981610fda565b9050823582811115610b59578485fd5b610b6587828601610800565b825250610b7586602085016107ae565b6020820152610b8786604085016107ae565b6040820152606083013560608201526080830135608082015260a083013560a0820152610bb78660c085016107ae565b60c082015260e083013582811115610bcd578485fd5b610bd987828601610800565b60e08301525095945050505050565b60008151808452610c00816020860160208601611025565b601f01601f19169290920160200192915050565b7f15496e647261205369676e6564204d6573736167653a0a3332000000000000008152601981019190915260390190565b901515815260200190565b93845260ff9290921660208401526040830152606082015260800190565b600060208252610c816020830184610be8565b9392505050565b60208082526018908201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604082015260600190565b6020808252601f908201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604082015260600190565b60208082526017908201527f57697468647261773a20454d5054595f5349474e455253000000000000000000604082015260600190565b60208082526027908201527f57697468647261772e7265736f6c76653a20494e56414c49445f524553504f4e6040820152664445525f53494760c81b606082015260800190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604082015261756560f01b606082015260800190565b6020808252601f908201527f57697468647261773a20494e56414c49445f494e49544941544f525f53494700604082015260600190565b6020808252601e908201527f57697468647261773a20494e53554646494349454e545f42414c414e43450000604082015260600190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604082015261756560f01b606082015260800190565b60208082526023908201527f57697468647261773a204e4f4e5a45524f5f524543495049454e545f42414c416040820152624e434560e81b606082015260800190565b60208082526014908201527357697468647261773a20454d5054595f4441544160601b604082015260600190565b60208082526015908201527457697468647261773a20454d5054595f4e4f4e434560581b604082015260600190565b815160808201908260005b6002811015610f30578251825260209283019290910190600101610f11565b5050506020808401516040840160005b6002811015610f665782516001600160a01b031682529183019190830190600101610f40565b5050505092915050565b600060208252825160806020840152610f8c60a0840182610be8565b905060018060a01b0360208501511660408401526040840151601f1980858403016060860152610fbc8383610be8565b92506060860151915080858403016080860152506109bc8282610be8565b60405181810167ffffffffffffffff81118282101715610ff957600080fd5b604052919050565b600067ffffffffffffffff821115611017578081fd5b50601f01601f191660200190565b60005b83811015611040578181015183820152602001611028565b8381111561104f576000848401525b50505050565b6001600160a01b038116811461106a57600080fd5b5056fe7475706c6528627974657320696e69746961746f725369676e61747572652c206164647265737320696e69746961746f722c206164647265737320726573706f6e6465722c206279746573333220646174612c2075696e74323536206e6f6e63652c2075696e74323536206665652c20616464726573732063616c6c546f2c2062797465732063616c6c4461746129a2646970667358221220651df066ff8e027083933222a9314c3a598d8dbb9635f3e47e624bd3c705441964736f6c63430007010033";
