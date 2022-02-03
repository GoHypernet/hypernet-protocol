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
          indexed: false,
          internalType: "bytes32",
          name: "merkleRoot",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "frozen",
          type: "bool",
        },
      ],
      name: "MerkleRootUpdated",
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
      inputs: [],
      name: "baseURI",
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
      inputs: [],
      name: "frozen",
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
          name: "_primaryRegistry",
          type: "address",
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
      inputs: [],
      name: "merkleRoot",
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
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
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
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
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
          internalType: "bytes32",
          name: "_merkleRoot",
          type: "bytes32",
        },
        {
          internalType: "bool",
          name: "freeze",
          type: "bool",
        },
      ],
      name: "setMerkleRoot",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_primaryRegistry",
          type: "address",
        },
      ],
      name: "setPrimaryRegistry",
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
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURINoBase",
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
  ],
  bytecode:
    "0x60806040523480156200001157600080fd5b50600054610100900460ff166200002f5760005460ff161562000039565b62000039620000de565b620000a15760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000c4576000805461ffff19166101011790555b8015620000d7576000805461ff00191690555b5062000102565b6000620000f630620000fc60201b620021171760201c565b15905090565b3b151590565b6149b580620001126000396000f3fe608060405234801561001057600080fd5b50600436106102f15760003560e01c80636c0360eb1161019d578063a8f1c6d8116100e9578063d547741f116100a2578063f041b4a71161007c578063f041b4a71461071a578063f68e95531461072e578063f8895cc814610743578063fce589d81461074b57600080fd5b8063d547741f146106b8578063db0ed6a0146106cb578063e985e9c5146106de57600080fd5b8063a8f1c6d81461062d578063b88d4fde14610640578063bce8542e14610653578063c87b56dd1461067f578063ca15c87314610692578063cb9c6154146106a557600080fd5b80639010d07c1161015657806395d89b411161013057806395d89b41146105f7578063a10474c7146105ff578063a217fddf14610612578063a22cb4651461061a57600080fd5b80639010d07c146105be57806391d14854146105d157806393d0da07146105e457600080fd5b80636c0360eb146105565780636f4c25aa1461055e57806370a082311461057157806370d5ae05146105845780638792ffef146105985780638daf3f4e146105ab57600080fd5b80632f2ff15d1161025c57806347f00d5a116102155780635471a057116101ef5780635471a057146104fb57806358083969146105095780636017160b146105305780636352211e1461054357600080fd5b806347f00d5a146104ba5780634b08b0a3146104cd5780634f6ccce7146104e857600080fd5b80632f2ff15d146104085780632f745c591461041b57806336568abe1461042e57806338f292d51461044157806342842e0e1461049457806342966c68146104a757600080fd5b806318160ddd116102ae57806318160ddd146103995780632185810b146103a157806323b872dd146103b5578063248a9ca3146103c8578063267be25c146103eb5780632eb4a7ab146103fe57600080fd5b806301ffc9a7146102f6578063054f7d9c1461031e57806306fdde031461032c578063081812fc14610341578063095ea7b31461036c57806314c44e0914610381575b600080fd5b6103096103043660046140be565b610755565b60405190151581526020015b60405180910390f35b610169546103099060ff1681565b610334610766565b6040516103159190614518565b61035461034f36600461403f565b6107f8565b6040516001600160a01b039091168152602001610315565b61037f61037a366004613ffa565b610885565b005b61038b6101645481565b604051908152602001610315565b60fd5461038b565b610163546103099062010000900460ff1681565b61037f6103c3366004613e8c565b61099b565b61038b6103d636600461403f565b60009081526065602052604090206001015490565b61037f6103f9366004613f75565b6109f2565b61038b6101685481565b61037f610416366004614057565b610d7a565b61038b610429366004613ffa565b610da0565b61037f61043c366004614057565b610e36565b61047561044f36600461403f565b61016260205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b039093168352602083019190915201610315565b61037f6104a2366004613e8c565b610eb4565b61037f6104b536600461403f565b610ecf565b61037f6104c8366004614396565b61104a565b6101635461035490630100000090046001600160a01b031681565b61038b6104f636600461403f565b611185565b610163546103099060ff1681565b61038b7fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b61033461053e36600461403f565b611226565b61035461055136600461403f565b6112c1565b610334611338565b6101635461030990610100900460ff1681565b61038b61057f366004613e40565b611346565b61016554610354906001600160a01b031681565b61037f6105a6366004613f75565b6113cd565b61037f6105b93660046140f6565b6114d5565b6103546105cc36600461409d565b611887565b6103096105df366004614057565b6118a6565b61037f6105f2366004614396565b6118d1565b610334611a33565b61037f61060d366004613e40565b611a42565b61038b600081565b61037f610628366004613f3f565b611bd8565b61037f61063b366004614079565b611be3565b61037f61064e366004613ec7565b611cde565b61038b610661366004614135565b80516020818301810180516101608252928201919093012091525481565b61033461068d36600461403f565b611d35565b61038b6106a036600461403f565b611d40565b6103346106b336600461403f565b611d57565b61037f6106c6366004614057565b611f10565b61037f6106d9366004614167565b611f36565b6103096106ec366004613e5a565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b61016754610354906001600160a01b031681565b61038b60008051602061496083398151915281565b610334612109565b61038b6101665481565b60006107608261211d565b92915050565b606060c9805461077590614895565b80601f01602080910402602001604051908101604052809291908181526020018280546107a190614895565b80156107ee5780601f106107c3576101008083540402835291602001916107ee565b820191906000526020600020905b8154815290600101906020018083116107d157829003601f168201915b5050505050905090565b600061080382612142565b6108695760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610890826112c1565b9050806001600160a01b0316836001600160a01b031614156108fe5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610860565b336001600160a01b038216148061091a575061091a81336106ec565b61098c5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610860565b610996838361215f565b505050565b6109a6335b826121cd565b6109c25760405162461bcd60e51b8152600401610860906145c4565b6109cb826122d5565b6109e75760405162461bcd60e51b8152600401610860906146ca565b610996838383612372565b61016354630100000090046001600160a01b0316610a785760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610860565b610ab785858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061251d92505050565b15610ad45760405162461bcd60e51b81526004016108609061462e565b61016354630100000090046001600160a01b03166323b872dd33610164546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015610b3e57600080fd5b505af1158015610b52573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b769190614023565b610bd65760405162461bcd60e51b815260206004820152602b60248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e207472616e7360448201526a3332b9103330b4b632b21760a91b6064820152608401610860565b610c4c8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612548915050565b60006127106101665461016454610c63919061481c565b610c6d9190614808565b610163546101655460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018490529293506301000000909104169063a9059cbb90604401602060405180830381600087803b158015610cc957600080fd5b505af1158015610cdd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d019190614023565b506040805180820190915261016354630100000090046001600160a01b03168152610164546020820190610d3690849061483b565b9052600092835261016260209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b600082815260656020526040902060010154610d9681336125d4565b6109968383612638565b6000610dab83611346565b8210610e0d5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610860565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6001600160a01b0381163314610ea65760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610860565b610eb0828261265a565b5050565b61099683838360405180602001604052806000815250611cde565b610ed8336109a0565b610ef45760405162461bcd60e51b8152600401610860906145c4565b610efd8161267c565b600081815261016260205260409020600101541561104757600081815261016260205260409020546001600160a01b031663a9059cbb33600084815261016260205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b158015610f8e57600080fd5b505af1158015610fa2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fc69190614023565b6110255760405162461bcd60e51b815260206004820152602a60248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e2074616e736660448201526932b9103330b4b632b21760b11b6064820152608401610860565b60008181526101626020526040812080546001600160a01b0319168155600101555b50565b611052612761565b6110b95760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610860565b6110c4335b846121cd565b6110e05760405162461bcd60e51b8152600401610860906145c4565b6111208383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061278e92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f483838360405160200161115592919061440b565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b600061119060fd5490565b82106111f35760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610860565b60fd828154811061121457634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b610161602052600090815260409020805461124090614895565b80601f016020809104026020016040519081016040528092919081815260200182805461126c90614895565b80156112b95780601f1061128e576101008083540402835291602001916112b9565b820191906000526020600020905b81548152906001019060200180831161129c57829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806107605760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610860565b61016a805461124090614895565b60006001600160a01b0382166113b15760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610860565b506001600160a01b0316600090815260cc602052604090205490565b6113e5600080516020614960833981519152336118a6565b6114575760405162461bcd60e51b815260206004820152603a60248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260448201527f656769737472617220726f6c6520746f2072656769737465722e0000000000006064820152608401610860565b6114cd8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612548915050565b505050505050565b6114ed600080516020614960833981519152336118a6565b6115095760405162461bcd60e51b81526004016108609061457d565b6000611517828401846141f9565b80515190915015611563578051805160009061154357634e487b7160e01b600052603260045260246000fd5b602002602001015161015f9080519060200190611561929190613a6d565b505b602081015151156115b657806020015160008151811061159357634e487b7160e01b600052603260045260246000fd5b602002602001015161016360006101000a81548160ff0219169083151502179055505b604081015151156116095780604001516000815181106115e657634e487b7160e01b600052603260045260246000fd5b602002602001015161016360016101000a81548160ff0219169083151502179055505b6060810151511561165c57806060015160008151811061163957634e487b7160e01b600052603260045260246000fd5b602002602001015161016360026101000a81548160ff0219169083151502179055505b608081015151156116bc57806080015160008151811061168c57634e487b7160e01b600052603260045260246000fd5b602002602001015161016360036101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60a081015151156116fc578060a001516000815181106116ec57634e487b7160e01b600052603260045260246000fd5b6020026020010151610164819055505b60c0810151511561175c578060c0015160008151811061172c57634e487b7160e01b600052603260045260246000fd5b602002602001015161016560006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60e08101515115611831576127108160e0015160008151811061178f57634e487b7160e01b600052603260045260246000fd5b602002602001015111156117fc5760405162461bcd60e51b815260206004820152602e60248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201526d3a1031329036329018981818181760911b6064820152608401610860565b8060e0015160008151811061182157634e487b7160e01b600052603260045260246000fd5b6020026020010151610166819055505b61010081015151156109965780610100015160008151811061186357634e487b7160e01b600052603260045260246000fd5b602002602001015161016a9080519060200190611881929190613a6d565b50505050565b600082815260976020526040812061189f908361281a565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6118d9612826565b61193e5760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610860565b611947336110be565b6119635760405162461bcd60e51b8152600401610860906145c4565b6119a282828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061251d92505050565b156119bf5760405162461bcd60e51b81526004016108609061462e565b8261016083836040516119d392919061440b565b9081526040805160209281900383019020929092556000858152610161909152206119ff908383613af1565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c8383836040516111789392919061473e565b606060ca805461077590614895565b611a4d6000336118a6565b611aa55760405162461bcd60e51b815260206004820152602360248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652061646d60448201526234b71760e91b6064820152608401610860565b6001600160a01b038116611ac75761016780546001600160a01b031916905550565b6040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b038216906301ffc9a79060240160206040518083038186803b158015611b0d57600080fd5b505afa158015611b21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b459190614023565b611bb75760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610860565b61016780546001600160a01b0383166001600160a01b031990911617905550565b610eb0338383612853565b611bfb600080516020614960833981519152336118a6565b611c175760405162461bcd60e51b81526004016108609061457d565b6101695460ff1615611c845760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a206d65726b6c65526f6f742060448201526f3430b9903132b2b710333937bd32b71760811b6064820152608401610860565b610168829055610169805460ff19168215159081179091556040805184815260ff909216151560208301527fc72271867375e4dc99b635d35b37f44698b889895effb6891602e23128d4f68d910160405180910390a15050565b611ce833836121cd565b611d045760405162461bcd60e51b8152600401610860906145c4565b611d0d836122d5565b611d295760405162461bcd60e51b8152600401610860906146ca565b61188184848484612922565b606061076082612955565b600081815260976020526040812061076090612ab8565b6060600061016a8054611d6990614895565b80601f0160208091040260200160405190810160405280929190818152602001828054611d9590614895565b8015611de25780601f10611db757610100808354040283529160200191611de2565b820191906000526020600020905b815481529060010190602001808311611dc557829003601f168201915b50505050509050805160001415611dfc5761189f83612955565b6000611e0784612955565b9050600082518251611e19919061483b565b6001600160401b03811115611e3e57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611e68576020820181803683370190505b50905060005b83518351611e7c919061483b565b811015611f015782845182611e9191906147f0565b81518110611eaf57634e487b7160e01b600052603260045260246000fd5b602001015160f81c60f81b828281518110611eda57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611efa816148ca565b9050611e6e565b50949350505050565b50919050565b600082815260656020526040902060010154611f2c81336125d4565b610996838361265a565b600054610100900460ff16611f515760005460ff1615611f55565b303b155b611fb85760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610860565b600054610100900460ff16158015611fda576000805461ffff19166101011790555b611fe2612ac2565b611fea612af3565b611ff2612b32565b611ffa612b32565b6120048686612b59565b61200f600083612b9a565b61202760008051602061496083398151915284612b9a565b61205f6000805160206149608339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba612ba4565b6120897fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba84612b9a565b61016380546001600160b81b03191662010001179055670de0b6b3a76400006101645561016580546001600160a01b038481166001600160a01b0319928316179092556101f461016655610167805492871692909116919091179055610169805460ff1916905580156114cd576000805461ff0019169055505050505050565b61015f805461124090614895565b3b151590565b60006001600160e01b0319821663780e9d6360e01b1480610760575061076082612bef565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190612194826112c1565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006121d882612142565b6122395760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610860565b6000612244836112c1565b9050806001600160a01b0316846001600160a01b0316148061227f5750836001600160a01b0316612274846107f8565b6001600160a01b0316145b806122af57506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806122cd57506122cd600080516020614960833981519152856118a6565b949350505050565b610167546000906001600160a01b031615806107605750610167546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561233357600080fd5b505afa158015612347573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061236b919061437e565b1192915050565b826001600160a01b0316612385826112c1565b6001600160a01b0316146123ed5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610860565b6001600160a01b03821661244f5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610860565b61245a838383612c2f565b61246560008261215f565b6001600160a01b038316600090815260cc6020526040812080546001929061248e90849061483b565b90915550506001600160a01b038216600090815260cc602052604081208054600192906124bc9084906147f0565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600061016082604051612530919061441b565b90815260405190819003602001902054151592915050565b8251156125c9576125588361251d565b156125755760405162461bcd60e51b81526004016108609061462e565b612580848383612ca3565b8061016084604051612592919061441b565b908152604080516020928190038301902092909255600083815261016182529190912084516125c392860190613a6d565b50611881565b611881848383612ca3565b6125de82826118a6565b610eb0576125f6816001600160a01b03166014612d3a565b612601836020612d3a565b604051602001612612929190614466565b60408051601f198184030181529082905262461bcd60e51b825261086091600401614518565b6126428282612f1b565b60008281526097602052604090206109969082612fa1565b6126648282612fb6565b6000828152609760205260409020610996908261301d565b61268581613032565b600081815261016160205260408120805461269f90614895565b80601f01602080910402602001604051908101604052809291908181526020018280546126cb90614895565b80156127185780601f106126ed57610100808354040283529160200191612718565b820191906000526020600020905b8154815290600101906020018083116126fb57829003601f168201915b50505060008581526101616020526040812093945061273a9392509050613b65565b6101608160405161274b919061441b565b9081526020016040518091039020600090555050565b6101635460009060ff16806127895750612789600080516020614960833981519152336118a6565b905090565b61279782612142565b6127fa5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610860565b600082815261012d60209081526040909120825161099692840190613a6d565b600061189f8383613074565b61016354600090610100900460ff16806127895750612789600080516020614960833981519152336118a6565b816001600160a01b0316836001600160a01b031614156128b55760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610860565b6001600160a01b03838116600081815260ce6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61292d848484612372565b612939848484846130ac565b6118815760405162461bcd60e51b81526004016108609061452b565b606061296082612142565b6129c65760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610860565b600082815261012d6020526040812080546129e090614895565b80601f0160208091040260200160405190810160405280929190818152602001828054612a0c90614895565b8015612a595780601f10612a2e57610100808354040283529160200191612a59565b820191906000526020600020905b815481529060010190602001808311612a3c57829003601f168201915b505050505090506000612a6a6131b9565b9050805160001415612a7d575092915050565b815115612aaf578082604051602001612a97929190614437565b60405160208183030381529060405292505050919050565b6122cd846131c9565b6000610760825490565b600054610100900460ff16612ae95760405162461bcd60e51b81526004016108609061467f565b612af1613293565b565b600054610100900460ff16612b1a5760405162461bcd60e51b81526004016108609061467f565b612b22613293565b612b2a613293565b612ae9613293565b600054610100900460ff16612b225760405162461bcd60e51b81526004016108609061467f565b600054610100900460ff16612b805760405162461bcd60e51b81526004016108609061467f565b612b88613293565b612b90613293565b610eb082826132ba565b610eb08282612638565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006001600160e01b031982166380ac58cd60e01b1480612c2057506001600160e01b03198216635b5e139f60e01b145b80610760575061076082613308565b612c3761332d565b612c985760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610860565b61099683838361335b565b612cac836122d5565b612cc85760405162461bcd60e51b8152600401610860906146ca565b80612d265760405162461bcd60e51b815260206004820152602860248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e49642063616e60448201526706e6f7420626520360c41b6064820152608401610860565b612d308382613413565b610996818361278e565b60606000612d4983600261481c565b612d549060026147f0565b6001600160401b03811115612d7957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015612da3576020820181803683370190505b509050600360fc1b81600081518110612dcc57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110612e0957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000612e2d84600261481c565b612e389060016147f0565b90505b6001811115612ecc576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110612e7a57634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110612e9e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93612ec58161487e565b9050612e3b565b50831561189f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610860565b612f2582826118a6565b610eb05760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612f5d3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061189f836001600160a01b038416613552565b612fc082826118a6565b15610eb05760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061189f836001600160a01b0384166135a1565b61303b816136be565b600081815261012d60205260409020805461305590614895565b15905061104757600081815261012d6020526040812061104791613b65565b600082600001828154811061309957634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b156131ae57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906130f09033908990889088906004016144db565b602060405180830381600087803b15801561310a57600080fd5b505af192505050801561313a575060408051601f3d908101601f19168201909252613137918101906140da565b60015b613194573d808015613168576040519150601f19603f3d011682016040523d82523d6000602084013e61316d565b606091505b50805161318c5760405162461bcd60e51b81526004016108609061452b565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506122cd565b506001949350505050565b606061016a805461077590614895565b60606131d482612142565b6132385760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610860565b60006132426131b9565b90506000815111613262576040518060200160405280600081525061189f565b8061326c84613765565b60405160200161327d929190614437565b6040516020818303038152906040529392505050565b600054610100900460ff16612af15760405162461bcd60e51b81526004016108609061467f565b600054610100900460ff166132e15760405162461bcd60e51b81526004016108609061467f565b81516132f49060c9906020850190613a6d565b5080516109969060ca906020840190613a6d565b60006001600160e01b03198216635a05180f60e01b148061076057506107608261387e565b6101635460009062010000900460ff16806127895750612789600080516020614960833981519152336118a6565b6001600160a01b0383166133b6576133b18160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b6133d9565b816001600160a01b0316836001600160a01b0316146133d9576133d983826138b3565b6001600160a01b0382166133f05761099681613950565b826001600160a01b0316826001600160a01b031614610996576109968282613a29565b6001600160a01b0382166134695760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610860565b61347281612142565b156134bf5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610860565b6134cb60008383612c2f565b6001600160a01b038216600090815260cc602052604081208054600192906134f49084906147f0565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b600081815260018301602052604081205461359957508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610760565b506000610760565b600081815260018301602052604081205480156136b45760006135c560018361483b565b85549091506000906135d99060019061483b565b905081811461365a57600086600001828154811061360757634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061363857634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061367957634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610760565b6000915050610760565b60006136c9826112c1565b90506136d781600084612c2f565b6136e260008361215f565b6001600160a01b038116600090815260cc6020526040812080546001929061370b90849061483b565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816137895750506040805180820190915260018152600360fc1b602082015290565b8160005b81156137b3578061379d816148ca565b91506137ac9050600a83614808565b915061378d565b6000816001600160401b038111156137db57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613805576020820181803683370190505b5090505b84156122cd5761381a60018361483b565b9150613827600a866148e5565b6138329060306147f0565b60f81b81838151811061385557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350613877600a86614808565b9450613809565b60006001600160e01b03198216637965db0b60e01b148061076057506301ffc9a760e01b6001600160e01b0319831614610760565b600060016138c084611346565b6138ca919061483b565b600083815260fc602052604090205490915080821461391d576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd546000906139629060019061483b565b600083815260fe602052604081205460fd805493945090928490811061399857634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106139c757634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd805480613a0d57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000613a3483611346565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054613a7990614895565b90600052602060002090601f016020900481019282613a9b5760008555613ae1565b82601f10613ab457805160ff1916838001178555613ae1565b82800160010185558215613ae1579182015b82811115613ae1578251825591602001919060010190613ac6565b50613aed929150613b9b565b5090565b828054613afd90614895565b90600052602060002090601f016020900481019282613b1f5760008555613ae1565b82601f10613b385782800160ff19823516178555613ae1565b82800160010185558215613ae1579182015b82811115613ae1578235825591602001919060010190613b4a565b508054613b7190614895565b6000825580601f10613b81575050565b601f01602090049060005260206000209081019061104791905b5b80821115613aed5760008155600101613b9c565b60006001600160401b03831115613bc957613bc9614925565b613bdc601f8401601f191660200161479d565b9050828152838383011115613bf057600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114613c1e57600080fd5b919050565b600082601f830112613c33578081fd5b81356020613c48613c43836147cd565b61479d565b80838252828201915082860187848660051b8901011115613c67578586fd5b855b85811015613c8c57613c7a82613c07565b84529284019290840190600101613c69565b5090979650505050505050565b600082601f830112613ca9578081fd5b81356020613cb9613c43836147cd565b80838252828201915082860187848660051b8901011115613cd8578586fd5b855b85811015613c8c578135613ced8161493b565b84529284019290840190600101613cda565b600082601f830112613d0f578081fd5b81356020613d1f613c43836147cd565b80838252828201915082860187848660051b8901011115613d3e578586fd5b855b85811015613c8c5781356001600160401b03811115613d5d578788fd5b613d6b8a87838c0101613e21565b8552509284019290840190600101613d40565b600082601f830112613d8e578081fd5b81356020613d9e613c43836147cd565b80838252828201915082860187848660051b8901011115613dbd578586fd5b855b85811015613c8c57813584529284019290840190600101613dbf565b60008083601f840112613dec578182fd5b5081356001600160401b03811115613e02578182fd5b602083019150836020828501011115613e1a57600080fd5b9250929050565b600082601f830112613e31578081fd5b61189f83833560208501613bb0565b600060208284031215613e51578081fd5b61189f82613c07565b60008060408385031215613e6c578081fd5b613e7583613c07565b9150613e8360208401613c07565b90509250929050565b600080600060608486031215613ea0578081fd5b613ea984613c07565b9250613eb760208501613c07565b9150604084013590509250925092565b60008060008060808587031215613edc578182fd5b613ee585613c07565b9350613ef360208601613c07565b92506040850135915060608501356001600160401b03811115613f14578182fd5b8501601f81018713613f24578182fd5b613f3387823560208401613bb0565b91505092959194509250565b60008060408385031215613f51578182fd5b613f5a83613c07565b91506020830135613f6a8161493b565b809150509250929050565b60008060008060008060808789031215613f8d578384fd5b613f9687613c07565b955060208701356001600160401b0380821115613fb1578586fd5b613fbd8a838b01613ddb565b90975095506040890135915080821115613fd5578384fd5b50613fe289828a01613ddb565b979a9699509497949695606090950135949350505050565b6000806040838503121561400c578182fd5b61401583613c07565b946020939093013593505050565b600060208284031215614034578081fd5b815161189f8161493b565b600060208284031215614050578081fd5b5035919050565b60008060408385031215614069578182fd5b82359150613e8360208401613c07565b6000806040838503121561408b578182fd5b823591506020830135613f6a8161493b565b600080604083850312156140af578182fd5b50508035926020909101359150565b6000602082840312156140cf578081fd5b813561189f81614949565b6000602082840312156140eb578081fd5b815161189f81614949565b60008060208385031215614108578182fd5b82356001600160401b0381111561411d578283fd5b61412985828601613ddb565b90969095509350505050565b600060208284031215614146578081fd5b81356001600160401b0381111561415b578182fd5b6122cd84828501613e21565b600080600080600060a0868803121561417e578283fd5b85356001600160401b0380821115614194578485fd5b6141a089838a01613e21565b965060208801359150808211156141b5578485fd5b506141c288828901613e21565b9450506141d160408701613c07565b92506141df60608701613c07565b91506141ed60808701613c07565b90509295509295909350565b60006020828403121561420a578081fd5b81356001600160401b0380821115614220578283fd5b908301906101208286031215614234578283fd5b61423c614774565b82358281111561424a578485fd5b61425687828601613cff565b82525060208301358281111561426a578485fd5b61427687828601613c99565b60208301525060408301358281111561428d578485fd5b61429987828601613c99565b6040830152506060830135828111156142b0578485fd5b6142bc87828601613c99565b6060830152506080830135828111156142d3578485fd5b6142df87828601613c23565b60808301525060a0830135828111156142f6578485fd5b61430287828601613d7e565b60a08301525060c083013582811115614319578485fd5b61432587828601613c23565b60c08301525060e08301358281111561433c578485fd5b61434887828601613d7e565b60e0830152506101008084013583811115614361578586fd5b61436d88828701613cff565b918301919091525095945050505050565b60006020828403121561438f578081fd5b5051919050565b6000806000604084860312156143aa578081fd5b8335925060208401356001600160401b038111156143c6578182fd5b6143d286828701613ddb565b9497909650939450505050565b600081518084526143f7816020860160208601614852565b601f01601f19169290920160200192915050565b8183823760009101908152919050565b6000825161442d818460208701614852565b9190910192915050565b60008351614449818460208801614852565b83519083019061445d818360208801614852565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161449e816017850160208801614852565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516144cf816028840160208801614852565b01602801949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061450e908301846143df565b9695505050505050565b60208152600061189f60208301846143df565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526027908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760408201526634b9ba3930b91760c91b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161012081016001600160401b038111828210171561479757614797614925565b60405290565b604051601f8201601f191681016001600160401b03811182821017156147c5576147c5614925565b604052919050565b60006001600160401b038211156147e6576147e6614925565b5060051b60200190565b60008219821115614803576148036148f9565b500190565b6000826148175761481761490f565b500490565b6000816000190483118215151615614836576148366148f9565b500290565b60008282101561484d5761484d6148f9565b500390565b60005b8381101561486d578181015183820152602001614855565b838111156118815750506000910152565b60008161488d5761488d6148f9565b506000190190565b600181811c908216806148a957607f821691505b60208210811415611f0a57634e487b7160e01b600052602260045260246000fd5b60006000198214156148de576148de6148f9565b5060010190565b6000826148f4576148f461490f565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461104757600080fd5b6001600160e01b03198116811461104757600080fdfeedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a26469706673582212202243b89e00e08b66925265212292dfea693d1535ab9b5d34837337c482a91f8364736f6c63430008040033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106102f15760003560e01c80636c0360eb1161019d578063a8f1c6d8116100e9578063d547741f116100a2578063f041b4a71161007c578063f041b4a71461071a578063f68e95531461072e578063f8895cc814610743578063fce589d81461074b57600080fd5b8063d547741f146106b8578063db0ed6a0146106cb578063e985e9c5146106de57600080fd5b8063a8f1c6d81461062d578063b88d4fde14610640578063bce8542e14610653578063c87b56dd1461067f578063ca15c87314610692578063cb9c6154146106a557600080fd5b80639010d07c1161015657806395d89b411161013057806395d89b41146105f7578063a10474c7146105ff578063a217fddf14610612578063a22cb4651461061a57600080fd5b80639010d07c146105be57806391d14854146105d157806393d0da07146105e457600080fd5b80636c0360eb146105565780636f4c25aa1461055e57806370a082311461057157806370d5ae05146105845780638792ffef146105985780638daf3f4e146105ab57600080fd5b80632f2ff15d1161025c57806347f00d5a116102155780635471a057116101ef5780635471a057146104fb57806358083969146105095780636017160b146105305780636352211e1461054357600080fd5b806347f00d5a146104ba5780634b08b0a3146104cd5780634f6ccce7146104e857600080fd5b80632f2ff15d146104085780632f745c591461041b57806336568abe1461042e57806338f292d51461044157806342842e0e1461049457806342966c68146104a757600080fd5b806318160ddd116102ae57806318160ddd146103995780632185810b146103a157806323b872dd146103b5578063248a9ca3146103c8578063267be25c146103eb5780632eb4a7ab146103fe57600080fd5b806301ffc9a7146102f6578063054f7d9c1461031e57806306fdde031461032c578063081812fc14610341578063095ea7b31461036c57806314c44e0914610381575b600080fd5b6103096103043660046140be565b610755565b60405190151581526020015b60405180910390f35b610169546103099060ff1681565b610334610766565b6040516103159190614518565b61035461034f36600461403f565b6107f8565b6040516001600160a01b039091168152602001610315565b61037f61037a366004613ffa565b610885565b005b61038b6101645481565b604051908152602001610315565b60fd5461038b565b610163546103099062010000900460ff1681565b61037f6103c3366004613e8c565b61099b565b61038b6103d636600461403f565b60009081526065602052604090206001015490565b61037f6103f9366004613f75565b6109f2565b61038b6101685481565b61037f610416366004614057565b610d7a565b61038b610429366004613ffa565b610da0565b61037f61043c366004614057565b610e36565b61047561044f36600461403f565b61016260205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b039093168352602083019190915201610315565b61037f6104a2366004613e8c565b610eb4565b61037f6104b536600461403f565b610ecf565b61037f6104c8366004614396565b61104a565b6101635461035490630100000090046001600160a01b031681565b61038b6104f636600461403f565b611185565b610163546103099060ff1681565b61038b7fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b61033461053e36600461403f565b611226565b61035461055136600461403f565b6112c1565b610334611338565b6101635461030990610100900460ff1681565b61038b61057f366004613e40565b611346565b61016554610354906001600160a01b031681565b61037f6105a6366004613f75565b6113cd565b61037f6105b93660046140f6565b6114d5565b6103546105cc36600461409d565b611887565b6103096105df366004614057565b6118a6565b61037f6105f2366004614396565b6118d1565b610334611a33565b61037f61060d366004613e40565b611a42565b61038b600081565b61037f610628366004613f3f565b611bd8565b61037f61063b366004614079565b611be3565b61037f61064e366004613ec7565b611cde565b61038b610661366004614135565b80516020818301810180516101608252928201919093012091525481565b61033461068d36600461403f565b611d35565b61038b6106a036600461403f565b611d40565b6103346106b336600461403f565b611d57565b61037f6106c6366004614057565b611f10565b61037f6106d9366004614167565b611f36565b6103096106ec366004613e5a565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b61016754610354906001600160a01b031681565b61038b60008051602061496083398151915281565b610334612109565b61038b6101665481565b60006107608261211d565b92915050565b606060c9805461077590614895565b80601f01602080910402602001604051908101604052809291908181526020018280546107a190614895565b80156107ee5780601f106107c3576101008083540402835291602001916107ee565b820191906000526020600020905b8154815290600101906020018083116107d157829003601f168201915b5050505050905090565b600061080382612142565b6108695760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610890826112c1565b9050806001600160a01b0316836001600160a01b031614156108fe5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610860565b336001600160a01b038216148061091a575061091a81336106ec565b61098c5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610860565b610996838361215f565b505050565b6109a6335b826121cd565b6109c25760405162461bcd60e51b8152600401610860906145c4565b6109cb826122d5565b6109e75760405162461bcd60e51b8152600401610860906146ca565b610996838383612372565b61016354630100000090046001600160a01b0316610a785760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610860565b610ab785858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061251d92505050565b15610ad45760405162461bcd60e51b81526004016108609061462e565b61016354630100000090046001600160a01b03166323b872dd33610164546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015610b3e57600080fd5b505af1158015610b52573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b769190614023565b610bd65760405162461bcd60e51b815260206004820152602b60248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e207472616e7360448201526a3332b9103330b4b632b21760a91b6064820152608401610860565b610c4c8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612548915050565b60006127106101665461016454610c63919061481c565b610c6d9190614808565b610163546101655460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018490529293506301000000909104169063a9059cbb90604401602060405180830381600087803b158015610cc957600080fd5b505af1158015610cdd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d019190614023565b506040805180820190915261016354630100000090046001600160a01b03168152610164546020820190610d3690849061483b565b9052600092835261016260209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b600082815260656020526040902060010154610d9681336125d4565b6109968383612638565b6000610dab83611346565b8210610e0d5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610860565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6001600160a01b0381163314610ea65760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610860565b610eb0828261265a565b5050565b61099683838360405180602001604052806000815250611cde565b610ed8336109a0565b610ef45760405162461bcd60e51b8152600401610860906145c4565b610efd8161267c565b600081815261016260205260409020600101541561104757600081815261016260205260409020546001600160a01b031663a9059cbb33600084815261016260205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b158015610f8e57600080fd5b505af1158015610fa2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fc69190614023565b6110255760405162461bcd60e51b815260206004820152602a60248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e2074616e736660448201526932b9103330b4b632b21760b11b6064820152608401610860565b60008181526101626020526040812080546001600160a01b0319168155600101555b50565b611052612761565b6110b95760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610860565b6110c4335b846121cd565b6110e05760405162461bcd60e51b8152600401610860906145c4565b6111208383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061278e92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f483838360405160200161115592919061440b565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b600061119060fd5490565b82106111f35760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610860565b60fd828154811061121457634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b610161602052600090815260409020805461124090614895565b80601f016020809104026020016040519081016040528092919081815260200182805461126c90614895565b80156112b95780601f1061128e576101008083540402835291602001916112b9565b820191906000526020600020905b81548152906001019060200180831161129c57829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806107605760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610860565b61016a805461124090614895565b60006001600160a01b0382166113b15760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610860565b506001600160a01b0316600090815260cc602052604090205490565b6113e5600080516020614960833981519152336118a6565b6114575760405162461bcd60e51b815260206004820152603a60248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260448201527f656769737472617220726f6c6520746f2072656769737465722e0000000000006064820152608401610860565b6114cd8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612548915050565b505050505050565b6114ed600080516020614960833981519152336118a6565b6115095760405162461bcd60e51b81526004016108609061457d565b6000611517828401846141f9565b80515190915015611563578051805160009061154357634e487b7160e01b600052603260045260246000fd5b602002602001015161015f9080519060200190611561929190613a6d565b505b602081015151156115b657806020015160008151811061159357634e487b7160e01b600052603260045260246000fd5b602002602001015161016360006101000a81548160ff0219169083151502179055505b604081015151156116095780604001516000815181106115e657634e487b7160e01b600052603260045260246000fd5b602002602001015161016360016101000a81548160ff0219169083151502179055505b6060810151511561165c57806060015160008151811061163957634e487b7160e01b600052603260045260246000fd5b602002602001015161016360026101000a81548160ff0219169083151502179055505b608081015151156116bc57806080015160008151811061168c57634e487b7160e01b600052603260045260246000fd5b602002602001015161016360036101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60a081015151156116fc578060a001516000815181106116ec57634e487b7160e01b600052603260045260246000fd5b6020026020010151610164819055505b60c0810151511561175c578060c0015160008151811061172c57634e487b7160e01b600052603260045260246000fd5b602002602001015161016560006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60e08101515115611831576127108160e0015160008151811061178f57634e487b7160e01b600052603260045260246000fd5b602002602001015111156117fc5760405162461bcd60e51b815260206004820152602e60248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201526d3a1031329036329018981818181760911b6064820152608401610860565b8060e0015160008151811061182157634e487b7160e01b600052603260045260246000fd5b6020026020010151610166819055505b61010081015151156109965780610100015160008151811061186357634e487b7160e01b600052603260045260246000fd5b602002602001015161016a9080519060200190611881929190613a6d565b50505050565b600082815260976020526040812061189f908361281a565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6118d9612826565b61193e5760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610860565b611947336110be565b6119635760405162461bcd60e51b8152600401610860906145c4565b6119a282828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061251d92505050565b156119bf5760405162461bcd60e51b81526004016108609061462e565b8261016083836040516119d392919061440b565b9081526040805160209281900383019020929092556000858152610161909152206119ff908383613af1565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c8383836040516111789392919061473e565b606060ca805461077590614895565b611a4d6000336118a6565b611aa55760405162461bcd60e51b815260206004820152602360248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652061646d60448201526234b71760e91b6064820152608401610860565b6001600160a01b038116611ac75761016780546001600160a01b031916905550565b6040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b038216906301ffc9a79060240160206040518083038186803b158015611b0d57600080fd5b505afa158015611b21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b459190614023565b611bb75760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610860565b61016780546001600160a01b0383166001600160a01b031990911617905550565b610eb0338383612853565b611bfb600080516020614960833981519152336118a6565b611c175760405162461bcd60e51b81526004016108609061457d565b6101695460ff1615611c845760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a206d65726b6c65526f6f742060448201526f3430b9903132b2b710333937bd32b71760811b6064820152608401610860565b610168829055610169805460ff19168215159081179091556040805184815260ff909216151560208301527fc72271867375e4dc99b635d35b37f44698b889895effb6891602e23128d4f68d910160405180910390a15050565b611ce833836121cd565b611d045760405162461bcd60e51b8152600401610860906145c4565b611d0d836122d5565b611d295760405162461bcd60e51b8152600401610860906146ca565b61188184848484612922565b606061076082612955565b600081815260976020526040812061076090612ab8565b6060600061016a8054611d6990614895565b80601f0160208091040260200160405190810160405280929190818152602001828054611d9590614895565b8015611de25780601f10611db757610100808354040283529160200191611de2565b820191906000526020600020905b815481529060010190602001808311611dc557829003601f168201915b50505050509050805160001415611dfc5761189f83612955565b6000611e0784612955565b9050600082518251611e19919061483b565b6001600160401b03811115611e3e57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611e68576020820181803683370190505b50905060005b83518351611e7c919061483b565b811015611f015782845182611e9191906147f0565b81518110611eaf57634e487b7160e01b600052603260045260246000fd5b602001015160f81c60f81b828281518110611eda57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611efa816148ca565b9050611e6e565b50949350505050565b50919050565b600082815260656020526040902060010154611f2c81336125d4565b610996838361265a565b600054610100900460ff16611f515760005460ff1615611f55565b303b155b611fb85760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610860565b600054610100900460ff16158015611fda576000805461ffff19166101011790555b611fe2612ac2565b611fea612af3565b611ff2612b32565b611ffa612b32565b6120048686612b59565b61200f600083612b9a565b61202760008051602061496083398151915284612b9a565b61205f6000805160206149608339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba612ba4565b6120897fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba84612b9a565b61016380546001600160b81b03191662010001179055670de0b6b3a76400006101645561016580546001600160a01b038481166001600160a01b0319928316179092556101f461016655610167805492871692909116919091179055610169805460ff1916905580156114cd576000805461ff0019169055505050505050565b61015f805461124090614895565b3b151590565b60006001600160e01b0319821663780e9d6360e01b1480610760575061076082612bef565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190612194826112c1565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006121d882612142565b6122395760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610860565b6000612244836112c1565b9050806001600160a01b0316846001600160a01b0316148061227f5750836001600160a01b0316612274846107f8565b6001600160a01b0316145b806122af57506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806122cd57506122cd600080516020614960833981519152856118a6565b949350505050565b610167546000906001600160a01b031615806107605750610167546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561233357600080fd5b505afa158015612347573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061236b919061437e565b1192915050565b826001600160a01b0316612385826112c1565b6001600160a01b0316146123ed5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610860565b6001600160a01b03821661244f5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610860565b61245a838383612c2f565b61246560008261215f565b6001600160a01b038316600090815260cc6020526040812080546001929061248e90849061483b565b90915550506001600160a01b038216600090815260cc602052604081208054600192906124bc9084906147f0565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600061016082604051612530919061441b565b90815260405190819003602001902054151592915050565b8251156125c9576125588361251d565b156125755760405162461bcd60e51b81526004016108609061462e565b612580848383612ca3565b8061016084604051612592919061441b565b908152604080516020928190038301902092909255600083815261016182529190912084516125c392860190613a6d565b50611881565b611881848383612ca3565b6125de82826118a6565b610eb0576125f6816001600160a01b03166014612d3a565b612601836020612d3a565b604051602001612612929190614466565b60408051601f198184030181529082905262461bcd60e51b825261086091600401614518565b6126428282612f1b565b60008281526097602052604090206109969082612fa1565b6126648282612fb6565b6000828152609760205260409020610996908261301d565b61268581613032565b600081815261016160205260408120805461269f90614895565b80601f01602080910402602001604051908101604052809291908181526020018280546126cb90614895565b80156127185780601f106126ed57610100808354040283529160200191612718565b820191906000526020600020905b8154815290600101906020018083116126fb57829003601f168201915b50505060008581526101616020526040812093945061273a9392509050613b65565b6101608160405161274b919061441b565b9081526020016040518091039020600090555050565b6101635460009060ff16806127895750612789600080516020614960833981519152336118a6565b905090565b61279782612142565b6127fa5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610860565b600082815261012d60209081526040909120825161099692840190613a6d565b600061189f8383613074565b61016354600090610100900460ff16806127895750612789600080516020614960833981519152336118a6565b816001600160a01b0316836001600160a01b031614156128b55760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610860565b6001600160a01b03838116600081815260ce6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61292d848484612372565b612939848484846130ac565b6118815760405162461bcd60e51b81526004016108609061452b565b606061296082612142565b6129c65760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610860565b600082815261012d6020526040812080546129e090614895565b80601f0160208091040260200160405190810160405280929190818152602001828054612a0c90614895565b8015612a595780601f10612a2e57610100808354040283529160200191612a59565b820191906000526020600020905b815481529060010190602001808311612a3c57829003601f168201915b505050505090506000612a6a6131b9565b9050805160001415612a7d575092915050565b815115612aaf578082604051602001612a97929190614437565b60405160208183030381529060405292505050919050565b6122cd846131c9565b6000610760825490565b600054610100900460ff16612ae95760405162461bcd60e51b81526004016108609061467f565b612af1613293565b565b600054610100900460ff16612b1a5760405162461bcd60e51b81526004016108609061467f565b612b22613293565b612b2a613293565b612ae9613293565b600054610100900460ff16612b225760405162461bcd60e51b81526004016108609061467f565b600054610100900460ff16612b805760405162461bcd60e51b81526004016108609061467f565b612b88613293565b612b90613293565b610eb082826132ba565b610eb08282612638565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006001600160e01b031982166380ac58cd60e01b1480612c2057506001600160e01b03198216635b5e139f60e01b145b80610760575061076082613308565b612c3761332d565b612c985760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610860565b61099683838361335b565b612cac836122d5565b612cc85760405162461bcd60e51b8152600401610860906146ca565b80612d265760405162461bcd60e51b815260206004820152602860248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e49642063616e60448201526706e6f7420626520360c41b6064820152608401610860565b612d308382613413565b610996818361278e565b60606000612d4983600261481c565b612d549060026147f0565b6001600160401b03811115612d7957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015612da3576020820181803683370190505b509050600360fc1b81600081518110612dcc57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110612e0957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000612e2d84600261481c565b612e389060016147f0565b90505b6001811115612ecc576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110612e7a57634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110612e9e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93612ec58161487e565b9050612e3b565b50831561189f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610860565b612f2582826118a6565b610eb05760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612f5d3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061189f836001600160a01b038416613552565b612fc082826118a6565b15610eb05760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061189f836001600160a01b0384166135a1565b61303b816136be565b600081815261012d60205260409020805461305590614895565b15905061104757600081815261012d6020526040812061104791613b65565b600082600001828154811061309957634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b156131ae57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906130f09033908990889088906004016144db565b602060405180830381600087803b15801561310a57600080fd5b505af192505050801561313a575060408051601f3d908101601f19168201909252613137918101906140da565b60015b613194573d808015613168576040519150601f19603f3d011682016040523d82523d6000602084013e61316d565b606091505b50805161318c5760405162461bcd60e51b81526004016108609061452b565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506122cd565b506001949350505050565b606061016a805461077590614895565b60606131d482612142565b6132385760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610860565b60006132426131b9565b90506000815111613262576040518060200160405280600081525061189f565b8061326c84613765565b60405160200161327d929190614437565b6040516020818303038152906040529392505050565b600054610100900460ff16612af15760405162461bcd60e51b81526004016108609061467f565b600054610100900460ff166132e15760405162461bcd60e51b81526004016108609061467f565b81516132f49060c9906020850190613a6d565b5080516109969060ca906020840190613a6d565b60006001600160e01b03198216635a05180f60e01b148061076057506107608261387e565b6101635460009062010000900460ff16806127895750612789600080516020614960833981519152336118a6565b6001600160a01b0383166133b6576133b18160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b6133d9565b816001600160a01b0316836001600160a01b0316146133d9576133d983826138b3565b6001600160a01b0382166133f05761099681613950565b826001600160a01b0316826001600160a01b031614610996576109968282613a29565b6001600160a01b0382166134695760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610860565b61347281612142565b156134bf5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610860565b6134cb60008383612c2f565b6001600160a01b038216600090815260cc602052604081208054600192906134f49084906147f0565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b600081815260018301602052604081205461359957508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610760565b506000610760565b600081815260018301602052604081205480156136b45760006135c560018361483b565b85549091506000906135d99060019061483b565b905081811461365a57600086600001828154811061360757634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061363857634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061367957634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610760565b6000915050610760565b60006136c9826112c1565b90506136d781600084612c2f565b6136e260008361215f565b6001600160a01b038116600090815260cc6020526040812080546001929061370b90849061483b565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816137895750506040805180820190915260018152600360fc1b602082015290565b8160005b81156137b3578061379d816148ca565b91506137ac9050600a83614808565b915061378d565b6000816001600160401b038111156137db57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613805576020820181803683370190505b5090505b84156122cd5761381a60018361483b565b9150613827600a866148e5565b6138329060306147f0565b60f81b81838151811061385557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350613877600a86614808565b9450613809565b60006001600160e01b03198216637965db0b60e01b148061076057506301ffc9a760e01b6001600160e01b0319831614610760565b600060016138c084611346565b6138ca919061483b565b600083815260fc602052604090205490915080821461391d576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd546000906139629060019061483b565b600083815260fe602052604081205460fd805493945090928490811061399857634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106139c757634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd805480613a0d57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000613a3483611346565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054613a7990614895565b90600052602060002090601f016020900481019282613a9b5760008555613ae1565b82601f10613ab457805160ff1916838001178555613ae1565b82800160010185558215613ae1579182015b82811115613ae1578251825591602001919060010190613ac6565b50613aed929150613b9b565b5090565b828054613afd90614895565b90600052602060002090601f016020900481019282613b1f5760008555613ae1565b82601f10613b385782800160ff19823516178555613ae1565b82800160010185558215613ae1579182015b82811115613ae1578235825591602001919060010190613b4a565b508054613b7190614895565b6000825580601f10613b81575050565b601f01602090049060005260206000209081019061104791905b5b80821115613aed5760008155600101613b9c565b60006001600160401b03831115613bc957613bc9614925565b613bdc601f8401601f191660200161479d565b9050828152838383011115613bf057600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114613c1e57600080fd5b919050565b600082601f830112613c33578081fd5b81356020613c48613c43836147cd565b61479d565b80838252828201915082860187848660051b8901011115613c67578586fd5b855b85811015613c8c57613c7a82613c07565b84529284019290840190600101613c69565b5090979650505050505050565b600082601f830112613ca9578081fd5b81356020613cb9613c43836147cd565b80838252828201915082860187848660051b8901011115613cd8578586fd5b855b85811015613c8c578135613ced8161493b565b84529284019290840190600101613cda565b600082601f830112613d0f578081fd5b81356020613d1f613c43836147cd565b80838252828201915082860187848660051b8901011115613d3e578586fd5b855b85811015613c8c5781356001600160401b03811115613d5d578788fd5b613d6b8a87838c0101613e21565b8552509284019290840190600101613d40565b600082601f830112613d8e578081fd5b81356020613d9e613c43836147cd565b80838252828201915082860187848660051b8901011115613dbd578586fd5b855b85811015613c8c57813584529284019290840190600101613dbf565b60008083601f840112613dec578182fd5b5081356001600160401b03811115613e02578182fd5b602083019150836020828501011115613e1a57600080fd5b9250929050565b600082601f830112613e31578081fd5b61189f83833560208501613bb0565b600060208284031215613e51578081fd5b61189f82613c07565b60008060408385031215613e6c578081fd5b613e7583613c07565b9150613e8360208401613c07565b90509250929050565b600080600060608486031215613ea0578081fd5b613ea984613c07565b9250613eb760208501613c07565b9150604084013590509250925092565b60008060008060808587031215613edc578182fd5b613ee585613c07565b9350613ef360208601613c07565b92506040850135915060608501356001600160401b03811115613f14578182fd5b8501601f81018713613f24578182fd5b613f3387823560208401613bb0565b91505092959194509250565b60008060408385031215613f51578182fd5b613f5a83613c07565b91506020830135613f6a8161493b565b809150509250929050565b60008060008060008060808789031215613f8d578384fd5b613f9687613c07565b955060208701356001600160401b0380821115613fb1578586fd5b613fbd8a838b01613ddb565b90975095506040890135915080821115613fd5578384fd5b50613fe289828a01613ddb565b979a9699509497949695606090950135949350505050565b6000806040838503121561400c578182fd5b61401583613c07565b946020939093013593505050565b600060208284031215614034578081fd5b815161189f8161493b565b600060208284031215614050578081fd5b5035919050565b60008060408385031215614069578182fd5b82359150613e8360208401613c07565b6000806040838503121561408b578182fd5b823591506020830135613f6a8161493b565b600080604083850312156140af578182fd5b50508035926020909101359150565b6000602082840312156140cf578081fd5b813561189f81614949565b6000602082840312156140eb578081fd5b815161189f81614949565b60008060208385031215614108578182fd5b82356001600160401b0381111561411d578283fd5b61412985828601613ddb565b90969095509350505050565b600060208284031215614146578081fd5b81356001600160401b0381111561415b578182fd5b6122cd84828501613e21565b600080600080600060a0868803121561417e578283fd5b85356001600160401b0380821115614194578485fd5b6141a089838a01613e21565b965060208801359150808211156141b5578485fd5b506141c288828901613e21565b9450506141d160408701613c07565b92506141df60608701613c07565b91506141ed60808701613c07565b90509295509295909350565b60006020828403121561420a578081fd5b81356001600160401b0380821115614220578283fd5b908301906101208286031215614234578283fd5b61423c614774565b82358281111561424a578485fd5b61425687828601613cff565b82525060208301358281111561426a578485fd5b61427687828601613c99565b60208301525060408301358281111561428d578485fd5b61429987828601613c99565b6040830152506060830135828111156142b0578485fd5b6142bc87828601613c99565b6060830152506080830135828111156142d3578485fd5b6142df87828601613c23565b60808301525060a0830135828111156142f6578485fd5b61430287828601613d7e565b60a08301525060c083013582811115614319578485fd5b61432587828601613c23565b60c08301525060e08301358281111561433c578485fd5b61434887828601613d7e565b60e0830152506101008084013583811115614361578586fd5b61436d88828701613cff565b918301919091525095945050505050565b60006020828403121561438f578081fd5b5051919050565b6000806000604084860312156143aa578081fd5b8335925060208401356001600160401b038111156143c6578182fd5b6143d286828701613ddb565b9497909650939450505050565b600081518084526143f7816020860160208601614852565b601f01601f19169290920160200192915050565b8183823760009101908152919050565b6000825161442d818460208701614852565b9190910192915050565b60008351614449818460208801614852565b83519083019061445d818360208801614852565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161449e816017850160208801614852565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516144cf816028840160208801614852565b01602801949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061450e908301846143df565b9695505050505050565b60208152600061189f60208301846143df565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526027908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760408201526634b9ba3930b91760c91b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161012081016001600160401b038111828210171561479757614797614925565b60405290565b604051601f8201601f191681016001600160401b03811182821017156147c5576147c5614925565b604052919050565b60006001600160401b038211156147e6576147e6614925565b5060051b60200190565b60008219821115614803576148036148f9565b500190565b6000826148175761481761490f565b500490565b6000816000190483118215151615614836576148366148f9565b500290565b60008282101561484d5761484d6148f9565b500390565b60005b8381101561486d578181015183820152602001614855565b838111156118815750506000910152565b60008161488d5761488d6148f9565b506000190190565b600181811c908216806148a957607f821691505b60208210811415611f0a57634e487b7160e01b600052602260045260246000fd5b60006000198214156148de576148de6148f9565b5060010190565b6000826148f4576148f461490f565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461104757600080fd5b6001600160e01b03198116811461104757600080fdfeedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a26469706673582212202243b89e00e08b66925265212292dfea693d1535ab9b5d34837337c482a91f8364736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
