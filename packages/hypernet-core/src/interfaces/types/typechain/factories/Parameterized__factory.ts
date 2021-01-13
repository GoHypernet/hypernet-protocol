/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Parameterized } from "../Parameterized";

export class Parameterized__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Parameterized> {
    return super.deploy(overrides || {}) as Promise<Parameterized>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Parameterized {
    return super.attach(address) as Parameterized;
  }
  connect(signer: Signer): Parameterized__factory {
    return super.connect(signer) as Parameterized__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Parameterized {
    return new Contract(address, _abi, signerOrProvider) as Parameterized;
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
  "0x608060405234801561001057600080fd5b506116b0806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638052474d1161005b5780638052474d146100bd5780638de8b77e146100c55780638ef98a7e146100cd57806394184ba9146100ed5761007d565b80630528aa1c14610082578063206162be146100a05780633722aff9146100b5575b600080fd5b61008a61010d565b6040516100979190610f89565b60405180910390f35b6100a861018e565b6040516100979190611450565b61008a61039a565b61008a6103b6565b61008a6103df565b6100e06100db366004610c01565b6103fb565b60405161009791906113e6565b6101006100fb366004610b98565b610615565b6040516100979190610f60565b60606101176109fc565b506040805180820190915260008082526020820152610134610a13565b6040805180820182528381528151604180825260808201909352909160208301919060208201818036833750505090526040519091506101789082906020016114ee565b6040516020818303038152906040529250505090565b610196610a33565b6040518060a00160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b1580156101da57600080fd5b505afa1580156101ee573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102169190810190610c97565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561026357600080fd5b505afa158015610277573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261029f9190810190610c97565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b1580156102dd57600080fd5b505afa1580156102f1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103199190810190610c97565b8152602001306001600160a01b0316630528aa1c6040518163ffffffff1660e01b815260040160006040518083038186803b15801561035757600080fd5b505afa15801561036b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103939190810190610c97565b9052905090565b60405180608001604052806051815260200161162a6051913981565b6040518060400160405280600d81526020016c14185c985b595d195c9a5e9959609a1b81525081565b6040518060a00160405280607c81526020016115ae607c913981565b610403610a6b565b61040b610a6b565b61041787890189610cca565b9050610421610a90565b61042d86880188610e72565b9050610437610a13565b61044385870187610d9c565b905061044d6109fc565b5080516020810151610465578394505050505061060b565b60008160405160200161047891906114e0565b60405160208183030381529060405280519060200120905061049e818460200151610739565b6001600160a01b031684600001516001600160a01b0316146104db5760405162461bcd60e51b81526004016104d290611274565b60405180910390fd5b81516060850151146104ff5760405162461bcd60e51b81526004016104d29061119d565b836040015142106105225760405162461bcd60e51b81526004016104d29061100a565b600061053b85602001514261075b90919063ffffffff16565b905060006105648261055e600160401b87602001516107a490919063ffffffff16565b906107de565b608087015160208101519051919250600091610589919061055e90600160401b6107a4565b9050808211156105ab5760405162461bcd60e51b81526004016104d290611244565b875151602086015111156105d15760405162461bcd60e51b81526004016104d2906112b5565b60208501518851516105e29161075b565b8851526020858101518951909101516105fa91610820565b885160200152509596505050505050505b9695505050505050565b600061061f610a6b565b61062b85870187610cca565b9050610635610a90565b61064184860186610e72565b905061064b610ac7565b506080810151825160200151156106745760405162461bcd60e51b81526004016104d2906110ad565b8051600111156106965760405162461bcd60e51b81526004016104d290611308565b6001816020015110156106bb5760405162461bcd60e51b81526004016104d29061139f565b426203f480018260400151116106e35760405162461bcd60e51b81526004016104d29061134e565b81516001600160a01b031661070a5760405162461bcd60e51b81526004016104d2906111ca565b606082015161072b5760405162461bcd60e51b81526004016104d290611216565b506001979650505050505050565b60008061074584610845565b90506107518184610875565b9150505b92915050565b600061079d83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610999565b9392505050565b6000826107b357506000610755565b828202828482816107c057fe5b041461079d5760405162461bcd60e51b81526004016104d29061115c565b600061079d83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506109c5565b60008282018381101561079d5760405162461bcd60e51b81526004016104d290611034565b6000816040516020016108589190610f2f565b604051602081830303815290604052805190602001209050919050565b600081516041146108985760405162461bcd60e51b81526004016104d290610fd3565b60208201516040830151606084015160001a7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156108ea5760405162461bcd60e51b81526004016104d29061106b565b8060ff16601b1415801561090257508060ff16601c14155b1561091f5760405162461bcd60e51b81526004016104d29061111a565b6000600187838686604051600081526020016040526040516109449493929190610f6b565b6020604051602081039080840390855afa158015610966573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661060b5760405162461bcd60e51b81526004016104d290610f9c565b600081848411156109bd5760405162461bcd60e51b81526004016104d29190610f89565b505050900390565b600081836109e65760405162461bcd60e51b81526004016104d29190610f89565b5060008385816109f257fe5b0495945050505050565b604080518082019091526000808252602082015290565b6040518060400160405280610a266109fc565b8152602001606081525090565b6040518060a001604052806060815260200160006001600160a01b031681526020016060815260200160608152602001606081525090565b6040518060400160405280610a7e610ae1565b8152602001610a8b610ae1565b905290565b6040518060a0016040528060006001600160a01b03168152602001600081526020016000815260200160008019168152602001610a8b5b604051806040016040528060008152602001600081525090565b60405180604001604052806002906020820280368337509192915050565b60008083601f840112610b10578182fd5b50813567ffffffffffffffff811115610b27578182fd5b602083019150836020828501011115610b3f57600080fd5b9250929050565b600082601f830112610b56578081fd5b8151610b69610b6482611541565b61151a565b9150808252836020828501011115610b8057600080fd5b610b91816020840160208601611565565b5092915050565b60008060008060408587031215610bad578384fd5b843567ffffffffffffffff80821115610bc4578586fd5b610bd088838901610aff565b90965094506020870135915080821115610be8578384fd5b50610bf587828801610aff565b95989497509550505050565b60008060008060008060608789031215610c19578182fd5b863567ffffffffffffffff80821115610c30578384fd5b610c3c8a838b01610aff565b90985096506020890135915080821115610c54578384fd5b610c608a838b01610aff565b90965094506040890135915080821115610c78578384fd5b50610c8589828a01610aff565b979a9699509497509295939492505050565b600060208284031215610ca8578081fd5b815167ffffffffffffffff811115610cbe578182fd5b61075184828501610b46565b600060808284031215610cdb578081fd5b610ce5604061151a565b83601f840112610cf3578182fd5b610cfd604061151a565b80846040860187811115610d0f578586fd5b855b6002811015610d30578235855260209485019490920191600101610d11565b5082855287605f880112610d42578586fd5b610d4c604061151a565b9350839250905060808601871015610d62578485fd5b845b6002811015610d8d578135610d7881611595565b84526020938401939190910190600101610d64565b50506020830152509392505050565b60006020808385031215610dae578182fd5b823567ffffffffffffffff80821115610dc5578384fd5b908401908186036060811215610dd9578485fd5b610de3604061151a565b6040821215610df0578586fd5b610dfa604061151a565b84358152858501358682015281526040840135915082821115610e1b578586fd5b818401935087601f850112610e2e578586fd5b83359250610e3e610b6484611541565b91508282528785848601011115610e53578586fd5b8285850186840137918101840194909452918201929092529392505050565b600081830360c0811215610e84578182fd5b610e8e60a061151a565b8335610e9981611595565b8152602084810135908201526040808501358183015260608086013590830152607f1983011215610ec8578283fd5b610ed2604061151a565b608085810135825260a090950135602082015293810193909352509092915050565b60008151808452610f0c816020860160208601611565565b601f01601f19169290920160200192915050565b80518252602090810151910152565b7f175574696c697479205369676e6564204d6573736167653a0a333200000000008152601b810191909152603b0190565b901515815260200190565b93845260ff9290921660208401526040830152606082015260800190565b60006020825261079d6020830184610ef4565b60208082526018908201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604082015260600190565b6020808252601f908201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604082015260600190565b60208082526010908201526f5061796d656e7420657870697265642160801b604082015260600190565b6020808252601b908201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604082015260600190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604082015261756560f01b606082015260800190565b60208082526047908201527f43616e6e6f742063726561746520706172616d65746572697a6564207061796d60408201527f656e742077697468206e6f6e7a65726f20726563697069656e7420696e69742060608201526662616c616e636560c81b608082015260a00190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604082015261756560f01b606082015260800190565b60208082526021908201527f536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f6040820152607760f81b606082015260800190565b6020808252601390820152725555494420646964206e6f74206d617463682160681b604082015260600190565b6020808252602c908201527f526563656976657220616464726573732063616e6e6f7420626520746865207a60408201526b65726f20616464726573732160a01b606082015260800190565b6020808252601490820152732aaaa4a21031b0b73737ba10313290373ab6361760611b604082015260600190565b6020808252601690820152752830bcb6b2b73a103930ba329032bc31b2b2b232b21760511b604082015260600190565b60208082526021908201527f5265636569766572207369676e617475726520646964206e6f74206d617463686040820152601760f91b606082015260800190565b60208082526033908201527f43616e6e6f742074616b65206d6f7265207061796d656e74207468616e206f7260408201527234b3b4b730b6363c9030b63637b1b0ba32b21760691b606082015260800190565b60208082526026908201527f5065722d756e697420616d6f756e74206d757374206265206174206c6561737460408201526520312077656960d01b606082015260800190565b60208082526031908201527f45787069726174696f6e206d757374206265206174206c6561737420332064616040820152703cb99034b7103a343290333aba3ab9329760791b606082015260800190565b60208082526027908201527f5065722d756e69742074696d65206d757374206265206174206c656173742031604082015266081cd958dbdb9960ca1b606082015260800190565b815160808201908260005b60028110156114105782518252602092830192909101906001016113f1565b5050506020808401516040840160005b60028110156114465782516001600160a01b031682529183019190830190600101611420565b5050505092915050565b600060208252825160a0602084015261146c60c0840182610ef4565b905060018060a01b0360208501511660408401526040840151601f198085840301606086015261149c8383610ef4565b925060608601519150808584030160808601526114b98383610ef4565b925060808601519150808584030160a0860152506114d78282610ef4565b95945050505050565b604081016107558284610f20565b600060208252611502602083018451610f20565b60208301516060808401526107516080840182610ef4565b60405181810167ffffffffffffffff8111828210171561153957600080fd5b604052919050565b600067ffffffffffffffff821115611557578081fd5b50601f01601f191660200190565b60005b83811015611580578181015183820152602001611568565b8381111561158f576000848401525b50505050565b6001600160a01b03811681146115aa57600080fd5b5056fe7475706c6528616464726573732072656365697665722c2075696e743235362073746172742c2075696e743235362065787069726174696f6e2c206279746573333220555549442c207475706c652875696e743235362064656c7461416d6f756e742c2075696e743235362064656c746154696d65292072617465297475706c65287475706c65286279746573333220555549442c2075696e74323536207061796d656e74416d6f756e7454616b656e2920646174612c2062797465732070617965655369676e617475726529a26469706673582212202f6e118ad197af7a6b67231b5c4710cdb864415fc26df71be8a510f58cb84fc364736f6c63430007010033";
