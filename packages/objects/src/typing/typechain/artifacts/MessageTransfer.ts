export default {
  _format: "hh-sol-artifact-1",
  contractName: "MessageTransfer",
  sourceName: "contracts/message/Message.sol",
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
          name: "",
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
      stateMutability: "pure",
      type: "function",
    },
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b5061092c806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638052474d1161005b5780638052474d146100bd5780638de8b77e146100b55780638ef98a7e146100c557806394184ba9146100e55761007d565b80630528aa1c14610082578063206162be146100a05780633722aff9146100b5575b600080fd5b61008a610105565b6040516100979190610770565b60405180910390f35b6100a861014b565b60405161009791906107f4565b61008a610357565b61008a610388565b6100d86100d336600461058b565b6103b3565b604051610097919061078a565b6100f86100f3366004610522565b6103db565b6040516100979190610765565b606061010f6103e5565b50604080518082018252600060208083019182529082529151909161013691839101610884565b60405160208183030381529060405291505090565b6101536103f8565b6040518060a00160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b15801561019757600080fd5b505afa1580156101ab573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101d39190810190610621565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561022057600080fd5b505afa158015610234573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261025c9190810190610621565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b15801561029a57600080fd5b505afa1580156102ae573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102d69190810190610621565b8152602001306001600160a01b0316630528aa1c6040518163ffffffff1660e01b815260040160006040518083038186803b15801561031457600080fd5b505afa158015610328573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103509190810190610621565b9052905090565b604051806040016040528060158152602001747475706c6528737472696e67206d6573736167652960581b81525081565b6040518060400160405280600f81526020016e26b2b9b9b0b3b2aa3930b739b332b960891b81525081565b6103bb610430565b6103c3610430565b6103cf8789018961065c565b98975050505050505050565b6001949350505050565b6040518060200160405280606081525090565b6040518060a001604052806060815260200160006001600160a01b031681526020016060815260200160608152602001606081525090565b6040518060400160405280610443610455565b8152602001610450610455565b905290565b60405180604001604052806002906020820280368337509192915050565b60008083601f840112610484578182fd5b50813567ffffffffffffffff81111561049b578182fd5b6020830191508360208285010111156104b357600080fd5b9250929050565b600082601f8301126104ca578081fd5b815167ffffffffffffffff8111156104e0578182fd5b6104f3601f8201601f191660200161089f565b915080825283602082850101111561050a57600080fd5b61051b8160208401602086016108c6565b5092915050565b60008060008060408587031215610537578384fd5b843567ffffffffffffffff8082111561054e578586fd5b61055a88838901610473565b90965094506020870135915080821115610572578384fd5b5061057f87828801610473565b95989497509550505050565b600080600080600080606087890312156105a3578182fd5b863567ffffffffffffffff808211156105ba578384fd5b6105c68a838b01610473565b909850965060208901359150808211156105de578384fd5b6105ea8a838b01610473565b90965094506040890135915080821115610602578384fd5b5061060f89828a01610473565b979a9699509497509295939492505050565b600060208284031215610632578081fd5b815167ffffffffffffffff811115610648578182fd5b610654848285016104ba565b949350505050565b60006080828403121561066d578081fd5b610677604061089f565b83601f840112610685578182fd5b61068f604061089f565b808460408601878111156106a1578586fd5b855b60028110156106c25782358552602094850194909201916001016106a3565b5082855287605f8801126106d4578586fd5b6106de604061089f565b93508392509050608086018710156106f4578485fd5b845b600281101561072a5781356001600160a01b0381168114610715578687fd5b845260209384019391909101906001016106f6565b50506020830152509392505050565b600081518084526107518160208601602086016108c6565b601f01601f19169290920160200192915050565b901515815260200190565b6000602082526107836020830184610739565b9392505050565b815160808201908260005b60028110156107b4578251825260209283019290910190600101610795565b5050506020808401516040840160005b60028110156107ea5782516001600160a01b0316825291830191908301906001016107c4565b5050505092915050565b600060208252825160a0602084015261081060c0840182610739565b905060018060a01b0360208501511660408401526040840151601f19808584030160608601526108408383610739565b9250606086015191508085840301608086015261085d8383610739565b925060808601519150808584030160a08601525061087b8282610739565b95945050505050565b60006020825282516020808401526106546040840182610739565b60405181810167ffffffffffffffff811182821017156108be57600080fd5b604052919050565b60005b838110156108e15781810151838201526020016108c9565b838111156108f0576000848401525b5050505056fea2646970667358221220e88958002e12fdd5f7be9c7e8bf2c459d9aafd8b265cc8ef73c96e8e1355c0c164736f6c63430007010033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b506004361061007d5760003560e01c80638052474d1161005b5780638052474d146100bd5780638de8b77e146100b55780638ef98a7e146100c557806394184ba9146100e55761007d565b80630528aa1c14610082578063206162be146100a05780633722aff9146100b5575b600080fd5b61008a610105565b6040516100979190610770565b60405180910390f35b6100a861014b565b60405161009791906107f4565b61008a610357565b61008a610388565b6100d86100d336600461058b565b6103b3565b604051610097919061078a565b6100f86100f3366004610522565b6103db565b6040516100979190610765565b606061010f6103e5565b50604080518082018252600060208083019182529082529151909161013691839101610884565b60405160208183030381529060405291505090565b6101536103f8565b6040518060a00160405280306001600160a01b0316638052474d6040518163ffffffff1660e01b815260040160006040518083038186803b15801561019757600080fd5b505afa1580156101ab573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101d39190810190610621565b8152602001306001600160a01b03168152602001306001600160a01b0316638de8b77e6040518163ffffffff1660e01b815260040160006040518083038186803b15801561022057600080fd5b505afa158015610234573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261025c9190810190610621565b8152602001306001600160a01b0316633722aff96040518163ffffffff1660e01b815260040160006040518083038186803b15801561029a57600080fd5b505afa1580156102ae573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102d69190810190610621565b8152602001306001600160a01b0316630528aa1c6040518163ffffffff1660e01b815260040160006040518083038186803b15801561031457600080fd5b505afa158015610328573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526103509190810190610621565b9052905090565b604051806040016040528060158152602001747475706c6528737472696e67206d6573736167652960581b81525081565b6040518060400160405280600f81526020016e26b2b9b9b0b3b2aa3930b739b332b960891b81525081565b6103bb610430565b6103c3610430565b6103cf8789018961065c565b98975050505050505050565b6001949350505050565b6040518060200160405280606081525090565b6040518060a001604052806060815260200160006001600160a01b031681526020016060815260200160608152602001606081525090565b6040518060400160405280610443610455565b8152602001610450610455565b905290565b60405180604001604052806002906020820280368337509192915050565b60008083601f840112610484578182fd5b50813567ffffffffffffffff81111561049b578182fd5b6020830191508360208285010111156104b357600080fd5b9250929050565b600082601f8301126104ca578081fd5b815167ffffffffffffffff8111156104e0578182fd5b6104f3601f8201601f191660200161089f565b915080825283602082850101111561050a57600080fd5b61051b8160208401602086016108c6565b5092915050565b60008060008060408587031215610537578384fd5b843567ffffffffffffffff8082111561054e578586fd5b61055a88838901610473565b90965094506020870135915080821115610572578384fd5b5061057f87828801610473565b95989497509550505050565b600080600080600080606087890312156105a3578182fd5b863567ffffffffffffffff808211156105ba578384fd5b6105c68a838b01610473565b909850965060208901359150808211156105de578384fd5b6105ea8a838b01610473565b90965094506040890135915080821115610602578384fd5b5061060f89828a01610473565b979a9699509497509295939492505050565b600060208284031215610632578081fd5b815167ffffffffffffffff811115610648578182fd5b610654848285016104ba565b949350505050565b60006080828403121561066d578081fd5b610677604061089f565b83601f840112610685578182fd5b61068f604061089f565b808460408601878111156106a1578586fd5b855b60028110156106c25782358552602094850194909201916001016106a3565b5082855287605f8801126106d4578586fd5b6106de604061089f565b93508392509050608086018710156106f4578485fd5b845b600281101561072a5781356001600160a01b0381168114610715578687fd5b845260209384019391909101906001016106f6565b50506020830152509392505050565b600081518084526107518160208601602086016108c6565b601f01601f19169290920160200192915050565b901515815260200190565b6000602082526107836020830184610739565b9392505050565b815160808201908260005b60028110156107b4578251825260209283019290910190600101610795565b5050506020808401516040840160005b60028110156107ea5782516001600160a01b0316825291830191908301906001016107c4565b5050505092915050565b600060208252825160a0602084015261081060c0840182610739565b905060018060a01b0360208501511660408401526040840151601f19808584030160608601526108408383610739565b9250606086015191508085840301608086015261085d8383610739565b925060808601519150808584030160a08601525061087b8282610739565b95945050505050565b60006020825282516020808401526106546040840182610739565b60405181810167ffffffffffffffff811182821017156108be57600080fd5b604052919050565b60005b838110156108e15781810151838201526020016108c9565b838111156108f0576000848401525b5050505056fea2646970667358221220e88958002e12fdd5f7be9c7e8bf2c459d9aafd8b265cc8ef73c96e8e1355c0c164736f6c63430007010033",
  linkReferences: {},
  deployedLinkReferences: {},
};
