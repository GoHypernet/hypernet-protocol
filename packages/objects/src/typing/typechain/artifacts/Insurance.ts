export default {
  _format: "hh-sol-artifact-1",
  contractName: "Insurance",
  sourceName: "contracts/insurance/Insurance.sol",
  abi: [
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
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b50611462806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638052474d1161005b5780638052474d146100bd5780638de8b77e146100c55780638ef98a7e146100cd57806394184ba9146100ed5761007d565b80630528aa1c14610082578063206162be146100a05780633722aff9146100b5575b600080fd5b61008a61010d565b6040516100979190610e1c565b60405180910390f35b6100a861018e565b6040516100979190611230565b61008a61039a565b61008a6103b6565b61008a6103db565b6100e06100db366004610ab1565b6103f7565b60405161009791906111c6565b6101006100fb366004610a48565b6105a1565b6040516100979190610df3565b60606101176108cf565b5060408051808201909152600080825260208201526101346108e6565b6040805180820182528381528151604180825260808201909352909160208301919060208201818036833750505090526040519091506101789082906020016112ce565b6040516020818303038152906040529250505090565b610196610906565b6040518060a00160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b1580156101da57600080fd5b505afa1580156101ee573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102169190810190610b47565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561026357600080fd5b505afa158015610277573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261029f9190810190610b47565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b1580156102dd57600080fd5b505afa1580156102f1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103199190810190610b47565b8152602001306001600160a01b0316630528aa1c6040518163ffffffff1660e01b815260040160006040518083038186803b15801561035757600080fd5b505afa15801561036b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103939190810190610b47565b9052905090565b6040518060600160405280604081526020016113ed6040913981565b60405180604001604052806009815260200168496e737572616e636560b81b81525081565b6040518060800160405280605f815260200161138e605f913981565b6103ff61093e565b61040761093e565b61041387890189610b7a565b905061041d610963565b61042986880188610d22565b90506104336108e6565b61043f85870187610c4c565b90506104496108cf565b508051805161045e5783945050505050610597565b826060015142106104755783945050505050610597565b80602001518360800151146104a55760405162461bcd60e51b815260040161049c90611082565b60405180910390fd5b6000816040516020016104b891906112c0565b60405160208183030381529060405280519060200120905060006104e08285602001516106bf565b905084600001516001600160a01b0316816001600160a01b0316141561050e57859650505050505050610597565b84602001516001600160a01b0316816001600160a01b0316146105435760405162461bcd60e51b815260040161049c90610f9c565b855151835111156105665760405162461bcd60e51b815260040161049c90610ed4565b8251865151610574916106e1565b86515282518651602001516105889161072a565b86516020015250939450505050505b9695505050505050565b60006105ab61093e565b6105b785870187610b7a565b90506105c1610963565b6105cd84860186610d22565b825160200151909150156105f35760405162461bcd60e51b815260040161049c90610fd3565b426203f4800181606001511161061b5760405162461bcd60e51b815260040161049c90611175565b80516001600160a01b03166106425760405162461bcd60e51b815260040161049c906110af565b60208101516001600160a01b031661066c5760405162461bcd60e51b815260040161049c90611129565b608081015161068d5760405162461bcd60e51b815260040161049c906110fb565b6001816040015110156106b25760405162461bcd60e51b815260040161049c90610f65565b5060019695505050505050565b6000806106cb8461074f565b90506106d7818461077f565b9150505b92915050565b600061072383836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f7700008152506108a3565b9392505050565b6000828201838110156107235760405162461bcd60e51b815260040161049c90610e9d565b6000816040516020016107629190610dc2565b604051602081830303815290604052805190602001209050919050565b600081516041146107a25760405162461bcd60e51b815260040161049c90610e66565b60208201516040830151606084015160001a7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156107f45760405162461bcd60e51b815260040161049c90610f23565b8060ff16601b1415801561080c57508060ff16601c14155b156108295760405162461bcd60e51b815260040161049c90611040565b60006001878386866040516000815260200160405260405161084e9493929190610dfe565b6020604051602081039080840390855afa158015610870573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166105975760405162461bcd60e51b815260040161049c90610e2f565b600081848411156108c75760405162461bcd60e51b815260040161049c9190610e1c565b505050900390565b604080518082019091526000808252602082015290565b60405180604001604052806108f96108cf565b8152602001606081525090565b6040518060a001604052806060815260200160006001600160a01b031681526020016060815260200160608152602001606081525090565b6040518060400160405280610951610991565b815260200161095e610991565b905290565b6040805160a08101825260008082526020820181905291810182905260608101829052608081019190915290565b60405180604001604052806002906020820280368337509192915050565b60008083601f8401126109c0578182fd5b50813567ffffffffffffffff8111156109d7578182fd5b6020830191508360208285010111156109ef57600080fd5b9250929050565b600082601f830112610a06578081fd5b8151610a19610a1482611321565b6112fa565b9150808252836020828501011115610a3057600080fd5b610a41816020840160208601611345565b5092915050565b60008060008060408587031215610a5d578384fd5b843567ffffffffffffffff80821115610a74578586fd5b610a80888389016109af565b90965094506020870135915080821115610a98578384fd5b50610aa5878288016109af565b95989497509550505050565b60008060008060008060608789031215610ac9578182fd5b863567ffffffffffffffff80821115610ae0578384fd5b610aec8a838b016109af565b90985096506020890135915080821115610b04578384fd5b610b108a838b016109af565b90965094506040890135915080821115610b28578384fd5b50610b3589828a016109af565b979a9699509497509295939492505050565b600060208284031215610b58578081fd5b815167ffffffffffffffff811115610b6e578182fd5b6106d7848285016109f6565b600060808284031215610b8b578081fd5b610b9560406112fa565b83601f840112610ba3578182fd5b610bad60406112fa565b80846040860187811115610bbf578586fd5b855b6002811015610be0578235855260209485019490920191600101610bc1565b5082855287605f880112610bf2578586fd5b610bfc60406112fa565b9350839250905060808601871015610c12578485fd5b845b6002811015610c3d578135610c2881611375565b84526020938401939190910190600101610c14565b50506020830152509392505050565b60006020808385031215610c5e578182fd5b823567ffffffffffffffff80821115610c75578384fd5b908401908186036060811215610c89578485fd5b610c9360406112fa565b6040821215610ca0578586fd5b610caa60406112fa565b84358152858501358682015281526040840135915082821115610ccb578586fd5b818401935087601f850112610cde578586fd5b83359250610cee610a1484611321565b91508282528785848601011115610d03578586fd5b8285850186840137918101840194909452918201929092529392505050565b600060a08284031215610d33578081fd5b610d3d60a06112fa565b8235610d4881611375565b81526020830135610d5881611375565b806020830152506040830135604082015260608301356060820152608083013560808201528091505092915050565b60008151808452610d9f816020860160208601611345565b601f01601f19169290920160200192915050565b80518252602090810151910152565b7f175574696c697479205369676e6564204d6573736167653a0a333200000000008152601b810191909152603b0190565b901515815260200190565b93845260ff9290921660208401526040830152606082015260800190565b6000602082526107236020830184610d87565b60208082526018908201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604082015260600190565b6020808252601f908201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604082015260600190565b6020808252601b908201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604082015260600190565b6020808252602f908201527f43616e6e6f74207472616e73666572206d6f7265207468616e206f726967696e60408201526e30b6363c9030b63637b1b0ba32b21760891b606082015260800190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604082015261756560f01b606082015260800190565b6020808252601a908201527f436f6c6c61746572616c206d757374206265206e6f6e7a65726f000000000000604082015260600190565b60208082526019908201527f5369676e617475726520646964206e6f74207665726966792100000000000000604082015260600190565b60208082526047908201527f43616e6e6f742063726561746520706172616d65746572697a6564207061796d60408201527f656e742077697468206e6f6e7a65726f20726563697069656e7420696e69742060608201526662616c616e636560c81b608082015260a00190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604082015261756560f01b606082015260800190565b6020808252601390820152725555494420646964206e6f74206d617463682160681b604082015260600190565b6020808252602c908201527f526563656976657220616464726573732063616e6e6f7420626520746865207a60408201526b65726f20616464726573732160a01b606082015260800190565b6020808252601490820152732aaaa4a21031b0b73737ba10313290373ab6361760611b604082015260600190565b6020808252602c908201527f4d65646961746f7220616464726573732063616e6e6f7420626520746865207a60408201526b65726f20616464726573732160a01b606082015260800190565b60208082526031908201527f45787069726174696f6e206d757374206265206174206c6561737420332064616040820152703cb99034b7103a343290333aba3ab9329760791b606082015260800190565b815160808201908260005b60028110156111f05782518252602092830192909101906001016111d1565b5050506020808401516040840160005b60028110156112265782516001600160a01b031682529183019190830190600101611200565b5050505092915050565b600060208252825160a0602084015261124c60c0840182610d87565b905060018060a01b0360208501511660408401526040840151601f198085840301606086015261127c8383610d87565b925060608601519150808584030160808601526112998383610d87565b925060808601519150808584030160a0860152506112b78282610d87565b95945050505050565b604081016106db8284610db3565b6000602082526112e2602083018451610db3565b60208301516060808401526106d76080840182610d87565b60405181810167ffffffffffffffff8111828210171561131957600080fd5b604052919050565b600067ffffffffffffffff821115611337578081fd5b50601f01601f191660200190565b60005b83811015611360578181015183820152602001611348565b8381111561136f576000848401525b50505050565b6001600160a01b038116811461138a57600080fd5b5056fe7475706c6528616464726573732072656365697665722c2061646472657373206d65646961746f722c2075696e7432353620636f6c6c61746572616c2c2075696e743235362065787069726174696f6e2c20627974657333322055554944297475706c65287475706c652875696e7432353620616d6f756e742c206279746573333220555549442920646174612c206279746573207369676e617475726529a26469706673582212200a9140caaba4e9370692fed496d875e3c26bb4de8137ccc404d7542bd100404364736f6c63430007010033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b506004361061007d5760003560e01c80638052474d1161005b5780638052474d146100bd5780638de8b77e146100c55780638ef98a7e146100cd57806394184ba9146100ed5761007d565b80630528aa1c14610082578063206162be146100a05780633722aff9146100b5575b600080fd5b61008a61010d565b6040516100979190610e1c565b60405180910390f35b6100a861018e565b6040516100979190611230565b61008a61039a565b61008a6103b6565b61008a6103db565b6100e06100db366004610ab1565b6103f7565b60405161009791906111c6565b6101006100fb366004610a48565b6105a1565b6040516100979190610df3565b60606101176108cf565b5060408051808201909152600080825260208201526101346108e6565b6040805180820182528381528151604180825260808201909352909160208301919060208201818036833750505090526040519091506101789082906020016112ce565b6040516020818303038152906040529250505090565b610196610906565b6040518060a00160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b1580156101da57600080fd5b505afa1580156101ee573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102169190810190610b47565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561026357600080fd5b505afa158015610277573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261029f9190810190610b47565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b1580156102dd57600080fd5b505afa1580156102f1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103199190810190610b47565b8152602001306001600160a01b0316630528aa1c6040518163ffffffff1660e01b815260040160006040518083038186803b15801561035757600080fd5b505afa15801561036b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103939190810190610b47565b9052905090565b6040518060600160405280604081526020016113ed6040913981565b60405180604001604052806009815260200168496e737572616e636560b81b81525081565b6040518060800160405280605f815260200161138e605f913981565b6103ff61093e565b61040761093e565b61041387890189610b7a565b905061041d610963565b61042986880188610d22565b90506104336108e6565b61043f85870187610c4c565b90506104496108cf565b508051805161045e5783945050505050610597565b826060015142106104755783945050505050610597565b80602001518360800151146104a55760405162461bcd60e51b815260040161049c90611082565b60405180910390fd5b6000816040516020016104b891906112c0565b60405160208183030381529060405280519060200120905060006104e08285602001516106bf565b905084600001516001600160a01b0316816001600160a01b0316141561050e57859650505050505050610597565b84602001516001600160a01b0316816001600160a01b0316146105435760405162461bcd60e51b815260040161049c90610f9c565b855151835111156105665760405162461bcd60e51b815260040161049c90610ed4565b8251865151610574916106e1565b86515282518651602001516105889161072a565b86516020015250939450505050505b9695505050505050565b60006105ab61093e565b6105b785870187610b7a565b90506105c1610963565b6105cd84860186610d22565b825160200151909150156105f35760405162461bcd60e51b815260040161049c90610fd3565b426203f4800181606001511161061b5760405162461bcd60e51b815260040161049c90611175565b80516001600160a01b03166106425760405162461bcd60e51b815260040161049c906110af565b60208101516001600160a01b031661066c5760405162461bcd60e51b815260040161049c90611129565b608081015161068d5760405162461bcd60e51b815260040161049c906110fb565b6001816040015110156106b25760405162461bcd60e51b815260040161049c90610f65565b5060019695505050505050565b6000806106cb8461074f565b90506106d7818461077f565b9150505b92915050565b600061072383836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f7700008152506108a3565b9392505050565b6000828201838110156107235760405162461bcd60e51b815260040161049c90610e9d565b6000816040516020016107629190610dc2565b604051602081830303815290604052805190602001209050919050565b600081516041146107a25760405162461bcd60e51b815260040161049c90610e66565b60208201516040830151606084015160001a7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156107f45760405162461bcd60e51b815260040161049c90610f23565b8060ff16601b1415801561080c57508060ff16601c14155b156108295760405162461bcd60e51b815260040161049c90611040565b60006001878386866040516000815260200160405260405161084e9493929190610dfe565b6020604051602081039080840390855afa158015610870573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166105975760405162461bcd60e51b815260040161049c90610e2f565b600081848411156108c75760405162461bcd60e51b815260040161049c9190610e1c565b505050900390565b604080518082019091526000808252602082015290565b60405180604001604052806108f96108cf565b8152602001606081525090565b6040518060a001604052806060815260200160006001600160a01b031681526020016060815260200160608152602001606081525090565b6040518060400160405280610951610991565b815260200161095e610991565b905290565b6040805160a08101825260008082526020820181905291810182905260608101829052608081019190915290565b60405180604001604052806002906020820280368337509192915050565b60008083601f8401126109c0578182fd5b50813567ffffffffffffffff8111156109d7578182fd5b6020830191508360208285010111156109ef57600080fd5b9250929050565b600082601f830112610a06578081fd5b8151610a19610a1482611321565b6112fa565b9150808252836020828501011115610a3057600080fd5b610a41816020840160208601611345565b5092915050565b60008060008060408587031215610a5d578384fd5b843567ffffffffffffffff80821115610a74578586fd5b610a80888389016109af565b90965094506020870135915080821115610a98578384fd5b50610aa5878288016109af565b95989497509550505050565b60008060008060008060608789031215610ac9578182fd5b863567ffffffffffffffff80821115610ae0578384fd5b610aec8a838b016109af565b90985096506020890135915080821115610b04578384fd5b610b108a838b016109af565b90965094506040890135915080821115610b28578384fd5b50610b3589828a016109af565b979a9699509497509295939492505050565b600060208284031215610b58578081fd5b815167ffffffffffffffff811115610b6e578182fd5b6106d7848285016109f6565b600060808284031215610b8b578081fd5b610b9560406112fa565b83601f840112610ba3578182fd5b610bad60406112fa565b80846040860187811115610bbf578586fd5b855b6002811015610be0578235855260209485019490920191600101610bc1565b5082855287605f880112610bf2578586fd5b610bfc60406112fa565b9350839250905060808601871015610c12578485fd5b845b6002811015610c3d578135610c2881611375565b84526020938401939190910190600101610c14565b50506020830152509392505050565b60006020808385031215610c5e578182fd5b823567ffffffffffffffff80821115610c75578384fd5b908401908186036060811215610c89578485fd5b610c9360406112fa565b6040821215610ca0578586fd5b610caa60406112fa565b84358152858501358682015281526040840135915082821115610ccb578586fd5b818401935087601f850112610cde578586fd5b83359250610cee610a1484611321565b91508282528785848601011115610d03578586fd5b8285850186840137918101840194909452918201929092529392505050565b600060a08284031215610d33578081fd5b610d3d60a06112fa565b8235610d4881611375565b81526020830135610d5881611375565b806020830152506040830135604082015260608301356060820152608083013560808201528091505092915050565b60008151808452610d9f816020860160208601611345565b601f01601f19169290920160200192915050565b80518252602090810151910152565b7f175574696c697479205369676e6564204d6573736167653a0a333200000000008152601b810191909152603b0190565b901515815260200190565b93845260ff9290921660208401526040830152606082015260800190565b6000602082526107236020830184610d87565b60208082526018908201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604082015260600190565b6020808252601f908201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604082015260600190565b6020808252601b908201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604082015260600190565b6020808252602f908201527f43616e6e6f74207472616e73666572206d6f7265207468616e206f726967696e60408201526e30b6363c9030b63637b1b0ba32b21760891b606082015260800190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604082015261756560f01b606082015260800190565b6020808252601a908201527f436f6c6c61746572616c206d757374206265206e6f6e7a65726f000000000000604082015260600190565b60208082526019908201527f5369676e617475726520646964206e6f74207665726966792100000000000000604082015260600190565b60208082526047908201527f43616e6e6f742063726561746520706172616d65746572697a6564207061796d60408201527f656e742077697468206e6f6e7a65726f20726563697069656e7420696e69742060608201526662616c616e636560c81b608082015260a00190565b60208082526022908201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604082015261756560f01b606082015260800190565b6020808252601390820152725555494420646964206e6f74206d617463682160681b604082015260600190565b6020808252602c908201527f526563656976657220616464726573732063616e6e6f7420626520746865207a60408201526b65726f20616464726573732160a01b606082015260800190565b6020808252601490820152732aaaa4a21031b0b73737ba10313290373ab6361760611b604082015260600190565b6020808252602c908201527f4d65646961746f7220616464726573732063616e6e6f7420626520746865207a60408201526b65726f20616464726573732160a01b606082015260800190565b60208082526031908201527f45787069726174696f6e206d757374206265206174206c6561737420332064616040820152703cb99034b7103a343290333aba3ab9329760791b606082015260800190565b815160808201908260005b60028110156111f05782518252602092830192909101906001016111d1565b5050506020808401516040840160005b60028110156112265782516001600160a01b031682529183019190830190600101611200565b5050505092915050565b600060208252825160a0602084015261124c60c0840182610d87565b905060018060a01b0360208501511660408401526040840151601f198085840301606086015261127c8383610d87565b925060608601519150808584030160808601526112998383610d87565b925060808601519150808584030160a0860152506112b78282610d87565b95945050505050565b604081016106db8284610db3565b6000602082526112e2602083018451610db3565b60208301516060808401526106d76080840182610d87565b60405181810167ffffffffffffffff8111828210171561131957600080fd5b604052919050565b600067ffffffffffffffff821115611337578081fd5b50601f01601f191660200190565b60005b83811015611360578181015183820152602001611348565b8381111561136f576000848401525b50505050565b6001600160a01b038116811461138a57600080fd5b5056fe7475706c6528616464726573732072656365697665722c2061646472657373206d65646961746f722c2075696e7432353620636f6c6c61746572616c2c2075696e743235362065787069726174696f6e2c20627974657333322055554944297475706c65287475706c652875696e7432353620616d6f756e742c206279746573333220555549442920646174612c206279746573207369676e617475726529a26469706673582212200a9140caaba4e9370692fed496d875e3c26bb4de8137ccc404d7542bd100404364736f6c63430007010033",
  linkReferences: {},
  deployedLinkReferences: {},
};
