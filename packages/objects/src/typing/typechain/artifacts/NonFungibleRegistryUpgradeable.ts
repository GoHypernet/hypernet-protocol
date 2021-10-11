export default {
  _format: "hh-sol-artifact-1",
  contractName: "NonFungibleRegistryUpgradeable",
  sourceName: "contracts/NonFungibleRegistryUpgradeable.sol",
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
          internalType: "string[]",
          name: "_schema",
          type: "string[]",
        },
        {
          internalType: "bool[]",
          name: "_allowLazyRegister",
          type: "bool[]",
        },
        {
          internalType: "bool[]",
          name: "_allowStorageUpdate",
          type: "bool[]",
        },
        {
          internalType: "bool[]",
          name: "_allowLabelChange",
          type: "bool[]",
        },
        {
          internalType: "bool[]",
          name: "_allowTransfers",
          type: "bool[]",
        },
        {
          internalType: "address[]",
          name: "_registrationToken",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "_registrationFee",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "_burnAddress",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "_burnFee",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "_primaryRegistry",
          type: "address[]",
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
    "0x60a06040523060601b6080523480156200001857600080fd5b50600054610100900460ff168062000033575060005460ff16155b6200009b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000be576000805461ffff19166101011790555b8015620000d1576000805461ff00191690555b5060805160601c61541d6200010660003960008181610fde0152818161101e015281816112df015261131f015261541d6000f3fe6080604052600436106102ae5760003560e01c80636352211e11610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a7146108f5578063f68e955314610916578063f8895cc814610938578063fce589d81461094d57600080fd5b8063ca15c8731461086c578063d547741f1461088c578063e985e9c5146108ac57600080fd5b8063a217fddf146107a3578063a22cb465146107b8578063b88d4fde146107d8578063bb87c1c8146107f8578063bce8542e14610813578063c87b56dd1461084c57600080fd5b80638d59cc021161012e5780638d59cc02146106ee5780638f15b4141461070e5780639010d07c1461072e57806391d148541461074e57806393d0da071461076e57806395d89b411461078e57600080fd5b80636352211e1461062c57806366e7b6061461064c5780636f4c25aa1461066c5780637092d9ea1461068d57806370a08231146106ad57806370d5ae05146106cd57600080fd5b806336568abe116102195780634b08b0a3116101d25780634b08b0a3146105705780634f1ef286146105995780634f6ccce7146105ac5780635471a057146105cc5780635dc638a4146105ec5780636017160b1461060c57600080fd5b806336568abe146104705780633659cfe61461049057806338f292d5146104b057806342842e0e1461051057806342966c681461053057806347f00d5a1461055057600080fd5b806318160ddd1161026b57806318160ddd146103a95780632185810b146103be57806323b872dd146103e0578063248a9ca3146104005780632f2ff15d146104305780632f745c591461045057600080fd5b806301ffc9a7146102b357806306fdde03146102e8578063081812fc1461030a578063095ea7b3146103425780630ecf9dfd1461036457806314c44e0914610384575b600080fd5b3480156102bf57600080fd5b506102d36102ce366004614c40565b610964565b60405190151581526020015b60405180910390f35b3480156102f457600080fd5b506102fd610975565b6040516102df9190614ee8565b34801561031657600080fd5b5061032a610325366004614be5565b610a07565b6040516001600160a01b0390911681526020016102df565b34801561034e57600080fd5b5061036261035d3660046149a8565b610a94565b005b34801561037057600080fd5b5061036261037f366004614920565b610baa565b34801561039057600080fd5b5061039b6101c85481565b6040519081526020016102df565b3480156103b557600080fd5b5060fd5461039b565b3480156103ca57600080fd5b506101c7546102d3906301000000900460ff1681565b3480156103ec57600080fd5b506103626103fb36600461478f565b610ea2565b34801561040c57600080fd5b5061039b61041b366004614be5565b60009081526065602052604090206001015490565b34801561043c57600080fd5b5061036261044b366004614bfd565b610ef9565b34801561045c57600080fd5b5061039b61046b3660046149a8565b610f1b565b34801561047c57600080fd5b5061036261048b366004614bfd565b610fb1565b34801561049c57600080fd5b506103626104ab366004614743565b610fd3565b3480156104bc57600080fd5b506104f16104cb366004614be5565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102df565b34801561051c57600080fd5b5061036261052b36600461478f565b61109c565b34801561053c57600080fd5b5061036261054b366004614be5565b6110b7565b34801561055c57600080fd5b5061036261056b366004614d43565b6111d2565b34801561057c57600080fd5b506101c75461032a9064010000000090046001600160a01b031681565b6103626105a7366004614865565b6112d4565b3480156105b857600080fd5b5061039b6105c7366004614be5565b61138e565b3480156105d857600080fd5b506101c7546102d390610100900460ff1681565b3480156105f857600080fd5b50610362610607366004614a4a565b61142f565b34801561061857600080fd5b506102fd610627366004614be5565b61179b565b34801561063857600080fd5b5061032a610647366004614be5565b611836565b34801561065857600080fd5b506103626106673660046149d1565b6118ad565b34801561067857600080fd5b506101c7546102d39062010000900460ff1681565b34801561069957600080fd5b506103626106a83660046148b0565b611a9f565b3480156106b957600080fd5b5061039b6106c8366004614743565b611d2d565b3480156106d957600080fd5b506101c95461032a906001600160a01b031681565b3480156106fa57600080fd5b506103626107093660046148b0565b611db4565b34801561071a57600080fd5b50610362610729366004614caa565b611df3565b34801561073a57600080fd5b5061032a610749366004614c1f565b611f0b565b34801561075a57600080fd5b506102d3610769366004614bfd565b611f2a565b34801561077a57600080fd5b50610362610789366004614d43565b611f55565b34801561079a57600080fd5b506102fd612082565b3480156107af57600080fd5b5061039b600081565b3480156107c457600080fd5b506103626107d336600461482f565b612091565b3480156107e457600080fd5b506103626107f33660046147ca565b612156565b34801561080457600080fd5b506101c7546102d39060ff1681565b34801561081f57600080fd5b5061039b61082e366004614c78565b80516020818301810180516101c48252928201919093012091525481565b34801561085857600080fd5b506102fd610867366004614be5565b6121ac565b34801561087857600080fd5b5061039b610887366004614be5565b6121b7565b34801561089857600080fd5b506103626108a7366004614bfd565b6121ce565b3480156108b857600080fd5b506102d36108c736600461475d565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561090157600080fd5b506101cb5461032a906001600160a01b031681565b34801561092257600080fd5b5061039b6000805160206153c883398151915281565b34801561094457600080fd5b506102fd6121d8565b34801561095957600080fd5b5061039b6101ca5481565b600061096f826121e6565b92915050565b606060c98054610984906152d0565b80601f01602080910402602001604051908101604052809291908181526020018280546109b0906152d0565b80156109fd5780601f106109d2576101008083540402835291602001916109fd565b820191906000526020600020905b8154815290600101906020018083116109e057829003601f168201915b5050505050905090565b6000610a128261220b565b610a785760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a9f82611836565b9050806001600160a01b0316836001600160a01b03161415610b0d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a6f565b336001600160a01b0382161480610b295750610b2981336108c7565b610b9b5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a6f565b610ba58383612228565b505050565b6101c75460ff16610c195760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a6f565b610c2284612296565b610c3e5760405162461bcd60e51b8152600401610a6f9061514b565b6101c75462010000900460ff1615610cd15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a6f565b6000835111610d3e5760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610a6f565b610d4783612333565b15610dba5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a6f565b336001600160a01b03851614610e285760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a6f565b610e348484848461235e565b610e905760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a6f565b610e9b848484612403565b5050505050565b610ead335b82612492565b610ec95760405162461bcd60e51b8152600401610a6f90615033565b610ed282612296565b610eee5760405162461bcd60e51b8152600401610a6f9061514b565b610ba5838383612592565b610f03828261273d565b6000828152609760205260409020610ba59082612763565b6000610f2683611d2d565b8210610f885760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a6f565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b610fbb8282612778565b6000828152609760205260409020610ba590826127f2565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561101c5760405162461bcd60e51b8152600401610a6f90614f4d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661104e612807565b6001600160a01b0316146110745760405162461bcd60e51b8152600401610a6f90614f99565b61107d81612835565b604080516000808252602082019092526110999183919061284e565b50565b610ba583838360405180602001604052806000815250612156565b6110c033610ea7565b6110dc5760405162461bcd60e51b8152600401610a6f90615033565b6110e581612992565b60008181526101c66020526040902060010154156110995760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561117657600080fd5b505af115801561118a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111ae9190614bc9565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b6111da612a77565b6112415760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a6f565b61124c335b83612492565b6112685760405162461bcd60e51b8152600401610a6f90615033565b6112728282612aa9565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f482826040516020016112a59190614deb565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a15050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561131d5760405162461bcd60e51b8152600401610a6f90614f4d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661134f612807565b6001600160a01b0316146113755760405162461bcd60e51b8152600401610a6f90614f99565b61137e82612835565b61138a8282600161284e565b5050565b600061139960fd5490565b82106113fc5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a6f565b60fd828154811061141d57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6114476000805160206153c883398151915233611f2a565b6114a35760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a6f565b8951156114eb57896000815181106114cb57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c390805190602001906114e9929190614436565b505b885115611536578860008151811061151357634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b875115611581578760008151811061155e57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b8651156115cc57866000815181106115a957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b85511561161757856000815181106115f457634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b84511561166f578460008151811061163f57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b8351156116a7578360008151811061169757634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b8251156116ff57826000815181106116cf57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b815115611737578160008151811061172757634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b80511561178f578060008151811061175f57634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b50505050505050505050565b6101c560205260009081526040902080546117b5906152d0565b80601f01602080910402602001604051908101604052809291908181526020018280546117e1906152d0565b801561182e5780601f106118035761010080835404028352916020019161182e565b820191906000526020600020905b81548152906001019060200180831161181157829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b03168061096f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a6f565b6118c56000805160206153c883398151915233611f2a565b6118e15760405162461bcd60e51b8152600401610a6f9061509d565b815183511461196b5760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a6f565b81518151146119fc5760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a6f565b60005b8351811015611a9957611a88848281518110611a2b57634e487b7160e01b600052603260045260246000fd5b6020026020010151848381518110611a5357634e487b7160e01b600052603260045260246000fd5b6020026020010151848481518110611a7b57634e487b7160e01b600052603260045260246000fd5b6020026020010151612403565b50611a928161530b565b90506119ff565b50505050565b6101c75464010000000090046001600160a01b0316611b265760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a6f565b611b2f82612333565b15611b4c5760405162461bcd60e51b8152600401610a6f906150fa565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015611bb757600080fd5b505af1158015611bcb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bef9190614bc9565b506000611bfd848484612403565b905060006127106101ca546101c854611c169190615257565b611c209190615243565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611c7d57600080fd5b505af1158015611c91573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cb59190614bc9565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611ceb908490615276565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b0390911617815592015160019092019190915550505050565b60006001600160a01b038216611d985760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a6f565b506001600160a01b0316600090815260cc602052604090205490565b611dcc6000805160206153c883398151915233611f2a565b611de85760405162461bcd60e51b8152600401610a6f9061509d565b611a99838383612403565b600054610100900460ff1680611e0c575060005460ff16155b611e285760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015611e4a576000805461ffff19166101011790555b611e52612b35565b611e5a612ba8565b611e62612c17565b611e6a612c17565b611e72612c75565b611e7c8585612cd3565b611e87600083612d5a565b611e9f6000805160206153c883398151915284612d5a565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb805490911690558015610e9b576000805461ff00191690555050505050565b6000828152609760205260408120611f239083612d64565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b611f5d612d70565b611fc25760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a6f565b611fcb33611246565b611fe75760405162461bcd60e51b8152600401610a6f90615033565b611ff081612333565b1561200d5760405162461bcd60e51b8152600401610a6f906150fa565b816101c48260405161201f9190614deb565b90815260408051602092819003830190209290925560008481526101c5825291909120825161205092840190614436565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c82826040516112c89291906151bf565b606060ca8054610984906152d0565b6001600160a01b0382163314156120ea5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a6f565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61215f33611246565b61217b5760405162461bcd60e51b8152600401610a6f90615033565b61218483612296565b6121a05760405162461bcd60e51b8152600401610a6f9061514b565b611a9984848484612d9e565b606061096f82612dd1565b600081815260976020526040812061096f90612f41565b610fbb8282612f4b565b6101c380546117b5906152d0565b60006001600160e01b0319821663780e9d6360e01b148061096f575061096f82612f71565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b038416908117909155819061225d82611836565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b0316158061096f57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b1580156122f457600080fd5b505afa158015612308573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061232c9190614d2b565b1192915050565b60006101c4826040516123469190614deb565b90815260405190819003602001902054151592915050565b6000806123d986868660405160200161237993929190614d9d565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b90506123f76000805160206153c88339815191526107698386612fb1565b9150505b949350505050565b8151600090156124885761241683612333565b156124335760405162461bcd60e51b8152600401610a6f906150fa565b61243d8483612fd5565b9050806101c4846040516124519190614deb565b90815260408051602092819003830190209290925560008381526101c5825291909120845161248292860190614436565b50611f23565b6123fb8483612fd5565b600061249d8261220b565b6124fe5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a6f565b600061250983611836565b9050806001600160a01b0316846001600160a01b031614806125445750836001600160a01b031661253984610a07565b6001600160a01b0316145b8061257457506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806123fb57506123fb6000805160206153c883398151915285611f2a565b826001600160a01b03166125a582611836565b6001600160a01b03161461260d5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a6f565b6001600160a01b03821661266f5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a6f565b61267a838383613030565b612685600082612228565b6001600160a01b038316600090815260cc602052604081208054600192906126ae908490615276565b90915550506001600160a01b038216600090815260cc602052604081208054600192906126dc90849061522b565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b60008281526065602052604090206001015461275981336130a4565b610ba58383613108565b6000611f23836001600160a01b03841661318e565b6001600160a01b03811633146127e85760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a6f565b61138a82826131dd565b6000611f23836001600160a01b038416613244565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6000805160206153c883398151915261138a81336130a4565b6000612858612807565b905061286384613361565b6000835111806128705750815b156128815761287f8484613406565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610e9b57805460ff191660011781556040516001600160a01b038316602482015261290090869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613406565b50805460ff19168155612911612807565b6001600160a01b0316826001600160a01b0316146129895760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a6f565b610e9b856134f1565b61299b81613531565b60008181526101c56020526040812080546129b5906152d0565b80601f01602080910402602001604051908101604052809291908181526020018280546129e1906152d0565b8015612a2e5780601f10612a0357610100808354040283529160200191612a2e565b820191906000526020600020905b815481529060010190602001808311612a1157829003601f168201915b50505060008581526101c560205260408120939450612a5093925090506144ba565b6101c481604051612a619190614deb565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff1680612aa45750612aa46000805160206153c883398151915233611f2a565b905090565b612ab28261220b565b612b155760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a6f565b600082815261012d602090815260409091208251610ba592840190614436565b600054610100900460ff1680612b4e575060005460ff16155b612b6a5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612b8c576000805461ffff19166101011790555b612b94613573565b8015611099576000805461ff001916905550565b600054610100900460ff1680612bc1575060005460ff16155b612bdd5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612bff576000805461ffff19166101011790555b612c07613573565b612c0f613573565b612b8c613573565b600054610100900460ff1680612c30575060005460ff16155b612c4c5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612c07576000805461ffff1916610101179055612c0f613573565b600054610100900460ff1680612c8e575060005460ff16155b612caa5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612c0f576000805461ffff1916610101179055612b8c613573565b600054610100900460ff1680612cec575060005460ff16155b612d085760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612d2a576000805461ffff19166101011790555b612d32613573565b612d3a613573565b612d4483836135dd565b8015610ba5576000805461ff0019169055505050565b610f038282613672565b6000611f23838361367c565b6101c75460009062010000900460ff1680612aa45750612aa46000805160206153c883398151915233611f2a565b612da9848484612592565b612db5848484846136b4565b611a995760405162461bcd60e51b8152600401610a6f90614efb565b6060612ddc8261220b565b612e425760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a6f565b600082815261012d602052604081208054612e5c906152d0565b80601f0160208091040260200160405190810160405280929190818152602001828054612e88906152d0565b8015612ed55780601f10612eaa57610100808354040283529160200191612ed5565b820191906000526020600020905b815481529060010190602001808311612eb857829003601f168201915b505050505090506000612ef360408051602081019091526000815290565b9050805160001415612f06575092915050565b815115612f38578082604051602001612f20929190614e07565b60405160208183030381529060405292505050919050565b6123fb846137be565b600061096f825490565b600082815260656020526040902060010154612f6781336130a4565b610ba583836131dd565b60006001600160e01b031982166380ac58cd60e01b1480612fa257506001600160e01b03198216635b5e139f60e01b145b8061096f575061096f82613895565b6000806000612fc085856138ba565b91509150612fcd8161392a565b509392505050565b6000612fe083612296565b612ffc5760405162461bcd60e51b8152600401610a6f9061514b565b6101cc5461300b90600161522b565b90506130178382613b2b565b6130266101cc80546001019055565b61096f8183612aa9565b613038613c6a565b6130995760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a6f565b610ba5838383613c99565b6130ae8282611f2a565b61138a576130c6816001600160a01b03166014613d51565b6130d1836020613d51565b6040516020016130e2929190614e36565b60408051601f198184030181529082905262461bcd60e51b8252610a6f91600401614ee8565b6131128282611f2a565b61138a5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561314a3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008181526001830160205260408120546131d55750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561096f565b50600061096f565b6131e78282611f2a565b1561138a5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008181526001830160205260408120548015613357576000613268600183615276565b855490915060009061327c90600190615276565b90508181146132fd5760008660000182815481106132aa57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106132db57634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061331c57634e487b7160e01b600052603160045260246000fd5b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061096f565b600091505061096f565b803b6133c55760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a6f565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6134655760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a6f565b600080846001600160a01b0316846040516134809190614deb565b600060405180830381855af49150503d80600081146134bb576040519150601f19603f3d011682016040523d82523d6000602084013e6134c0565b606091505b50915091506134e882826040518060600160405280602781526020016153a160279139613f32565b95945050505050565b6134fa81613361565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b61353a81613f6b565b600081815261012d602052604090208054613554906152d0565b15905061109957600081815261012d60205260408120611099916144ba565b600054610100900460ff168061358c575060005460ff16155b6135a85760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612b94576000805461ffff19166101011790558015611099576000805461ff001916905550565b600054610100900460ff16806135f6575060005460ff16155b6136125760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015613634576000805461ffff19166101011790555b82516136479060c9906020860190614436565b50815161365b9060ca906020850190614436565b508015610ba5576000805461ff0019169055505050565b61138a8282613108565b60008260000182815481106136a157634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b156137b657604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906136f8903390899088908890600401614eab565b602060405180830381600087803b15801561371257600080fd5b505af1925050508015613742575060408051601f3d908101601f1916820190925261373f91810190614c5c565b60015b61379c573d808015613770576040519150601f19603f3d011682016040523d82523d6000602084013e613775565b606091505b5080516137945760405162461bcd60e51b8152600401610a6f90614efb565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506123fb565b5060016123fb565b60606137c98261220b565b61382d5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a6f565b600061384460408051602081019091526000815290565b905060008151116138645760405180602001604052806000815250611f23565b8061386e84614012565b60405160200161387f929190614e07565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b148061096f575061096f8261412b565b6000808251604114156138f15760208301516040840151606085015160001a6138e587828585614160565b94509450505050613923565b82516040141561391b576020830151604084015161391086838361424d565b935093505050613923565b506000905060025b9250929050565b600081600481111561394c57634e487b7160e01b600052602160045260246000fd5b14156139555750565b600181600481111561397757634e487b7160e01b600052602160045260246000fd5b14156139c55760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a6f565b60028160048111156139e757634e487b7160e01b600052602160045260246000fd5b1415613a355760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a6f565b6003816004811115613a5757634e487b7160e01b600052602160045260246000fd5b1415613ab05760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a6f565b6004816004811115613ad257634e487b7160e01b600052602160045260246000fd5b14156110995760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a6f565b6001600160a01b038216613b815760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a6f565b613b8a8161220b565b15613bd75760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a6f565b613be360008383613030565b6001600160a01b038216600090815260cc60205260408120805460019290613c0c90849061522b565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff1680612aa45750612aa46000805160206153c883398151915233611f2a565b6001600160a01b038316613cf457613cef8160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b613d17565b816001600160a01b0316836001600160a01b031614613d1757613d17838261427c565b6001600160a01b038216613d2e57610ba581614319565b826001600160a01b0316826001600160a01b031614610ba557610ba582826143f2565b60606000613d60836002615257565b613d6b90600261522b565b6001600160401b03811115613d9057634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613dba576020820181803683370190505b509050600360fc1b81600081518110613de357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613e2057634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000613e44846002615257565b613e4f90600161522b565b90505b6001811115613ee3576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110613e9157634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110613eb557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93613edc816152b9565b9050613e52565b508315611f235760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a6f565b60608315613f41575081611f23565b825115613f515782518084602001fd5b8160405162461bcd60e51b8152600401610a6f9190614ee8565b6000613f7682611836565b9050613f8481600084613030565b613f8f600083612228565b6001600160a01b038116600090815260cc60205260408120805460019290613fb8908490615276565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816140365750506040805180820190915260018152600360fc1b602082015290565b8160005b8115614060578061404a8161530b565b91506140599050600a83615243565b915061403a565b6000816001600160401b0381111561408857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156140b2576020820181803683370190505b5090505b84156123fb576140c7600183615276565b91506140d4600a86615326565b6140df90603061522b565b60f81b81838151811061410257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350614124600a86615243565b94506140b6565b60006001600160e01b03198216637965db0b60e01b148061096f57506301ffc9a760e01b6001600160e01b031983161461096f565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156141975750600090506003614244565b8460ff16601b141580156141af57508460ff16601c14155b156141c05750600090506004614244565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015614214573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661423d57600060019250925050614244565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161426e87828885614160565b935093505050935093915050565b6000600161428984611d2d565b6142939190615276565b600083815260fc60205260409020549091508082146142e6576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061432b90600190615276565b600083815260fe602052604081205460fd805493945090928490811061436157634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd838154811061439057634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd8054806143d657634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b60006143fd83611d2d565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614442906152d0565b90600052602060002090601f01602090048101928261446457600085556144aa565b82601f1061447d57805160ff19168380011785556144aa565b828001600101855582156144aa579182015b828111156144aa57825182559160200191906001019061448f565b506144b69291506144f0565b5090565b5080546144c6906152d0565b6000825580601f106144d6575050565b601f01602090049060005260206000209081019061109991905b5b808211156144b657600081556001016144f1565b80356001600160a01b038116811461451c57600080fd5b919050565b600082601f830112614531578081fd5b8135602061454661454183615208565b6151d8565b80838252828201915082860187848660051b8901011115614565578586fd5b855b8581101561458a5761457882614505565b84529284019290840190600101614567565b5090979650505050505050565b600082601f8301126145a7578081fd5b813560206145b761454183615208565b80838252828201915082860187848660051b89010111156145d6578586fd5b855b8581101561458a5781356145eb8161537c565b845292840192908401906001016145d8565b600082601f83011261460d578081fd5b8135602061461d61454183615208565b80838252828201915082860187848660051b890101111561463c578586fd5b855b8581101561458a5781356001600160401b0381111561465b578788fd5b6146698a87838c01016146d9565b855250928401929084019060010161463e565b600082601f83011261468c578081fd5b8135602061469c61454183615208565b80838252828201915082860187848660051b89010111156146bb578586fd5b855b8581101561458a578135845292840192908401906001016146bd565b600082601f8301126146e9578081fd5b81356001600160401b0381111561470257614702615366565b614715601f8201601f19166020016151d8565b818152846020838601011115614729578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614754578081fd5b611f2382614505565b6000806040838503121561476f578081fd5b61477883614505565b915061478660208401614505565b90509250929050565b6000806000606084860312156147a3578081fd5b6147ac84614505565b92506147ba60208501614505565b9150604084013590509250925092565b600080600080608085870312156147df578081fd5b6147e885614505565b93506147f660208601614505565b92506040850135915060608501356001600160401b03811115614817578182fd5b614823878288016146d9565b91505092959194509250565b60008060408385031215614841578182fd5b61484a83614505565b9150602083013561485a8161537c565b809150509250929050565b60008060408385031215614877578182fd5b61488083614505565b915060208301356001600160401b0381111561489a578182fd5b6148a6858286016146d9565b9150509250929050565b6000806000606084860312156148c4578081fd5b6148cd84614505565b925060208401356001600160401b03808211156148e8578283fd5b6148f4878388016146d9565b93506040860135915080821115614909578283fd5b50614916868287016146d9565b9150509250925092565b60008060008060808587031215614935578182fd5b61493e85614505565b935060208501356001600160401b0380821115614959578384fd5b614965888389016146d9565b9450604087013591508082111561497a578384fd5b614986888389016146d9565b9350606087013591508082111561499b578283fd5b50614823878288016146d9565b600080604083850312156149ba578182fd5b6149c383614505565b946020939093013593505050565b6000806000606084860312156149e5578081fd5b83356001600160401b03808211156149fb578283fd5b614a0787838801614521565b94506020860135915080821115614a1c578283fd5b614a28878388016145fd565b93506040860135915080821115614a3d578283fd5b50614916868287016145fd565b6000806000806000806000806000806101408b8d031215614a69578788fd5b8a356001600160401b0380821115614a7f57898afd5b614a8b8e838f016145fd565b9b5060208d0135915080821115614aa057898afd5b614aac8e838f01614597565b9a5060408d0135915080821115614ac157898afd5b614acd8e838f01614597565b995060608d0135915080821115614ae2578788fd5b614aee8e838f01614597565b985060808d0135915080821115614b03578788fd5b614b0f8e838f01614597565b975060a08d0135915080821115614b24578687fd5b614b308e838f01614521565b965060c08d0135915080821115614b45578586fd5b614b518e838f0161467c565b955060e08d0135915080821115614b66578485fd5b614b728e838f01614521565b94506101008d0135915080821115614b88578384fd5b614b948e838f0161467c565b93506101208d0135915080821115614baa578283fd5b50614bb78d828e01614521565b9150509295989b9194979a5092959850565b600060208284031215614bda578081fd5b8151611f238161537c565b600060208284031215614bf6578081fd5b5035919050565b60008060408385031215614c0f578182fd5b8235915061478660208401614505565b60008060408385031215614c31578182fd5b50508035926020909101359150565b600060208284031215614c51578081fd5b8135611f238161538a565b600060208284031215614c6d578081fd5b8151611f238161538a565b600060208284031215614c89578081fd5b81356001600160401b03811115614c9e578182fd5b6123fb848285016146d9565b60008060008060808587031215614cbf578182fd5b84356001600160401b0380821115614cd5578384fd5b614ce1888389016146d9565b95506020870135915080821115614cf6578384fd5b50614d03878288016146d9565b935050614d1260408601614505565b9150614d2060608601614505565b905092959194509250565b600060208284031215614d3c578081fd5b5051919050565b60008060408385031215614d55578182fd5b8235915060208301356001600160401b0381111561489a578182fd5b60008151808452614d8981602086016020860161528d565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b16815260008351614dc781601485016020880161528d565b835190830190614dde81601484016020880161528d565b0160140195945050505050565b60008251614dfd81846020870161528d565b9190910192915050565b60008351614e1981846020880161528d565b835190830190614e2d81836020880161528d565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351614e6e81601785016020880161528d565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351614e9f81602884016020880161528d565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090614ede90830184614d71565b9695505050505050565b602081526000611f236020830184614d71565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b8281526040602082015260006123fb6040830184614d71565b604051601f8201601f191681016001600160401b038111828210171561520057615200615366565b604052919050565b60006001600160401b0382111561522157615221615366565b5060051b60200190565b6000821982111561523e5761523e61533a565b500190565b60008261525257615252615350565b500490565b60008160001904831182151516156152715761527161533a565b500290565b6000828210156152885761528861533a565b500390565b60005b838110156152a8578181015183820152602001615290565b83811115611a995750506000910152565b6000816152c8576152c861533a565b506000190190565b600181811c908216806152e457607f821691505b6020821081141561530557634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561531f5761531f61533a565b5060010190565b60008261533557615335615350565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461109957600080fd5b6001600160e01b03198116811461109957600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220888e64ef4a58f27bb28481596eb3e7e2e1a3aef04e60d8a919f4bdc622e40c7164736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102ae5760003560e01c80636352211e11610175578063a217fddf116100dc578063ca15c87311610095578063f041b4a71161006f578063f041b4a7146108f5578063f68e955314610916578063f8895cc814610938578063fce589d81461094d57600080fd5b8063ca15c8731461086c578063d547741f1461088c578063e985e9c5146108ac57600080fd5b8063a217fddf146107a3578063a22cb465146107b8578063b88d4fde146107d8578063bb87c1c8146107f8578063bce8542e14610813578063c87b56dd1461084c57600080fd5b80638d59cc021161012e5780638d59cc02146106ee5780638f15b4141461070e5780639010d07c1461072e57806391d148541461074e57806393d0da071461076e57806395d89b411461078e57600080fd5b80636352211e1461062c57806366e7b6061461064c5780636f4c25aa1461066c5780637092d9ea1461068d57806370a08231146106ad57806370d5ae05146106cd57600080fd5b806336568abe116102195780634b08b0a3116101d25780634b08b0a3146105705780634f1ef286146105995780634f6ccce7146105ac5780635471a057146105cc5780635dc638a4146105ec5780636017160b1461060c57600080fd5b806336568abe146104705780633659cfe61461049057806338f292d5146104b057806342842e0e1461051057806342966c681461053057806347f00d5a1461055057600080fd5b806318160ddd1161026b57806318160ddd146103a95780632185810b146103be57806323b872dd146103e0578063248a9ca3146104005780632f2ff15d146104305780632f745c591461045057600080fd5b806301ffc9a7146102b357806306fdde03146102e8578063081812fc1461030a578063095ea7b3146103425780630ecf9dfd1461036457806314c44e0914610384575b600080fd5b3480156102bf57600080fd5b506102d36102ce366004614c40565b610964565b60405190151581526020015b60405180910390f35b3480156102f457600080fd5b506102fd610975565b6040516102df9190614ee8565b34801561031657600080fd5b5061032a610325366004614be5565b610a07565b6040516001600160a01b0390911681526020016102df565b34801561034e57600080fd5b5061036261035d3660046149a8565b610a94565b005b34801561037057600080fd5b5061036261037f366004614920565b610baa565b34801561039057600080fd5b5061039b6101c85481565b6040519081526020016102df565b3480156103b557600080fd5b5060fd5461039b565b3480156103ca57600080fd5b506101c7546102d3906301000000900460ff1681565b3480156103ec57600080fd5b506103626103fb36600461478f565b610ea2565b34801561040c57600080fd5b5061039b61041b366004614be5565b60009081526065602052604090206001015490565b34801561043c57600080fd5b5061036261044b366004614bfd565b610ef9565b34801561045c57600080fd5b5061039b61046b3660046149a8565b610f1b565b34801561047c57600080fd5b5061036261048b366004614bfd565b610fb1565b34801561049c57600080fd5b506103626104ab366004614743565b610fd3565b3480156104bc57600080fd5b506104f16104cb366004614be5565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102df565b34801561051c57600080fd5b5061036261052b36600461478f565b61109c565b34801561053c57600080fd5b5061036261054b366004614be5565b6110b7565b34801561055c57600080fd5b5061036261056b366004614d43565b6111d2565b34801561057c57600080fd5b506101c75461032a9064010000000090046001600160a01b031681565b6103626105a7366004614865565b6112d4565b3480156105b857600080fd5b5061039b6105c7366004614be5565b61138e565b3480156105d857600080fd5b506101c7546102d390610100900460ff1681565b3480156105f857600080fd5b50610362610607366004614a4a565b61142f565b34801561061857600080fd5b506102fd610627366004614be5565b61179b565b34801561063857600080fd5b5061032a610647366004614be5565b611836565b34801561065857600080fd5b506103626106673660046149d1565b6118ad565b34801561067857600080fd5b506101c7546102d39062010000900460ff1681565b34801561069957600080fd5b506103626106a83660046148b0565b611a9f565b3480156106b957600080fd5b5061039b6106c8366004614743565b611d2d565b3480156106d957600080fd5b506101c95461032a906001600160a01b031681565b3480156106fa57600080fd5b506103626107093660046148b0565b611db4565b34801561071a57600080fd5b50610362610729366004614caa565b611df3565b34801561073a57600080fd5b5061032a610749366004614c1f565b611f0b565b34801561075a57600080fd5b506102d3610769366004614bfd565b611f2a565b34801561077a57600080fd5b50610362610789366004614d43565b611f55565b34801561079a57600080fd5b506102fd612082565b3480156107af57600080fd5b5061039b600081565b3480156107c457600080fd5b506103626107d336600461482f565b612091565b3480156107e457600080fd5b506103626107f33660046147ca565b612156565b34801561080457600080fd5b506101c7546102d39060ff1681565b34801561081f57600080fd5b5061039b61082e366004614c78565b80516020818301810180516101c48252928201919093012091525481565b34801561085857600080fd5b506102fd610867366004614be5565b6121ac565b34801561087857600080fd5b5061039b610887366004614be5565b6121b7565b34801561089857600080fd5b506103626108a7366004614bfd565b6121ce565b3480156108b857600080fd5b506102d36108c736600461475d565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b34801561090157600080fd5b506101cb5461032a906001600160a01b031681565b34801561092257600080fd5b5061039b6000805160206153c883398151915281565b34801561094457600080fd5b506102fd6121d8565b34801561095957600080fd5b5061039b6101ca5481565b600061096f826121e6565b92915050565b606060c98054610984906152d0565b80601f01602080910402602001604051908101604052809291908181526020018280546109b0906152d0565b80156109fd5780601f106109d2576101008083540402835291602001916109fd565b820191906000526020600020905b8154815290600101906020018083116109e057829003601f168201915b5050505050905090565b6000610a128261220b565b610a785760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a9f82611836565b9050806001600160a01b0316836001600160a01b03161415610b0d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a6f565b336001600160a01b0382161480610b295750610b2981336108c7565b610b9b5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a6f565b610ba58383612228565b505050565b6101c75460ff16610c195760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a6f565b610c2284612296565b610c3e5760405162461bcd60e51b8152600401610a6f9061514b565b6101c75462010000900460ff1615610cd15760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a6f565b6000835111610d3e5760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610a6f565b610d4783612333565b15610dba5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a6f565b336001600160a01b03851614610e285760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a6f565b610e348484848461235e565b610e905760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a6f565b610e9b848484612403565b5050505050565b610ead335b82612492565b610ec95760405162461bcd60e51b8152600401610a6f90615033565b610ed282612296565b610eee5760405162461bcd60e51b8152600401610a6f9061514b565b610ba5838383612592565b610f03828261273d565b6000828152609760205260409020610ba59082612763565b6000610f2683611d2d565b8210610f885760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a6f565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b610fbb8282612778565b6000828152609760205260409020610ba590826127f2565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561101c5760405162461bcd60e51b8152600401610a6f90614f4d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661104e612807565b6001600160a01b0316146110745760405162461bcd60e51b8152600401610a6f90614f99565b61107d81612835565b604080516000808252602082019092526110999183919061284e565b50565b610ba583838360405180602001604052806000815250612156565b6110c033610ea7565b6110dc5760405162461bcd60e51b8152600401610a6f90615033565b6110e581612992565b60008181526101c66020526040902060010154156110995760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561117657600080fd5b505af115801561118a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111ae9190614bc9565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b6111da612a77565b6112415760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a6f565b61124c335b83612492565b6112685760405162461bcd60e51b8152600401610a6f90615033565b6112728282612aa9565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f482826040516020016112a59190614deb565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a15050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561131d5760405162461bcd60e51b8152600401610a6f90614f4d565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661134f612807565b6001600160a01b0316146113755760405162461bcd60e51b8152600401610a6f90614f99565b61137e82612835565b61138a8282600161284e565b5050565b600061139960fd5490565b82106113fc5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a6f565b60fd828154811061141d57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6114476000805160206153c883398151915233611f2a565b6114a35760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a6f565b8951156114eb57896000815181106114cb57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c390805190602001906114e9929190614436565b505b885115611536578860008151811061151357634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b875115611581578760008151811061155e57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b8651156115cc57866000815181106115a957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b85511561161757856000815181106115f457634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b84511561166f578460008151811061163f57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b8351156116a7578360008151811061169757634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b8251156116ff57826000815181106116cf57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b815115611737578160008151811061172757634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b80511561178f578060008151811061175f57634e487b7160e01b600052603260045260246000fd5b60200260200101516101cb60006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b50505050505050505050565b6101c560205260009081526040902080546117b5906152d0565b80601f01602080910402602001604051908101604052809291908181526020018280546117e1906152d0565b801561182e5780601f106118035761010080835404028352916020019161182e565b820191906000526020600020905b81548152906001019060200180831161181157829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b03168061096f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a6f565b6118c56000805160206153c883398151915233611f2a565b6118e15760405162461bcd60e51b8152600401610a6f9061509d565b815183511461196b5760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a6f565b81518151146119fc5760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a6f565b60005b8351811015611a9957611a88848281518110611a2b57634e487b7160e01b600052603260045260246000fd5b6020026020010151848381518110611a5357634e487b7160e01b600052603260045260246000fd5b6020026020010151848481518110611a7b57634e487b7160e01b600052603260045260246000fd5b6020026020010151612403565b50611a928161530b565b90506119ff565b50505050565b6101c75464010000000090046001600160a01b0316611b265760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a6f565b611b2f82612333565b15611b4c5760405162461bcd60e51b8152600401610a6f906150fa565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015611bb757600080fd5b505af1158015611bcb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bef9190614bc9565b506000611bfd848484612403565b905060006127106101ca546101c854611c169190615257565b611c209190615243565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b158015611c7d57600080fd5b505af1158015611c91573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cb59190614bc9565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c8546020820190611ceb908490615276565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b0390911617815592015160019092019190915550505050565b60006001600160a01b038216611d985760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a6f565b506001600160a01b0316600090815260cc602052604090205490565b611dcc6000805160206153c883398151915233611f2a565b611de85760405162461bcd60e51b8152600401610a6f9061509d565b611a99838383612403565b600054610100900460ff1680611e0c575060005460ff16155b611e285760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015611e4a576000805461ffff19166101011790555b611e52612b35565b611e5a612ba8565b611e62612c17565b611e6a612c17565b611e72612c75565b611e7c8585612cd3565b611e87600083612d5a565b611e9f6000805160206153c883398151915284612d5a565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b0319918216179091556101f46101ca556101cb805490911690558015610e9b576000805461ff00191690555050505050565b6000828152609760205260408120611f239083612d64565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b611f5d612d70565b611fc25760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a6f565b611fcb33611246565b611fe75760405162461bcd60e51b8152600401610a6f90615033565b611ff081612333565b1561200d5760405162461bcd60e51b8152600401610a6f906150fa565b816101c48260405161201f9190614deb565b90815260408051602092819003830190209290925560008481526101c5825291909120825161205092840190614436565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c82826040516112c89291906151bf565b606060ca8054610984906152d0565b6001600160a01b0382163314156120ea5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a6f565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61215f33611246565b61217b5760405162461bcd60e51b8152600401610a6f90615033565b61218483612296565b6121a05760405162461bcd60e51b8152600401610a6f9061514b565b611a9984848484612d9e565b606061096f82612dd1565b600081815260976020526040812061096f90612f41565b610fbb8282612f4b565b6101c380546117b5906152d0565b60006001600160e01b0319821663780e9d6360e01b148061096f575061096f82612f71565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b038416908117909155819061225d82611836565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6101cb546000906001600160a01b0316158061096f57506101cb546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b1580156122f457600080fd5b505afa158015612308573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061232c9190614d2b565b1192915050565b60006101c4826040516123469190614deb565b90815260405190819003602001902054151592915050565b6000806123d986868660405160200161237993929190614d9d565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b90506123f76000805160206153c88339815191526107698386612fb1565b9150505b949350505050565b8151600090156124885761241683612333565b156124335760405162461bcd60e51b8152600401610a6f906150fa565b61243d8483612fd5565b9050806101c4846040516124519190614deb565b90815260408051602092819003830190209290925560008381526101c5825291909120845161248292860190614436565b50611f23565b6123fb8483612fd5565b600061249d8261220b565b6124fe5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a6f565b600061250983611836565b9050806001600160a01b0316846001600160a01b031614806125445750836001600160a01b031661253984610a07565b6001600160a01b0316145b8061257457506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806123fb57506123fb6000805160206153c883398151915285611f2a565b826001600160a01b03166125a582611836565b6001600160a01b03161461260d5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a6f565b6001600160a01b03821661266f5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a6f565b61267a838383613030565b612685600082612228565b6001600160a01b038316600090815260cc602052604081208054600192906126ae908490615276565b90915550506001600160a01b038216600090815260cc602052604081208054600192906126dc90849061522b565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b60008281526065602052604090206001015461275981336130a4565b610ba58383613108565b6000611f23836001600160a01b03841661318e565b6001600160a01b03811633146127e85760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a6f565b61138a82826131dd565b6000611f23836001600160a01b038416613244565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6000805160206153c883398151915261138a81336130a4565b6000612858612807565b905061286384613361565b6000835111806128705750815b156128815761287f8484613406565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610e9b57805460ff191660011781556040516001600160a01b038316602482015261290090869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052613406565b50805460ff19168155612911612807565b6001600160a01b0316826001600160a01b0316146129895760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a6f565b610e9b856134f1565b61299b81613531565b60008181526101c56020526040812080546129b5906152d0565b80601f01602080910402602001604051908101604052809291908181526020018280546129e1906152d0565b8015612a2e5780601f10612a0357610100808354040283529160200191612a2e565b820191906000526020600020905b815481529060010190602001808311612a1157829003601f168201915b50505060008581526101c560205260408120939450612a5093925090506144ba565b6101c481604051612a619190614deb565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff1680612aa45750612aa46000805160206153c883398151915233611f2a565b905090565b612ab28261220b565b612b155760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a6f565b600082815261012d602090815260409091208251610ba592840190614436565b600054610100900460ff1680612b4e575060005460ff16155b612b6a5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612b8c576000805461ffff19166101011790555b612b94613573565b8015611099576000805461ff001916905550565b600054610100900460ff1680612bc1575060005460ff16155b612bdd5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612bff576000805461ffff19166101011790555b612c07613573565b612c0f613573565b612b8c613573565b600054610100900460ff1680612c30575060005460ff16155b612c4c5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612c07576000805461ffff1916610101179055612c0f613573565b600054610100900460ff1680612c8e575060005460ff16155b612caa5760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612c0f576000805461ffff1916610101179055612b8c613573565b600054610100900460ff1680612cec575060005460ff16155b612d085760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612d2a576000805461ffff19166101011790555b612d32613573565b612d3a613573565b612d4483836135dd565b8015610ba5576000805461ff0019169055505050565b610f038282613672565b6000611f23838361367c565b6101c75460009062010000900460ff1680612aa45750612aa46000805160206153c883398151915233611f2a565b612da9848484612592565b612db5848484846136b4565b611a995760405162461bcd60e51b8152600401610a6f90614efb565b6060612ddc8261220b565b612e425760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a6f565b600082815261012d602052604081208054612e5c906152d0565b80601f0160208091040260200160405190810160405280929190818152602001828054612e88906152d0565b8015612ed55780601f10612eaa57610100808354040283529160200191612ed5565b820191906000526020600020905b815481529060010190602001808311612eb857829003601f168201915b505050505090506000612ef360408051602081019091526000815290565b9050805160001415612f06575092915050565b815115612f38578082604051602001612f20929190614e07565b60405160208183030381529060405292505050919050565b6123fb846137be565b600061096f825490565b600082815260656020526040902060010154612f6781336130a4565b610ba583836131dd565b60006001600160e01b031982166380ac58cd60e01b1480612fa257506001600160e01b03198216635b5e139f60e01b145b8061096f575061096f82613895565b6000806000612fc085856138ba565b91509150612fcd8161392a565b509392505050565b6000612fe083612296565b612ffc5760405162461bcd60e51b8152600401610a6f9061514b565b6101cc5461300b90600161522b565b90506130178382613b2b565b6130266101cc80546001019055565b61096f8183612aa9565b613038613c6a565b6130995760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a6f565b610ba5838383613c99565b6130ae8282611f2a565b61138a576130c6816001600160a01b03166014613d51565b6130d1836020613d51565b6040516020016130e2929190614e36565b60408051601f198184030181529082905262461bcd60e51b8252610a6f91600401614ee8565b6131128282611f2a565b61138a5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561314a3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008181526001830160205260408120546131d55750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561096f565b50600061096f565b6131e78282611f2a565b1561138a5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008181526001830160205260408120548015613357576000613268600183615276565b855490915060009061327c90600190615276565b90508181146132fd5760008660000182815481106132aa57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106132db57634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061331c57634e487b7160e01b600052603160045260246000fd5b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061096f565b600091505061096f565b803b6133c55760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a6f565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6134655760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a6f565b600080846001600160a01b0316846040516134809190614deb565b600060405180830381855af49150503d80600081146134bb576040519150601f19603f3d011682016040523d82523d6000602084013e6134c0565b606091505b50915091506134e882826040518060600160405280602781526020016153a160279139613f32565b95945050505050565b6134fa81613361565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b61353a81613f6b565b600081815261012d602052604090208054613554906152d0565b15905061109957600081815261012d60205260408120611099916144ba565b600054610100900460ff168061358c575060005460ff16155b6135a85760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015612b94576000805461ffff19166101011790558015611099576000805461ff001916905550565b600054610100900460ff16806135f6575060005460ff16155b6136125760405162461bcd60e51b8152600401610a6f90614fe5565b600054610100900460ff16158015613634576000805461ffff19166101011790555b82516136479060c9906020860190614436565b50815161365b9060ca906020850190614436565b508015610ba5576000805461ff0019169055505050565b61138a8282613108565b60008260000182815481106136a157634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b156137b657604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906136f8903390899088908890600401614eab565b602060405180830381600087803b15801561371257600080fd5b505af1925050508015613742575060408051601f3d908101601f1916820190925261373f91810190614c5c565b60015b61379c573d808015613770576040519150601f19603f3d011682016040523d82523d6000602084013e613775565b606091505b5080516137945760405162461bcd60e51b8152600401610a6f90614efb565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506123fb565b5060016123fb565b60606137c98261220b565b61382d5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a6f565b600061384460408051602081019091526000815290565b905060008151116138645760405180602001604052806000815250611f23565b8061386e84614012565b60405160200161387f929190614e07565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b148061096f575061096f8261412b565b6000808251604114156138f15760208301516040840151606085015160001a6138e587828585614160565b94509450505050613923565b82516040141561391b576020830151604084015161391086838361424d565b935093505050613923565b506000905060025b9250929050565b600081600481111561394c57634e487b7160e01b600052602160045260246000fd5b14156139555750565b600181600481111561397757634e487b7160e01b600052602160045260246000fd5b14156139c55760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a6f565b60028160048111156139e757634e487b7160e01b600052602160045260246000fd5b1415613a355760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a6f565b6003816004811115613a5757634e487b7160e01b600052602160045260246000fd5b1415613ab05760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a6f565b6004816004811115613ad257634e487b7160e01b600052602160045260246000fd5b14156110995760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a6f565b6001600160a01b038216613b815760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a6f565b613b8a8161220b565b15613bd75760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a6f565b613be360008383613030565b6001600160a01b038216600090815260cc60205260408120805460019290613c0c90849061522b565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff1680612aa45750612aa46000805160206153c883398151915233611f2a565b6001600160a01b038316613cf457613cef8160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b613d17565b816001600160a01b0316836001600160a01b031614613d1757613d17838261427c565b6001600160a01b038216613d2e57610ba581614319565b826001600160a01b0316826001600160a01b031614610ba557610ba582826143f2565b60606000613d60836002615257565b613d6b90600261522b565b6001600160401b03811115613d9057634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613dba576020820181803683370190505b509050600360fc1b81600081518110613de357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613e2057634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000613e44846002615257565b613e4f90600161522b565b90505b6001811115613ee3576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110613e9157634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110613eb557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93613edc816152b9565b9050613e52565b508315611f235760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a6f565b60608315613f41575081611f23565b825115613f515782518084602001fd5b8160405162461bcd60e51b8152600401610a6f9190614ee8565b6000613f7682611836565b9050613f8481600084613030565b613f8f600083612228565b6001600160a01b038116600090815260cc60205260408120805460019290613fb8908490615276565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816140365750506040805180820190915260018152600360fc1b602082015290565b8160005b8115614060578061404a8161530b565b91506140599050600a83615243565b915061403a565b6000816001600160401b0381111561408857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156140b2576020820181803683370190505b5090505b84156123fb576140c7600183615276565b91506140d4600a86615326565b6140df90603061522b565b60f81b81838151811061410257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350614124600a86615243565b94506140b6565b60006001600160e01b03198216637965db0b60e01b148061096f57506301ffc9a760e01b6001600160e01b031983161461096f565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156141975750600090506003614244565b8460ff16601b141580156141af57508460ff16601c14155b156141c05750600090506004614244565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015614214573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661423d57600060019250925050614244565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161426e87828885614160565b935093505050935093915050565b6000600161428984611d2d565b6142939190615276565b600083815260fc60205260409020549091508082146142e6576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061432b90600190615276565b600083815260fe602052604081205460fd805493945090928490811061436157634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd838154811061439057634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd8054806143d657634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b60006143fd83611d2d565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b828054614442906152d0565b90600052602060002090601f01602090048101928261446457600085556144aa565b82601f1061447d57805160ff19168380011785556144aa565b828001600101855582156144aa579182015b828111156144aa57825182559160200191906001019061448f565b506144b69291506144f0565b5090565b5080546144c6906152d0565b6000825580601f106144d6575050565b601f01602090049060005260206000209081019061109991905b5b808211156144b657600081556001016144f1565b80356001600160a01b038116811461451c57600080fd5b919050565b600082601f830112614531578081fd5b8135602061454661454183615208565b6151d8565b80838252828201915082860187848660051b8901011115614565578586fd5b855b8581101561458a5761457882614505565b84529284019290840190600101614567565b5090979650505050505050565b600082601f8301126145a7578081fd5b813560206145b761454183615208565b80838252828201915082860187848660051b89010111156145d6578586fd5b855b8581101561458a5781356145eb8161537c565b845292840192908401906001016145d8565b600082601f83011261460d578081fd5b8135602061461d61454183615208565b80838252828201915082860187848660051b890101111561463c578586fd5b855b8581101561458a5781356001600160401b0381111561465b578788fd5b6146698a87838c01016146d9565b855250928401929084019060010161463e565b600082601f83011261468c578081fd5b8135602061469c61454183615208565b80838252828201915082860187848660051b89010111156146bb578586fd5b855b8581101561458a578135845292840192908401906001016146bd565b600082601f8301126146e9578081fd5b81356001600160401b0381111561470257614702615366565b614715601f8201601f19166020016151d8565b818152846020838601011115614729578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215614754578081fd5b611f2382614505565b6000806040838503121561476f578081fd5b61477883614505565b915061478660208401614505565b90509250929050565b6000806000606084860312156147a3578081fd5b6147ac84614505565b92506147ba60208501614505565b9150604084013590509250925092565b600080600080608085870312156147df578081fd5b6147e885614505565b93506147f660208601614505565b92506040850135915060608501356001600160401b03811115614817578182fd5b614823878288016146d9565b91505092959194509250565b60008060408385031215614841578182fd5b61484a83614505565b9150602083013561485a8161537c565b809150509250929050565b60008060408385031215614877578182fd5b61488083614505565b915060208301356001600160401b0381111561489a578182fd5b6148a6858286016146d9565b9150509250929050565b6000806000606084860312156148c4578081fd5b6148cd84614505565b925060208401356001600160401b03808211156148e8578283fd5b6148f4878388016146d9565b93506040860135915080821115614909578283fd5b50614916868287016146d9565b9150509250925092565b60008060008060808587031215614935578182fd5b61493e85614505565b935060208501356001600160401b0380821115614959578384fd5b614965888389016146d9565b9450604087013591508082111561497a578384fd5b614986888389016146d9565b9350606087013591508082111561499b578283fd5b50614823878288016146d9565b600080604083850312156149ba578182fd5b6149c383614505565b946020939093013593505050565b6000806000606084860312156149e5578081fd5b83356001600160401b03808211156149fb578283fd5b614a0787838801614521565b94506020860135915080821115614a1c578283fd5b614a28878388016145fd565b93506040860135915080821115614a3d578283fd5b50614916868287016145fd565b6000806000806000806000806000806101408b8d031215614a69578788fd5b8a356001600160401b0380821115614a7f57898afd5b614a8b8e838f016145fd565b9b5060208d0135915080821115614aa057898afd5b614aac8e838f01614597565b9a5060408d0135915080821115614ac157898afd5b614acd8e838f01614597565b995060608d0135915080821115614ae2578788fd5b614aee8e838f01614597565b985060808d0135915080821115614b03578788fd5b614b0f8e838f01614597565b975060a08d0135915080821115614b24578687fd5b614b308e838f01614521565b965060c08d0135915080821115614b45578586fd5b614b518e838f0161467c565b955060e08d0135915080821115614b66578485fd5b614b728e838f01614521565b94506101008d0135915080821115614b88578384fd5b614b948e838f0161467c565b93506101208d0135915080821115614baa578283fd5b50614bb78d828e01614521565b9150509295989b9194979a5092959850565b600060208284031215614bda578081fd5b8151611f238161537c565b600060208284031215614bf6578081fd5b5035919050565b60008060408385031215614c0f578182fd5b8235915061478660208401614505565b60008060408385031215614c31578182fd5b50508035926020909101359150565b600060208284031215614c51578081fd5b8135611f238161538a565b600060208284031215614c6d578081fd5b8151611f238161538a565b600060208284031215614c89578081fd5b81356001600160401b03811115614c9e578182fd5b6123fb848285016146d9565b60008060008060808587031215614cbf578182fd5b84356001600160401b0380821115614cd5578384fd5b614ce1888389016146d9565b95506020870135915080821115614cf6578384fd5b50614d03878288016146d9565b935050614d1260408601614505565b9150614d2060608601614505565b905092959194509250565b600060208284031215614d3c578081fd5b5051919050565b60008060408385031215614d55578182fd5b8235915060208301356001600160401b0381111561489a578182fd5b60008151808452614d8981602086016020860161528d565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b16815260008351614dc781601485016020880161528d565b835190830190614dde81601484016020880161528d565b0160140195945050505050565b60008251614dfd81846020870161528d565b9190910192915050565b60008351614e1981846020880161528d565b835190830190614e2d81836020880161528d565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351614e6e81601785016020880161528d565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351614e9f81602884016020880161528d565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090614ede90830184614d71565b9695505050505050565b602081526000611f236020830184614d71565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b8281526040602082015260006123fb6040830184614d71565b604051601f8201601f191681016001600160401b038111828210171561520057615200615366565b604052919050565b60006001600160401b0382111561522157615221615366565b5060051b60200190565b6000821982111561523e5761523e61533a565b500190565b60008261525257615252615350565b500490565b60008160001904831182151516156152715761527161533a565b500290565b6000828210156152885761528861533a565b500390565b60005b838110156152a8578181015183820152602001615290565b83811115611a995750506000910152565b6000816152c8576152c861533a565b506000190190565b600181811c908216806152e457607f821691505b6020821081141561530557634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561531f5761531f61533a565b5060010190565b60008261533557615335615350565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461109957600080fd5b6001600160e01b03198116811461109957600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220888e64ef4a58f27bb28481596eb3e7e2e1a3aef04e60d8a919f4bdc622e40c7164736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
