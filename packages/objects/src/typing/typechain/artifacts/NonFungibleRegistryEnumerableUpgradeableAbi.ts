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
    "0x60a06040523060601b6080523480156200001857600080fd5b50600054610100900460ff168062000033575060005460ff16155b6200009b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000be576000805461ffff19166101011790555b8015620000d1576000805461ff00191690555b5060805160601c6158f262000106600039600081816111180152818161115801528181611452015261149201526158f26000f3fe6080604052600436106102ae5760003560e01c806366e7b60611610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a7146108f5578063f68e955314610916578063f8895cc814610938578063fce589d81461094d57600080fd5b8063ca15c8731461086c578063d547741f1461088c578063e985e9c5146108ac57600080fd5b8063a217fddf146107a3578063a22cb465146107b8578063b88d4fde146107d8578063bb87c1c8146107f8578063bce8542e14610813578063c87b56dd1461084c57600080fd5b80638daf3f4e1161012e5780638daf3f4e146106ee5780638f15b4141461070e5780639010d07c1461072e57806391d148541461074e57806393d0da071461076e57806395d89b411461078e57600080fd5b806366e7b6061461062c5780636f4c25aa1461064c5780637092d9ea1461066d57806370a082311461068d57806370d5ae05146106ad5780638d59cc02146106ce57600080fd5b806336568abe116102195780634b08b0a3116101d25780634b08b0a3146105705780634f1ef286146105995780634f6ccce7146105ac5780635471a057146105cc5780636017160b146105ec5780636352211e1461060c57600080fd5b806336568abe146104705780633659cfe61461049057806338f292d5146104b057806342842e0e1461051057806342966c681461053057806347f00d5a1461055057600080fd5b806318160ddd1161026b57806318160ddd146103a95780632185810b146103be57806323b872dd146103e0578063248a9ca3146104005780632f2ff15d146104305780632f745c591461045057600080fd5b806301ffc9a7146102b357806306fdde03146102e8578063081812fc1461030a578063095ea7b3146103425780630ecf9dfd1461036457806314c44e0914610384575b600080fd5b3480156102bf57600080fd5b506102d36102ce366004614ebb565b610964565b60405190151581526020015b60405180910390f35b3480156102f457600080fd5b506102fd610975565b6040516102df9190615377565b34801561031657600080fd5b5061032a610325366004614e60565b610a07565b6040516001600160a01b0390911681526020016102df565b34801561034e57600080fd5b5061036261035d366004614d98565b610a94565b005b34801561037057600080fd5b5061036261037f366004614cf2565b610baa565b34801561039057600080fd5b5061039b6101c85481565b6040519081526020016102df565b3480156103b557600080fd5b5060fd5461039b565b3480156103ca57600080fd5b506101c7546102d3906301000000900460ff1681565b3480156103ec57600080fd5b506103626103fb366004614b54565b610fdc565b34801561040c57600080fd5b5061039b61041b366004614e60565b60009081526065602052604090206001015490565b34801561043c57600080fd5b5061036261044b366004614e78565b611033565b34801561045c57600080fd5b5061039b61046b366004614d98565b611055565b34801561047c57600080fd5b5061036261048b366004614e78565b6110eb565b34801561049c57600080fd5b506103626104ab366004614b08565b61110d565b3480156104bc57600080fd5b506104f16104cb366004614e60565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102df565b34801561051c57600080fd5b5061036261052b366004614b54565b6111d6565b34801561053c57600080fd5b5061036261054b366004614e60565b6111f1565b34801561055c57600080fd5b5061036261056b3660046151a7565b61130c565b34801561057c57600080fd5b506101c75461032a9064010000000090046001600160a01b031681565b6103626105a7366004614c2a565b611447565b3480156105b857600080fd5b5061039b6105c7366004614e60565b611501565b3480156105d857600080fd5b506101c7546102d390610100900460ff1681565b3480156105f857600080fd5b506102fd610607366004614e60565b6115a2565b34801561061857600080fd5b5061032a610627366004614e60565b61163d565b34801561063857600080fd5b50610362610647366004614dc1565b6116b4565b34801561065857600080fd5b506101c7546102d39062010000900460ff1681565b34801561067957600080fd5b50610362610688366004614c75565b6118a6565b34801561069957600080fd5b5061039b6106a8366004614b08565b611bd5565b3480156106b957600080fd5b506101c95461032a906001600160a01b031681565b3480156106da57600080fd5b506103626106e9366004614c75565b611c5c565b3480156106fa57600080fd5b50610362610709366004614ef3565b611d0c565b34801561071a57600080fd5b50610362610729366004614f64565b6120ce565b34801561073a57600080fd5b5061032a610749366004614e9a565b6121e7565b34801561075a57600080fd5b506102d3610769366004614e78565b612206565b34801561077a57600080fd5b506103626107893660046151a7565b612231565b34801561079a57600080fd5b506102fd612393565b3480156107af57600080fd5b5061039b600081565b3480156107c457600080fd5b506103626107d3366004614bf4565b6123a2565b3480156107e457600080fd5b506103626107f3366004614b8f565b612467565b34801561080457600080fd5b506101c7546102d39060ff1681565b34801561081f57600080fd5b5061039b61082e366004614f32565b80516020818301810180516101c48252928201919093012091525481565b34801561085857600080fd5b506102fd610867366004614e60565b6124be565b34801561087857600080fd5b5061039b610887366004614e60565b6124c9565b34801561089857600080fd5b506103626108a7366004614e78565b6124e0565b3480156108b857600080fd5b506102d36108c7366004614b22565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561090157600080fd5b506101cb5461032a906001600160a01b031681565b34801561092257600080fd5b5061039b60008051602061589d83398151915281565b34801561094457600080fd5b506102fd6124ea565b34801561095957600080fd5b5061039b6101ca5481565b600061096f826124f8565b92915050565b606060c98054610984906157a5565b80601f01602080910402602001604051908101604052809291908181526020018280546109b0906157a5565b80156109fd5780601f106109d2576101008083540402835291602001916109fd565b820191906000526020600020905b8154815290600101906020018083116109e057829003601f168201915b5050505050905090565b6000610a128261251d565b610a785760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a9f8261163d565b9050806001600160a01b0316836001600160a01b03161415610b0d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a6f565b336001600160a01b0382161480610b295750610b2981336108c7565b610b9b5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a6f565b610ba5838361253a565b505050565b6101c75460ff16610c195760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a6f565b610c22876125a8565b610c3e5760405162461bcd60e51b8152600401610a6f906155da565b6101c75462010000900460ff1615610cd15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a6f565b84610d3a5760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610a6f565b610d7986868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061264592505050565b15610dec5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a6f565b336001600160a01b03881614610e5a5760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a6f565b610f028787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061267092505050565b610f5e5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a6f565b610fd28787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525061271592505050565b5050505050505050565b610fe7335b826127a4565b6110035760405162461bcd60e51b8152600401610a6f906154c2565b61100c826125a8565b6110285760405162461bcd60e51b8152600401610a6f906155da565b610ba58383836128a4565b61103d8282612a4f565b6000828152609760205260409020610ba59082612a75565b600061106083611bd5565b82106110c25760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a6f565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6110f58282612a8a565b6000828152609760205260409020610ba59082612b04565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111565760405162461bcd60e51b8152600401610a6f906153dc565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316611188612b19565b6001600160a01b0316146111ae5760405162461bcd60e51b8152600401610a6f90615428565b6111b781612b47565b604080516000808252602082019092526111d391839190612b60565b50565b610ba583838360405180602001604052806000815250612467565b6111fa33610fe1565b6112165760405162461bcd60e51b8152600401610a6f906154c2565b61121f81612ca4565b60008181526101c66020526040902060010154156111d35760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156112b057600080fd5b505af11580156112c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e89190614e44565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b611314612d89565b61137b5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a6f565b611386335b846127a4565b6113a25760405162461bcd60e51b8152600401610a6f906154c2565b6113e28383838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612dbb92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f4838383604051602001611417929190615286565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156114905760405162461bcd60e51b8152600401610a6f906153dc565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166114c2612b19565b6001600160a01b0316146114e85760405162461bcd60e51b8152600401610a6f90615428565b6114f182612b47565b6114fd82826001612b60565b5050565b600061150c60fd5490565b821061156f5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a6f565b60fd828154811061159057634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c560205260009081526040902080546115bc906157a5565b80601f01602080910402602001604051908101604052809291908181526020018280546115e8906157a5565b80156116355780601f1061160a57610100808354040283529160200191611635565b820191906000526020600020905b81548152906001019060200180831161161857829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b03168061096f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a6f565b6116cc60008051602061589d83398151915233612206565b6116e85760405162461bcd60e51b8152600401610a6f9061552c565b81518351146117725760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a6f565b81518151146118035760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a6f565b60005b83518110156118a05761188f84828151811061183257634e487b7160e01b600052603260045260246000fd5b602002602001015184838151811061185a57634e487b7160e01b600052603260045260246000fd5b602002602001015184848151811061188257634e487b7160e01b600052603260045260246000fd5b6020026020010151612715565b50611899816157e0565b9050611806565b50505050565b6101c75464010000000090046001600160a01b031661192d5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a6f565b61196c84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061264592505050565b156119895760405162461bcd60e51b8152600401610a6f90615589565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b1580156119f457600080fd5b505af1158015611a08573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a2c9190614e44565b506000611aa38686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061271592505050565b905060006127106101ca546101c854611abc919061572c565b611ac69190615718565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611b2357600080fd5b505af1158015611b37573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b5b9190614e44565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611b9190849061574b565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611c405760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a6f565b506001600160a01b0316600090815260cc602052604090205490565b611c7460008051602061589d83398151915233612206565b611c905760405162461bcd60e51b8152600401610a6f9061552c565b611d048585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8901819004810282018101909252878152925087915086908190840183828082843760009201919091525061271592505050565b505050505050565b611d2460008051602061589d83398151915233612206565b611d805760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a6f565b6000611d8e82840184614fe5565b80515190915015611dda5780518051600090611dba57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611dd8929190614748565b505b60208101515115611e2d578060200151600081518110611e0a57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b60408101515115611e80578060400151600081518110611e5d57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b60608101515115611ed3578060600151600081518110611eb057634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b60808101515115611f26578060800151600081518110611f0357634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b60a08101515115611f86578060a00151600081518110611f5657634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115611fc6578060c00151600081518110611fb657634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b60e08101515115612026578060e00151600081518110611ff657634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b61010081015151156120685780610100015160008151811061205857634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b6101208101515115610ba55780610120015160008151811061209a57634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff16806120e7575060005460ff16155b6121035760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612125576000805461ffff19166101011790555b61212d612e47565b612135612eba565b61213d612f29565b612145612f29565b61214d612f87565b6121578585612fe5565b61216260008361306c565b61217a60008051602061589d8339815191528461306c565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb8054909116905580156121e0576000805461ff00191690555b5050505050565b60008281526097602052604081206121ff9083613076565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b612239613082565b61229e5760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a6f565b6122a733611380565b6122c35760405162461bcd60e51b8152600401610a6f906154c2565b61230282828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061264592505050565b1561231f5760405162461bcd60e51b8152600401610a6f90615589565b826101c48383604051612333929190615286565b90815260408051602092819003830190209290925560008581526101c59091522061235f9083836147cc565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161143a9392919061564e565b606060ca8054610984906157a5565b6001600160a01b0382163314156123fb5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a6f565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61247133836127a4565b61248d5760405162461bcd60e51b8152600401610a6f906154c2565b612496836125a8565b6124b25760405162461bcd60e51b8152600401610a6f906155da565b6118a0848484846130b0565b606061096f826130e3565b600081815260976020526040812061096f90613253565b6110f5828261325d565b6101c380546115bc906157a5565b60006001600160e01b0319821663780e9d6360e01b148061096f575061096f82613283565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b038416908117909155819061256f8261163d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b0316158061096f57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561260657600080fd5b505afa15801561261a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061263e919061518f565b1192915050565b60006101c482604051612658919061526a565b90815260405190819003602001902054151592915050565b6000806126eb86868660405160200161268b9392919061521c565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b905061270960008051602061589d83398151915261076983866132c3565b9150505b949350505050565b81516000901561279a5761272883612645565b156127455760405162461bcd60e51b8152600401610a6f90615589565b61274f84836132e7565b9050806101c484604051612763919061526a565b90815260408051602092819003830190209290925560008381526101c5825291909120845161279492860190614748565b506121ff565b61270d84836132e7565b60006127af8261251d565b6128105760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a6f565b600061281b8361163d565b9050806001600160a01b0316846001600160a01b031614806128565750836001600160a01b031661284b84610a07565b6001600160a01b0316145b8061288657506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b8061270d575061270d60008051602061589d83398151915285612206565b826001600160a01b03166128b78261163d565b6001600160a01b03161461291f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a6f565b6001600160a01b0382166129815760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a6f565b61298c838383613342565b61299760008261253a565b6001600160a01b038316600090815260cc602052604081208054600192906129c090849061574b565b90915550506001600160a01b038216600090815260cc602052604081208054600192906129ee908490615700565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612a6b81336133b6565b610ba5838361341a565b60006121ff836001600160a01b0384166134a0565b6001600160a01b0381163314612afa5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a6f565b6114fd82826134ef565b60006121ff836001600160a01b038416613556565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b60008051602061589d8339815191526114fd81336133b6565b6000612b6a612b19565b9050612b7584613673565b600083511180612b825750815b15612b9357612b918484613718565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff166121e057805460ff191660011781556040516001600160a01b0383166024820152612c1290869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613718565b50805460ff19168155612c23612b19565b6001600160a01b0316826001600160a01b031614612c9b5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a6f565b6121e085613803565b612cad81613843565b60008181526101c5602052604081208054612cc7906157a5565b80601f0160208091040260200160405190810160405280929190818152602001828054612cf3906157a5565b8015612d405780601f10612d1557610100808354040283529160200191612d40565b820191906000526020600020905b815481529060010190602001808311612d2357829003601f168201915b50505060008581526101c560205260408120939450612d629392509050614840565b6101c481604051612d73919061526a565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff1680612db65750612db660008051602061589d83398151915233612206565b905090565b612dc48261251d565b612e275760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a6f565b600082815261012d602090815260409091208251610ba592840190614748565b600054610100900460ff1680612e60575060005460ff16155b612e7c5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612e9e576000805461ffff19166101011790555b612ea6613885565b80156111d3576000805461ff001916905550565b600054610100900460ff1680612ed3575060005460ff16155b612eef5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612f11576000805461ffff19166101011790555b612f19613885565b612f21613885565b612e9e613885565b600054610100900460ff1680612f42575060005460ff16155b612f5e5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612f19576000805461ffff1916610101179055612f21613885565b600054610100900460ff1680612fa0575060005460ff16155b612fbc5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612f21576000805461ffff1916610101179055612e9e613885565b600054610100900460ff1680612ffe575060005460ff16155b61301a5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff1615801561303c576000805461ffff19166101011790555b613044613885565b61304c613885565b61305683836138ef565b8015610ba5576000805461ff0019169055505050565b61103d8282613984565b60006121ff838361398e565b6101c75460009062010000900460ff1680612db65750612db660008051602061589d83398151915233612206565b6130bb8484846128a4565b6130c7848484846139c6565b6118a05760405162461bcd60e51b8152600401610a6f9061538a565b60606130ee8261251d565b6131545760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a6f565b600082815261012d60205260408120805461316e906157a5565b80601f016020809104026020016040519081016040528092919081815260200182805461319a906157a5565b80156131e75780601f106131bc576101008083540402835291602001916131e7565b820191906000526020600020905b8154815290600101906020018083116131ca57829003601f168201915b50505050509050600061320560408051602081019091526000815290565b9050805160001415613218575092915050565b81511561324a578082604051602001613232929190615296565b60405160208183030381529060405292505050919050565b61270d84613ad0565b600061096f825490565b60008281526065602052604090206001015461327981336133b6565b610ba583836134ef565b60006001600160e01b031982166380ac58cd60e01b14806132b457506001600160e01b03198216635b5e139f60e01b145b8061096f575061096f82613ba7565b60008060006132d28585613bcc565b915091506132df81613c3c565b509392505050565b60006132f2836125a8565b61330e5760405162461bcd60e51b8152600401610a6f906155da565b6101cc5461331d906001615700565b90506133298382613e3d565b6133386101cc80546001019055565b61096f8183612dbb565b61334a613f7c565b6133ab5760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a6f565b610ba5838383613fab565b6133c08282612206565b6114fd576133d8816001600160a01b03166014614063565b6133e3836020614063565b6040516020016133f49291906152c5565b60408051601f198184030181529082905262461bcd60e51b8252610a6f91600401615377565b6134248282612206565b6114fd5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561345c3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008181526001830160205260408120546134e75750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561096f565b50600061096f565b6134f98282612206565b156114fd5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000818152600183016020526040812054801561366957600061357a60018361574b565b855490915060009061358e9060019061574b565b905081811461360f5760008660000182815481106135bc57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106135ed57634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061362e57634e487b7160e01b600052603160045260246000fd5b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061096f565b600091505061096f565b803b6136d75760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a6f565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6137775760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a6f565b600080846001600160a01b031684604051613792919061526a565b600060405180830381855af49150503d80600081146137cd576040519150601f19603f3d011682016040523d82523d6000602084013e6137d2565b606091505b50915091506137fa828260405180606001604052806027815260200161587660279139614244565b95945050505050565b61380c81613673565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b61384c8161427d565b600081815261012d602052604090208054613866906157a5565b1590506111d357600081815261012d602052604081206111d391614840565b600054610100900460ff168061389e575060005460ff16155b6138ba5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612ea6576000805461ffff191661010117905580156111d3576000805461ff001916905550565b600054610100900460ff1680613908575060005460ff16155b6139245760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015613946576000805461ffff19166101011790555b82516139599060c9906020860190614748565b50815161396d9060ca906020850190614748565b508015610ba5576000805461ff0019169055505050565b6114fd828261341a565b60008260000182815481106139b357634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613ac857604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613a0a90339089908890889060040161533a565b602060405180830381600087803b158015613a2457600080fd5b505af1925050508015613a54575060408051601f3d908101601f19168201909252613a5191810190614ed7565b60015b613aae573d808015613a82576040519150601f19603f3d011682016040523d82523d6000602084013e613a87565b606091505b508051613aa65760405162461bcd60e51b8152600401610a6f9061538a565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061270d565b50600161270d565b6060613adb8261251d565b613b3f5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a6f565b6000613b5660408051602081019091526000815290565b90506000815111613b7657604051806020016040528060008152506121ff565b80613b8084614324565b604051602001613b91929190615296565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b148061096f575061096f8261443d565b600080825160411415613c035760208301516040840151606085015160001a613bf787828585614472565b94509450505050613c35565b825160401415613c2d5760208301516040840151613c2286838361455f565b935093505050613c35565b506000905060025b9250929050565b6000816004811115613c5e57634e487b7160e01b600052602160045260246000fd5b1415613c675750565b6001816004811115613c8957634e487b7160e01b600052602160045260246000fd5b1415613cd75760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a6f565b6002816004811115613cf957634e487b7160e01b600052602160045260246000fd5b1415613d475760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a6f565b6003816004811115613d6957634e487b7160e01b600052602160045260246000fd5b1415613dc25760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a6f565b6004816004811115613de457634e487b7160e01b600052602160045260246000fd5b14156111d35760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a6f565b6001600160a01b038216613e935760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a6f565b613e9c8161251d565b15613ee95760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a6f565b613ef560008383613342565b6001600160a01b038216600090815260cc60205260408120805460019290613f1e908490615700565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff1680612db65750612db660008051602061589d83398151915233612206565b6001600160a01b038316614006576140018160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b614029565b816001600160a01b0316836001600160a01b03161461402957614029838261458e565b6001600160a01b03821661404057610ba58161462b565b826001600160a01b0316826001600160a01b031614610ba557610ba58282614704565b6060600061407283600261572c565b61407d906002615700565b6001600160401b038111156140a257634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156140cc576020820181803683370190505b509050600360fc1b816000815181106140f557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061413257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600061415684600261572c565b614161906001615700565b90505b60018111156141f5576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106141a357634e487b7160e01b600052603260045260246000fd5b1a60f81b8282815181106141c757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936141ee8161578e565b9050614164565b5083156121ff5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a6f565b606083156142535750816121ff565b8251156142635782518084602001fd5b8160405162461bcd60e51b8152600401610a6f9190615377565b60006142888261163d565b905061429681600084613342565b6142a160008361253a565b6001600160a01b038116600090815260cc602052604081208054600192906142ca90849061574b565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816143485750506040805180820190915260018152600360fc1b602082015290565b8160005b8115614372578061435c816157e0565b915061436b9050600a83615718565b915061434c565b6000816001600160401b0381111561439a57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156143c4576020820181803683370190505b5090505b841561270d576143d960018361574b565b91506143e6600a866157fb565b6143f1906030615700565b60f81b81838151811061441457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350614436600a86615718565b94506143c8565b60006001600160e01b03198216637965db0b60e01b148061096f57506301ffc9a760e01b6001600160e01b031983161461096f565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156144a95750600090506003614556565b8460ff16601b141580156144c157508460ff16601c14155b156144d25750600090506004614556565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015614526573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661454f57600060019250925050614556565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161458087828885614472565b935093505050935093915050565b6000600161459b84611bd5565b6145a5919061574b565b600083815260fc60205260409020549091508082146145f8576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061463d9060019061574b565b600083815260fe602052604081205460fd805493945090928490811061467357634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106146a257634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd8054806146e857634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b600061470f83611bd5565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614754906157a5565b90600052602060002090601f01602090048101928261477657600085556147bc565b82601f1061478f57805160ff19168380011785556147bc565b828001600101855582156147bc579182015b828111156147bc5782518255916020019190600101906147a1565b506147c8929150614876565b5090565b8280546147d8906157a5565b90600052602060002090601f0160209004810192826147fa57600085556147bc565b82601f106148135782800160ff198235161785556147bc565b828001600101855582156147bc579182015b828111156147bc578235825591602001919060010190614825565b50805461484c906157a5565b6000825580601f1061485c575050565b601f0160209004906000526020600020908101906111d391905b5b808211156147c85760008155600101614877565b80356001600160a01b03811681146148a257600080fd5b919050565b600082601f8301126148b7578081fd5b813560206148cc6148c7836156dd565b6156ad565b80838252828201915082860187848660051b89010111156148eb578586fd5b855b85811015614910576148fe8261488b565b845292840192908401906001016148ed565b5090979650505050505050565b600082601f83011261492d578081fd5b8135602061493d6148c7836156dd565b80838252828201915082860187848660051b890101111561495c578586fd5b855b8581101561491057813561497181615851565b8452928401929084019060010161495e565b600082601f830112614993578081fd5b813560206149a36148c7836156dd565b80838252828201915082860187848660051b89010111156149c2578586fd5b855b858110156149105781356001600160401b038111156149e1578788fd5b6149ef8a87838c0101614a9e565b85525092840192908401906001016149c4565b600082601f830112614a12578081fd5b81356020614a226148c7836156dd565b80838252828201915082860187848660051b8901011115614a41578586fd5b855b8581101561491057813584529284019290840190600101614a43565b60008083601f840112614a70578182fd5b5081356001600160401b03811115614a86578182fd5b602083019150836020828501011115613c3557600080fd5b600082601f830112614aae578081fd5b81356001600160401b03811115614ac757614ac761583b565b614ada601f8201601f19166020016156ad565b818152846020838601011115614aee578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614b19578081fd5b6121ff8261488b565b60008060408385031215614b34578081fd5b614b3d8361488b565b9150614b4b6020840161488b565b90509250929050565b600080600060608486031215614b68578081fd5b614b718461488b565b9250614b7f6020850161488b565b9150604084013590509250925092565b60008060008060808587031215614ba4578182fd5b614bad8561488b565b9350614bbb6020860161488b565b92506040850135915060608501356001600160401b03811115614bdc578182fd5b614be887828801614a9e565b91505092959194509250565b60008060408385031215614c06578182fd5b614c0f8361488b565b91506020830135614c1f81615851565b809150509250929050565b60008060408385031215614c3c578182fd5b614c458361488b565b915060208301356001600160401b03811115614c5f578182fd5b614c6b85828601614a9e565b9150509250929050565b600080600080600060608688031215614c8c578283fd5b614c958661488b565b945060208601356001600160401b0380821115614cb0578485fd5b614cbc89838a01614a5f565b90965094506040880135915080821115614cd4578283fd5b50614ce188828901614a5f565b969995985093965092949392505050565b60008060008060008060006080888a031215614d0c578485fd5b614d158861488b565b965060208801356001600160401b0380821115614d30578687fd5b614d3c8b838c01614a5f565b909850965060408a0135915080821115614d54578384fd5b614d608b838c01614a5f565b909650945060608a0135915080821115614d78578384fd5b50614d858a828b01614a5f565b989b979a50959850939692959293505050565b60008060408385031215614daa578182fd5b614db38361488b565b946020939093013593505050565b600080600060608486031215614dd5578081fd5b83356001600160401b0380821115614deb578283fd5b614df7878388016148a7565b94506020860135915080821115614e0c578283fd5b614e1887838801614983565b93506040860135915080821115614e2d578283fd5b50614e3a86828701614983565b9150509250925092565b600060208284031215614e55578081fd5b81516121ff81615851565b600060208284031215614e71578081fd5b5035919050565b60008060408385031215614e8a578182fd5b82359150614b4b6020840161488b565b60008060408385031215614eac578182fd5b50508035926020909101359150565b600060208284031215614ecc578081fd5b81356121ff8161585f565b600060208284031215614ee8578081fd5b81516121ff8161585f565b60008060208385031215614f05578182fd5b82356001600160401b03811115614f1a578283fd5b614f2685828601614a5f565b90969095509350505050565b600060208284031215614f43578081fd5b81356001600160401b03811115614f58578182fd5b61270d84828501614a9e565b60008060008060808587031215614f79578182fd5b84356001600160401b0380821115614f8f578384fd5b614f9b88838901614a9e565b95506020870135915080821115614fb0578384fd5b50614fbd87828801614a9e565b935050614fcc6040860161488b565b9150614fda6060860161488b565b905092959194509250565b600060208284031215614ff6578081fd5b81356001600160401b038082111561500c578283fd5b908301906101408286031215615020578283fd5b615028615684565b823582811115615036578485fd5b61504287828601614983565b825250602083013582811115615056578485fd5b6150628782860161491d565b602083015250604083013582811115615079578485fd5b6150858782860161491d565b60408301525060608301358281111561509c578485fd5b6150a88782860161491d565b6060830152506080830135828111156150bf578485fd5b6150cb8782860161491d565b60808301525060a0830135828111156150e2578485fd5b6150ee878286016148a7565b60a08301525060c083013582811115615105578485fd5b61511187828601614a02565b60c08301525060e083013582811115615128578485fd5b615134878286016148a7565b60e083015250610100808401358381111561514d578586fd5b61515988828701614a02565b8284015250506101208084013583811115615172578586fd5b61517e888287016148a7565b918301919091525095945050505050565b6000602082840312156151a0578081fd5b5051919050565b6000806000604084860312156151bb578081fd5b8335925060208401356001600160401b038111156151d7578182fd5b6151e386828701614a5f565b9497909650939450505050565b60008151808452615208816020860160208601615762565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b16815260008351615246816014850160208801615762565b83519083019061525d816014840160208801615762565b0160140195945050505050565b6000825161527c818460208701615762565b9190910192915050565b8183823760009101908152919050565b600083516152a8818460208801615762565b8351908301906152bc818360208801615762565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516152fd816017850160208801615762565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161532e816028840160208801615762565b01602801949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061536d908301846151f0565b9695505050505050565b6020815260006121ff60208301846151f0565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b03811182821017156156a7576156a761583b565b60405290565b604051601f8201601f191681016001600160401b03811182821017156156d5576156d561583b565b604052919050565b60006001600160401b038211156156f6576156f661583b565b5060051b60200190565b600082198211156157135761571361580f565b500190565b60008261572757615727615825565b500490565b60008160001904831182151516156157465761574661580f565b500290565b60008282101561575d5761575d61580f565b500390565b60005b8381101561577d578181015183820152602001615765565b838111156118a05750506000910152565b60008161579d5761579d61580f565b506000190190565b600181811c908216806157b957607f821691505b602082108114156157da57634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156157f4576157f461580f565b5060010190565b60008261580a5761580a615825565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b80151581146111d357600080fd5b6001600160e01b0319811681146111d357600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220c9fc67c5e18546ca519c6df0cea06909074f8abe53ffc4bb12ec8acd3ebfea9e64736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102ae5760003560e01c806366e7b60611610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a7146108f5578063f68e955314610916578063f8895cc814610938578063fce589d81461094d57600080fd5b8063ca15c8731461086c578063d547741f1461088c578063e985e9c5146108ac57600080fd5b8063a217fddf146107a3578063a22cb465146107b8578063b88d4fde146107d8578063bb87c1c8146107f8578063bce8542e14610813578063c87b56dd1461084c57600080fd5b80638daf3f4e1161012e5780638daf3f4e146106ee5780638f15b4141461070e5780639010d07c1461072e57806391d148541461074e57806393d0da071461076e57806395d89b411461078e57600080fd5b806366e7b6061461062c5780636f4c25aa1461064c5780637092d9ea1461066d57806370a082311461068d57806370d5ae05146106ad5780638d59cc02146106ce57600080fd5b806336568abe116102195780634b08b0a3116101d25780634b08b0a3146105705780634f1ef286146105995780634f6ccce7146105ac5780635471a057146105cc5780636017160b146105ec5780636352211e1461060c57600080fd5b806336568abe146104705780633659cfe61461049057806338f292d5146104b057806342842e0e1461051057806342966c681461053057806347f00d5a1461055057600080fd5b806318160ddd1161026b57806318160ddd146103a95780632185810b146103be57806323b872dd146103e0578063248a9ca3146104005780632f2ff15d146104305780632f745c591461045057600080fd5b806301ffc9a7146102b357806306fdde03146102e8578063081812fc1461030a578063095ea7b3146103425780630ecf9dfd1461036457806314c44e0914610384575b600080fd5b3480156102bf57600080fd5b506102d36102ce366004614ebb565b610964565b60405190151581526020015b60405180910390f35b3480156102f457600080fd5b506102fd610975565b6040516102df9190615377565b34801561031657600080fd5b5061032a610325366004614e60565b610a07565b6040516001600160a01b0390911681526020016102df565b34801561034e57600080fd5b5061036261035d366004614d98565b610a94565b005b34801561037057600080fd5b5061036261037f366004614cf2565b610baa565b34801561039057600080fd5b5061039b6101c85481565b6040519081526020016102df565b3480156103b557600080fd5b5060fd5461039b565b3480156103ca57600080fd5b506101c7546102d3906301000000900460ff1681565b3480156103ec57600080fd5b506103626103fb366004614b54565b610fdc565b34801561040c57600080fd5b5061039b61041b366004614e60565b60009081526065602052604090206001015490565b34801561043c57600080fd5b5061036261044b366004614e78565b611033565b34801561045c57600080fd5b5061039b61046b366004614d98565b611055565b34801561047c57600080fd5b5061036261048b366004614e78565b6110eb565b34801561049c57600080fd5b506103626104ab366004614b08565b61110d565b3480156104bc57600080fd5b506104f16104cb366004614e60565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102df565b34801561051c57600080fd5b5061036261052b366004614b54565b6111d6565b34801561053c57600080fd5b5061036261054b366004614e60565b6111f1565b34801561055c57600080fd5b5061036261056b3660046151a7565b61130c565b34801561057c57600080fd5b506101c75461032a9064010000000090046001600160a01b031681565b6103626105a7366004614c2a565b611447565b3480156105b857600080fd5b5061039b6105c7366004614e60565b611501565b3480156105d857600080fd5b506101c7546102d390610100900460ff1681565b3480156105f857600080fd5b506102fd610607366004614e60565b6115a2565b34801561061857600080fd5b5061032a610627366004614e60565b61163d565b34801561063857600080fd5b50610362610647366004614dc1565b6116b4565b34801561065857600080fd5b506101c7546102d39062010000900460ff1681565b34801561067957600080fd5b50610362610688366004614c75565b6118a6565b34801561069957600080fd5b5061039b6106a8366004614b08565b611bd5565b3480156106b957600080fd5b506101c95461032a906001600160a01b031681565b3480156106da57600080fd5b506103626106e9366004614c75565b611c5c565b3480156106fa57600080fd5b50610362610709366004614ef3565b611d0c565b34801561071a57600080fd5b50610362610729366004614f64565b6120ce565b34801561073a57600080fd5b5061032a610749366004614e9a565b6121e7565b34801561075a57600080fd5b506102d3610769366004614e78565b612206565b34801561077a57600080fd5b506103626107893660046151a7565b612231565b34801561079a57600080fd5b506102fd612393565b3480156107af57600080fd5b5061039b600081565b3480156107c457600080fd5b506103626107d3366004614bf4565b6123a2565b3480156107e457600080fd5b506103626107f3366004614b8f565b612467565b34801561080457600080fd5b506101c7546102d39060ff1681565b34801561081f57600080fd5b5061039b61082e366004614f32565b80516020818301810180516101c48252928201919093012091525481565b34801561085857600080fd5b506102fd610867366004614e60565b6124be565b34801561087857600080fd5b5061039b610887366004614e60565b6124c9565b34801561089857600080fd5b506103626108a7366004614e78565b6124e0565b3480156108b857600080fd5b506102d36108c7366004614b22565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561090157600080fd5b506101cb5461032a906001600160a01b031681565b34801561092257600080fd5b5061039b60008051602061589d83398151915281565b34801561094457600080fd5b506102fd6124ea565b34801561095957600080fd5b5061039b6101ca5481565b600061096f826124f8565b92915050565b606060c98054610984906157a5565b80601f01602080910402602001604051908101604052809291908181526020018280546109b0906157a5565b80156109fd5780601f106109d2576101008083540402835291602001916109fd565b820191906000526020600020905b8154815290600101906020018083116109e057829003601f168201915b5050505050905090565b6000610a128261251d565b610a785760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a9f8261163d565b9050806001600160a01b0316836001600160a01b03161415610b0d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a6f565b336001600160a01b0382161480610b295750610b2981336108c7565b610b9b5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a6f565b610ba5838361253a565b505050565b6101c75460ff16610c195760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a6f565b610c22876125a8565b610c3e5760405162461bcd60e51b8152600401610a6f906155da565b6101c75462010000900460ff1615610cd15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a6f565b84610d3a5760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610a6f565b610d7986868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061264592505050565b15610dec5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a6f565b336001600160a01b03881614610e5a5760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a6f565b610f028787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061267092505050565b610f5e5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a6f565b610fd28787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525061271592505050565b5050505050505050565b610fe7335b826127a4565b6110035760405162461bcd60e51b8152600401610a6f906154c2565b61100c826125a8565b6110285760405162461bcd60e51b8152600401610a6f906155da565b610ba58383836128a4565b61103d8282612a4f565b6000828152609760205260409020610ba59082612a75565b600061106083611bd5565b82106110c25760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a6f565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b6110f58282612a8a565b6000828152609760205260409020610ba59082612b04565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111565760405162461bcd60e51b8152600401610a6f906153dc565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316611188612b19565b6001600160a01b0316146111ae5760405162461bcd60e51b8152600401610a6f90615428565b6111b781612b47565b604080516000808252602082019092526111d391839190612b60565b50565b610ba583838360405180602001604052806000815250612467565b6111fa33610fe1565b6112165760405162461bcd60e51b8152600401610a6f906154c2565b61121f81612ca4565b60008181526101c66020526040902060010154156111d35760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156112b057600080fd5b505af11580156112c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e89190614e44565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b611314612d89565b61137b5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a6f565b611386335b846127a4565b6113a25760405162461bcd60e51b8152600401610a6f906154c2565b6113e28383838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612dbb92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f4838383604051602001611417929190615286565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156114905760405162461bcd60e51b8152600401610a6f906153dc565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166114c2612b19565b6001600160a01b0316146114e85760405162461bcd60e51b8152600401610a6f90615428565b6114f182612b47565b6114fd82826001612b60565b5050565b600061150c60fd5490565b821061156f5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a6f565b60fd828154811061159057634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c560205260009081526040902080546115bc906157a5565b80601f01602080910402602001604051908101604052809291908181526020018280546115e8906157a5565b80156116355780601f1061160a57610100808354040283529160200191611635565b820191906000526020600020905b81548152906001019060200180831161161857829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b03168061096f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a6f565b6116cc60008051602061589d83398151915233612206565b6116e85760405162461bcd60e51b8152600401610a6f9061552c565b81518351146117725760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a6f565b81518151146118035760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a6f565b60005b83518110156118a05761188f84828151811061183257634e487b7160e01b600052603260045260246000fd5b602002602001015184838151811061185a57634e487b7160e01b600052603260045260246000fd5b602002602001015184848151811061188257634e487b7160e01b600052603260045260246000fd5b6020026020010151612715565b50611899816157e0565b9050611806565b50505050565b6101c75464010000000090046001600160a01b031661192d5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a6f565b61196c84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061264592505050565b156119895760405162461bcd60e51b8152600401610a6f90615589565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b1580156119f457600080fd5b505af1158015611a08573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a2c9190614e44565b506000611aa38686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061271592505050565b905060006127106101ca546101c854611abc919061572c565b611ac69190615718565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611b2357600080fd5b505af1158015611b37573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b5b9190614e44565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611b9190849061574b565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611c405760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a6f565b506001600160a01b0316600090815260cc602052604090205490565b611c7460008051602061589d83398151915233612206565b611c905760405162461bcd60e51b8152600401610a6f9061552c565b611d048585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8901819004810282018101909252878152925087915086908190840183828082843760009201919091525061271592505050565b505050505050565b611d2460008051602061589d83398151915233612206565b611d805760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a6f565b6000611d8e82840184614fe5565b80515190915015611dda5780518051600090611dba57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611dd8929190614748565b505b60208101515115611e2d578060200151600081518110611e0a57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b60408101515115611e80578060400151600081518110611e5d57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b60608101515115611ed3578060600151600081518110611eb057634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b60808101515115611f26578060800151600081518110611f0357634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b60a08101515115611f86578060a00151600081518110611f5657634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115611fc6578060c00151600081518110611fb657634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b60e08101515115612026578060e00151600081518110611ff657634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b61010081015151156120685780610100015160008151811061205857634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b6101208101515115610ba55780610120015160008151811061209a57634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff16806120e7575060005460ff16155b6121035760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612125576000805461ffff19166101011790555b61212d612e47565b612135612eba565b61213d612f29565b612145612f29565b61214d612f87565b6121578585612fe5565b61216260008361306c565b61217a60008051602061589d8339815191528461306c565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb8054909116905580156121e0576000805461ff00191690555b5050505050565b60008281526097602052604081206121ff9083613076565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b612239613082565b61229e5760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a6f565b6122a733611380565b6122c35760405162461bcd60e51b8152600401610a6f906154c2565b61230282828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061264592505050565b1561231f5760405162461bcd60e51b8152600401610a6f90615589565b826101c48383604051612333929190615286565b90815260408051602092819003830190209290925560008581526101c59091522061235f9083836147cc565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161143a9392919061564e565b606060ca8054610984906157a5565b6001600160a01b0382163314156123fb5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a6f565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61247133836127a4565b61248d5760405162461bcd60e51b8152600401610a6f906154c2565b612496836125a8565b6124b25760405162461bcd60e51b8152600401610a6f906155da565b6118a0848484846130b0565b606061096f826130e3565b600081815260976020526040812061096f90613253565b6110f5828261325d565b6101c380546115bc906157a5565b60006001600160e01b0319821663780e9d6360e01b148061096f575061096f82613283565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b038416908117909155819061256f8261163d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b0316158061096f57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561260657600080fd5b505afa15801561261a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061263e919061518f565b1192915050565b60006101c482604051612658919061526a565b90815260405190819003602001902054151592915050565b6000806126eb86868660405160200161268b9392919061521c565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b905061270960008051602061589d83398151915261076983866132c3565b9150505b949350505050565b81516000901561279a5761272883612645565b156127455760405162461bcd60e51b8152600401610a6f90615589565b61274f84836132e7565b9050806101c484604051612763919061526a565b90815260408051602092819003830190209290925560008381526101c5825291909120845161279492860190614748565b506121ff565b61270d84836132e7565b60006127af8261251d565b6128105760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a6f565b600061281b8361163d565b9050806001600160a01b0316846001600160a01b031614806128565750836001600160a01b031661284b84610a07565b6001600160a01b0316145b8061288657506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b8061270d575061270d60008051602061589d83398151915285612206565b826001600160a01b03166128b78261163d565b6001600160a01b03161461291f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a6f565b6001600160a01b0382166129815760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a6f565b61298c838383613342565b61299760008261253a565b6001600160a01b038316600090815260cc602052604081208054600192906129c090849061574b565b90915550506001600160a01b038216600090815260cc602052604081208054600192906129ee908490615700565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612a6b81336133b6565b610ba5838361341a565b60006121ff836001600160a01b0384166134a0565b6001600160a01b0381163314612afa5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a6f565b6114fd82826134ef565b60006121ff836001600160a01b038416613556565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b60008051602061589d8339815191526114fd81336133b6565b6000612b6a612b19565b9050612b7584613673565b600083511180612b825750815b15612b9357612b918484613718565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff166121e057805460ff191660011781556040516001600160a01b0383166024820152612c1290869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613718565b50805460ff19168155612c23612b19565b6001600160a01b0316826001600160a01b031614612c9b5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a6f565b6121e085613803565b612cad81613843565b60008181526101c5602052604081208054612cc7906157a5565b80601f0160208091040260200160405190810160405280929190818152602001828054612cf3906157a5565b8015612d405780601f10612d1557610100808354040283529160200191612d40565b820191906000526020600020905b815481529060010190602001808311612d2357829003601f168201915b50505060008581526101c560205260408120939450612d629392509050614840565b6101c481604051612d73919061526a565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff1680612db65750612db660008051602061589d83398151915233612206565b905090565b612dc48261251d565b612e275760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a6f565b600082815261012d602090815260409091208251610ba592840190614748565b600054610100900460ff1680612e60575060005460ff16155b612e7c5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612e9e576000805461ffff19166101011790555b612ea6613885565b80156111d3576000805461ff001916905550565b600054610100900460ff1680612ed3575060005460ff16155b612eef5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612f11576000805461ffff19166101011790555b612f19613885565b612f21613885565b612e9e613885565b600054610100900460ff1680612f42575060005460ff16155b612f5e5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612f19576000805461ffff1916610101179055612f21613885565b600054610100900460ff1680612fa0575060005460ff16155b612fbc5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612f21576000805461ffff1916610101179055612e9e613885565b600054610100900460ff1680612ffe575060005460ff16155b61301a5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff1615801561303c576000805461ffff19166101011790555b613044613885565b61304c613885565b61305683836138ef565b8015610ba5576000805461ff0019169055505050565b61103d8282613984565b60006121ff838361398e565b6101c75460009062010000900460ff1680612db65750612db660008051602061589d83398151915233612206565b6130bb8484846128a4565b6130c7848484846139c6565b6118a05760405162461bcd60e51b8152600401610a6f9061538a565b60606130ee8261251d565b6131545760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a6f565b600082815261012d60205260408120805461316e906157a5565b80601f016020809104026020016040519081016040528092919081815260200182805461319a906157a5565b80156131e75780601f106131bc576101008083540402835291602001916131e7565b820191906000526020600020905b8154815290600101906020018083116131ca57829003601f168201915b50505050509050600061320560408051602081019091526000815290565b9050805160001415613218575092915050565b81511561324a578082604051602001613232929190615296565b60405160208183030381529060405292505050919050565b61270d84613ad0565b600061096f825490565b60008281526065602052604090206001015461327981336133b6565b610ba583836134ef565b60006001600160e01b031982166380ac58cd60e01b14806132b457506001600160e01b03198216635b5e139f60e01b145b8061096f575061096f82613ba7565b60008060006132d28585613bcc565b915091506132df81613c3c565b509392505050565b60006132f2836125a8565b61330e5760405162461bcd60e51b8152600401610a6f906155da565b6101cc5461331d906001615700565b90506133298382613e3d565b6133386101cc80546001019055565b61096f8183612dbb565b61334a613f7c565b6133ab5760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a6f565b610ba5838383613fab565b6133c08282612206565b6114fd576133d8816001600160a01b03166014614063565b6133e3836020614063565b6040516020016133f49291906152c5565b60408051601f198184030181529082905262461bcd60e51b8252610a6f91600401615377565b6134248282612206565b6114fd5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561345c3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008181526001830160205260408120546134e75750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561096f565b50600061096f565b6134f98282612206565b156114fd5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000818152600183016020526040812054801561366957600061357a60018361574b565b855490915060009061358e9060019061574b565b905081811461360f5760008660000182815481106135bc57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106135ed57634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061362e57634e487b7160e01b600052603160045260246000fd5b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061096f565b600091505061096f565b803b6136d75760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a6f565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6137775760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a6f565b600080846001600160a01b031684604051613792919061526a565b600060405180830381855af49150503d80600081146137cd576040519150601f19603f3d011682016040523d82523d6000602084013e6137d2565b606091505b50915091506137fa828260405180606001604052806027815260200161587660279139614244565b95945050505050565b61380c81613673565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b61384c8161427d565b600081815261012d602052604090208054613866906157a5565b1590506111d357600081815261012d602052604081206111d391614840565b600054610100900460ff168061389e575060005460ff16155b6138ba5760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015612ea6576000805461ffff191661010117905580156111d3576000805461ff001916905550565b600054610100900460ff1680613908575060005460ff16155b6139245760405162461bcd60e51b8152600401610a6f90615474565b600054610100900460ff16158015613946576000805461ffff19166101011790555b82516139599060c9906020860190614748565b50815161396d9060ca906020850190614748565b508015610ba5576000805461ff0019169055505050565b6114fd828261341a565b60008260000182815481106139b357634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613ac857604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613a0a90339089908890889060040161533a565b602060405180830381600087803b158015613a2457600080fd5b505af1925050508015613a54575060408051601f3d908101601f19168201909252613a5191810190614ed7565b60015b613aae573d808015613a82576040519150601f19603f3d011682016040523d82523d6000602084013e613a87565b606091505b508051613aa65760405162461bcd60e51b8152600401610a6f9061538a565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061270d565b50600161270d565b6060613adb8261251d565b613b3f5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a6f565b6000613b5660408051602081019091526000815290565b90506000815111613b7657604051806020016040528060008152506121ff565b80613b8084614324565b604051602001613b91929190615296565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b148061096f575061096f8261443d565b600080825160411415613c035760208301516040840151606085015160001a613bf787828585614472565b94509450505050613c35565b825160401415613c2d5760208301516040840151613c2286838361455f565b935093505050613c35565b506000905060025b9250929050565b6000816004811115613c5e57634e487b7160e01b600052602160045260246000fd5b1415613c675750565b6001816004811115613c8957634e487b7160e01b600052602160045260246000fd5b1415613cd75760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a6f565b6002816004811115613cf957634e487b7160e01b600052602160045260246000fd5b1415613d475760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a6f565b6003816004811115613d6957634e487b7160e01b600052602160045260246000fd5b1415613dc25760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a6f565b6004816004811115613de457634e487b7160e01b600052602160045260246000fd5b14156111d35760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a6f565b6001600160a01b038216613e935760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a6f565b613e9c8161251d565b15613ee95760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a6f565b613ef560008383613342565b6001600160a01b038216600090815260cc60205260408120805460019290613f1e908490615700565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff1680612db65750612db660008051602061589d83398151915233612206565b6001600160a01b038316614006576140018160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b614029565b816001600160a01b0316836001600160a01b03161461402957614029838261458e565b6001600160a01b03821661404057610ba58161462b565b826001600160a01b0316826001600160a01b031614610ba557610ba58282614704565b6060600061407283600261572c565b61407d906002615700565b6001600160401b038111156140a257634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156140cc576020820181803683370190505b509050600360fc1b816000815181106140f557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061413257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600061415684600261572c565b614161906001615700565b90505b60018111156141f5576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106141a357634e487b7160e01b600052603260045260246000fd5b1a60f81b8282815181106141c757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936141ee8161578e565b9050614164565b5083156121ff5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a6f565b606083156142535750816121ff565b8251156142635782518084602001fd5b8160405162461bcd60e51b8152600401610a6f9190615377565b60006142888261163d565b905061429681600084613342565b6142a160008361253a565b6001600160a01b038116600090815260cc602052604081208054600192906142ca90849061574b565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816143485750506040805180820190915260018152600360fc1b602082015290565b8160005b8115614372578061435c816157e0565b915061436b9050600a83615718565b915061434c565b6000816001600160401b0381111561439a57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156143c4576020820181803683370190505b5090505b841561270d576143d960018361574b565b91506143e6600a866157fb565b6143f1906030615700565b60f81b81838151811061441457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350614436600a86615718565b94506143c8565b60006001600160e01b03198216637965db0b60e01b148061096f57506301ffc9a760e01b6001600160e01b031983161461096f565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156144a95750600090506003614556565b8460ff16601b141580156144c157508460ff16601c14155b156144d25750600090506004614556565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015614526573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661454f57600060019250925050614556565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161458087828885614472565b935093505050935093915050565b6000600161459b84611bd5565b6145a5919061574b565b600083815260fc60205260409020549091508082146145f8576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061463d9060019061574b565b600083815260fe602052604081205460fd805493945090928490811061467357634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106146a257634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd8054806146e857634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b600061470f83611bd5565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614754906157a5565b90600052602060002090601f01602090048101928261477657600085556147bc565b82601f1061478f57805160ff19168380011785556147bc565b828001600101855582156147bc579182015b828111156147bc5782518255916020019190600101906147a1565b506147c8929150614876565b5090565b8280546147d8906157a5565b90600052602060002090601f0160209004810192826147fa57600085556147bc565b82601f106148135782800160ff198235161785556147bc565b828001600101855582156147bc579182015b828111156147bc578235825591602001919060010190614825565b50805461484c906157a5565b6000825580601f1061485c575050565b601f0160209004906000526020600020908101906111d391905b5b808211156147c85760008155600101614877565b80356001600160a01b03811681146148a257600080fd5b919050565b600082601f8301126148b7578081fd5b813560206148cc6148c7836156dd565b6156ad565b80838252828201915082860187848660051b89010111156148eb578586fd5b855b85811015614910576148fe8261488b565b845292840192908401906001016148ed565b5090979650505050505050565b600082601f83011261492d578081fd5b8135602061493d6148c7836156dd565b80838252828201915082860187848660051b890101111561495c578586fd5b855b8581101561491057813561497181615851565b8452928401929084019060010161495e565b600082601f830112614993578081fd5b813560206149a36148c7836156dd565b80838252828201915082860187848660051b89010111156149c2578586fd5b855b858110156149105781356001600160401b038111156149e1578788fd5b6149ef8a87838c0101614a9e565b85525092840192908401906001016149c4565b600082601f830112614a12578081fd5b81356020614a226148c7836156dd565b80838252828201915082860187848660051b8901011115614a41578586fd5b855b8581101561491057813584529284019290840190600101614a43565b60008083601f840112614a70578182fd5b5081356001600160401b03811115614a86578182fd5b602083019150836020828501011115613c3557600080fd5b600082601f830112614aae578081fd5b81356001600160401b03811115614ac757614ac761583b565b614ada601f8201601f19166020016156ad565b818152846020838601011115614aee578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614b19578081fd5b6121ff8261488b565b60008060408385031215614b34578081fd5b614b3d8361488b565b9150614b4b6020840161488b565b90509250929050565b600080600060608486031215614b68578081fd5b614b718461488b565b9250614b7f6020850161488b565b9150604084013590509250925092565b60008060008060808587031215614ba4578182fd5b614bad8561488b565b9350614bbb6020860161488b565b92506040850135915060608501356001600160401b03811115614bdc578182fd5b614be887828801614a9e565b91505092959194509250565b60008060408385031215614c06578182fd5b614c0f8361488b565b91506020830135614c1f81615851565b809150509250929050565b60008060408385031215614c3c578182fd5b614c458361488b565b915060208301356001600160401b03811115614c5f578182fd5b614c6b85828601614a9e565b9150509250929050565b600080600080600060608688031215614c8c578283fd5b614c958661488b565b945060208601356001600160401b0380821115614cb0578485fd5b614cbc89838a01614a5f565b90965094506040880135915080821115614cd4578283fd5b50614ce188828901614a5f565b969995985093965092949392505050565b60008060008060008060006080888a031215614d0c578485fd5b614d158861488b565b965060208801356001600160401b0380821115614d30578687fd5b614d3c8b838c01614a5f565b909850965060408a0135915080821115614d54578384fd5b614d608b838c01614a5f565b909650945060608a0135915080821115614d78578384fd5b50614d858a828b01614a5f565b989b979a50959850939692959293505050565b60008060408385031215614daa578182fd5b614db38361488b565b946020939093013593505050565b600080600060608486031215614dd5578081fd5b83356001600160401b0380821115614deb578283fd5b614df7878388016148a7565b94506020860135915080821115614e0c578283fd5b614e1887838801614983565b93506040860135915080821115614e2d578283fd5b50614e3a86828701614983565b9150509250925092565b600060208284031215614e55578081fd5b81516121ff81615851565b600060208284031215614e71578081fd5b5035919050565b60008060408385031215614e8a578182fd5b82359150614b4b6020840161488b565b60008060408385031215614eac578182fd5b50508035926020909101359150565b600060208284031215614ecc578081fd5b81356121ff8161585f565b600060208284031215614ee8578081fd5b81516121ff8161585f565b60008060208385031215614f05578182fd5b82356001600160401b03811115614f1a578283fd5b614f2685828601614a5f565b90969095509350505050565b600060208284031215614f43578081fd5b81356001600160401b03811115614f58578182fd5b61270d84828501614a9e565b60008060008060808587031215614f79578182fd5b84356001600160401b0380821115614f8f578384fd5b614f9b88838901614a9e565b95506020870135915080821115614fb0578384fd5b50614fbd87828801614a9e565b935050614fcc6040860161488b565b9150614fda6060860161488b565b905092959194509250565b600060208284031215614ff6578081fd5b81356001600160401b038082111561500c578283fd5b908301906101408286031215615020578283fd5b615028615684565b823582811115615036578485fd5b61504287828601614983565b825250602083013582811115615056578485fd5b6150628782860161491d565b602083015250604083013582811115615079578485fd5b6150858782860161491d565b60408301525060608301358281111561509c578485fd5b6150a88782860161491d565b6060830152506080830135828111156150bf578485fd5b6150cb8782860161491d565b60808301525060a0830135828111156150e2578485fd5b6150ee878286016148a7565b60a08301525060c083013582811115615105578485fd5b61511187828601614a02565b60c08301525060e083013582811115615128578485fd5b615134878286016148a7565b60e083015250610100808401358381111561514d578586fd5b61515988828701614a02565b8284015250506101208084013583811115615172578586fd5b61517e888287016148a7565b918301919091525095945050505050565b6000602082840312156151a0578081fd5b5051919050565b6000806000604084860312156151bb578081fd5b8335925060208401356001600160401b038111156151d7578182fd5b6151e386828701614a5f565b9497909650939450505050565b60008151808452615208816020860160208601615762565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b16815260008351615246816014850160208801615762565b83519083019061525d816014840160208801615762565b0160140195945050505050565b6000825161527c818460208701615762565b9190910192915050565b8183823760009101908152919050565b600083516152a8818460208801615762565b8351908301906152bc818360208801615762565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516152fd816017850160208801615762565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161532e816028840160208801615762565b01602801949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061536d908301846151f0565b9695505050505050565b6020815260006121ff60208301846151f0565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b03811182821017156156a7576156a761583b565b60405290565b604051601f8201601f191681016001600160401b03811182821017156156d5576156d561583b565b604052919050565b60006001600160401b038211156156f6576156f661583b565b5060051b60200190565b600082198211156157135761571361580f565b500190565b60008261572757615727615825565b500490565b60008160001904831182151516156157465761574661580f565b500290565b60008282101561575d5761575d61580f565b500390565b60005b8381101561577d578181015183820152602001615765565b838111156118a05750506000910152565b60008161579d5761579d61580f565b506000190190565b600181811c908216806157b957607f821691505b602082108114156157da57634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156157f4576157f461580f565b5060010190565b60008261580a5761580a615825565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b80151581146111d357600080fd5b6001600160e01b0319811681146111d357600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220c9fc67c5e18546ca519c6df0cea06909074f8abe53ffc4bb12ec8acd3ebfea9e64736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
