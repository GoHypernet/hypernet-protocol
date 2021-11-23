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
    "0x60a06040523060601b6080523480156200001857600080fd5b50600054610100900460ff168062000033575060005460ff16155b6200009b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000be576000805461ffff19166101011790555b8015620000d1576000805461ff00191690555b5060805160601c615c576200010660003960008181611167015281816111a7015281816114a101526114e10152615c576000f3fe6080604052600436106102c95760003560e01c806366e7b60611610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a714610944578063f68e955314610965578063f8895cc814610987578063fce589d81461099c57600080fd5b8063ca15c873146108bb578063d547741f146108db578063e985e9c5146108fb57600080fd5b8063a217fddf146107f2578063a22cb46514610807578063b88d4fde14610827578063bb87c1c814610847578063bce8542e14610862578063c87b56dd1461089b57600080fd5b80638daf3f4e1161012e5780638daf3f4e1461073d5780638f15b4141461075d5780639010d07c1461077d57806391d148541461079d57806393d0da07146107bd57806395d89b41146107dd57600080fd5b806366e7b6061461067b5780636f4c25aa1461069b5780637092d9ea146106bc57806370a08231146106dc57806370d5ae05146106fc5780638d59cc021461071d57600080fd5b806336568abe116102345780634b08b0a3116101ed5780635471a057116101c75780635471a057146105e757806358083969146106075780636017160b1461063b5780636352211e1461065b57600080fd5b80634b08b0a31461058b5780634f1ef286146105b45780634f6ccce7146105c757600080fd5b806336568abe1461048b5780633659cfe6146104ab57806338f292d5146104cb57806342842e0e1461052b57806342966c681461054b57806347f00d5a1461056b57600080fd5b806318160ddd1161028657806318160ddd146103c45780632185810b146103d957806323b872dd146103fb578063248a9ca31461041b5780632f2ff15d1461044b5780632f745c591461046b57600080fd5b806301ffc9a7146102ce57806306fdde0314610303578063081812fc14610325578063095ea7b31461035d5780630ecf9dfd1461037f57806314c44e091461039f575b600080fd5b3480156102da57600080fd5b506102ee6102e9366004615220565b6109b3565b60405190151581526020015b60405180910390f35b34801561030f57600080fd5b506103186109c4565b6040516102fa91906156dc565b34801561033157600080fd5b506103456103403660046151c5565b610a56565b6040516001600160a01b0390911681526020016102fa565b34801561036957600080fd5b5061037d6103783660046150fd565b610ae3565b005b34801561038b57600080fd5b5061037d61039a366004615057565b610bf9565b3480156103ab57600080fd5b506103b66101c85481565b6040519081526020016102fa565b3480156103d057600080fd5b5060fd546103b6565b3480156103e557600080fd5b506101c7546102ee906301000000900460ff1681565b34801561040757600080fd5b5061037d610416366004614eb9565b61102b565b34801561042757600080fd5b506103b66104363660046151c5565b60009081526065602052604090206001015490565b34801561045757600080fd5b5061037d6104663660046151dd565b611082565b34801561047757600080fd5b506103b66104863660046150fd565b6110a4565b34801561049757600080fd5b5061037d6104a63660046151dd565b61113a565b3480156104b757600080fd5b5061037d6104c6366004614e6d565b61115c565b3480156104d757600080fd5b5061050c6104e63660046151c5565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102fa565b34801561053757600080fd5b5061037d610546366004614eb9565b611225565b34801561055757600080fd5b5061037d6105663660046151c5565b611240565b34801561057757600080fd5b5061037d61058636600461550c565b61135b565b34801561059757600080fd5b506101c7546103459064010000000090046001600160a01b031681565b61037d6105c2366004614f8f565b611496565b3480156105d357600080fd5b506103b66105e23660046151c5565b611550565b3480156105f357600080fd5b506101c7546102ee90610100900460ff1681565b34801561061357600080fd5b506103b67fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b34801561064757600080fd5b506103186106563660046151c5565b6115f1565b34801561066757600080fd5b506103456106763660046151c5565b61168c565b34801561068757600080fd5b5061037d610696366004615126565b611703565b3480156106a757600080fd5b506101c7546102ee9062010000900460ff1681565b3480156106c857600080fd5b5061037d6106d7366004614fda565b6118f5565b3480156106e857600080fd5b506103b66106f7366004614e6d565b611c24565b34801561070857600080fd5b506101c954610345906001600160a01b031681565b34801561072957600080fd5b5061037d610738366004614fda565b611cab565b34801561074957600080fd5b5061037d610758366004615258565b611d5b565b34801561076957600080fd5b5061037d6107783660046152c9565b612386565b34801561078957600080fd5b506103456107983660046151ff565b612501565b3480156107a957600080fd5b506102ee6107b83660046151dd565b612520565b3480156107c957600080fd5b5061037d6107d836600461550c565b61254b565b3480156107e957600080fd5b506103186126ad565b3480156107fe57600080fd5b506103b6600081565b34801561081357600080fd5b5061037d610822366004614f59565b6126bc565b34801561083357600080fd5b5061037d610842366004614ef4565b612781565b34801561085357600080fd5b506101c7546102ee9060ff1681565b34801561086e57600080fd5b506103b661087d366004615297565b80516020818301810180516101c48252928201919093012091525481565b3480156108a757600080fd5b506103186108b63660046151c5565b6127d8565b3480156108c757600080fd5b506103b66108d63660046151c5565b6127e3565b3480156108e757600080fd5b5061037d6108f63660046151dd565b6127fa565b34801561090757600080fd5b506102ee610916366004614e87565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561095057600080fd5b506101cb54610345906001600160a01b031681565b34801561097157600080fd5b506103b6600080516020615c0283398151915281565b34801561099357600080fd5b50610318612804565b3480156109a857600080fd5b506103b66101ca5481565b60006109be82612812565b92915050565b606060c980546109d390615b0a565b80601f01602080910402602001604051908101604052809291908181526020018280546109ff90615b0a565b8015610a4c5780601f10610a2157610100808354040283529160200191610a4c565b820191906000526020600020905b815481529060010190602001808311610a2f57829003601f168201915b5050505050905090565b6000610a6182612837565b610ac75760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610aee8261168c565b9050806001600160a01b0316836001600160a01b03161415610b5c5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610abe565b336001600160a01b0382161480610b785750610b788133610916565b610bea5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610abe565b610bf48383612854565b505050565b6101c75460ff16610c685760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610abe565b610c71876128c2565b610c8d5760405162461bcd60e51b8152600401610abe9061593f565b6101c75462010000900460ff1615610d205760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610abe565b84610d895760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610abe565b610dc886868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061295f92505050565b15610e3b5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610abe565b336001600160a01b03881614610ea95760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610abe565b610f518787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061298a92505050565b610fad5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610abe565b6110218787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b018190048102820181019092528981529250899150889081908401838280828437600092019190915250612a2f92505050565b5050505050505050565b611036335b82612abe565b6110525760405162461bcd60e51b8152600401610abe90615827565b61105b826128c2565b6110775760405162461bcd60e51b8152600401610abe9061593f565b610bf4838383612bbe565b61108c8282612d69565b6000828152609760205260409020610bf49082612d8f565b60006110af83611c24565b82106111115760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610abe565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6111448282612da4565b6000828152609760205260409020610bf49082612e1e565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111a55760405162461bcd60e51b8152600401610abe90615741565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166111d7612e33565b6001600160a01b0316146111fd5760405162461bcd60e51b8152600401610abe9061578d565b61120681612e61565b6040805160008082526020820190925261122291839190612e7a565b50565b610bf483838360405180602001604052806000815250612781565b61124933611030565b6112655760405162461bcd60e51b8152600401610abe90615827565b61126e81612fbe565b60008181526101c66020526040902060010154156112225760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156112ff57600080fd5b505af1158015611313573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061133791906151a9565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b6113636130a3565b6113ca5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610abe565b6113d5335b84612abe565b6113f15760405162461bcd60e51b8152600401610abe90615827565b6114318383838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506130d592505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f48383836040516020016114669291906155eb565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156114df5760405162461bcd60e51b8152600401610abe90615741565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316611511612e33565b6001600160a01b0316146115375760405162461bcd60e51b8152600401610abe9061578d565b61154082612e61565b61154c82826001612e7a565b5050565b600061155b60fd5490565b82106115be5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610abe565b60fd82815481106115df57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c5602052600090815260409020805461160b90615b0a565b80601f016020809104026020016040519081016040528092919081815260200182805461163790615b0a565b80156116845780601f1061165957610100808354040283529160200191611684565b820191906000526020600020905b81548152906001019060200180831161166757829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109be5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610abe565b61171b600080516020615c0283398151915233612520565b6117375760405162461bcd60e51b8152600401610abe90615891565b81518351146117c15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610abe565b81518151146118525760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610abe565b60005b83518110156118ef576118de84828151811061188157634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106118a957634e487b7160e01b600052603260045260246000fd5b60200260200101518484815181106118d157634e487b7160e01b600052603260045260246000fd5b6020026020010151612a2f565b506118e881615b45565b9050611855565b50505050565b6101c75464010000000090046001600160a01b031661197c5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610abe565b6119bb84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061295f92505050565b156119d85760405162461bcd60e51b8152600401610abe906158ee565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015611a4357600080fd5b505af1158015611a57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a7b91906151a9565b506000611af28686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250612a2f92505050565b905060006127106101ca546101c854611b0b9190615a91565b611b159190615a7d565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611b7257600080fd5b505af1158015611b86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611baa91906151a9565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611be0908490615ab0565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611c8f5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610abe565b506001600160a01b0316600090815260cc602052604090205490565b611cc3600080516020615c0283398151915233612520565b611cdf5760405162461bcd60e51b8152600401610abe90615891565b611d538585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f89018190048102820181019092528781529250879150869081908401838280828437600092019190915250612a2f92505050565b505050505050565b611d73600080516020615c0283398151915233612520565b611dcf5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610abe565b6000611ddd8284018461534a565b80515190915015611e295780518051600090611e0957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611e27929190614aad565b505b60208101515115611e7c578060200151600081518110611e5957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b60408101515115611ecf578060400151600081518110611eac57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b60608101515115611f22578060600151600081518110611eff57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b60808101515115611f75578060800151600081518110611f5257634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b60a08101515115611fd5578060a00151600081518110611fa557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115612015578060c0015160008151811061200557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b60e08101515115612075578060e0015160008151811061204557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b61010081015151156121a0576127108161010001516000815181106120aa57634e487b7160e01b600052603260045260246000fd5b6020026020010151111580156120ee575060008161010001516000815181106120e357634e487b7160e01b600052603260045260246000fd5b602002602001015110155b61216a5760405162461bcd60e51b815260206004820152604160248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201527f74206265206765207468616e203020616e64206c65207468616e2031303030306064820152601760f91b608482015260a401610abe565b80610100015160008151811061219057634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b6101208101515115610bf45760006001600160a01b03168161012001516000815181106121dd57634e487b7160e01b600052603260045260246000fd5b60200260200101516001600160a01b0316141561220a576101cb80546001600160a01b0319169055505050565b80610120015160008151811061223057634e487b7160e01b600052603260045260246000fd5b60209081029190910101516040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b03909116906301ffc9a79060240160206040518083038186803b15801561228257600080fd5b505afa158015612296573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122ba91906151a9565b61232c5760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610abe565b80610120015160008151811061235257634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff168061239f575060005460ff16155b6123bb5760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff161580156123dd576000805461ffff19166101011790555b6123e5613161565b6123ed6131d4565b6123f5613243565b6123fd613243565b6124056132a1565b61240f85856132ff565b61241a600083613386565b612432600080516020615c0283398151915284613386565b61246a600080516020615c028339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba613390565b6124947fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba84613386565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb8054909116905580156124fa576000805461ff00191690555b5050505050565b600082815260976020526040812061251990836133db565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6125536133e7565b6125b85760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610abe565b6125c1336113cf565b6125dd5760405162461bcd60e51b8152600401610abe90615827565b61261c82828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061295f92505050565b156126395760405162461bcd60e51b8152600401610abe906158ee565b826101c4838360405161264d9291906155eb565b90815260408051602092819003830190209290925560008581526101c590915220612679908383614b31565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c838383604051611489939291906159b3565b606060ca80546109d390615b0a565b6001600160a01b0382163314156127155760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610abe565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61278b3383612abe565b6127a75760405162461bcd60e51b8152600401610abe90615827565b6127b0836128c2565b6127cc5760405162461bcd60e51b8152600401610abe9061593f565b6118ef84848484613415565b60606109be82613448565b60008181526097602052604081206109be906135b8565b61114482826135c2565b6101c3805461160b90615b0a565b60006001600160e01b0319821663780e9d6360e01b14806109be57506109be826135e8565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b03841690811790915581906128898261168c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b031615806109be57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561292057600080fd5b505afa158015612934573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061295891906154f4565b1192915050565b60006101c48260405161297291906155cf565b90815260405190819003602001902054151592915050565b600080612a058686866040516020016129a593929190615581565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b9050612a23600080516020615c028339815191526107b88386613628565b9150505b949350505050565b815160009015612ab457612a428361295f565b15612a5f5760405162461bcd60e51b8152600401610abe906158ee565b612a69848361364c565b9050806101c484604051612a7d91906155cf565b90815260408051602092819003830190209290925560008381526101c58252919091208451612aae92860190614aad565b50612519565b612a27848361364c565b6000612ac982612837565b612b2a5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610abe565b6000612b358361168c565b9050806001600160a01b0316846001600160a01b03161480612b705750836001600160a01b0316612b6584610a56565b6001600160a01b0316145b80612ba057506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b80612a275750612a27600080516020615c0283398151915285612520565b826001600160a01b0316612bd18261168c565b6001600160a01b031614612c395760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610abe565b6001600160a01b038216612c9b5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610abe565b612ca68383836136a7565b612cb1600082612854565b6001600160a01b038316600090815260cc60205260408120805460019290612cda908490615ab0565b90915550506001600160a01b038216600090815260cc60205260408120805460019290612d08908490615a65565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612d85813361371b565b610bf4838361377f565b6000612519836001600160a01b038416613805565b6001600160a01b0381163314612e145760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610abe565b61154c8282613854565b6000612519836001600160a01b0384166138bb565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b600080516020615c0283398151915261154c813361371b565b6000612e84612e33565b9050612e8f846139d8565b600083511180612e9c5750815b15612ead57612eab8484613a7d565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff166124fa57805460ff191660011781556040516001600160a01b0383166024820152612f2c90869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613a7d565b50805460ff19168155612f3d612e33565b6001600160a01b0316826001600160a01b031614612fb55760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610abe565b6124fa85613b68565b612fc781613ba8565b60008181526101c5602052604081208054612fe190615b0a565b80601f016020809104026020016040519081016040528092919081815260200182805461300d90615b0a565b801561305a5780601f1061302f5761010080835404028352916020019161305a565b820191906000526020600020905b81548152906001019060200180831161303d57829003601f168201915b50505060008581526101c56020526040812093945061307c9392509050614ba5565b6101c48160405161308d91906155cf565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff16806130d057506130d0600080516020615c0283398151915233612520565b905090565b6130de82612837565b6131415760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610abe565b600082815261012d602090815260409091208251610bf492840190614aad565b600054610100900460ff168061317a575060005460ff16155b6131965760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff161580156131b8576000805461ffff19166101011790555b6131c0613bea565b8015611222576000805461ff001916905550565b600054610100900460ff16806131ed575060005460ff16155b6132095760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff1615801561322b576000805461ffff19166101011790555b613233613bea565b61323b613bea565b6131b8613bea565b600054610100900460ff168061325c575060005460ff16155b6132785760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff16158015613233576000805461ffff191661010117905561323b613bea565b600054610100900460ff16806132ba575060005460ff16155b6132d65760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff1615801561323b576000805461ffff19166101011790556131b8613bea565b600054610100900460ff1680613318575060005460ff16155b6133345760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff16158015613356576000805461ffff19166101011790555b61335e613bea565b613366613bea565b6133708383613c54565b8015610bf4576000805461ff0019169055505050565b61108c8282613ce9565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006125198383613cf3565b6101c75460009062010000900460ff16806130d057506130d0600080516020615c0283398151915233612520565b613420848484612bbe565b61342c84848484613d2b565b6118ef5760405162461bcd60e51b8152600401610abe906156ef565b606061345382612837565b6134b95760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610abe565b600082815261012d6020526040812080546134d390615b0a565b80601f01602080910402602001604051908101604052809291908181526020018280546134ff90615b0a565b801561354c5780601f106135215761010080835404028352916020019161354c565b820191906000526020600020905b81548152906001019060200180831161352f57829003601f168201915b50505050509050600061356a60408051602081019091526000815290565b905080516000141561357d575092915050565b8151156135af5780826040516020016135979291906155fb565b60405160208183030381529060405292505050919050565b612a2784613e35565b60006109be825490565b6000828152606560205260409020600101546135de813361371b565b610bf48383613854565b60006001600160e01b031982166380ac58cd60e01b148061361957506001600160e01b03198216635b5e139f60e01b145b806109be57506109be82613f0c565b60008060006136378585613f31565b9150915061364481613fa1565b509392505050565b6000613657836128c2565b6136735760405162461bcd60e51b8152600401610abe9061593f565b6101cc54613682906001615a65565b905061368e83826141a2565b61369d6101cc80546001019055565b6109be81836130d5565b6136af6142e1565b6137105760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610abe565b610bf4838383614310565b6137258282612520565b61154c5761373d816001600160a01b031660146143c8565b6137488360206143c8565b60405160200161375992919061562a565b60408051601f198184030181529082905262461bcd60e51b8252610abe916004016156dc565b6137898282612520565b61154c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556137c13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600081815260018301602052604081205461384c575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556109be565b5060006109be565b61385e8282612520565b1561154c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600081815260018301602052604081205480156139ce5760006138df600183615ab0565b85549091506000906138f390600190615ab0565b905081811461397457600086600001828154811061392157634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061395257634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061399357634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506109be565b60009150506109be565b803b613a3c5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610abe565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b613adc5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610abe565b600080846001600160a01b031684604051613af791906155cf565b600060405180830381855af49150503d8060008114613b32576040519150601f19603f3d011682016040523d82523d6000602084013e613b37565b606091505b5091509150613b5f8282604051806060016040528060278152602001615bdb602791396145a9565b95945050505050565b613b71816139d8565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b613bb1816145e2565b600081815261012d602052604090208054613bcb90615b0a565b15905061122257600081815261012d6020526040812061122291614ba5565b600054610100900460ff1680613c03575060005460ff16155b613c1f5760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff161580156131c0576000805461ffff19166101011790558015611222576000805461ff001916905550565b600054610100900460ff1680613c6d575060005460ff16155b613c895760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff16158015613cab576000805461ffff19166101011790555b8251613cbe9060c9906020860190614aad565b508151613cd29060ca906020850190614aad565b508015610bf4576000805461ff0019169055505050565b61154c828261377f565b6000826000018281548110613d1857634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613e2d57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613d6f90339089908890889060040161569f565b602060405180830381600087803b158015613d8957600080fd5b505af1925050508015613db9575060408051601f3d908101601f19168201909252613db69181019061523c565b60015b613e13573d808015613de7576040519150601f19603f3d011682016040523d82523d6000602084013e613dec565b606091505b508051613e0b5760405162461bcd60e51b8152600401610abe906156ef565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612a27565b506001612a27565b6060613e4082612837565b613ea45760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610abe565b6000613ebb60408051602081019091526000815290565b90506000815111613edb5760405180602001604052806000815250612519565b80613ee584614689565b604051602001613ef69291906155fb565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b14806109be57506109be826147a2565b600080825160411415613f685760208301516040840151606085015160001a613f5c878285856147d7565b94509450505050613f9a565b825160401415613f925760208301516040840151613f878683836148c4565b935093505050613f9a565b506000905060025b9250929050565b6000816004811115613fc357634e487b7160e01b600052602160045260246000fd5b1415613fcc5750565b6001816004811115613fee57634e487b7160e01b600052602160045260246000fd5b141561403c5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610abe565b600281600481111561405e57634e487b7160e01b600052602160045260246000fd5b14156140ac5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610abe565b60038160048111156140ce57634e487b7160e01b600052602160045260246000fd5b14156141275760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610abe565b600481600481111561414957634e487b7160e01b600052602160045260246000fd5b14156112225760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610abe565b6001600160a01b0382166141f85760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610abe565b61420181612837565b1561424e5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610abe565b61425a600083836136a7565b6001600160a01b038216600090815260cc60205260408120805460019290614283908490615a65565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff16806130d057506130d0600080516020615c0283398151915233612520565b6001600160a01b03831661436b576143668160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b61438e565b816001600160a01b0316836001600160a01b03161461438e5761438e83826148f3565b6001600160a01b0382166143a557610bf481614990565b826001600160a01b0316826001600160a01b031614610bf457610bf48282614a69565b606060006143d7836002615a91565b6143e2906002615a65565b6001600160401b0381111561440757634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015614431576020820181803683370190505b509050600360fc1b8160008151811061445a57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061449757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006144bb846002615a91565b6144c6906001615a65565b90505b600181111561455a576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061450857634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061452c57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361455381615af3565b90506144c9565b5083156125195760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610abe565b606083156145b8575081612519565b8251156145c85782518084602001fd5b8160405162461bcd60e51b8152600401610abe91906156dc565b60006145ed8261168c565b90506145fb816000846136a7565b614606600083612854565b6001600160a01b038116600090815260cc6020526040812080546001929061462f908490615ab0565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816146ad5750506040805180820190915260018152600360fc1b602082015290565b8160005b81156146d757806146c181615b45565b91506146d09050600a83615a7d565b91506146b1565b6000816001600160401b038111156146ff57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015614729576020820181803683370190505b5090505b8415612a275761473e600183615ab0565b915061474b600a86615b60565b614756906030615a65565b60f81b81838151811061477957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535061479b600a86615a7d565b945061472d565b60006001600160e01b03198216637965db0b60e01b14806109be57506301ffc9a760e01b6001600160e01b03198316146109be565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561480e57506000905060036148bb565b8460ff16601b1415801561482657508460ff16601c14155b1561483757506000905060046148bb565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561488b573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166148b4576000600192509250506148bb565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b016148e5878288856147d7565b935093505050935093915050565b6000600161490084611c24565b61490a9190615ab0565b600083815260fc602052604090205490915080821461495d576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd546000906149a290600190615ab0565b600083815260fe602052604081205460fd80549394509092849081106149d857634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd8381548110614a0757634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd805480614a4d57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000614a7483611c24565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614ab990615b0a565b90600052602060002090601f016020900481019282614adb5760008555614b21565b82601f10614af457805160ff1916838001178555614b21565b82800160010185558215614b21579182015b82811115614b21578251825591602001919060010190614b06565b50614b2d929150614bdb565b5090565b828054614b3d90615b0a565b90600052602060002090601f016020900481019282614b5f5760008555614b21565b82601f10614b785782800160ff19823516178555614b21565b82800160010185558215614b21579182015b82811115614b21578235825591602001919060010190614b8a565b508054614bb190615b0a565b6000825580601f10614bc1575050565b601f01602090049060005260206000209081019061122291905b5b80821115614b2d5760008155600101614bdc565b80356001600160a01b0381168114614c0757600080fd5b919050565b600082601f830112614c1c578081fd5b81356020614c31614c2c83615a42565b615a12565b80838252828201915082860187848660051b8901011115614c50578586fd5b855b85811015614c7557614c6382614bf0565b84529284019290840190600101614c52565b5090979650505050505050565b600082601f830112614c92578081fd5b81356020614ca2614c2c83615a42565b80838252828201915082860187848660051b8901011115614cc1578586fd5b855b85811015614c75578135614cd681615bb6565b84529284019290840190600101614cc3565b600082601f830112614cf8578081fd5b81356020614d08614c2c83615a42565b80838252828201915082860187848660051b8901011115614d27578586fd5b855b85811015614c755781356001600160401b03811115614d46578788fd5b614d548a87838c0101614e03565b8552509284019290840190600101614d29565b600082601f830112614d77578081fd5b81356020614d87614c2c83615a42565b80838252828201915082860187848660051b8901011115614da6578586fd5b855b85811015614c7557813584529284019290840190600101614da8565b60008083601f840112614dd5578182fd5b5081356001600160401b03811115614deb578182fd5b602083019150836020828501011115613f9a57600080fd5b600082601f830112614e13578081fd5b81356001600160401b03811115614e2c57614e2c615ba0565b614e3f601f8201601f1916602001615a12565b818152846020838601011115614e53578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614e7e578081fd5b61251982614bf0565b60008060408385031215614e99578081fd5b614ea283614bf0565b9150614eb060208401614bf0565b90509250929050565b600080600060608486031215614ecd578081fd5b614ed684614bf0565b9250614ee460208501614bf0565b9150604084013590509250925092565b60008060008060808587031215614f09578182fd5b614f1285614bf0565b9350614f2060208601614bf0565b92506040850135915060608501356001600160401b03811115614f41578182fd5b614f4d87828801614e03565b91505092959194509250565b60008060408385031215614f6b578182fd5b614f7483614bf0565b91506020830135614f8481615bb6565b809150509250929050565b60008060408385031215614fa1578182fd5b614faa83614bf0565b915060208301356001600160401b03811115614fc4578182fd5b614fd085828601614e03565b9150509250929050565b600080600080600060608688031215614ff1578283fd5b614ffa86614bf0565b945060208601356001600160401b0380821115615015578485fd5b61502189838a01614dc4565b90965094506040880135915080821115615039578283fd5b5061504688828901614dc4565b969995985093965092949392505050565b60008060008060008060006080888a031215615071578485fd5b61507a88614bf0565b965060208801356001600160401b0380821115615095578687fd5b6150a18b838c01614dc4565b909850965060408a01359150808211156150b9578384fd5b6150c58b838c01614dc4565b909650945060608a01359150808211156150dd578384fd5b506150ea8a828b01614dc4565b989b979a50959850939692959293505050565b6000806040838503121561510f578182fd5b61511883614bf0565b946020939093013593505050565b60008060006060848603121561513a578081fd5b83356001600160401b0380821115615150578283fd5b61515c87838801614c0c565b94506020860135915080821115615171578283fd5b61517d87838801614ce8565b93506040860135915080821115615192578283fd5b5061519f86828701614ce8565b9150509250925092565b6000602082840312156151ba578081fd5b815161251981615bb6565b6000602082840312156151d6578081fd5b5035919050565b600080604083850312156151ef578182fd5b82359150614eb060208401614bf0565b60008060408385031215615211578182fd5b50508035926020909101359150565b600060208284031215615231578081fd5b813561251981615bc4565b60006020828403121561524d578081fd5b815161251981615bc4565b6000806020838503121561526a578182fd5b82356001600160401b0381111561527f578283fd5b61528b85828601614dc4565b90969095509350505050565b6000602082840312156152a8578081fd5b81356001600160401b038111156152bd578182fd5b612a2784828501614e03565b600080600080608085870312156152de578182fd5b84356001600160401b03808211156152f4578384fd5b61530088838901614e03565b95506020870135915080821115615315578384fd5b5061532287828801614e03565b93505061533160408601614bf0565b915061533f60608601614bf0565b905092959194509250565b60006020828403121561535b578081fd5b81356001600160401b0380821115615371578283fd5b908301906101408286031215615385578283fd5b61538d6159e9565b82358281111561539b578485fd5b6153a787828601614ce8565b8252506020830135828111156153bb578485fd5b6153c787828601614c82565b6020830152506040830135828111156153de578485fd5b6153ea87828601614c82565b604083015250606083013582811115615401578485fd5b61540d87828601614c82565b606083015250608083013582811115615424578485fd5b61543087828601614c82565b60808301525060a083013582811115615447578485fd5b61545387828601614c0c565b60a08301525060c08301358281111561546a578485fd5b61547687828601614d67565b60c08301525060e08301358281111561548d578485fd5b61549987828601614c0c565b60e08301525061010080840135838111156154b2578586fd5b6154be88828701614d67565b82840152505061012080840135838111156154d7578586fd5b6154e388828701614c0c565b918301919091525095945050505050565b600060208284031215615505578081fd5b5051919050565b600080600060408486031215615520578081fd5b8335925060208401356001600160401b0381111561553c578182fd5b61554886828701614dc4565b9497909650939450505050565b6000815180845261556d816020860160208601615ac7565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b168152600083516155ab816014850160208801615ac7565b8351908301906155c2816014840160208801615ac7565b0160140195945050505050565b600082516155e1818460208701615ac7565b9190910192915050565b8183823760009101908152919050565b6000835161560d818460208801615ac7565b835190830190615621818360208801615ac7565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351615662816017850160208801615ac7565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351615693816028840160208801615ac7565b01602801949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906156d290830184615555565b9695505050505050565b6020815260006125196020830184615555565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b0381118282101715615a0c57615a0c615ba0565b60405290565b604051601f8201601f191681016001600160401b0381118282101715615a3a57615a3a615ba0565b604052919050565b60006001600160401b03821115615a5b57615a5b615ba0565b5060051b60200190565b60008219821115615a7857615a78615b74565b500190565b600082615a8c57615a8c615b8a565b500490565b6000816000190483118215151615615aab57615aab615b74565b500290565b600082821015615ac257615ac2615b74565b500390565b60005b83811015615ae2578181015183820152602001615aca565b838111156118ef5750506000910152565b600081615b0257615b02615b74565b506000190190565b600181811c90821680615b1e57607f821691505b60208210811415615b3f57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415615b5957615b59615b74565b5060010190565b600082615b6f57615b6f615b8a565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461122257600080fd5b6001600160e01b03198116811461122257600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220c8837bc511b6ccff485a4af3c4dbea7eabd6d5c3f6774ea90ad862efc971b60364736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102c95760003560e01c806366e7b60611610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a714610944578063f68e955314610965578063f8895cc814610987578063fce589d81461099c57600080fd5b8063ca15c873146108bb578063d547741f146108db578063e985e9c5146108fb57600080fd5b8063a217fddf146107f2578063a22cb46514610807578063b88d4fde14610827578063bb87c1c814610847578063bce8542e14610862578063c87b56dd1461089b57600080fd5b80638daf3f4e1161012e5780638daf3f4e1461073d5780638f15b4141461075d5780639010d07c1461077d57806391d148541461079d57806393d0da07146107bd57806395d89b41146107dd57600080fd5b806366e7b6061461067b5780636f4c25aa1461069b5780637092d9ea146106bc57806370a08231146106dc57806370d5ae05146106fc5780638d59cc021461071d57600080fd5b806336568abe116102345780634b08b0a3116101ed5780635471a057116101c75780635471a057146105e757806358083969146106075780636017160b1461063b5780636352211e1461065b57600080fd5b80634b08b0a31461058b5780634f1ef286146105b45780634f6ccce7146105c757600080fd5b806336568abe1461048b5780633659cfe6146104ab57806338f292d5146104cb57806342842e0e1461052b57806342966c681461054b57806347f00d5a1461056b57600080fd5b806318160ddd1161028657806318160ddd146103c45780632185810b146103d957806323b872dd146103fb578063248a9ca31461041b5780632f2ff15d1461044b5780632f745c591461046b57600080fd5b806301ffc9a7146102ce57806306fdde0314610303578063081812fc14610325578063095ea7b31461035d5780630ecf9dfd1461037f57806314c44e091461039f575b600080fd5b3480156102da57600080fd5b506102ee6102e9366004615220565b6109b3565b60405190151581526020015b60405180910390f35b34801561030f57600080fd5b506103186109c4565b6040516102fa91906156dc565b34801561033157600080fd5b506103456103403660046151c5565b610a56565b6040516001600160a01b0390911681526020016102fa565b34801561036957600080fd5b5061037d6103783660046150fd565b610ae3565b005b34801561038b57600080fd5b5061037d61039a366004615057565b610bf9565b3480156103ab57600080fd5b506103b66101c85481565b6040519081526020016102fa565b3480156103d057600080fd5b5060fd546103b6565b3480156103e557600080fd5b506101c7546102ee906301000000900460ff1681565b34801561040757600080fd5b5061037d610416366004614eb9565b61102b565b34801561042757600080fd5b506103b66104363660046151c5565b60009081526065602052604090206001015490565b34801561045757600080fd5b5061037d6104663660046151dd565b611082565b34801561047757600080fd5b506103b66104863660046150fd565b6110a4565b34801561049757600080fd5b5061037d6104a63660046151dd565b61113a565b3480156104b757600080fd5b5061037d6104c6366004614e6d565b61115c565b3480156104d757600080fd5b5061050c6104e63660046151c5565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102fa565b34801561053757600080fd5b5061037d610546366004614eb9565b611225565b34801561055757600080fd5b5061037d6105663660046151c5565b611240565b34801561057757600080fd5b5061037d61058636600461550c565b61135b565b34801561059757600080fd5b506101c7546103459064010000000090046001600160a01b031681565b61037d6105c2366004614f8f565b611496565b3480156105d357600080fd5b506103b66105e23660046151c5565b611550565b3480156105f357600080fd5b506101c7546102ee90610100900460ff1681565b34801561061357600080fd5b506103b67fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b34801561064757600080fd5b506103186106563660046151c5565b6115f1565b34801561066757600080fd5b506103456106763660046151c5565b61168c565b34801561068757600080fd5b5061037d610696366004615126565b611703565b3480156106a757600080fd5b506101c7546102ee9062010000900460ff1681565b3480156106c857600080fd5b5061037d6106d7366004614fda565b6118f5565b3480156106e857600080fd5b506103b66106f7366004614e6d565b611c24565b34801561070857600080fd5b506101c954610345906001600160a01b031681565b34801561072957600080fd5b5061037d610738366004614fda565b611cab565b34801561074957600080fd5b5061037d610758366004615258565b611d5b565b34801561076957600080fd5b5061037d6107783660046152c9565b612386565b34801561078957600080fd5b506103456107983660046151ff565b612501565b3480156107a957600080fd5b506102ee6107b83660046151dd565b612520565b3480156107c957600080fd5b5061037d6107d836600461550c565b61254b565b3480156107e957600080fd5b506103186126ad565b3480156107fe57600080fd5b506103b6600081565b34801561081357600080fd5b5061037d610822366004614f59565b6126bc565b34801561083357600080fd5b5061037d610842366004614ef4565b612781565b34801561085357600080fd5b506101c7546102ee9060ff1681565b34801561086e57600080fd5b506103b661087d366004615297565b80516020818301810180516101c48252928201919093012091525481565b3480156108a757600080fd5b506103186108b63660046151c5565b6127d8565b3480156108c757600080fd5b506103b66108d63660046151c5565b6127e3565b3480156108e757600080fd5b5061037d6108f63660046151dd565b6127fa565b34801561090757600080fd5b506102ee610916366004614e87565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561095057600080fd5b506101cb54610345906001600160a01b031681565b34801561097157600080fd5b506103b6600080516020615c0283398151915281565b34801561099357600080fd5b50610318612804565b3480156109a857600080fd5b506103b66101ca5481565b60006109be82612812565b92915050565b606060c980546109d390615b0a565b80601f01602080910402602001604051908101604052809291908181526020018280546109ff90615b0a565b8015610a4c5780601f10610a2157610100808354040283529160200191610a4c565b820191906000526020600020905b815481529060010190602001808311610a2f57829003601f168201915b5050505050905090565b6000610a6182612837565b610ac75760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610aee8261168c565b9050806001600160a01b0316836001600160a01b03161415610b5c5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610abe565b336001600160a01b0382161480610b785750610b788133610916565b610bea5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610abe565b610bf48383612854565b505050565b6101c75460ff16610c685760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610abe565b610c71876128c2565b610c8d5760405162461bcd60e51b8152600401610abe9061593f565b6101c75462010000900460ff1615610d205760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610abe565b84610d895760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610abe565b610dc886868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061295f92505050565b15610e3b5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610abe565b336001600160a01b03881614610ea95760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610abe565b610f518787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061298a92505050565b610fad5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610abe565b6110218787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b018190048102820181019092528981529250899150889081908401838280828437600092019190915250612a2f92505050565b5050505050505050565b611036335b82612abe565b6110525760405162461bcd60e51b8152600401610abe90615827565b61105b826128c2565b6110775760405162461bcd60e51b8152600401610abe9061593f565b610bf4838383612bbe565b61108c8282612d69565b6000828152609760205260409020610bf49082612d8f565b60006110af83611c24565b82106111115760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610abe565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6111448282612da4565b6000828152609760205260409020610bf49082612e1e565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111a55760405162461bcd60e51b8152600401610abe90615741565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166111d7612e33565b6001600160a01b0316146111fd5760405162461bcd60e51b8152600401610abe9061578d565b61120681612e61565b6040805160008082526020820190925261122291839190612e7a565b50565b610bf483838360405180602001604052806000815250612781565b61124933611030565b6112655760405162461bcd60e51b8152600401610abe90615827565b61126e81612fbe565b60008181526101c66020526040902060010154156112225760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156112ff57600080fd5b505af1158015611313573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061133791906151a9565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b6113636130a3565b6113ca5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610abe565b6113d5335b84612abe565b6113f15760405162461bcd60e51b8152600401610abe90615827565b6114318383838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506130d592505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f48383836040516020016114669291906155eb565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156114df5760405162461bcd60e51b8152600401610abe90615741565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316611511612e33565b6001600160a01b0316146115375760405162461bcd60e51b8152600401610abe9061578d565b61154082612e61565b61154c82826001612e7a565b5050565b600061155b60fd5490565b82106115be5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610abe565b60fd82815481106115df57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c5602052600090815260409020805461160b90615b0a565b80601f016020809104026020016040519081016040528092919081815260200182805461163790615b0a565b80156116845780601f1061165957610100808354040283529160200191611684565b820191906000526020600020905b81548152906001019060200180831161166757829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109be5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610abe565b61171b600080516020615c0283398151915233612520565b6117375760405162461bcd60e51b8152600401610abe90615891565b81518351146117c15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610abe565b81518151146118525760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610abe565b60005b83518110156118ef576118de84828151811061188157634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106118a957634e487b7160e01b600052603260045260246000fd5b60200260200101518484815181106118d157634e487b7160e01b600052603260045260246000fd5b6020026020010151612a2f565b506118e881615b45565b9050611855565b50505050565b6101c75464010000000090046001600160a01b031661197c5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610abe565b6119bb84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061295f92505050565b156119d85760405162461bcd60e51b8152600401610abe906158ee565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015611a4357600080fd5b505af1158015611a57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a7b91906151a9565b506000611af28686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250612a2f92505050565b905060006127106101ca546101c854611b0b9190615a91565b611b159190615a7d565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611b7257600080fd5b505af1158015611b86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611baa91906151a9565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611be0908490615ab0565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611c8f5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610abe565b506001600160a01b0316600090815260cc602052604090205490565b611cc3600080516020615c0283398151915233612520565b611cdf5760405162461bcd60e51b8152600401610abe90615891565b611d538585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f89018190048102820181019092528781529250879150869081908401838280828437600092019190915250612a2f92505050565b505050505050565b611d73600080516020615c0283398151915233612520565b611dcf5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610abe565b6000611ddd8284018461534a565b80515190915015611e295780518051600090611e0957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611e27929190614aad565b505b60208101515115611e7c578060200151600081518110611e5957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b60408101515115611ecf578060400151600081518110611eac57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b60608101515115611f22578060600151600081518110611eff57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b60808101515115611f75578060800151600081518110611f5257634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b60a08101515115611fd5578060a00151600081518110611fa557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115612015578060c0015160008151811061200557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b60e08101515115612075578060e0015160008151811061204557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b61010081015151156121a0576127108161010001516000815181106120aa57634e487b7160e01b600052603260045260246000fd5b6020026020010151111580156120ee575060008161010001516000815181106120e357634e487b7160e01b600052603260045260246000fd5b602002602001015110155b61216a5760405162461bcd60e51b815260206004820152604160248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201527f74206265206765207468616e203020616e64206c65207468616e2031303030306064820152601760f91b608482015260a401610abe565b80610100015160008151811061219057634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b6101208101515115610bf45760006001600160a01b03168161012001516000815181106121dd57634e487b7160e01b600052603260045260246000fd5b60200260200101516001600160a01b0316141561220a576101cb80546001600160a01b0319169055505050565b80610120015160008151811061223057634e487b7160e01b600052603260045260246000fd5b60209081029190910101516040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b03909116906301ffc9a79060240160206040518083038186803b15801561228257600080fd5b505afa158015612296573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122ba91906151a9565b61232c5760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610abe565b80610120015160008151811061235257634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff168061239f575060005460ff16155b6123bb5760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff161580156123dd576000805461ffff19166101011790555b6123e5613161565b6123ed6131d4565b6123f5613243565b6123fd613243565b6124056132a1565b61240f85856132ff565b61241a600083613386565b612432600080516020615c0283398151915284613386565b61246a600080516020615c028339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba613390565b6124947fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba84613386565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb8054909116905580156124fa576000805461ff00191690555b5050505050565b600082815260976020526040812061251990836133db565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6125536133e7565b6125b85760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610abe565b6125c1336113cf565b6125dd5760405162461bcd60e51b8152600401610abe90615827565b61261c82828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061295f92505050565b156126395760405162461bcd60e51b8152600401610abe906158ee565b826101c4838360405161264d9291906155eb565b90815260408051602092819003830190209290925560008581526101c590915220612679908383614b31565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c838383604051611489939291906159b3565b606060ca80546109d390615b0a565b6001600160a01b0382163314156127155760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610abe565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61278b3383612abe565b6127a75760405162461bcd60e51b8152600401610abe90615827565b6127b0836128c2565b6127cc5760405162461bcd60e51b8152600401610abe9061593f565b6118ef84848484613415565b60606109be82613448565b60008181526097602052604081206109be906135b8565b61114482826135c2565b6101c3805461160b90615b0a565b60006001600160e01b0319821663780e9d6360e01b14806109be57506109be826135e8565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b03841690811790915581906128898261168c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b031615806109be57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561292057600080fd5b505afa158015612934573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061295891906154f4565b1192915050565b60006101c48260405161297291906155cf565b90815260405190819003602001902054151592915050565b600080612a058686866040516020016129a593929190615581565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b9050612a23600080516020615c028339815191526107b88386613628565b9150505b949350505050565b815160009015612ab457612a428361295f565b15612a5f5760405162461bcd60e51b8152600401610abe906158ee565b612a69848361364c565b9050806101c484604051612a7d91906155cf565b90815260408051602092819003830190209290925560008381526101c58252919091208451612aae92860190614aad565b50612519565b612a27848361364c565b6000612ac982612837565b612b2a5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610abe565b6000612b358361168c565b9050806001600160a01b0316846001600160a01b03161480612b705750836001600160a01b0316612b6584610a56565b6001600160a01b0316145b80612ba057506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b80612a275750612a27600080516020615c0283398151915285612520565b826001600160a01b0316612bd18261168c565b6001600160a01b031614612c395760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610abe565b6001600160a01b038216612c9b5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610abe565b612ca68383836136a7565b612cb1600082612854565b6001600160a01b038316600090815260cc60205260408120805460019290612cda908490615ab0565b90915550506001600160a01b038216600090815260cc60205260408120805460019290612d08908490615a65565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612d85813361371b565b610bf4838361377f565b6000612519836001600160a01b038416613805565b6001600160a01b0381163314612e145760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610abe565b61154c8282613854565b6000612519836001600160a01b0384166138bb565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b600080516020615c0283398151915261154c813361371b565b6000612e84612e33565b9050612e8f846139d8565b600083511180612e9c5750815b15612ead57612eab8484613a7d565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff166124fa57805460ff191660011781556040516001600160a01b0383166024820152612f2c90869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613a7d565b50805460ff19168155612f3d612e33565b6001600160a01b0316826001600160a01b031614612fb55760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610abe565b6124fa85613b68565b612fc781613ba8565b60008181526101c5602052604081208054612fe190615b0a565b80601f016020809104026020016040519081016040528092919081815260200182805461300d90615b0a565b801561305a5780601f1061302f5761010080835404028352916020019161305a565b820191906000526020600020905b81548152906001019060200180831161303d57829003601f168201915b50505060008581526101c56020526040812093945061307c9392509050614ba5565b6101c48160405161308d91906155cf565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff16806130d057506130d0600080516020615c0283398151915233612520565b905090565b6130de82612837565b6131415760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610abe565b600082815261012d602090815260409091208251610bf492840190614aad565b600054610100900460ff168061317a575060005460ff16155b6131965760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff161580156131b8576000805461ffff19166101011790555b6131c0613bea565b8015611222576000805461ff001916905550565b600054610100900460ff16806131ed575060005460ff16155b6132095760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff1615801561322b576000805461ffff19166101011790555b613233613bea565b61323b613bea565b6131b8613bea565b600054610100900460ff168061325c575060005460ff16155b6132785760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff16158015613233576000805461ffff191661010117905561323b613bea565b600054610100900460ff16806132ba575060005460ff16155b6132d65760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff1615801561323b576000805461ffff19166101011790556131b8613bea565b600054610100900460ff1680613318575060005460ff16155b6133345760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff16158015613356576000805461ffff19166101011790555b61335e613bea565b613366613bea565b6133708383613c54565b8015610bf4576000805461ff0019169055505050565b61108c8282613ce9565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006125198383613cf3565b6101c75460009062010000900460ff16806130d057506130d0600080516020615c0283398151915233612520565b613420848484612bbe565b61342c84848484613d2b565b6118ef5760405162461bcd60e51b8152600401610abe906156ef565b606061345382612837565b6134b95760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610abe565b600082815261012d6020526040812080546134d390615b0a565b80601f01602080910402602001604051908101604052809291908181526020018280546134ff90615b0a565b801561354c5780601f106135215761010080835404028352916020019161354c565b820191906000526020600020905b81548152906001019060200180831161352f57829003601f168201915b50505050509050600061356a60408051602081019091526000815290565b905080516000141561357d575092915050565b8151156135af5780826040516020016135979291906155fb565b60405160208183030381529060405292505050919050565b612a2784613e35565b60006109be825490565b6000828152606560205260409020600101546135de813361371b565b610bf48383613854565b60006001600160e01b031982166380ac58cd60e01b148061361957506001600160e01b03198216635b5e139f60e01b145b806109be57506109be82613f0c565b60008060006136378585613f31565b9150915061364481613fa1565b509392505050565b6000613657836128c2565b6136735760405162461bcd60e51b8152600401610abe9061593f565b6101cc54613682906001615a65565b905061368e83826141a2565b61369d6101cc80546001019055565b6109be81836130d5565b6136af6142e1565b6137105760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610abe565b610bf4838383614310565b6137258282612520565b61154c5761373d816001600160a01b031660146143c8565b6137488360206143c8565b60405160200161375992919061562a565b60408051601f198184030181529082905262461bcd60e51b8252610abe916004016156dc565b6137898282612520565b61154c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556137c13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600081815260018301602052604081205461384c575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556109be565b5060006109be565b61385e8282612520565b1561154c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600081815260018301602052604081205480156139ce5760006138df600183615ab0565b85549091506000906138f390600190615ab0565b905081811461397457600086600001828154811061392157634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061395257634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061399357634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506109be565b60009150506109be565b803b613a3c5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610abe565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b613adc5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610abe565b600080846001600160a01b031684604051613af791906155cf565b600060405180830381855af49150503d8060008114613b32576040519150601f19603f3d011682016040523d82523d6000602084013e613b37565b606091505b5091509150613b5f8282604051806060016040528060278152602001615bdb602791396145a9565b95945050505050565b613b71816139d8565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b613bb1816145e2565b600081815261012d602052604090208054613bcb90615b0a565b15905061122257600081815261012d6020526040812061122291614ba5565b600054610100900460ff1680613c03575060005460ff16155b613c1f5760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff161580156131c0576000805461ffff19166101011790558015611222576000805461ff001916905550565b600054610100900460ff1680613c6d575060005460ff16155b613c895760405162461bcd60e51b8152600401610abe906157d9565b600054610100900460ff16158015613cab576000805461ffff19166101011790555b8251613cbe9060c9906020860190614aad565b508151613cd29060ca906020850190614aad565b508015610bf4576000805461ff0019169055505050565b61154c828261377f565b6000826000018281548110613d1857634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613e2d57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613d6f90339089908890889060040161569f565b602060405180830381600087803b158015613d8957600080fd5b505af1925050508015613db9575060408051601f3d908101601f19168201909252613db69181019061523c565b60015b613e13573d808015613de7576040519150601f19603f3d011682016040523d82523d6000602084013e613dec565b606091505b508051613e0b5760405162461bcd60e51b8152600401610abe906156ef565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612a27565b506001612a27565b6060613e4082612837565b613ea45760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610abe565b6000613ebb60408051602081019091526000815290565b90506000815111613edb5760405180602001604052806000815250612519565b80613ee584614689565b604051602001613ef69291906155fb565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b14806109be57506109be826147a2565b600080825160411415613f685760208301516040840151606085015160001a613f5c878285856147d7565b94509450505050613f9a565b825160401415613f925760208301516040840151613f878683836148c4565b935093505050613f9a565b506000905060025b9250929050565b6000816004811115613fc357634e487b7160e01b600052602160045260246000fd5b1415613fcc5750565b6001816004811115613fee57634e487b7160e01b600052602160045260246000fd5b141561403c5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610abe565b600281600481111561405e57634e487b7160e01b600052602160045260246000fd5b14156140ac5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610abe565b60038160048111156140ce57634e487b7160e01b600052602160045260246000fd5b14156141275760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610abe565b600481600481111561414957634e487b7160e01b600052602160045260246000fd5b14156112225760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610abe565b6001600160a01b0382166141f85760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610abe565b61420181612837565b1561424e5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610abe565b61425a600083836136a7565b6001600160a01b038216600090815260cc60205260408120805460019290614283908490615a65565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff16806130d057506130d0600080516020615c0283398151915233612520565b6001600160a01b03831661436b576143668160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b61438e565b816001600160a01b0316836001600160a01b03161461438e5761438e83826148f3565b6001600160a01b0382166143a557610bf481614990565b826001600160a01b0316826001600160a01b031614610bf457610bf48282614a69565b606060006143d7836002615a91565b6143e2906002615a65565b6001600160401b0381111561440757634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015614431576020820181803683370190505b509050600360fc1b8160008151811061445a57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061449757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006144bb846002615a91565b6144c6906001615a65565b90505b600181111561455a576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061450857634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061452c57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361455381615af3565b90506144c9565b5083156125195760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610abe565b606083156145b8575081612519565b8251156145c85782518084602001fd5b8160405162461bcd60e51b8152600401610abe91906156dc565b60006145ed8261168c565b90506145fb816000846136a7565b614606600083612854565b6001600160a01b038116600090815260cc6020526040812080546001929061462f908490615ab0565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816146ad5750506040805180820190915260018152600360fc1b602082015290565b8160005b81156146d757806146c181615b45565b91506146d09050600a83615a7d565b91506146b1565b6000816001600160401b038111156146ff57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015614729576020820181803683370190505b5090505b8415612a275761473e600183615ab0565b915061474b600a86615b60565b614756906030615a65565b60f81b81838151811061477957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535061479b600a86615a7d565b945061472d565b60006001600160e01b03198216637965db0b60e01b14806109be57506301ffc9a760e01b6001600160e01b03198316146109be565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561480e57506000905060036148bb565b8460ff16601b1415801561482657508460ff16601c14155b1561483757506000905060046148bb565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561488b573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166148b4576000600192509250506148bb565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b016148e5878288856147d7565b935093505050935093915050565b6000600161490084611c24565b61490a9190615ab0565b600083815260fc602052604090205490915080821461495d576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd546000906149a290600190615ab0565b600083815260fe602052604081205460fd80549394509092849081106149d857634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd8381548110614a0757634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd805480614a4d57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000614a7483611c24565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614ab990615b0a565b90600052602060002090601f016020900481019282614adb5760008555614b21565b82601f10614af457805160ff1916838001178555614b21565b82800160010185558215614b21579182015b82811115614b21578251825591602001919060010190614b06565b50614b2d929150614bdb565b5090565b828054614b3d90615b0a565b90600052602060002090601f016020900481019282614b5f5760008555614b21565b82601f10614b785782800160ff19823516178555614b21565b82800160010185558215614b21579182015b82811115614b21578235825591602001919060010190614b8a565b508054614bb190615b0a565b6000825580601f10614bc1575050565b601f01602090049060005260206000209081019061122291905b5b80821115614b2d5760008155600101614bdc565b80356001600160a01b0381168114614c0757600080fd5b919050565b600082601f830112614c1c578081fd5b81356020614c31614c2c83615a42565b615a12565b80838252828201915082860187848660051b8901011115614c50578586fd5b855b85811015614c7557614c6382614bf0565b84529284019290840190600101614c52565b5090979650505050505050565b600082601f830112614c92578081fd5b81356020614ca2614c2c83615a42565b80838252828201915082860187848660051b8901011115614cc1578586fd5b855b85811015614c75578135614cd681615bb6565b84529284019290840190600101614cc3565b600082601f830112614cf8578081fd5b81356020614d08614c2c83615a42565b80838252828201915082860187848660051b8901011115614d27578586fd5b855b85811015614c755781356001600160401b03811115614d46578788fd5b614d548a87838c0101614e03565b8552509284019290840190600101614d29565b600082601f830112614d77578081fd5b81356020614d87614c2c83615a42565b80838252828201915082860187848660051b8901011115614da6578586fd5b855b85811015614c7557813584529284019290840190600101614da8565b60008083601f840112614dd5578182fd5b5081356001600160401b03811115614deb578182fd5b602083019150836020828501011115613f9a57600080fd5b600082601f830112614e13578081fd5b81356001600160401b03811115614e2c57614e2c615ba0565b614e3f601f8201601f1916602001615a12565b818152846020838601011115614e53578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614e7e578081fd5b61251982614bf0565b60008060408385031215614e99578081fd5b614ea283614bf0565b9150614eb060208401614bf0565b90509250929050565b600080600060608486031215614ecd578081fd5b614ed684614bf0565b9250614ee460208501614bf0565b9150604084013590509250925092565b60008060008060808587031215614f09578182fd5b614f1285614bf0565b9350614f2060208601614bf0565b92506040850135915060608501356001600160401b03811115614f41578182fd5b614f4d87828801614e03565b91505092959194509250565b60008060408385031215614f6b578182fd5b614f7483614bf0565b91506020830135614f8481615bb6565b809150509250929050565b60008060408385031215614fa1578182fd5b614faa83614bf0565b915060208301356001600160401b03811115614fc4578182fd5b614fd085828601614e03565b9150509250929050565b600080600080600060608688031215614ff1578283fd5b614ffa86614bf0565b945060208601356001600160401b0380821115615015578485fd5b61502189838a01614dc4565b90965094506040880135915080821115615039578283fd5b5061504688828901614dc4565b969995985093965092949392505050565b60008060008060008060006080888a031215615071578485fd5b61507a88614bf0565b965060208801356001600160401b0380821115615095578687fd5b6150a18b838c01614dc4565b909850965060408a01359150808211156150b9578384fd5b6150c58b838c01614dc4565b909650945060608a01359150808211156150dd578384fd5b506150ea8a828b01614dc4565b989b979a50959850939692959293505050565b6000806040838503121561510f578182fd5b61511883614bf0565b946020939093013593505050565b60008060006060848603121561513a578081fd5b83356001600160401b0380821115615150578283fd5b61515c87838801614c0c565b94506020860135915080821115615171578283fd5b61517d87838801614ce8565b93506040860135915080821115615192578283fd5b5061519f86828701614ce8565b9150509250925092565b6000602082840312156151ba578081fd5b815161251981615bb6565b6000602082840312156151d6578081fd5b5035919050565b600080604083850312156151ef578182fd5b82359150614eb060208401614bf0565b60008060408385031215615211578182fd5b50508035926020909101359150565b600060208284031215615231578081fd5b813561251981615bc4565b60006020828403121561524d578081fd5b815161251981615bc4565b6000806020838503121561526a578182fd5b82356001600160401b0381111561527f578283fd5b61528b85828601614dc4565b90969095509350505050565b6000602082840312156152a8578081fd5b81356001600160401b038111156152bd578182fd5b612a2784828501614e03565b600080600080608085870312156152de578182fd5b84356001600160401b03808211156152f4578384fd5b61530088838901614e03565b95506020870135915080821115615315578384fd5b5061532287828801614e03565b93505061533160408601614bf0565b915061533f60608601614bf0565b905092959194509250565b60006020828403121561535b578081fd5b81356001600160401b0380821115615371578283fd5b908301906101408286031215615385578283fd5b61538d6159e9565b82358281111561539b578485fd5b6153a787828601614ce8565b8252506020830135828111156153bb578485fd5b6153c787828601614c82565b6020830152506040830135828111156153de578485fd5b6153ea87828601614c82565b604083015250606083013582811115615401578485fd5b61540d87828601614c82565b606083015250608083013582811115615424578485fd5b61543087828601614c82565b60808301525060a083013582811115615447578485fd5b61545387828601614c0c565b60a08301525060c08301358281111561546a578485fd5b61547687828601614d67565b60c08301525060e08301358281111561548d578485fd5b61549987828601614c0c565b60e08301525061010080840135838111156154b2578586fd5b6154be88828701614d67565b82840152505061012080840135838111156154d7578586fd5b6154e388828701614c0c565b918301919091525095945050505050565b600060208284031215615505578081fd5b5051919050565b600080600060408486031215615520578081fd5b8335925060208401356001600160401b0381111561553c578182fd5b61554886828701614dc4565b9497909650939450505050565b6000815180845261556d816020860160208601615ac7565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b168152600083516155ab816014850160208801615ac7565b8351908301906155c2816014840160208801615ac7565b0160140195945050505050565b600082516155e1818460208701615ac7565b9190910192915050565b8183823760009101908152919050565b6000835161560d818460208801615ac7565b835190830190615621818360208801615ac7565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351615662816017850160208801615ac7565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351615693816028840160208801615ac7565b01602801949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906156d290830184615555565b9695505050505050565b6020815260006125196020830184615555565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b0381118282101715615a0c57615a0c615ba0565b60405290565b604051601f8201601f191681016001600160401b0381118282101715615a3a57615a3a615ba0565b604052919050565b60006001600160401b03821115615a5b57615a5b615ba0565b5060051b60200190565b60008219821115615a7857615a78615b74565b500190565b600082615a8c57615a8c615b8a565b500490565b6000816000190483118215151615615aab57615aab615b74565b500290565b600082821015615ac257615ac2615b74565b500390565b60005b83811015615ae2578181015183820152602001615aca565b838111156118ef5750506000910152565b600081615b0257615b02615b74565b506000190190565b600181811c90821680615b1e57607f821691505b60208210811415615b3f57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415615b5957615b59615b74565b5060010190565b600082615b6f57615b6f615b8a565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461122257600080fd5b6001600160e01b03198116811461122257600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220c8837bc511b6ccff485a4af3c4dbea7eabd6d5c3f6774ea90ad862efc971b60364736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
