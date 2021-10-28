export default {
  _format: "hh-sol-artifact-1",
  contractName: "NonFungibleRegistryEnumerableUpgradeable",
  sourceName: "contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "previousAdmin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newAdmin",
          type: "address",
        },
      ],
      name: "AdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "beacon",
          type: "address",
        },
      ],
      name: "BeaconUpgraded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "label",
          type: "string",
        },
      ],
      name: "LabelUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "registrationData",
          type: "bytes32",
        },
      ],
      name: "StorageUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      name: "Upgraded",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "REGISTRAR_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "REGISTRAR_ROLE_ADMIN",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "allowLabelChange",
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
      name: "allowLazyRegister",
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
      name: "allowStorageUpdate",
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
      name: "allowTransfers",
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
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "recipients",
          type: "address[]",
        },
        {
          internalType: "string[]",
          name: "labels",
          type: "string[]",
        },
        {
          internalType: "string[]",
          name: "registrationDatas",
          type: "string[]",
        },
      ],
      name: "batchRegister",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "burnAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "burnFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "getRoleMember",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleMemberCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasRole",
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
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "identityStakes",
      outputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name_",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol_",
          type: "string",
        },
        {
          internalType: "address",
          name: "_registrar",
          type: "address",
        },
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
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
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "label",
          type: "string",
        },
        {
          internalType: "string",
          name: "registrationData",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      name: "lazyRegister",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "primaryRegistry",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "label",
          type: "string",
        },
        {
          internalType: "string",
          name: "registrationData",
          type: "string",
        },
      ],
      name: "register",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "label",
          type: "string",
        },
        {
          internalType: "string",
          name: "registrationData",
          type: "string",
        },
      ],
      name: "registerByToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "registrationFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "registrationToken",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "registryMap",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "reverseRegistryMap",
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
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "schema",
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
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "encodedParameters",
          type: "bytes",
        },
      ],
      name: "setRegistryParameters",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
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
      name: "symbol",
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
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
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
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "label",
          type: "string",
        },
      ],
      name: "updateLabel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "registrationData",
          type: "string",
        },
      ],
      name: "updateRegistration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
      ],
      name: "upgradeTo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
  bytecode:
    "0x60a06040523060601b6080523480156200001857600080fd5b50600054610100900460ff168062000033575060005460ff16155b6200009b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000be576000805461ffff19166101011790555b8015620000d1576000805461ff00191690555b5060805160601c615bf96200010660003960008181611167015281816111a7015281816114a101526114e10152615bf96000f3fe6080604052600436106102c95760003560e01c806366e7b60611610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a714610944578063f68e955314610965578063f8895cc814610987578063fce589d81461099c57600080fd5b8063ca15c873146108bb578063d547741f146108db578063e985e9c5146108fb57600080fd5b8063a217fddf146107f2578063a22cb46514610807578063b88d4fde14610827578063bb87c1c814610847578063bce8542e14610862578063c87b56dd1461089b57600080fd5b80638daf3f4e1161012e5780638daf3f4e1461073d5780638f15b4141461075d5780639010d07c1461077d57806391d148541461079d57806393d0da07146107bd57806395d89b41146107dd57600080fd5b806366e7b6061461067b5780636f4c25aa1461069b5780637092d9ea146106bc57806370a08231146106dc57806370d5ae05146106fc5780638d59cc021461071d57600080fd5b806336568abe116102345780634b08b0a3116101ed5780635471a057116101c75780635471a057146105e757806358083969146106075780636017160b1461063b5780636352211e1461065b57600080fd5b80634b08b0a31461058b5780634f1ef286146105b45780634f6ccce7146105c757600080fd5b806336568abe1461048b5780633659cfe6146104ab57806338f292d5146104cb57806342842e0e1461052b57806342966c681461054b57806347f00d5a1461056b57600080fd5b806318160ddd1161028657806318160ddd146103c45780632185810b146103d957806323b872dd146103fb578063248a9ca31461041b5780632f2ff15d1461044b5780632f745c591461046b57600080fd5b806301ffc9a7146102ce57806306fdde0314610303578063081812fc14610325578063095ea7b31461035d5780630ecf9dfd1461037f57806314c44e091461039f575b600080fd5b3480156102da57600080fd5b506102ee6102e93660046151c2565b6109b3565b60405190151581526020015b60405180910390f35b34801561030f57600080fd5b506103186109c4565b6040516102fa919061567e565b34801561033157600080fd5b50610345610340366004615167565b610a56565b6040516001600160a01b0390911681526020016102fa565b34801561036957600080fd5b5061037d61037836600461509f565b610ae3565b005b34801561038b57600080fd5b5061037d61039a366004614ff9565b610bf9565b3480156103ab57600080fd5b506103b66101c85481565b6040519081526020016102fa565b3480156103d057600080fd5b5060fd546103b6565b3480156103e557600080fd5b506101c7546102ee906301000000900460ff1681565b34801561040757600080fd5b5061037d610416366004614e5b565b61102b565b34801561042757600080fd5b506103b6610436366004615167565b60009081526065602052604090206001015490565b34801561045757600080fd5b5061037d61046636600461517f565b611082565b34801561047757600080fd5b506103b661048636600461509f565b6110a4565b34801561049757600080fd5b5061037d6104a636600461517f565b61113a565b3480156104b757600080fd5b5061037d6104c6366004614e0f565b61115c565b3480156104d757600080fd5b5061050c6104e6366004615167565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102fa565b34801561053757600080fd5b5061037d610546366004614e5b565b611225565b34801561055757600080fd5b5061037d610566366004615167565b611240565b34801561057757600080fd5b5061037d6105863660046154ae565b61135b565b34801561059757600080fd5b506101c7546103459064010000000090046001600160a01b031681565b61037d6105c2366004614f31565b611496565b3480156105d357600080fd5b506103b66105e2366004615167565b611550565b3480156105f357600080fd5b506101c7546102ee90610100900460ff1681565b34801561061357600080fd5b506103b67fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b34801561064757600080fd5b50610318610656366004615167565b6115f1565b34801561066757600080fd5b50610345610676366004615167565b61168c565b34801561068757600080fd5b5061037d6106963660046150c8565b611703565b3480156106a757600080fd5b506101c7546102ee9062010000900460ff1681565b3480156106c857600080fd5b5061037d6106d7366004614f7c565b6118f5565b3480156106e857600080fd5b506103b66106f7366004614e0f565b611c24565b34801561070857600080fd5b506101c954610345906001600160a01b031681565b34801561072957600080fd5b5061037d610738366004614f7c565b611cab565b34801561074957600080fd5b5061037d6107583660046151fa565b611d5b565b34801561076957600080fd5b5061037d61077836600461526b565b612328565b34801561078957600080fd5b506103456107983660046151a1565b6124a3565b3480156107a957600080fd5b506102ee6107b836600461517f565b6124c2565b3480156107c957600080fd5b5061037d6107d83660046154ae565b6124ed565b3480156107e957600080fd5b5061031861264f565b3480156107fe57600080fd5b506103b6600081565b34801561081357600080fd5b5061037d610822366004614efb565b61265e565b34801561083357600080fd5b5061037d610842366004614e96565b612723565b34801561085357600080fd5b506101c7546102ee9060ff1681565b34801561086e57600080fd5b506103b661087d366004615239565b80516020818301810180516101c48252928201919093012091525481565b3480156108a757600080fd5b506103186108b6366004615167565b61277a565b3480156108c757600080fd5b506103b66108d6366004615167565b612785565b3480156108e757600080fd5b5061037d6108f636600461517f565b61279c565b34801561090757600080fd5b506102ee610916366004614e29565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561095057600080fd5b506101cb54610345906001600160a01b031681565b34801561097157600080fd5b506103b6600080516020615ba483398151915281565b34801561099357600080fd5b506103186127a6565b3480156109a857600080fd5b506103b66101ca5481565b60006109be826127b4565b92915050565b606060c980546109d390615aac565b80601f01602080910402602001604051908101604052809291908181526020018280546109ff90615aac565b8015610a4c5780601f10610a2157610100808354040283529160200191610a4c565b820191906000526020600020905b815481529060010190602001808311610a2f57829003601f168201915b5050505050905090565b6000610a61826127d9565b610ac75760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610aee8261168c565b9050806001600160a01b0316836001600160a01b03161415610b5c5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610abe565b336001600160a01b0382161480610b785750610b788133610916565b610bea5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610abe565b610bf483836127f6565b505050565b6101c75460ff16610c685760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610abe565b610c7187612864565b610c8d5760405162461bcd60e51b8152600401610abe906158e1565b6101c75462010000900460ff1615610d205760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610abe565b84610d895760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610abe565b610dc886868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061290192505050565b15610e3b5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610abe565b336001600160a01b03881614610ea95760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610abe565b610f518787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061292c92505050565b610fad5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610abe565b6110218787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b0181900481028201810190925289815292508991508890819084018382808284376000920191909152506129d192505050565b5050505050505050565b611036335b82612a60565b6110525760405162461bcd60e51b8152600401610abe906157c9565b61105b82612864565b6110775760405162461bcd60e51b8152600401610abe906158e1565b610bf4838383612b60565b61108c8282612d0b565b6000828152609760205260409020610bf49082612d31565b60006110af83611c24565b82106111115760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610abe565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6111448282612d46565b6000828152609760205260409020610bf49082612dc0565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111a55760405162461bcd60e51b8152600401610abe906156e3565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166111d7612dd5565b6001600160a01b0316146111fd5760405162461bcd60e51b8152600401610abe9061572f565b61120681612e03565b6040805160008082526020820190925261122291839190612e1c565b50565b610bf483838360405180602001604052806000815250612723565b61124933611030565b6112655760405162461bcd60e51b8152600401610abe906157c9565b61126e81612f60565b60008181526101c66020526040902060010154156112225760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156112ff57600080fd5b505af1158015611313573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611337919061514b565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b611363613045565b6113ca5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610abe565b6113d5335b84612a60565b6113f15760405162461bcd60e51b8152600401610abe906157c9565b6114318383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061307792505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f483838360405160200161146692919061558d565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156114df5760405162461bcd60e51b8152600401610abe906156e3565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316611511612dd5565b6001600160a01b0316146115375760405162461bcd60e51b8152600401610abe9061572f565b61154082612e03565b61154c82826001612e1c565b5050565b600061155b60fd5490565b82106115be5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610abe565b60fd82815481106115df57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c5602052600090815260409020805461160b90615aac565b80601f016020809104026020016040519081016040528092919081815260200182805461163790615aac565b80156116845780601f1061165957610100808354040283529160200191611684565b820191906000526020600020905b81548152906001019060200180831161166757829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109be5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610abe565b61171b600080516020615ba4833981519152336124c2565b6117375760405162461bcd60e51b8152600401610abe90615833565b81518351146117c15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610abe565b81518151146118525760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610abe565b60005b83518110156118ef576118de84828151811061188157634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106118a957634e487b7160e01b600052603260045260246000fd5b60200260200101518484815181106118d157634e487b7160e01b600052603260045260246000fd5b60200260200101516129d1565b506118e881615ae7565b9050611855565b50505050565b6101c75464010000000090046001600160a01b031661197c5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610abe565b6119bb84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061290192505050565b156119d85760405162461bcd60e51b8152600401610abe90615890565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015611a4357600080fd5b505af1158015611a57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a7b919061514b565b506000611af28686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a0181900481028201810190925288815292508891508790819084018382808284376000920191909152506129d192505050565b905060006127106101ca546101c854611b0b9190615a33565b611b159190615a1f565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611b7257600080fd5b505af1158015611b86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611baa919061514b565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611be0908490615a52565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611c8f5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610abe565b506001600160a01b0316600090815260cc602052604090205490565b611cc3600080516020615ba4833981519152336124c2565b611cdf5760405162461bcd60e51b8152600401610abe90615833565b611d538585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f890181900481028201810190925287815292508791508690819084018382808284376000920191909152506129d192505050565b505050505050565b611d73600080516020615ba4833981519152336124c2565b611dcf5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610abe565b6000611ddd828401846152ec565b80515190915015611e295780518051600090611e0957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611e27929190614a4f565b505b60208101515115611e7c578060200151600081518110611e5957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b60408101515115611ecf578060400151600081518110611eac57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b60608101515115611f22578060600151600081518110611eff57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b60808101515115611f75578060800151600081518110611f5257634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b60a08101515115611fd5578060a00151600081518110611fa557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115612015578060c0015160008151811061200557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b60e08101515115612075578060e0015160008151811061204557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b61010081015151156121a0576127108161010001516000815181106120aa57634e487b7160e01b600052603260045260246000fd5b6020026020010151111580156120ee575060008161010001516000815181106120e357634e487b7160e01b600052603260045260246000fd5b602002602001015110155b61216a5760405162461bcd60e51b815260206004820152604160248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201527f74206265206765207468616e203020616e64206c65207468616e2031303030306064820152601760f91b608482015260a401610abe565b80610100015160008151811061219057634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b6101208101515115610bf4578061012001516000815181106121d257634e487b7160e01b600052603260045260246000fd5b60209081029190910101516040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b03909116906301ffc9a79060240160206040518083038186803b15801561222457600080fd5b505afa158015612238573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061225c919061514b565b6122ce5760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610abe565b8061012001516000815181106122f457634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff1680612341575060005460ff16155b61235d5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff1615801561237f576000805461ffff19166101011790555b612387613103565b61238f613176565b6123976131e5565b61239f6131e5565b6123a7613243565b6123b185856132a1565b6123bc600083613328565b6123d4600080516020615ba483398151915284613328565b61240c600080516020615ba48339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba613332565b6124367fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba84613328565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb80549091169055801561249c576000805461ff00191690555b5050505050565b60008281526097602052604081206124bb908361337d565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6124f5613389565b61255a5760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610abe565b612563336113cf565b61257f5760405162461bcd60e51b8152600401610abe906157c9565b6125be82828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061290192505050565b156125db5760405162461bcd60e51b8152600401610abe90615890565b826101c483836040516125ef92919061558d565b90815260408051602092819003830190209290925560008581526101c59091522061261b908383614ad3565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161148993929190615955565b606060ca80546109d390615aac565b6001600160a01b0382163314156126b75760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610abe565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61272d3383612a60565b6127495760405162461bcd60e51b8152600401610abe906157c9565b61275283612864565b61276e5760405162461bcd60e51b8152600401610abe906158e1565b6118ef848484846133b7565b60606109be826133ea565b60008181526097602052604081206109be9061355a565b6111448282613564565b6101c3805461160b90615aac565b60006001600160e01b0319821663780e9d6360e01b14806109be57506109be8261358a565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b038416908117909155819061282b8261168c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b031615806109be57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b1580156128c257600080fd5b505afa1580156128d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128fa9190615496565b1192915050565b60006101c4826040516129149190615571565b90815260405190819003602001902054151592915050565b6000806129a786868660405160200161294793929190615523565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b90506129c5600080516020615ba48339815191526107b883866135ca565b9150505b949350505050565b815160009015612a56576129e483612901565b15612a015760405162461bcd60e51b8152600401610abe90615890565b612a0b84836135ee565b9050806101c484604051612a1f9190615571565b90815260408051602092819003830190209290925560008381526101c58252919091208451612a5092860190614a4f565b506124bb565b6129c984836135ee565b6000612a6b826127d9565b612acc5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610abe565b6000612ad78361168c565b9050806001600160a01b0316846001600160a01b03161480612b125750836001600160a01b0316612b0784610a56565b6001600160a01b0316145b80612b4257506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806129c957506129c9600080516020615ba4833981519152856124c2565b826001600160a01b0316612b738261168c565b6001600160a01b031614612bdb5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610abe565b6001600160a01b038216612c3d5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610abe565b612c48838383613649565b612c536000826127f6565b6001600160a01b038316600090815260cc60205260408120805460019290612c7c908490615a52565b90915550506001600160a01b038216600090815260cc60205260408120805460019290612caa908490615a07565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612d2781336136bd565b610bf48383613721565b60006124bb836001600160a01b0384166137a7565b6001600160a01b0381163314612db65760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610abe565b61154c82826137f6565b60006124bb836001600160a01b03841661385d565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b600080516020615ba483398151915261154c81336136bd565b6000612e26612dd5565b9050612e318461397a565b600083511180612e3e5750815b15612e4f57612e4d8484613a1f565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff1661249c57805460ff191660011781556040516001600160a01b0383166024820152612ece90869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613a1f565b50805460ff19168155612edf612dd5565b6001600160a01b0316826001600160a01b031614612f575760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610abe565b61249c85613b0a565b612f6981613b4a565b60008181526101c5602052604081208054612f8390615aac565b80601f0160208091040260200160405190810160405280929190818152602001828054612faf90615aac565b8015612ffc5780601f10612fd157610100808354040283529160200191612ffc565b820191906000526020600020905b815481529060010190602001808311612fdf57829003601f168201915b50505060008581526101c56020526040812093945061301e9392509050614b47565b6101c48160405161302f9190615571565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff16806130725750613072600080516020615ba4833981519152336124c2565b905090565b613080826127d9565b6130e35760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610abe565b600082815261012d602090815260409091208251610bf492840190614a4f565b600054610100900460ff168061311c575060005460ff16155b6131385760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff1615801561315a576000805461ffff19166101011790555b613162613b8c565b8015611222576000805461ff001916905550565b600054610100900460ff168061318f575060005460ff16155b6131ab5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156131cd576000805461ffff19166101011790555b6131d5613b8c565b6131dd613b8c565b61315a613b8c565b600054610100900460ff16806131fe575060005460ff16155b61321a5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156131d5576000805461ffff19166101011790556131dd613b8c565b600054610100900460ff168061325c575060005460ff16155b6132785760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156131dd576000805461ffff191661010117905561315a613b8c565b600054610100900460ff16806132ba575060005460ff16155b6132d65760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156132f8576000805461ffff19166101011790555b613300613b8c565b613308613b8c565b6133128383613bf6565b8015610bf4576000805461ff0019169055505050565b61108c8282613c8b565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006124bb8383613c95565b6101c75460009062010000900460ff16806130725750613072600080516020615ba4833981519152336124c2565b6133c2848484612b60565b6133ce84848484613ccd565b6118ef5760405162461bcd60e51b8152600401610abe90615691565b60606133f5826127d9565b61345b5760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610abe565b600082815261012d60205260408120805461347590615aac565b80601f01602080910402602001604051908101604052809291908181526020018280546134a190615aac565b80156134ee5780601f106134c3576101008083540402835291602001916134ee565b820191906000526020600020905b8154815290600101906020018083116134d157829003601f168201915b50505050509050600061350c60408051602081019091526000815290565b905080516000141561351f575092915050565b81511561355157808260405160200161353992919061559d565b60405160208183030381529060405292505050919050565b6129c984613dd7565b60006109be825490565b60008281526065602052604090206001015461358081336136bd565b610bf483836137f6565b60006001600160e01b031982166380ac58cd60e01b14806135bb57506001600160e01b03198216635b5e139f60e01b145b806109be57506109be82613eae565b60008060006135d98585613ed3565b915091506135e681613f43565b509392505050565b60006135f983612864565b6136155760405162461bcd60e51b8152600401610abe906158e1565b6101cc54613624906001615a07565b90506136308382614144565b61363f6101cc80546001019055565b6109be8183613077565b613651614283565b6136b25760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610abe565b610bf48383836142b2565b6136c782826124c2565b61154c576136df816001600160a01b0316601461436a565b6136ea83602061436a565b6040516020016136fb9291906155cc565b60408051601f198184030181529082905262461bcd60e51b8252610abe9160040161567e565b61372b82826124c2565b61154c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556137633390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008181526001830160205260408120546137ee575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556109be565b5060006109be565b61380082826124c2565b1561154c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008181526001830160205260408120548015613970576000613881600183615a52565b855490915060009061389590600190615a52565b90508181146139165760008660000182815481106138c357634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106138f457634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061393557634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506109be565b60009150506109be565b803b6139de5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610abe565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b613a7e5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610abe565b600080846001600160a01b031684604051613a999190615571565b600060405180830381855af49150503d8060008114613ad4576040519150601f19603f3d011682016040523d82523d6000602084013e613ad9565b606091505b5091509150613b018282604051806060016040528060278152602001615b7d6027913961454b565b95945050505050565b613b138161397a565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b613b5381614584565b600081815261012d602052604090208054613b6d90615aac565b15905061122257600081815261012d6020526040812061122291614b47565b600054610100900460ff1680613ba5575060005460ff16155b613bc15760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff16158015613162576000805461ffff19166101011790558015611222576000805461ff001916905550565b600054610100900460ff1680613c0f575060005460ff16155b613c2b5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff16158015613c4d576000805461ffff19166101011790555b8251613c609060c9906020860190614a4f565b508151613c749060ca906020850190614a4f565b508015610bf4576000805461ff0019169055505050565b61154c8282613721565b6000826000018281548110613cba57634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613dcf57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613d11903390899088908890600401615641565b602060405180830381600087803b158015613d2b57600080fd5b505af1925050508015613d5b575060408051601f3d908101601f19168201909252613d58918101906151de565b60015b613db5573d808015613d89576040519150601f19603f3d011682016040523d82523d6000602084013e613d8e565b606091505b508051613dad5760405162461bcd60e51b8152600401610abe90615691565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506129c9565b5060016129c9565b6060613de2826127d9565b613e465760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610abe565b6000613e5d60408051602081019091526000815290565b90506000815111613e7d57604051806020016040528060008152506124bb565b80613e878461462b565b604051602001613e9892919061559d565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b14806109be57506109be82614744565b600080825160411415613f0a5760208301516040840151606085015160001a613efe87828585614779565b94509450505050613f3c565b825160401415613f345760208301516040840151613f29868383614866565b935093505050613f3c565b506000905060025b9250929050565b6000816004811115613f6557634e487b7160e01b600052602160045260246000fd5b1415613f6e5750565b6001816004811115613f9057634e487b7160e01b600052602160045260246000fd5b1415613fde5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610abe565b600281600481111561400057634e487b7160e01b600052602160045260246000fd5b141561404e5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610abe565b600381600481111561407057634e487b7160e01b600052602160045260246000fd5b14156140c95760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610abe565b60048160048111156140eb57634e487b7160e01b600052602160045260246000fd5b14156112225760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610abe565b6001600160a01b03821661419a5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610abe565b6141a3816127d9565b156141f05760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610abe565b6141fc60008383613649565b6001600160a01b038216600090815260cc60205260408120805460019290614225908490615a07565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff16806130725750613072600080516020615ba4833981519152336124c2565b6001600160a01b03831661430d576143088160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b614330565b816001600160a01b0316836001600160a01b031614614330576143308382614895565b6001600160a01b03821661434757610bf481614932565b826001600160a01b0316826001600160a01b031614610bf457610bf48282614a0b565b60606000614379836002615a33565b614384906002615a07565b6001600160401b038111156143a957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156143d3576020820181803683370190505b509050600360fc1b816000815181106143fc57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061443957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600061445d846002615a33565b614468906001615a07565b90505b60018111156144fc576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106144aa57634e487b7160e01b600052603260045260246000fd5b1a60f81b8282815181106144ce57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936144f581615a95565b905061446b565b5083156124bb5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610abe565b6060831561455a5750816124bb565b82511561456a5782518084602001fd5b8160405162461bcd60e51b8152600401610abe919061567e565b600061458f8261168c565b905061459d81600084613649565b6145a86000836127f6565b6001600160a01b038116600090815260cc602052604081208054600192906145d1908490615a52565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60608161464f5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115614679578061466381615ae7565b91506146729050600a83615a1f565b9150614653565b6000816001600160401b038111156146a157634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156146cb576020820181803683370190505b5090505b84156129c9576146e0600183615a52565b91506146ed600a86615b02565b6146f8906030615a07565b60f81b81838151811061471b57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535061473d600a86615a1f565b94506146cf565b60006001600160e01b03198216637965db0b60e01b14806109be57506301ffc9a760e01b6001600160e01b03198316146109be565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156147b0575060009050600361485d565b8460ff16601b141580156147c857508460ff16601c14155b156147d9575060009050600461485d565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561482d573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166148565760006001925092505061485d565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161488787828885614779565b935093505050935093915050565b600060016148a284611c24565b6148ac9190615a52565b600083815260fc60205260409020549091508082146148ff576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061494490600190615a52565b600083815260fe602052604081205460fd805493945090928490811061497a57634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106149a957634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd8054806149ef57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000614a1683611c24565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614a5b90615aac565b90600052602060002090601f016020900481019282614a7d5760008555614ac3565b82601f10614a9657805160ff1916838001178555614ac3565b82800160010185558215614ac3579182015b82811115614ac3578251825591602001919060010190614aa8565b50614acf929150614b7d565b5090565b828054614adf90615aac565b90600052602060002090601f016020900481019282614b015760008555614ac3565b82601f10614b1a5782800160ff19823516178555614ac3565b82800160010185558215614ac3579182015b82811115614ac3578235825591602001919060010190614b2c565b508054614b5390615aac565b6000825580601f10614b63575050565b601f01602090049060005260206000209081019061122291905b5b80821115614acf5760008155600101614b7e565b80356001600160a01b0381168114614ba957600080fd5b919050565b600082601f830112614bbe578081fd5b81356020614bd3614bce836159e4565b6159b4565b80838252828201915082860187848660051b8901011115614bf2578586fd5b855b85811015614c1757614c0582614b92565b84529284019290840190600101614bf4565b5090979650505050505050565b600082601f830112614c34578081fd5b81356020614c44614bce836159e4565b80838252828201915082860187848660051b8901011115614c63578586fd5b855b85811015614c17578135614c7881615b58565b84529284019290840190600101614c65565b600082601f830112614c9a578081fd5b81356020614caa614bce836159e4565b80838252828201915082860187848660051b8901011115614cc9578586fd5b855b85811015614c175781356001600160401b03811115614ce8578788fd5b614cf68a87838c0101614da5565b8552509284019290840190600101614ccb565b600082601f830112614d19578081fd5b81356020614d29614bce836159e4565b80838252828201915082860187848660051b8901011115614d48578586fd5b855b85811015614c1757813584529284019290840190600101614d4a565b60008083601f840112614d77578182fd5b5081356001600160401b03811115614d8d578182fd5b602083019150836020828501011115613f3c57600080fd5b600082601f830112614db5578081fd5b81356001600160401b03811115614dce57614dce615b42565b614de1601f8201601f19166020016159b4565b818152846020838601011115614df5578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614e20578081fd5b6124bb82614b92565b60008060408385031215614e3b578081fd5b614e4483614b92565b9150614e5260208401614b92565b90509250929050565b600080600060608486031215614e6f578081fd5b614e7884614b92565b9250614e8660208501614b92565b9150604084013590509250925092565b60008060008060808587031215614eab578182fd5b614eb485614b92565b9350614ec260208601614b92565b92506040850135915060608501356001600160401b03811115614ee3578182fd5b614eef87828801614da5565b91505092959194509250565b60008060408385031215614f0d578182fd5b614f1683614b92565b91506020830135614f2681615b58565b809150509250929050565b60008060408385031215614f43578182fd5b614f4c83614b92565b915060208301356001600160401b03811115614f66578182fd5b614f7285828601614da5565b9150509250929050565b600080600080600060608688031215614f93578283fd5b614f9c86614b92565b945060208601356001600160401b0380821115614fb7578485fd5b614fc389838a01614d66565b90965094506040880135915080821115614fdb578283fd5b50614fe888828901614d66565b969995985093965092949392505050565b60008060008060008060006080888a031215615013578485fd5b61501c88614b92565b965060208801356001600160401b0380821115615037578687fd5b6150438b838c01614d66565b909850965060408a013591508082111561505b578384fd5b6150678b838c01614d66565b909650945060608a013591508082111561507f578384fd5b5061508c8a828b01614d66565b989b979a50959850939692959293505050565b600080604083850312156150b1578182fd5b6150ba83614b92565b946020939093013593505050565b6000806000606084860312156150dc578081fd5b83356001600160401b03808211156150f2578283fd5b6150fe87838801614bae565b94506020860135915080821115615113578283fd5b61511f87838801614c8a565b93506040860135915080821115615134578283fd5b5061514186828701614c8a565b9150509250925092565b60006020828403121561515c578081fd5b81516124bb81615b58565b600060208284031215615178578081fd5b5035919050565b60008060408385031215615191578182fd5b82359150614e5260208401614b92565b600080604083850312156151b3578182fd5b50508035926020909101359150565b6000602082840312156151d3578081fd5b81356124bb81615b66565b6000602082840312156151ef578081fd5b81516124bb81615b66565b6000806020838503121561520c578182fd5b82356001600160401b03811115615221578283fd5b61522d85828601614d66565b90969095509350505050565b60006020828403121561524a578081fd5b81356001600160401b0381111561525f578182fd5b6129c984828501614da5565b60008060008060808587031215615280578182fd5b84356001600160401b0380821115615296578384fd5b6152a288838901614da5565b955060208701359150808211156152b7578384fd5b506152c487828801614da5565b9350506152d360408601614b92565b91506152e160608601614b92565b905092959194509250565b6000602082840312156152fd578081fd5b81356001600160401b0380821115615313578283fd5b908301906101408286031215615327578283fd5b61532f61598b565b82358281111561533d578485fd5b61534987828601614c8a565b82525060208301358281111561535d578485fd5b61536987828601614c24565b602083015250604083013582811115615380578485fd5b61538c87828601614c24565b6040830152506060830135828111156153a3578485fd5b6153af87828601614c24565b6060830152506080830135828111156153c6578485fd5b6153d287828601614c24565b60808301525060a0830135828111156153e9578485fd5b6153f587828601614bae565b60a08301525060c08301358281111561540c578485fd5b61541887828601614d09565b60c08301525060e08301358281111561542f578485fd5b61543b87828601614bae565b60e0830152506101008084013583811115615454578586fd5b61546088828701614d09565b8284015250506101208084013583811115615479578586fd5b61548588828701614bae565b918301919091525095945050505050565b6000602082840312156154a7578081fd5b5051919050565b6000806000604084860312156154c2578081fd5b8335925060208401356001600160401b038111156154de578182fd5b6154ea86828701614d66565b9497909650939450505050565b6000815180845261550f816020860160208601615a69565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b1681526000835161554d816014850160208801615a69565b835190830190615564816014840160208801615a69565b0160140195945050505050565b60008251615583818460208701615a69565b9190910192915050565b8183823760009101908152919050565b600083516155af818460208801615a69565b8351908301906155c3818360208801615a69565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351615604816017850160208801615a69565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351615635816028840160208801615a69565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090615674908301846154f7565b9695505050505050565b6020815260006124bb60208301846154f7565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b03811182821017156159ae576159ae615b42565b60405290565b604051601f8201601f191681016001600160401b03811182821017156159dc576159dc615b42565b604052919050565b60006001600160401b038211156159fd576159fd615b42565b5060051b60200190565b60008219821115615a1a57615a1a615b16565b500190565b600082615a2e57615a2e615b2c565b500490565b6000816000190483118215151615615a4d57615a4d615b16565b500290565b600082821015615a6457615a64615b16565b500390565b60005b83811015615a84578181015183820152602001615a6c565b838111156118ef5750506000910152565b600081615aa457615aa4615b16565b506000190190565b600181811c90821680615ac057607f821691505b60208210811415615ae157634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415615afb57615afb615b16565b5060010190565b600082615b1157615b11615b2c565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461122257600080fd5b6001600160e01b03198116811461122257600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220ba3b441a525af6790f1309b81ce054779ea3c5d2b870c4a97d116bb68f56755864736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102c95760003560e01c806366e7b60611610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a714610944578063f68e955314610965578063f8895cc814610987578063fce589d81461099c57600080fd5b8063ca15c873146108bb578063d547741f146108db578063e985e9c5146108fb57600080fd5b8063a217fddf146107f2578063a22cb46514610807578063b88d4fde14610827578063bb87c1c814610847578063bce8542e14610862578063c87b56dd1461089b57600080fd5b80638daf3f4e1161012e5780638daf3f4e1461073d5780638f15b4141461075d5780639010d07c1461077d57806391d148541461079d57806393d0da07146107bd57806395d89b41146107dd57600080fd5b806366e7b6061461067b5780636f4c25aa1461069b5780637092d9ea146106bc57806370a08231146106dc57806370d5ae05146106fc5780638d59cc021461071d57600080fd5b806336568abe116102345780634b08b0a3116101ed5780635471a057116101c75780635471a057146105e757806358083969146106075780636017160b1461063b5780636352211e1461065b57600080fd5b80634b08b0a31461058b5780634f1ef286146105b45780634f6ccce7146105c757600080fd5b806336568abe1461048b5780633659cfe6146104ab57806338f292d5146104cb57806342842e0e1461052b57806342966c681461054b57806347f00d5a1461056b57600080fd5b806318160ddd1161028657806318160ddd146103c45780632185810b146103d957806323b872dd146103fb578063248a9ca31461041b5780632f2ff15d1461044b5780632f745c591461046b57600080fd5b806301ffc9a7146102ce57806306fdde0314610303578063081812fc14610325578063095ea7b31461035d5780630ecf9dfd1461037f57806314c44e091461039f575b600080fd5b3480156102da57600080fd5b506102ee6102e93660046151c2565b6109b3565b60405190151581526020015b60405180910390f35b34801561030f57600080fd5b506103186109c4565b6040516102fa919061567e565b34801561033157600080fd5b50610345610340366004615167565b610a56565b6040516001600160a01b0390911681526020016102fa565b34801561036957600080fd5b5061037d61037836600461509f565b610ae3565b005b34801561038b57600080fd5b5061037d61039a366004614ff9565b610bf9565b3480156103ab57600080fd5b506103b66101c85481565b6040519081526020016102fa565b3480156103d057600080fd5b5060fd546103b6565b3480156103e557600080fd5b506101c7546102ee906301000000900460ff1681565b34801561040757600080fd5b5061037d610416366004614e5b565b61102b565b34801561042757600080fd5b506103b6610436366004615167565b60009081526065602052604090206001015490565b34801561045757600080fd5b5061037d61046636600461517f565b611082565b34801561047757600080fd5b506103b661048636600461509f565b6110a4565b34801561049757600080fd5b5061037d6104a636600461517f565b61113a565b3480156104b757600080fd5b5061037d6104c6366004614e0f565b61115c565b3480156104d757600080fd5b5061050c6104e6366004615167565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102fa565b34801561053757600080fd5b5061037d610546366004614e5b565b611225565b34801561055757600080fd5b5061037d610566366004615167565b611240565b34801561057757600080fd5b5061037d6105863660046154ae565b61135b565b34801561059757600080fd5b506101c7546103459064010000000090046001600160a01b031681565b61037d6105c2366004614f31565b611496565b3480156105d357600080fd5b506103b66105e2366004615167565b611550565b3480156105f357600080fd5b506101c7546102ee90610100900460ff1681565b34801561061357600080fd5b506103b67fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b34801561064757600080fd5b50610318610656366004615167565b6115f1565b34801561066757600080fd5b50610345610676366004615167565b61168c565b34801561068757600080fd5b5061037d6106963660046150c8565b611703565b3480156106a757600080fd5b506101c7546102ee9062010000900460ff1681565b3480156106c857600080fd5b5061037d6106d7366004614f7c565b6118f5565b3480156106e857600080fd5b506103b66106f7366004614e0f565b611c24565b34801561070857600080fd5b506101c954610345906001600160a01b031681565b34801561072957600080fd5b5061037d610738366004614f7c565b611cab565b34801561074957600080fd5b5061037d6107583660046151fa565b611d5b565b34801561076957600080fd5b5061037d61077836600461526b565b612328565b34801561078957600080fd5b506103456107983660046151a1565b6124a3565b3480156107a957600080fd5b506102ee6107b836600461517f565b6124c2565b3480156107c957600080fd5b5061037d6107d83660046154ae565b6124ed565b3480156107e957600080fd5b5061031861264f565b3480156107fe57600080fd5b506103b6600081565b34801561081357600080fd5b5061037d610822366004614efb565b61265e565b34801561083357600080fd5b5061037d610842366004614e96565b612723565b34801561085357600080fd5b506101c7546102ee9060ff1681565b34801561086e57600080fd5b506103b661087d366004615239565b80516020818301810180516101c48252928201919093012091525481565b3480156108a757600080fd5b506103186108b6366004615167565b61277a565b3480156108c757600080fd5b506103b66108d6366004615167565b612785565b3480156108e757600080fd5b5061037d6108f636600461517f565b61279c565b34801561090757600080fd5b506102ee610916366004614e29565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561095057600080fd5b506101cb54610345906001600160a01b031681565b34801561097157600080fd5b506103b6600080516020615ba483398151915281565b34801561099357600080fd5b506103186127a6565b3480156109a857600080fd5b506103b66101ca5481565b60006109be826127b4565b92915050565b606060c980546109d390615aac565b80601f01602080910402602001604051908101604052809291908181526020018280546109ff90615aac565b8015610a4c5780601f10610a2157610100808354040283529160200191610a4c565b820191906000526020600020905b815481529060010190602001808311610a2f57829003601f168201915b5050505050905090565b6000610a61826127d9565b610ac75760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610aee8261168c565b9050806001600160a01b0316836001600160a01b03161415610b5c5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610abe565b336001600160a01b0382161480610b785750610b788133610916565b610bea5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610abe565b610bf483836127f6565b505050565b6101c75460ff16610c685760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610abe565b610c7187612864565b610c8d5760405162461bcd60e51b8152600401610abe906158e1565b6101c75462010000900460ff1615610d205760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610abe565b84610d895760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610abe565b610dc886868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061290192505050565b15610e3b5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610abe565b336001600160a01b03881614610ea95760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610abe565b610f518787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061292c92505050565b610fad5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610abe565b6110218787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b0181900481028201810190925289815292508991508890819084018382808284376000920191909152506129d192505050565b5050505050505050565b611036335b82612a60565b6110525760405162461bcd60e51b8152600401610abe906157c9565b61105b82612864565b6110775760405162461bcd60e51b8152600401610abe906158e1565b610bf4838383612b60565b61108c8282612d0b565b6000828152609760205260409020610bf49082612d31565b60006110af83611c24565b82106111115760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610abe565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6111448282612d46565b6000828152609760205260409020610bf49082612dc0565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111a55760405162461bcd60e51b8152600401610abe906156e3565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166111d7612dd5565b6001600160a01b0316146111fd5760405162461bcd60e51b8152600401610abe9061572f565b61120681612e03565b6040805160008082526020820190925261122291839190612e1c565b50565b610bf483838360405180602001604052806000815250612723565b61124933611030565b6112655760405162461bcd60e51b8152600401610abe906157c9565b61126e81612f60565b60008181526101c66020526040902060010154156112225760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156112ff57600080fd5b505af1158015611313573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611337919061514b565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b611363613045565b6113ca5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610abe565b6113d5335b84612a60565b6113f15760405162461bcd60e51b8152600401610abe906157c9565b6114318383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061307792505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f483838360405160200161146692919061558d565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156114df5760405162461bcd60e51b8152600401610abe906156e3565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316611511612dd5565b6001600160a01b0316146115375760405162461bcd60e51b8152600401610abe9061572f565b61154082612e03565b61154c82826001612e1c565b5050565b600061155b60fd5490565b82106115be5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610abe565b60fd82815481106115df57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c5602052600090815260409020805461160b90615aac565b80601f016020809104026020016040519081016040528092919081815260200182805461163790615aac565b80156116845780601f1061165957610100808354040283529160200191611684565b820191906000526020600020905b81548152906001019060200180831161166757829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109be5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610abe565b61171b600080516020615ba4833981519152336124c2565b6117375760405162461bcd60e51b8152600401610abe90615833565b81518351146117c15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610abe565b81518151146118525760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610abe565b60005b83518110156118ef576118de84828151811061188157634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106118a957634e487b7160e01b600052603260045260246000fd5b60200260200101518484815181106118d157634e487b7160e01b600052603260045260246000fd5b60200260200101516129d1565b506118e881615ae7565b9050611855565b50505050565b6101c75464010000000090046001600160a01b031661197c5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610abe565b6119bb84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061290192505050565b156119d85760405162461bcd60e51b8152600401610abe90615890565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015611a4357600080fd5b505af1158015611a57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a7b919061514b565b506000611af28686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a0181900481028201810190925288815292508891508790819084018382808284376000920191909152506129d192505050565b905060006127106101ca546101c854611b0b9190615a33565b611b159190615a1f565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611b7257600080fd5b505af1158015611b86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611baa919061514b565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611be0908490615a52565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611c8f5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610abe565b506001600160a01b0316600090815260cc602052604090205490565b611cc3600080516020615ba4833981519152336124c2565b611cdf5760405162461bcd60e51b8152600401610abe90615833565b611d538585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f890181900481028201810190925287815292508791508690819084018382808284376000920191909152506129d192505050565b505050505050565b611d73600080516020615ba4833981519152336124c2565b611dcf5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610abe565b6000611ddd828401846152ec565b80515190915015611e295780518051600090611e0957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611e27929190614a4f565b505b60208101515115611e7c578060200151600081518110611e5957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b60408101515115611ecf578060400151600081518110611eac57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b60608101515115611f22578060600151600081518110611eff57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b60808101515115611f75578060800151600081518110611f5257634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b60a08101515115611fd5578060a00151600081518110611fa557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115612015578060c0015160008151811061200557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b60e08101515115612075578060e0015160008151811061204557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b61010081015151156121a0576127108161010001516000815181106120aa57634e487b7160e01b600052603260045260246000fd5b6020026020010151111580156120ee575060008161010001516000815181106120e357634e487b7160e01b600052603260045260246000fd5b602002602001015110155b61216a5760405162461bcd60e51b815260206004820152604160248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201527f74206265206765207468616e203020616e64206c65207468616e2031303030306064820152601760f91b608482015260a401610abe565b80610100015160008151811061219057634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b6101208101515115610bf4578061012001516000815181106121d257634e487b7160e01b600052603260045260246000fd5b60209081029190910101516040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b03909116906301ffc9a79060240160206040518083038186803b15801561222457600080fd5b505afa158015612238573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061225c919061514b565b6122ce5760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610abe565b8061012001516000815181106122f457634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff1680612341575060005460ff16155b61235d5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff1615801561237f576000805461ffff19166101011790555b612387613103565b61238f613176565b6123976131e5565b61239f6131e5565b6123a7613243565b6123b185856132a1565b6123bc600083613328565b6123d4600080516020615ba483398151915284613328565b61240c600080516020615ba48339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba613332565b6124367fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba84613328565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb80549091169055801561249c576000805461ff00191690555b5050505050565b60008281526097602052604081206124bb908361337d565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6124f5613389565b61255a5760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610abe565b612563336113cf565b61257f5760405162461bcd60e51b8152600401610abe906157c9565b6125be82828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061290192505050565b156125db5760405162461bcd60e51b8152600401610abe90615890565b826101c483836040516125ef92919061558d565b90815260408051602092819003830190209290925560008581526101c59091522061261b908383614ad3565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161148993929190615955565b606060ca80546109d390615aac565b6001600160a01b0382163314156126b75760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610abe565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61272d3383612a60565b6127495760405162461bcd60e51b8152600401610abe906157c9565b61275283612864565b61276e5760405162461bcd60e51b8152600401610abe906158e1565b6118ef848484846133b7565b60606109be826133ea565b60008181526097602052604081206109be9061355a565b6111448282613564565b6101c3805461160b90615aac565b60006001600160e01b0319821663780e9d6360e01b14806109be57506109be8261358a565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b038416908117909155819061282b8261168c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b031615806109be57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b1580156128c257600080fd5b505afa1580156128d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128fa9190615496565b1192915050565b60006101c4826040516129149190615571565b90815260405190819003602001902054151592915050565b6000806129a786868660405160200161294793929190615523565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b90506129c5600080516020615ba48339815191526107b883866135ca565b9150505b949350505050565b815160009015612a56576129e483612901565b15612a015760405162461bcd60e51b8152600401610abe90615890565b612a0b84836135ee565b9050806101c484604051612a1f9190615571565b90815260408051602092819003830190209290925560008381526101c58252919091208451612a5092860190614a4f565b506124bb565b6129c984836135ee565b6000612a6b826127d9565b612acc5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610abe565b6000612ad78361168c565b9050806001600160a01b0316846001600160a01b03161480612b125750836001600160a01b0316612b0784610a56565b6001600160a01b0316145b80612b4257506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806129c957506129c9600080516020615ba4833981519152856124c2565b826001600160a01b0316612b738261168c565b6001600160a01b031614612bdb5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610abe565b6001600160a01b038216612c3d5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610abe565b612c48838383613649565b612c536000826127f6565b6001600160a01b038316600090815260cc60205260408120805460019290612c7c908490615a52565b90915550506001600160a01b038216600090815260cc60205260408120805460019290612caa908490615a07565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612d2781336136bd565b610bf48383613721565b60006124bb836001600160a01b0384166137a7565b6001600160a01b0381163314612db65760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610abe565b61154c82826137f6565b60006124bb836001600160a01b03841661385d565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b600080516020615ba483398151915261154c81336136bd565b6000612e26612dd5565b9050612e318461397a565b600083511180612e3e5750815b15612e4f57612e4d8484613a1f565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff1661249c57805460ff191660011781556040516001600160a01b0383166024820152612ece90869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613a1f565b50805460ff19168155612edf612dd5565b6001600160a01b0316826001600160a01b031614612f575760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610abe565b61249c85613b0a565b612f6981613b4a565b60008181526101c5602052604081208054612f8390615aac565b80601f0160208091040260200160405190810160405280929190818152602001828054612faf90615aac565b8015612ffc5780601f10612fd157610100808354040283529160200191612ffc565b820191906000526020600020905b815481529060010190602001808311612fdf57829003601f168201915b50505060008581526101c56020526040812093945061301e9392509050614b47565b6101c48160405161302f9190615571565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff16806130725750613072600080516020615ba4833981519152336124c2565b905090565b613080826127d9565b6130e35760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610abe565b600082815261012d602090815260409091208251610bf492840190614a4f565b600054610100900460ff168061311c575060005460ff16155b6131385760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff1615801561315a576000805461ffff19166101011790555b613162613b8c565b8015611222576000805461ff001916905550565b600054610100900460ff168061318f575060005460ff16155b6131ab5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156131cd576000805461ffff19166101011790555b6131d5613b8c565b6131dd613b8c565b61315a613b8c565b600054610100900460ff16806131fe575060005460ff16155b61321a5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156131d5576000805461ffff19166101011790556131dd613b8c565b600054610100900460ff168061325c575060005460ff16155b6132785760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156131dd576000805461ffff191661010117905561315a613b8c565b600054610100900460ff16806132ba575060005460ff16155b6132d65760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff161580156132f8576000805461ffff19166101011790555b613300613b8c565b613308613b8c565b6133128383613bf6565b8015610bf4576000805461ff0019169055505050565b61108c8282613c8b565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006124bb8383613c95565b6101c75460009062010000900460ff16806130725750613072600080516020615ba4833981519152336124c2565b6133c2848484612b60565b6133ce84848484613ccd565b6118ef5760405162461bcd60e51b8152600401610abe90615691565b60606133f5826127d9565b61345b5760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610abe565b600082815261012d60205260408120805461347590615aac565b80601f01602080910402602001604051908101604052809291908181526020018280546134a190615aac565b80156134ee5780601f106134c3576101008083540402835291602001916134ee565b820191906000526020600020905b8154815290600101906020018083116134d157829003601f168201915b50505050509050600061350c60408051602081019091526000815290565b905080516000141561351f575092915050565b81511561355157808260405160200161353992919061559d565b60405160208183030381529060405292505050919050565b6129c984613dd7565b60006109be825490565b60008281526065602052604090206001015461358081336136bd565b610bf483836137f6565b60006001600160e01b031982166380ac58cd60e01b14806135bb57506001600160e01b03198216635b5e139f60e01b145b806109be57506109be82613eae565b60008060006135d98585613ed3565b915091506135e681613f43565b509392505050565b60006135f983612864565b6136155760405162461bcd60e51b8152600401610abe906158e1565b6101cc54613624906001615a07565b90506136308382614144565b61363f6101cc80546001019055565b6109be8183613077565b613651614283565b6136b25760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610abe565b610bf48383836142b2565b6136c782826124c2565b61154c576136df816001600160a01b0316601461436a565b6136ea83602061436a565b6040516020016136fb9291906155cc565b60408051601f198184030181529082905262461bcd60e51b8252610abe9160040161567e565b61372b82826124c2565b61154c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556137633390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008181526001830160205260408120546137ee575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556109be565b5060006109be565b61380082826124c2565b1561154c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008181526001830160205260408120548015613970576000613881600183615a52565b855490915060009061389590600190615a52565b90508181146139165760008660000182815481106138c357634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106138f457634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061393557634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506109be565b60009150506109be565b803b6139de5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610abe565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b613a7e5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610abe565b600080846001600160a01b031684604051613a999190615571565b600060405180830381855af49150503d8060008114613ad4576040519150601f19603f3d011682016040523d82523d6000602084013e613ad9565b606091505b5091509150613b018282604051806060016040528060278152602001615b7d6027913961454b565b95945050505050565b613b138161397a565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b613b5381614584565b600081815261012d602052604090208054613b6d90615aac565b15905061122257600081815261012d6020526040812061122291614b47565b600054610100900460ff1680613ba5575060005460ff16155b613bc15760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff16158015613162576000805461ffff19166101011790558015611222576000805461ff001916905550565b600054610100900460ff1680613c0f575060005460ff16155b613c2b5760405162461bcd60e51b8152600401610abe9061577b565b600054610100900460ff16158015613c4d576000805461ffff19166101011790555b8251613c609060c9906020860190614a4f565b508151613c749060ca906020850190614a4f565b508015610bf4576000805461ff0019169055505050565b61154c8282613721565b6000826000018281548110613cba57634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613dcf57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613d11903390899088908890600401615641565b602060405180830381600087803b158015613d2b57600080fd5b505af1925050508015613d5b575060408051601f3d908101601f19168201909252613d58918101906151de565b60015b613db5573d808015613d89576040519150601f19603f3d011682016040523d82523d6000602084013e613d8e565b606091505b508051613dad5760405162461bcd60e51b8152600401610abe90615691565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506129c9565b5060016129c9565b6060613de2826127d9565b613e465760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610abe565b6000613e5d60408051602081019091526000815290565b90506000815111613e7d57604051806020016040528060008152506124bb565b80613e878461462b565b604051602001613e9892919061559d565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b14806109be57506109be82614744565b600080825160411415613f0a5760208301516040840151606085015160001a613efe87828585614779565b94509450505050613f3c565b825160401415613f345760208301516040840151613f29868383614866565b935093505050613f3c565b506000905060025b9250929050565b6000816004811115613f6557634e487b7160e01b600052602160045260246000fd5b1415613f6e5750565b6001816004811115613f9057634e487b7160e01b600052602160045260246000fd5b1415613fde5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610abe565b600281600481111561400057634e487b7160e01b600052602160045260246000fd5b141561404e5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610abe565b600381600481111561407057634e487b7160e01b600052602160045260246000fd5b14156140c95760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610abe565b60048160048111156140eb57634e487b7160e01b600052602160045260246000fd5b14156112225760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610abe565b6001600160a01b03821661419a5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610abe565b6141a3816127d9565b156141f05760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610abe565b6141fc60008383613649565b6001600160a01b038216600090815260cc60205260408120805460019290614225908490615a07565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff16806130725750613072600080516020615ba4833981519152336124c2565b6001600160a01b03831661430d576143088160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b614330565b816001600160a01b0316836001600160a01b031614614330576143308382614895565b6001600160a01b03821661434757610bf481614932565b826001600160a01b0316826001600160a01b031614610bf457610bf48282614a0b565b60606000614379836002615a33565b614384906002615a07565b6001600160401b038111156143a957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156143d3576020820181803683370190505b509050600360fc1b816000815181106143fc57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061443957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600061445d846002615a33565b614468906001615a07565b90505b60018111156144fc576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106144aa57634e487b7160e01b600052603260045260246000fd5b1a60f81b8282815181106144ce57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936144f581615a95565b905061446b565b5083156124bb5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610abe565b6060831561455a5750816124bb565b82511561456a5782518084602001fd5b8160405162461bcd60e51b8152600401610abe919061567e565b600061458f8261168c565b905061459d81600084613649565b6145a86000836127f6565b6001600160a01b038116600090815260cc602052604081208054600192906145d1908490615a52565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b60608161464f5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115614679578061466381615ae7565b91506146729050600a83615a1f565b9150614653565b6000816001600160401b038111156146a157634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156146cb576020820181803683370190505b5090505b84156129c9576146e0600183615a52565b91506146ed600a86615b02565b6146f8906030615a07565b60f81b81838151811061471b57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535061473d600a86615a1f565b94506146cf565b60006001600160e01b03198216637965db0b60e01b14806109be57506301ffc9a760e01b6001600160e01b03198316146109be565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156147b0575060009050600361485d565b8460ff16601b141580156147c857508460ff16601c14155b156147d9575060009050600461485d565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561482d573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166148565760006001925092505061485d565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161488787828885614779565b935093505050935093915050565b600060016148a284611c24565b6148ac9190615a52565b600083815260fc60205260409020549091508082146148ff576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061494490600190615a52565b600083815260fe602052604081205460fd805493945090928490811061497a57634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106149a957634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd8054806149ef57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000614a1683611c24565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614a5b90615aac565b90600052602060002090601f016020900481019282614a7d5760008555614ac3565b82601f10614a9657805160ff1916838001178555614ac3565b82800160010185558215614ac3579182015b82811115614ac3578251825591602001919060010190614aa8565b50614acf929150614b7d565b5090565b828054614adf90615aac565b90600052602060002090601f016020900481019282614b015760008555614ac3565b82601f10614b1a5782800160ff19823516178555614ac3565b82800160010185558215614ac3579182015b82811115614ac3578235825591602001919060010190614b2c565b508054614b5390615aac565b6000825580601f10614b63575050565b601f01602090049060005260206000209081019061122291905b5b80821115614acf5760008155600101614b7e565b80356001600160a01b0381168114614ba957600080fd5b919050565b600082601f830112614bbe578081fd5b81356020614bd3614bce836159e4565b6159b4565b80838252828201915082860187848660051b8901011115614bf2578586fd5b855b85811015614c1757614c0582614b92565b84529284019290840190600101614bf4565b5090979650505050505050565b600082601f830112614c34578081fd5b81356020614c44614bce836159e4565b80838252828201915082860187848660051b8901011115614c63578586fd5b855b85811015614c17578135614c7881615b58565b84529284019290840190600101614c65565b600082601f830112614c9a578081fd5b81356020614caa614bce836159e4565b80838252828201915082860187848660051b8901011115614cc9578586fd5b855b85811015614c175781356001600160401b03811115614ce8578788fd5b614cf68a87838c0101614da5565b8552509284019290840190600101614ccb565b600082601f830112614d19578081fd5b81356020614d29614bce836159e4565b80838252828201915082860187848660051b8901011115614d48578586fd5b855b85811015614c1757813584529284019290840190600101614d4a565b60008083601f840112614d77578182fd5b5081356001600160401b03811115614d8d578182fd5b602083019150836020828501011115613f3c57600080fd5b600082601f830112614db5578081fd5b81356001600160401b03811115614dce57614dce615b42565b614de1601f8201601f19166020016159b4565b818152846020838601011115614df5578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614e20578081fd5b6124bb82614b92565b60008060408385031215614e3b578081fd5b614e4483614b92565b9150614e5260208401614b92565b90509250929050565b600080600060608486031215614e6f578081fd5b614e7884614b92565b9250614e8660208501614b92565b9150604084013590509250925092565b60008060008060808587031215614eab578182fd5b614eb485614b92565b9350614ec260208601614b92565b92506040850135915060608501356001600160401b03811115614ee3578182fd5b614eef87828801614da5565b91505092959194509250565b60008060408385031215614f0d578182fd5b614f1683614b92565b91506020830135614f2681615b58565b809150509250929050565b60008060408385031215614f43578182fd5b614f4c83614b92565b915060208301356001600160401b03811115614f66578182fd5b614f7285828601614da5565b9150509250929050565b600080600080600060608688031215614f93578283fd5b614f9c86614b92565b945060208601356001600160401b0380821115614fb7578485fd5b614fc389838a01614d66565b90965094506040880135915080821115614fdb578283fd5b50614fe888828901614d66565b969995985093965092949392505050565b60008060008060008060006080888a031215615013578485fd5b61501c88614b92565b965060208801356001600160401b0380821115615037578687fd5b6150438b838c01614d66565b909850965060408a013591508082111561505b578384fd5b6150678b838c01614d66565b909650945060608a013591508082111561507f578384fd5b5061508c8a828b01614d66565b989b979a50959850939692959293505050565b600080604083850312156150b1578182fd5b6150ba83614b92565b946020939093013593505050565b6000806000606084860312156150dc578081fd5b83356001600160401b03808211156150f2578283fd5b6150fe87838801614bae565b94506020860135915080821115615113578283fd5b61511f87838801614c8a565b93506040860135915080821115615134578283fd5b5061514186828701614c8a565b9150509250925092565b60006020828403121561515c578081fd5b81516124bb81615b58565b600060208284031215615178578081fd5b5035919050565b60008060408385031215615191578182fd5b82359150614e5260208401614b92565b600080604083850312156151b3578182fd5b50508035926020909101359150565b6000602082840312156151d3578081fd5b81356124bb81615b66565b6000602082840312156151ef578081fd5b81516124bb81615b66565b6000806020838503121561520c578182fd5b82356001600160401b03811115615221578283fd5b61522d85828601614d66565b90969095509350505050565b60006020828403121561524a578081fd5b81356001600160401b0381111561525f578182fd5b6129c984828501614da5565b60008060008060808587031215615280578182fd5b84356001600160401b0380821115615296578384fd5b6152a288838901614da5565b955060208701359150808211156152b7578384fd5b506152c487828801614da5565b9350506152d360408601614b92565b91506152e160608601614b92565b905092959194509250565b6000602082840312156152fd578081fd5b81356001600160401b0380821115615313578283fd5b908301906101408286031215615327578283fd5b61532f61598b565b82358281111561533d578485fd5b61534987828601614c8a565b82525060208301358281111561535d578485fd5b61536987828601614c24565b602083015250604083013582811115615380578485fd5b61538c87828601614c24565b6040830152506060830135828111156153a3578485fd5b6153af87828601614c24565b6060830152506080830135828111156153c6578485fd5b6153d287828601614c24565b60808301525060a0830135828111156153e9578485fd5b6153f587828601614bae565b60a08301525060c08301358281111561540c578485fd5b61541887828601614d09565b60c08301525060e08301358281111561542f578485fd5b61543b87828601614bae565b60e0830152506101008084013583811115615454578586fd5b61546088828701614d09565b8284015250506101208084013583811115615479578586fd5b61548588828701614bae565b918301919091525095945050505050565b6000602082840312156154a7578081fd5b5051919050565b6000806000604084860312156154c2578081fd5b8335925060208401356001600160401b038111156154de578182fd5b6154ea86828701614d66565b9497909650939450505050565b6000815180845261550f816020860160208601615a69565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b1681526000835161554d816014850160208801615a69565b835190830190615564816014840160208801615a69565b0160140195945050505050565b60008251615583818460208701615a69565b9190910192915050565b8183823760009101908152919050565b600083516155af818460208801615a69565b8351908301906155c3818360208801615a69565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351615604816017850160208801615a69565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351615635816028840160208801615a69565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090615674908301846154f7565b9695505050505050565b6020815260006124bb60208301846154f7565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b03811182821017156159ae576159ae615b42565b60405290565b604051601f8201601f191681016001600160401b03811182821017156159dc576159dc615b42565b604052919050565b60006001600160401b038211156159fd576159fd615b42565b5060051b60200190565b60008219821115615a1a57615a1a615b16565b500190565b600082615a2e57615a2e615b2c565b500490565b6000816000190483118215151615615a4d57615a4d615b16565b500290565b600082821015615a6457615a64615b16565b500390565b60005b83811015615a84578181015183820152602001615a6c565b838111156118ef5750506000910152565b600081615aa457615aa4615b16565b506000190190565b600181811c90821680615ac057607f821691505b60208210811415615ae157634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415615afb57615afb615b16565b5060010190565b600082615b1157615b11615b2c565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461122257600080fd5b6001600160e01b03198116811461122257600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220ba3b441a525af6790f1309b81ce054779ea3c5d2b870c4a97d116bb68f56755864736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
