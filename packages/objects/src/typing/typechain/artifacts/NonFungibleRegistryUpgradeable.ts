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
    "0x60a06040523060601b6080523480156200001857600080fd5b50600054610100900460ff168062000033575060005460ff16155b6200009b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000be576000805461ffff19166101011790555b8015620000d1576000805461ff00191690555b5060805160601c6151346200010660003960008181610eeb01528181610f2b015281816111ec015261122c01526151346000f3fe6080604052600436106102935760003560e01c806366e7b6061161015a578063a22cb465116100c1578063d547741f1161007a578063d547741f14610851578063df6a7f3514610871578063e985e9c514610891578063f68e9553146108da578063f8895cc8146108fc578063fce589d81461091157600080fd5b8063a22cb4651461077d578063b88d4fde1461079d578063bb87c1c8146107bd578063bce8542e146107d8578063c87b56dd14610811578063ca15c8731461083157600080fd5b80638f15b414116101135780638f15b414146106d35780639010d07c146106f357806391d148541461071357806393d0da071461073357806395d89b4114610753578063a217fddf1461076857600080fd5b806366e7b606146106115780636f4c25aa146106315780637092d9ea1461065257806370a082311461067257806370d5ae05146106925780638d59cc02146106b357600080fd5b806336568abe116101fe5780634b08b0a3116101b75780634b08b0a3146105555780634f1ef2861461057e5780634f6ccce7146105915780635471a057146105b15780636017160b146105d15780636352211e146105f157600080fd5b806336568abe146104555780633659cfe61461047557806338f292d51461049557806342842e0e146104f557806342966c681461051557806347f00d5a1461053557600080fd5b806318160ddd1161025057806318160ddd1461038e5780632185810b146103a357806323b872dd146103c5578063248a9ca3146103e55780632f2ff15d146104155780632f745c591461043557600080fd5b806301ffc9a71461029857806306fdde03146102cd578063081812fc146102ef578063095ea7b3146103275780630ecf9dfd1461034957806314c44e0914610369575b600080fd5b3480156102a457600080fd5b506102b86102b33660046149e3565b610928565b60405190151581526020015b60405180910390f35b3480156102d957600080fd5b506102e2610939565b6040516102c49190614c73565b3480156102fb57600080fd5b5061030f61030a366004614988565b6109cb565b6040516001600160a01b0390911681526020016102c4565b34801561033357600080fd5b50610347610342366004614770565b610a58565b005b34801561035557600080fd5b506103476103643660046146e8565b610b6e565b34801561037557600080fd5b506103806101c85481565b6040519081526020016102c4565b34801561039a57600080fd5b5060fd54610380565b3480156103af57600080fd5b506101c7546102b8906301000000900460ff1681565b3480156103d157600080fd5b506103476103e0366004614557565b610dd4565b3480156103f157600080fd5b50610380610400366004614988565b60009081526065602052604090206001015490565b34801561042157600080fd5b506103476104303660046149a0565b610e06565b34801561044157600080fd5b50610380610450366004614770565b610e28565b34801561046157600080fd5b506103476104703660046149a0565b610ebe565b34801561048157600080fd5b5061034761049036600461450b565b610ee0565b3480156104a157600080fd5b506104d66104b0366004614988565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102c4565b34801561050157600080fd5b50610347610510366004614557565b610fa9565b34801561052157600080fd5b50610347610530366004614988565b610fc4565b34801561054157600080fd5b50610347610550366004614ace565b6110df565b34801561056157600080fd5b506101c75461030f9064010000000090046001600160a01b031681565b61034761058c36600461462d565b6111e1565b34801561059d57600080fd5b506103806105ac366004614988565b61129b565b3480156105bd57600080fd5b506101c7546102b890610100900460ff1681565b3480156105dd57600080fd5b506102e26105ec366004614988565b61133c565b3480156105fd57600080fd5b5061030f61060c366004614988565b6113d7565b34801561061d57600080fd5b5061034761062c366004614799565b61144e565b34801561063d57600080fd5b506101c7546102b89062010000900460ff1681565b34801561065e57600080fd5b5061034761066d366004614678565b611640565b34801561067e57600080fd5b5061038061068d36600461450b565b6118ce565b34801561069e57600080fd5b506101c95461030f906001600160a01b031681565b3480156106bf57600080fd5b506103476106ce366004614678565b611955565b3480156106df57600080fd5b506103476106ee366004614a4d565b611994565b3480156106ff57600080fd5b5061030f61070e3660046149c2565b611aa1565b34801561071f57600080fd5b506102b861072e3660046149a0565b611ac0565b34801561073f57600080fd5b5061034761074e366004614ace565b611aeb565b34801561075f57600080fd5b506102e2611c18565b34801561077457600080fd5b50610380600081565b34801561078957600080fd5b506103476107983660046145f7565b611c27565b3480156107a957600080fd5b506103476107b8366004614592565b611cec565b3480156107c957600080fd5b506101c7546102b89060ff1681565b3480156107e457600080fd5b506103806107f3366004614a1b565b80516020818301810180516101c48252928201919093012091525481565b34801561081d57600080fd5b506102e261082c366004614988565b611d1d565b34801561083d57600080fd5b5061038061084c366004614988565b611d28565b34801561085d57600080fd5b5061034761086c3660046149a0565b611d3f565b34801561087d57600080fd5b5061034761088c366004614812565b611d49565b34801561089d57600080fd5b506102b86108ac366004614525565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b3480156108e657600080fd5b506103806000805160206150df83398151915281565b34801561090857600080fd5b506102e261205c565b34801561091d57600080fd5b506103806101ca5481565b60006109338261206a565b92915050565b606060c9805461094890614fe7565b80601f016020809104026020016040519081016040528092919081815260200182805461097490614fe7565b80156109c15780601f10610996576101008083540402835291602001916109c1565b820191906000526020600020905b8154815290600101906020018083116109a457829003601f168201915b5050505050905090565b60006109d68261208f565b610a3c5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a63826113d7565b9050806001600160a01b0316836001600160a01b03161415610ad15760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a33565b336001600160a01b0382161480610aed5750610aed81336108ac565b610b5f5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a33565b610b6983836120ac565b505050565b6101c75460ff16610bdd5760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a33565b6101c75462010000900460ff1615610c705760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a33565b610c798361211a565b15610cec5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a33565b336001600160a01b03851614610d5a5760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a33565b610d6684848484612145565b610dc25760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a33565b610dcd8484846121ea565b5050505050565b610ddf335b82612279565b610dfb5760405162461bcd60e51b8152600401610a3390614dbe565b610b69838383612379565b610e108282612524565b6000828152609760205260409020610b69908261254a565b6000610e33836118ce565b8210610e955760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a33565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b610ec8828261255f565b6000828152609760205260409020610b6990826125d9565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610f295760405162461bcd60e51b8152600401610a3390614cd8565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610f5b6125ee565b6001600160a01b031614610f815760405162461bcd60e51b8152600401610a3390614d24565b610f8a8161261c565b60408051600080825260208201909252610fa691839190612635565b50565b610b6983838360405180602001604052806000815250611cec565b610fcd33610dd9565b610fe95760405162461bcd60e51b8152600401610a3390614dbe565b610ff281612779565b60008181526101c6602052604090206001015415610fa65760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561108357600080fd5b505af1158015611097573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110bb919061496c565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b6110e761285e565b61114e5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a33565b611159335b83612279565b6111755760405162461bcd60e51b8152600401610a3390614dbe565b61117f8282612890565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f482826040516020016111b29190614b76565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a15050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561122a5760405162461bcd60e51b8152600401610a3390614cd8565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661125c6125ee565b6001600160a01b0316146112825760405162461bcd60e51b8152600401610a3390614d24565b61128b8261261c565b61129782826001612635565b5050565b60006112a660fd5490565b82106113095760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a33565b60fd828154811061132a57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c5602052600090815260409020805461135690614fe7565b80601f016020809104026020016040519081016040528092919081815260200182805461138290614fe7565b80156113cf5780601f106113a4576101008083540402835291602001916113cf565b820191906000526020600020905b8154815290600101906020018083116113b257829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109335760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a33565b6114666000805160206150df83398151915233611ac0565b6114825760405162461bcd60e51b8152600401610a3390614e28565b815183511461150c5760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a33565b815181511461159d5760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a33565b60005b835181101561163a576116298482815181106115cc57634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106115f457634e487b7160e01b600052603260045260246000fd5b602002602001015184848151811061161c57634e487b7160e01b600052603260045260246000fd5b60200260200101516121ea565b5061163381615022565b90506115a0565b50505050565b6101c75464010000000090046001600160a01b03166116c75760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a33565b6116d08261211a565b156116ed5760405162461bcd60e51b8152600401610a3390614e85565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b15801561175857600080fd5b505af115801561176c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611790919061496c565b50600061179e8484846121ea565b905060006127106101ca546101c8546117b79190614f6e565b6117c19190614f5a565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b15801561181e57600080fd5b505af1158015611832573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611856919061496c565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c854602082019061188c908490614f8d565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b0390911617815592015160019092019190915550505050565b60006001600160a01b0382166119395760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a33565b506001600160a01b0316600090815260cc602052604090205490565b61196d6000805160206150df83398151915233611ac0565b6119895760405162461bcd60e51b8152600401610a3390614e28565b61163a8383836121ea565b600054610100900460ff16806119ad575060005460ff16155b6119c95760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156119eb576000805461ffff19166101011790555b6119f361291c565b6119fb61298f565b611a036129fe565b611a0b6129fe565b611a13612a5c565b611a1d8585612aba565b611a28600083612b41565b611a406000805160206150df83398151915284612b41565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b03199091161790556101f46101ca558015610dcd576000805461ff00191690555050505050565b6000828152609760205260408120611ab99083612b4b565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b611af3612b57565b611b585760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a33565b611b6133611153565b611b7d5760405162461bcd60e51b8152600401610a3390614dbe565b611b868161211a565b15611ba35760405162461bcd60e51b8152600401610a3390614e85565b816101c482604051611bb59190614b76565b90815260408051602092819003830190209290925560008481526101c58252919091208251611be6928401906141fe565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c82826040516111d5929190614ed6565b606060ca805461094890614fe7565b6001600160a01b038216331415611c805760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a33565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611cf533611153565b611d115760405162461bcd60e51b8152600401610a3390614dbe565b61163a84848484612b85565b606061093382612bb8565b600081815260976020526040812061093390612d28565b610ec88282612d32565b611d616000805160206150df83398151915233611ac0565b611dbd5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a33565b885115611e055788600081518110611de557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611e039291906141fe565b505b875115611e505787600081518110611e2d57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b865115611e9b5786600081518110611e7857634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b855115611ee65785600081518110611ec357634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b845115611f315784600081518110611f0e57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b835115611f895783600081518110611f5957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b825115611fc15782600081518110611fb157634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b8151156120195781600081518110611fe957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b805115612051578060008151811061204157634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b505050505050505050565b6101c3805461135690614fe7565b60006001600160e01b0319821663780e9d6360e01b1480610933575061093382612d58565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b03841690811790915581906120e1826113d7565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006101c48260405161212d9190614b76565b90815260405190819003602001902054151592915050565b6000806121c086868660405160200161216093929190614b28565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b90506121de6000805160206150df83398151915261072e8386612d98565b9150505b949350505050565b81516000901561226f576121fd8361211a565b1561221a5760405162461bcd60e51b8152600401610a3390614e85565b6122248483612dbc565b9050806101c4846040516122389190614b76565b90815260408051602092819003830190209290925560008381526101c58252919091208451612269928601906141fe565b50611ab9565b6121e28483612dbc565b60006122848261208f565b6122e55760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a33565b60006122f0836113d7565b9050806001600160a01b0316846001600160a01b0316148061232b5750836001600160a01b0316612320846109cb565b6001600160a01b0316145b8061235b57506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806121e257506121e26000805160206150df83398151915285611ac0565b826001600160a01b031661238c826113d7565b6001600160a01b0316146123f45760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a33565b6001600160a01b0382166124565760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a33565b612461838383612df8565b61246c6000826120ac565b6001600160a01b038316600090815260cc60205260408120805460019290612495908490614f8d565b90915550506001600160a01b038216600090815260cc602052604081208054600192906124c3908490614f42565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000828152606560205260409020600101546125408133612e6c565b610b698383612ed0565b6000611ab9836001600160a01b038416612f56565b6001600160a01b03811633146125cf5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a33565b6112978282612fa5565b6000611ab9836001600160a01b03841661300c565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6000805160206150df8339815191526112978133612e6c565b600061263f6125ee565b905061264a84613129565b6000835111806126575750815b156126685761266684846131ce565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610dcd57805460ff191660011781556040516001600160a01b03831660248201526126e790869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b1790526131ce565b50805460ff191681556126f86125ee565b6001600160a01b0316826001600160a01b0316146127705760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a33565b610dcd856132b9565b612782816132f9565b60008181526101c560205260408120805461279c90614fe7565b80601f01602080910402602001604051908101604052809291908181526020018280546127c890614fe7565b80156128155780601f106127ea57610100808354040283529160200191612815565b820191906000526020600020905b8154815290600101906020018083116127f857829003601f168201915b50505060008581526101c5602052604081209394506128379392509050614282565b6101c4816040516128489190614b76565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff168061288b575061288b6000805160206150df83398151915233611ac0565b905090565b6128998261208f565b6128fc5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a33565b600082815261012d602090815260409091208251610b69928401906141fe565b600054610100900460ff1680612935575060005460ff16155b6129515760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff16158015612973576000805461ffff19166101011790555b61297b61333b565b8015610fa6576000805461ff001916905550565b600054610100900460ff16806129a8575060005460ff16155b6129c45760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156129e6576000805461ffff19166101011790555b6129ee61333b565b6129f661333b565b61297361333b565b600054610100900460ff1680612a17575060005460ff16155b612a335760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156129ee576000805461ffff19166101011790556129f661333b565b600054610100900460ff1680612a75575060005460ff16155b612a915760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156129f6576000805461ffff191661010117905561297361333b565b600054610100900460ff1680612ad3575060005460ff16155b612aef5760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff16158015612b11576000805461ffff19166101011790555b612b1961333b565b612b2161333b565b612b2b83836133a5565b8015610b69576000805461ff0019169055505050565b610e10828261343a565b6000611ab98383613444565b6101c75460009062010000900460ff168061288b575061288b6000805160206150df83398151915233611ac0565b612b90848484612379565b612b9c8484848461347c565b61163a5760405162461bcd60e51b8152600401610a3390614c86565b6060612bc38261208f565b612c295760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a33565b600082815261012d602052604081208054612c4390614fe7565b80601f0160208091040260200160405190810160405280929190818152602001828054612c6f90614fe7565b8015612cbc5780601f10612c9157610100808354040283529160200191612cbc565b820191906000526020600020905b815481529060010190602001808311612c9f57829003601f168201915b505050505090506000612cda60408051602081019091526000815290565b9050805160001415612ced575092915050565b815115612d1f578082604051602001612d07929190614b92565b60405160208183030381529060405292505050919050565b6121e284613586565b6000610933825490565b600082815260656020526040902060010154612d4e8133612e6c565b610b698383612fa5565b60006001600160e01b031982166380ac58cd60e01b1480612d8957506001600160e01b03198216635b5e139f60e01b145b8061093357506109338261365d565b6000806000612da78585613682565b91509150612db4816136f2565b509392505050565b6000612dc86101cb5490565b612dd3906001614f42565b9050612ddf83826138f3565b612dee6101cb80546001019055565b6109338183612890565b612e00613a32565b612e615760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a33565b610b69838383613a61565b612e768282611ac0565b61129757612e8e816001600160a01b03166014613b19565b612e99836020613b19565b604051602001612eaa929190614bc1565b60408051601f198184030181529082905262461bcd60e51b8252610a3391600401614c73565b612eda8282611ac0565b6112975760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612f123390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000818152600183016020526040812054612f9d57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610933565b506000610933565b612faf8282611ac0565b156112975760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000818152600183016020526040812054801561311f576000613030600183614f8d565b855490915060009061304490600190614f8d565b90508181146130c557600086600001828154811061307257634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106130a357634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b85548690806130e457634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610933565b6000915050610933565b803b61318d5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a33565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b61322d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a33565b600080846001600160a01b0316846040516132489190614b76565b600060405180830381855af49150503d8060008114613283576040519150601f19603f3d011682016040523d82523d6000602084013e613288565b606091505b50915091506132b082826040518060600160405280602781526020016150b860279139613cfa565b95945050505050565b6132c281613129565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b61330281613d33565b600081815261012d60205260409020805461331c90614fe7565b159050610fa657600081815261012d60205260408120610fa691614282565b600054610100900460ff1680613354575060005460ff16155b6133705760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff1615801561297b576000805461ffff19166101011790558015610fa6576000805461ff001916905550565b600054610100900460ff16806133be575060005460ff16155b6133da5760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156133fc576000805461ffff19166101011790555b825161340f9060c99060208601906141fe565b5081516134239060ca9060208501906141fe565b508015610b69576000805461ff0019169055505050565b6112978282612ed0565b600082600001828154811061346957634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b1561357e57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906134c0903390899088908890600401614c36565b602060405180830381600087803b1580156134da57600080fd5b505af192505050801561350a575060408051601f3d908101601f19168201909252613507918101906149ff565b60015b613564573d808015613538576040519150601f19603f3d011682016040523d82523d6000602084013e61353d565b606091505b50805161355c5760405162461bcd60e51b8152600401610a3390614c86565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506121e2565b5060016121e2565b60606135918261208f565b6135f55760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a33565b600061360c60408051602081019091526000815290565b9050600081511161362c5760405180602001604052806000815250611ab9565b8061363684613dda565b604051602001613647929190614b92565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b1480610933575061093382613ef3565b6000808251604114156136b95760208301516040840151606085015160001a6136ad87828585613f28565b945094505050506136eb565b8251604014156136e357602083015160408401516136d8868383614015565b9350935050506136eb565b506000905060025b9250929050565b600081600481111561371457634e487b7160e01b600052602160045260246000fd5b141561371d5750565b600181600481111561373f57634e487b7160e01b600052602160045260246000fd5b141561378d5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a33565b60028160048111156137af57634e487b7160e01b600052602160045260246000fd5b14156137fd5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a33565b600381600481111561381f57634e487b7160e01b600052602160045260246000fd5b14156138785760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a33565b600481600481111561389a57634e487b7160e01b600052602160045260246000fd5b1415610fa65760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a33565b6001600160a01b0382166139495760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a33565b6139528161208f565b1561399f5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a33565b6139ab60008383612df8565b6001600160a01b038216600090815260cc602052604081208054600192906139d4908490614f42565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff168061288b575061288b6000805160206150df83398151915233611ac0565b6001600160a01b038316613abc57613ab78160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b613adf565b816001600160a01b0316836001600160a01b031614613adf57613adf8382614044565b6001600160a01b038216613af657610b69816140e1565b826001600160a01b0316826001600160a01b031614610b6957610b6982826141ba565b60606000613b28836002614f6e565b613b33906002614f42565b6001600160401b03811115613b5857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613b82576020820181803683370190505b509050600360fc1b81600081518110613bab57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613be857634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000613c0c846002614f6e565b613c17906001614f42565b90505b6001811115613cab576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110613c5957634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110613c7d57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93613ca481614fd0565b9050613c1a565b508315611ab95760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a33565b60608315613d09575081611ab9565b825115613d195782518084602001fd5b8160405162461bcd60e51b8152600401610a339190614c73565b6000613d3e826113d7565b9050613d4c81600084612df8565b613d576000836120ac565b6001600160a01b038116600090815260cc60205260408120805460019290613d80908490614f8d565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b606081613dfe5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115613e285780613e1281615022565b9150613e219050600a83614f5a565b9150613e02565b6000816001600160401b03811115613e5057634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613e7a576020820181803683370190505b5090505b84156121e257613e8f600183614f8d565b9150613e9c600a8661503d565b613ea7906030614f42565b60f81b818381518110613eca57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350613eec600a86614f5a565b9450613e7e565b60006001600160e01b03198216637965db0b60e01b148061093357506301ffc9a760e01b6001600160e01b0319831614610933565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115613f5f575060009050600361400c565b8460ff16601b14158015613f7757508460ff16601c14155b15613f88575060009050600461400c565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015613fdc573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166140055760006001925092505061400c565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161403687828885613f28565b935093505050935093915050565b60006001614051846118ce565b61405b9190614f8d565b600083815260fc60205260409020549091508082146140ae576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd546000906140f390600190614f8d565b600083815260fe602052604081205460fd805493945090928490811061412957634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd838154811061415857634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd80548061419e57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b60006141c5836118ce565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b82805461420a90614fe7565b90600052602060002090601f01602090048101928261422c5760008555614272565b82601f1061424557805160ff1916838001178555614272565b82800160010185558215614272579182015b82811115614272578251825591602001919060010190614257565b5061427e9291506142b8565b5090565b50805461428e90614fe7565b6000825580601f1061429e575050565b601f016020900490600052602060002090810190610fa691905b5b8082111561427e57600081556001016142b9565b80356001600160a01b03811681146142e457600080fd5b919050565b600082601f8301126142f9578081fd5b8135602061430e61430983614f1f565b614eef565b80838252828201915082860187848660051b890101111561432d578586fd5b855b8581101561435257614340826142cd565b8452928401929084019060010161432f565b5090979650505050505050565b600082601f83011261436f578081fd5b8135602061437f61430983614f1f565b80838252828201915082860187848660051b890101111561439e578586fd5b855b858110156143525781356143b381615093565b845292840192908401906001016143a0565b600082601f8301126143d5578081fd5b813560206143e561430983614f1f565b80838252828201915082860187848660051b8901011115614404578586fd5b855b858110156143525781356001600160401b03811115614423578788fd5b6144318a87838c01016144a1565b8552509284019290840190600101614406565b600082601f830112614454578081fd5b8135602061446461430983614f1f565b80838252828201915082860187848660051b8901011115614483578586fd5b855b8581101561435257813584529284019290840190600101614485565b600082601f8301126144b1578081fd5b81356001600160401b038111156144ca576144ca61507d565b6144dd601f8201601f1916602001614eef565b8181528460208386010111156144f1578283fd5b816020850160208301379081016020019190915292915050565b60006020828403121561451c578081fd5b611ab9826142cd565b60008060408385031215614537578081fd5b614540836142cd565b915061454e602084016142cd565b90509250929050565b60008060006060848603121561456b578081fd5b614574846142cd565b9250614582602085016142cd565b9150604084013590509250925092565b600080600080608085870312156145a7578081fd5b6145b0856142cd565b93506145be602086016142cd565b92506040850135915060608501356001600160401b038111156145df578182fd5b6145eb878288016144a1565b91505092959194509250565b60008060408385031215614609578182fd5b614612836142cd565b9150602083013561462281615093565b809150509250929050565b6000806040838503121561463f578182fd5b614648836142cd565b915060208301356001600160401b03811115614662578182fd5b61466e858286016144a1565b9150509250929050565b60008060006060848603121561468c578081fd5b614695846142cd565b925060208401356001600160401b03808211156146b0578283fd5b6146bc878388016144a1565b935060408601359150808211156146d1578283fd5b506146de868287016144a1565b9150509250925092565b600080600080608085870312156146fd578182fd5b614706856142cd565b935060208501356001600160401b0380821115614721578384fd5b61472d888389016144a1565b94506040870135915080821115614742578384fd5b61474e888389016144a1565b93506060870135915080821115614763578283fd5b506145eb878288016144a1565b60008060408385031215614782578182fd5b61478b836142cd565b946020939093013593505050565b6000806000606084860312156147ad578081fd5b83356001600160401b03808211156147c3578283fd5b6147cf878388016142e9565b945060208601359150808211156147e4578283fd5b6147f0878388016143c5565b93506040860135915080821115614805578283fd5b506146de868287016143c5565b60008060008060008060008060006101208a8c031215614830578687fd5b89356001600160401b0380821115614846578889fd5b6148528d838e016143c5565b9a5060208c0135915080821115614867578889fd5b6148738d838e0161435f565b995060408c0135915080821115614888578889fd5b6148948d838e0161435f565b985060608c01359150808211156148a9578687fd5b6148b58d838e0161435f565b975060808c01359150808211156148ca578687fd5b6148d68d838e0161435f565b965060a08c01359150808211156148eb578586fd5b6148f78d838e016142e9565b955060c08c013591508082111561490c578485fd5b6149188d838e01614444565b945060e08c013591508082111561492d578384fd5b6149398d838e016142e9565b93506101008c013591508082111561494f578283fd5b5061495c8c828d01614444565b9150509295985092959850929598565b60006020828403121561497d578081fd5b8151611ab981615093565b600060208284031215614999578081fd5b5035919050565b600080604083850312156149b2578182fd5b8235915061454e602084016142cd565b600080604083850312156149d4578182fd5b50508035926020909101359150565b6000602082840312156149f4578081fd5b8135611ab9816150a1565b600060208284031215614a10578081fd5b8151611ab9816150a1565b600060208284031215614a2c578081fd5b81356001600160401b03811115614a41578182fd5b6121e2848285016144a1565b60008060008060808587031215614a62578182fd5b84356001600160401b0380821115614a78578384fd5b614a84888389016144a1565b95506020870135915080821115614a99578384fd5b50614aa6878288016144a1565b935050614ab5604086016142cd565b9150614ac3606086016142cd565b905092959194509250565b60008060408385031215614ae0578182fd5b8235915060208301356001600160401b03811115614662578182fd5b60008151808452614b14816020860160208601614fa4565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b16815260008351614b52816014850160208801614fa4565b835190830190614b69816014840160208801614fa4565b0160140195945050505050565b60008251614b88818460208701614fa4565b9190910192915050565b60008351614ba4818460208801614fa4565b835190830190614bb8818360208801614fa4565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351614bf9816017850160208801614fa4565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351614c2a816028840160208801614fa4565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090614c6990830184614afc565b9695505050505050565b602081526000611ab96020830184614afc565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b8281526040602082015260006121e26040830184614afc565b604051601f8201601f191681016001600160401b0381118282101715614f1757614f1761507d565b604052919050565b60006001600160401b03821115614f3857614f3861507d565b5060051b60200190565b60008219821115614f5557614f55615051565b500190565b600082614f6957614f69615067565b500490565b6000816000190483118215151615614f8857614f88615051565b500290565b600082821015614f9f57614f9f615051565b500390565b60005b83811015614fbf578181015183820152602001614fa7565b8381111561163a5750506000910152565b600081614fdf57614fdf615051565b506000190190565b600181811c90821680614ffb57607f821691505b6020821081141561501c57634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561503657615036615051565b5060010190565b60008261504c5761504c615067565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b8015158114610fa657600080fd5b6001600160e01b031981168114610fa657600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220c778da108e734ed8b9082d1d804fe95d1423598c81da4cde06daf2a20228610264736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102935760003560e01c806366e7b6061161015a578063a22cb465116100c1578063d547741f1161007a578063d547741f14610851578063df6a7f3514610871578063e985e9c514610891578063f68e9553146108da578063f8895cc8146108fc578063fce589d81461091157600080fd5b8063a22cb4651461077d578063b88d4fde1461079d578063bb87c1c8146107bd578063bce8542e146107d8578063c87b56dd14610811578063ca15c8731461083157600080fd5b80638f15b414116101135780638f15b414146106d35780639010d07c146106f357806391d148541461071357806393d0da071461073357806395d89b4114610753578063a217fddf1461076857600080fd5b806366e7b606146106115780636f4c25aa146106315780637092d9ea1461065257806370a082311461067257806370d5ae05146106925780638d59cc02146106b357600080fd5b806336568abe116101fe5780634b08b0a3116101b75780634b08b0a3146105555780634f1ef2861461057e5780634f6ccce7146105915780635471a057146105b15780636017160b146105d15780636352211e146105f157600080fd5b806336568abe146104555780633659cfe61461047557806338f292d51461049557806342842e0e146104f557806342966c681461051557806347f00d5a1461053557600080fd5b806318160ddd1161025057806318160ddd1461038e5780632185810b146103a357806323b872dd146103c5578063248a9ca3146103e55780632f2ff15d146104155780632f745c591461043557600080fd5b806301ffc9a71461029857806306fdde03146102cd578063081812fc146102ef578063095ea7b3146103275780630ecf9dfd1461034957806314c44e0914610369575b600080fd5b3480156102a457600080fd5b506102b86102b33660046149e3565b610928565b60405190151581526020015b60405180910390f35b3480156102d957600080fd5b506102e2610939565b6040516102c49190614c73565b3480156102fb57600080fd5b5061030f61030a366004614988565b6109cb565b6040516001600160a01b0390911681526020016102c4565b34801561033357600080fd5b50610347610342366004614770565b610a58565b005b34801561035557600080fd5b506103476103643660046146e8565b610b6e565b34801561037557600080fd5b506103806101c85481565b6040519081526020016102c4565b34801561039a57600080fd5b5060fd54610380565b3480156103af57600080fd5b506101c7546102b8906301000000900460ff1681565b3480156103d157600080fd5b506103476103e0366004614557565b610dd4565b3480156103f157600080fd5b50610380610400366004614988565b60009081526065602052604090206001015490565b34801561042157600080fd5b506103476104303660046149a0565b610e06565b34801561044157600080fd5b50610380610450366004614770565b610e28565b34801561046157600080fd5b506103476104703660046149a0565b610ebe565b34801561048157600080fd5b5061034761049036600461450b565b610ee0565b3480156104a157600080fd5b506104d66104b0366004614988565b6101c660205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102c4565b34801561050157600080fd5b50610347610510366004614557565b610fa9565b34801561052157600080fd5b50610347610530366004614988565b610fc4565b34801561054157600080fd5b50610347610550366004614ace565b6110df565b34801561056157600080fd5b506101c75461030f9064010000000090046001600160a01b031681565b61034761058c36600461462d565b6111e1565b34801561059d57600080fd5b506103806105ac366004614988565b61129b565b3480156105bd57600080fd5b506101c7546102b890610100900460ff1681565b3480156105dd57600080fd5b506102e26105ec366004614988565b61133c565b3480156105fd57600080fd5b5061030f61060c366004614988565b6113d7565b34801561061d57600080fd5b5061034761062c366004614799565b61144e565b34801561063d57600080fd5b506101c7546102b89062010000900460ff1681565b34801561065e57600080fd5b5061034761066d366004614678565b611640565b34801561067e57600080fd5b5061038061068d36600461450b565b6118ce565b34801561069e57600080fd5b506101c95461030f906001600160a01b031681565b3480156106bf57600080fd5b506103476106ce366004614678565b611955565b3480156106df57600080fd5b506103476106ee366004614a4d565b611994565b3480156106ff57600080fd5b5061030f61070e3660046149c2565b611aa1565b34801561071f57600080fd5b506102b861072e3660046149a0565b611ac0565b34801561073f57600080fd5b5061034761074e366004614ace565b611aeb565b34801561075f57600080fd5b506102e2611c18565b34801561077457600080fd5b50610380600081565b34801561078957600080fd5b506103476107983660046145f7565b611c27565b3480156107a957600080fd5b506103476107b8366004614592565b611cec565b3480156107c957600080fd5b506101c7546102b89060ff1681565b3480156107e457600080fd5b506103806107f3366004614a1b565b80516020818301810180516101c48252928201919093012091525481565b34801561081d57600080fd5b506102e261082c366004614988565b611d1d565b34801561083d57600080fd5b5061038061084c366004614988565b611d28565b34801561085d57600080fd5b5061034761086c3660046149a0565b611d3f565b34801561087d57600080fd5b5061034761088c366004614812565b611d49565b34801561089d57600080fd5b506102b86108ac366004614525565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b3480156108e657600080fd5b506103806000805160206150df83398151915281565b34801561090857600080fd5b506102e261205c565b34801561091d57600080fd5b506103806101ca5481565b60006109338261206a565b92915050565b606060c9805461094890614fe7565b80601f016020809104026020016040519081016040528092919081815260200182805461097490614fe7565b80156109c15780601f10610996576101008083540402835291602001916109c1565b820191906000526020600020905b8154815290600101906020018083116109a457829003601f168201915b5050505050905090565b60006109d68261208f565b610a3c5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a63826113d7565b9050806001600160a01b0316836001600160a01b03161415610ad15760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a33565b336001600160a01b0382161480610aed5750610aed81336108ac565b610b5f5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a33565b610b6983836120ac565b505050565b6101c75460ff16610bdd5760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a33565b6101c75462010000900460ff1615610c705760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a33565b610c798361211a565b15610cec5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a33565b336001600160a01b03851614610d5a5760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a33565b610d6684848484612145565b610dc25760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a33565b610dcd8484846121ea565b5050505050565b610ddf335b82612279565b610dfb5760405162461bcd60e51b8152600401610a3390614dbe565b610b69838383612379565b610e108282612524565b6000828152609760205260409020610b69908261254a565b6000610e33836118ce565b8210610e955760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a33565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b610ec8828261255f565b6000828152609760205260409020610b6990826125d9565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610f295760405162461bcd60e51b8152600401610a3390614cd8565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610f5b6125ee565b6001600160a01b031614610f815760405162461bcd60e51b8152600401610a3390614d24565b610f8a8161261c565b60408051600080825260208201909252610fa691839190612635565b50565b610b6983838360405180602001604052806000815250611cec565b610fcd33610dd9565b610fe95760405162461bcd60e51b8152600401610a3390614dbe565b610ff281612779565b60008181526101c6602052604090206001015415610fa65760008181526101c660205260409020546001600160a01b031663a9059cbb3360008481526101c660205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561108357600080fd5b505af1158015611097573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110bb919061496c565b5060009081526101c66020526040812080546001600160a01b031916815560010155565b6110e761285e565b61114e5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a33565b611159335b83612279565b6111755760405162461bcd60e51b8152600401610a3390614dbe565b61117f8282612890565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f482826040516020016111b29190614b76565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a15050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561122a5760405162461bcd60e51b8152600401610a3390614cd8565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661125c6125ee565b6001600160a01b0316146112825760405162461bcd60e51b8152600401610a3390614d24565b61128b8261261c565b61129782826001612635565b5050565b60006112a660fd5490565b82106113095760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a33565b60fd828154811061132a57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6101c5602052600090815260409020805461135690614fe7565b80601f016020809104026020016040519081016040528092919081815260200182805461138290614fe7565b80156113cf5780601f106113a4576101008083540402835291602001916113cf565b820191906000526020600020905b8154815290600101906020018083116113b257829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109335760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a33565b6114666000805160206150df83398151915233611ac0565b6114825760405162461bcd60e51b8152600401610a3390614e28565b815183511461150c5760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a33565b815181511461159d5760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a33565b60005b835181101561163a576116298482815181106115cc57634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106115f457634e487b7160e01b600052603260045260246000fd5b602002602001015184848151811061161c57634e487b7160e01b600052603260045260246000fd5b60200260200101516121ea565b5061163381615022565b90506115a0565b50505050565b6101c75464010000000090046001600160a01b03166116c75760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a33565b6116d08261211a565b156116ed5760405162461bcd60e51b8152600401610a3390614e85565b6101c75464010000000090046001600160a01b03166323b872dd336101c8546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b15801561175857600080fd5b505af115801561176c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611790919061496c565b50600061179e8484846121ea565b905060006127106101ca546101c8546117b79190614f6e565b6117c19190614f5a565b6101c7546101c95460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b15801561181e57600080fd5b505af1158015611832573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611856919061496c565b50604080518082019091526101c75464010000000090046001600160a01b031681526101c854602082019061188c908490614f8d565b905260009283526101c660209081526040909320815181546001600160a01b0319166001600160a01b0390911617815592015160019092019190915550505050565b60006001600160a01b0382166119395760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a33565b506001600160a01b0316600090815260cc602052604090205490565b61196d6000805160206150df83398151915233611ac0565b6119895760405162461bcd60e51b8152600401610a3390614e28565b61163a8383836121ea565b600054610100900460ff16806119ad575060005460ff16155b6119c95760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156119eb576000805461ffff19166101011790555b6119f361291c565b6119fb61298f565b611a036129fe565b611a0b6129fe565b611a13612a5c565b611a1d8585612aba565b611a28600083612b41565b611a406000805160206150df83398151915284612b41565b6101c780546001600160c01b0319166301000100179055670de0b6b3a76400006101c8556101c980546001600160a01b0384166001600160a01b03199091161790556101f46101ca558015610dcd576000805461ff00191690555050505050565b6000828152609760205260408120611ab99083612b4b565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b611af3612b57565b611b585760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a33565b611b6133611153565b611b7d5760405162461bcd60e51b8152600401610a3390614dbe565b611b868161211a565b15611ba35760405162461bcd60e51b8152600401610a3390614e85565b816101c482604051611bb59190614b76565b90815260408051602092819003830190209290925560008481526101c58252919091208251611be6928401906141fe565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c82826040516111d5929190614ed6565b606060ca805461094890614fe7565b6001600160a01b038216331415611c805760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a33565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611cf533611153565b611d115760405162461bcd60e51b8152600401610a3390614dbe565b61163a84848484612b85565b606061093382612bb8565b600081815260976020526040812061093390612d28565b610ec88282612d32565b611d616000805160206150df83398151915233611ac0565b611dbd5760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a33565b885115611e055788600081518110611de557634e487b7160e01b600052603260045260246000fd5b60200260200101516101c39080519060200190611e039291906141fe565b505b875115611e505787600081518110611e2d57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760006101000a81548160ff0219169083151502179055505b865115611e9b5786600081518110611e7857634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760016101000a81548160ff0219169083151502179055505b855115611ee65785600081518110611ec357634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760026101000a81548160ff0219169083151502179055505b845115611f315784600081518110611f0e57634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760036101000a81548160ff0219169083151502179055505b835115611f895783600081518110611f5957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c760046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b825115611fc15782600081518110611fb157634e487b7160e01b600052603260045260246000fd5b60200260200101516101c8819055505b8151156120195781600081518110611fe957634e487b7160e01b600052603260045260246000fd5b60200260200101516101c960006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b805115612051578060008151811061204157634e487b7160e01b600052603260045260246000fd5b60200260200101516101ca819055505b505050505050505050565b6101c3805461135690614fe7565b60006001600160e01b0319821663780e9d6360e01b1480610933575061093382612d58565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b03841690811790915581906120e1826113d7565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006101c48260405161212d9190614b76565b90815260405190819003602001902054151592915050565b6000806121c086868660405160200161216093929190614b28565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b90506121de6000805160206150df83398151915261072e8386612d98565b9150505b949350505050565b81516000901561226f576121fd8361211a565b1561221a5760405162461bcd60e51b8152600401610a3390614e85565b6122248483612dbc565b9050806101c4846040516122389190614b76565b90815260408051602092819003830190209290925560008381526101c58252919091208451612269928601906141fe565b50611ab9565b6121e28483612dbc565b60006122848261208f565b6122e55760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a33565b60006122f0836113d7565b9050806001600160a01b0316846001600160a01b0316148061232b5750836001600160a01b0316612320846109cb565b6001600160a01b0316145b8061235b57506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b806121e257506121e26000805160206150df83398151915285611ac0565b826001600160a01b031661238c826113d7565b6001600160a01b0316146123f45760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a33565b6001600160a01b0382166124565760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a33565b612461838383612df8565b61246c6000826120ac565b6001600160a01b038316600090815260cc60205260408120805460019290612495908490614f8d565b90915550506001600160a01b038216600090815260cc602052604081208054600192906124c3908490614f42565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000828152606560205260409020600101546125408133612e6c565b610b698383612ed0565b6000611ab9836001600160a01b038416612f56565b6001600160a01b03811633146125cf5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a33565b6112978282612fa5565b6000611ab9836001600160a01b03841661300c565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6000805160206150df8339815191526112978133612e6c565b600061263f6125ee565b905061264a84613129565b6000835111806126575750815b156126685761266684846131ce565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610dcd57805460ff191660011781556040516001600160a01b03831660248201526126e790869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b1790526131ce565b50805460ff191681556126f86125ee565b6001600160a01b0316826001600160a01b0316146127705760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a33565b610dcd856132b9565b612782816132f9565b60008181526101c560205260408120805461279c90614fe7565b80601f01602080910402602001604051908101604052809291908181526020018280546127c890614fe7565b80156128155780601f106127ea57610100808354040283529160200191612815565b820191906000526020600020905b8154815290600101906020018083116127f857829003601f168201915b50505060008581526101c5602052604081209394506128379392509050614282565b6101c4816040516128489190614b76565b9081526020016040518091039020600090555050565b6101c754600090610100900460ff168061288b575061288b6000805160206150df83398151915233611ac0565b905090565b6128998261208f565b6128fc5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a33565b600082815261012d602090815260409091208251610b69928401906141fe565b600054610100900460ff1680612935575060005460ff16155b6129515760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff16158015612973576000805461ffff19166101011790555b61297b61333b565b8015610fa6576000805461ff001916905550565b600054610100900460ff16806129a8575060005460ff16155b6129c45760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156129e6576000805461ffff19166101011790555b6129ee61333b565b6129f661333b565b61297361333b565b600054610100900460ff1680612a17575060005460ff16155b612a335760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156129ee576000805461ffff19166101011790556129f661333b565b600054610100900460ff1680612a75575060005460ff16155b612a915760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156129f6576000805461ffff191661010117905561297361333b565b600054610100900460ff1680612ad3575060005460ff16155b612aef5760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff16158015612b11576000805461ffff19166101011790555b612b1961333b565b612b2161333b565b612b2b83836133a5565b8015610b69576000805461ff0019169055505050565b610e10828261343a565b6000611ab98383613444565b6101c75460009062010000900460ff168061288b575061288b6000805160206150df83398151915233611ac0565b612b90848484612379565b612b9c8484848461347c565b61163a5760405162461bcd60e51b8152600401610a3390614c86565b6060612bc38261208f565b612c295760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a33565b600082815261012d602052604081208054612c4390614fe7565b80601f0160208091040260200160405190810160405280929190818152602001828054612c6f90614fe7565b8015612cbc5780601f10612c9157610100808354040283529160200191612cbc565b820191906000526020600020905b815481529060010190602001808311612c9f57829003601f168201915b505050505090506000612cda60408051602081019091526000815290565b9050805160001415612ced575092915050565b815115612d1f578082604051602001612d07929190614b92565b60405160208183030381529060405292505050919050565b6121e284613586565b6000610933825490565b600082815260656020526040902060010154612d4e8133612e6c565b610b698383612fa5565b60006001600160e01b031982166380ac58cd60e01b1480612d8957506001600160e01b03198216635b5e139f60e01b145b8061093357506109338261365d565b6000806000612da78585613682565b91509150612db4816136f2565b509392505050565b6000612dc86101cb5490565b612dd3906001614f42565b9050612ddf83826138f3565b612dee6101cb80546001019055565b6109338183612890565b612e00613a32565b612e615760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a33565b610b69838383613a61565b612e768282611ac0565b61129757612e8e816001600160a01b03166014613b19565b612e99836020613b19565b604051602001612eaa929190614bc1565b60408051601f198184030181529082905262461bcd60e51b8252610a3391600401614c73565b612eda8282611ac0565b6112975760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612f123390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000818152600183016020526040812054612f9d57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610933565b506000610933565b612faf8282611ac0565b156112975760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000818152600183016020526040812054801561311f576000613030600183614f8d565b855490915060009061304490600190614f8d565b90508181146130c557600086600001828154811061307257634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106130a357634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b85548690806130e457634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610933565b6000915050610933565b803b61318d5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a33565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b61322d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a33565b600080846001600160a01b0316846040516132489190614b76565b600060405180830381855af49150503d8060008114613283576040519150601f19603f3d011682016040523d82523d6000602084013e613288565b606091505b50915091506132b082826040518060600160405280602781526020016150b860279139613cfa565b95945050505050565b6132c281613129565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b61330281613d33565b600081815261012d60205260409020805461331c90614fe7565b159050610fa657600081815261012d60205260408120610fa691614282565b600054610100900460ff1680613354575060005460ff16155b6133705760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff1615801561297b576000805461ffff19166101011790558015610fa6576000805461ff001916905550565b600054610100900460ff16806133be575060005460ff16155b6133da5760405162461bcd60e51b8152600401610a3390614d70565b600054610100900460ff161580156133fc576000805461ffff19166101011790555b825161340f9060c99060208601906141fe565b5081516134239060ca9060208501906141fe565b508015610b69576000805461ff0019169055505050565b6112978282612ed0565b600082600001828154811061346957634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b1561357e57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906134c0903390899088908890600401614c36565b602060405180830381600087803b1580156134da57600080fd5b505af192505050801561350a575060408051601f3d908101601f19168201909252613507918101906149ff565b60015b613564573d808015613538576040519150601f19603f3d011682016040523d82523d6000602084013e61353d565b606091505b50805161355c5760405162461bcd60e51b8152600401610a3390614c86565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506121e2565b5060016121e2565b60606135918261208f565b6135f55760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a33565b600061360c60408051602081019091526000815290565b9050600081511161362c5760405180602001604052806000815250611ab9565b8061363684613dda565b604051602001613647929190614b92565b6040516020818303038152906040529392505050565b60006001600160e01b03198216635a05180f60e01b1480610933575061093382613ef3565b6000808251604114156136b95760208301516040840151606085015160001a6136ad87828585613f28565b945094505050506136eb565b8251604014156136e357602083015160408401516136d8868383614015565b9350935050506136eb565b506000905060025b9250929050565b600081600481111561371457634e487b7160e01b600052602160045260246000fd5b141561371d5750565b600181600481111561373f57634e487b7160e01b600052602160045260246000fd5b141561378d5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a33565b60028160048111156137af57634e487b7160e01b600052602160045260246000fd5b14156137fd5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a33565b600381600481111561381f57634e487b7160e01b600052602160045260246000fd5b14156138785760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a33565b600481600481111561389a57634e487b7160e01b600052602160045260246000fd5b1415610fa65760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a33565b6001600160a01b0382166139495760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a33565b6139528161208f565b1561399f5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a33565b6139ab60008383612df8565b6001600160a01b038216600090815260cc602052604081208054600192906139d4908490614f42565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6101c7546000906301000000900460ff168061288b575061288b6000805160206150df83398151915233611ac0565b6001600160a01b038316613abc57613ab78160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b613adf565b816001600160a01b0316836001600160a01b031614613adf57613adf8382614044565b6001600160a01b038216613af657610b69816140e1565b826001600160a01b0316826001600160a01b031614610b6957610b6982826141ba565b60606000613b28836002614f6e565b613b33906002614f42565b6001600160401b03811115613b5857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613b82576020820181803683370190505b509050600360fc1b81600081518110613bab57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613be857634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000613c0c846002614f6e565b613c17906001614f42565b90505b6001811115613cab576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110613c5957634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110613c7d57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93613ca481614fd0565b9050613c1a565b508315611ab95760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a33565b60608315613d09575081611ab9565b825115613d195782518084602001fd5b8160405162461bcd60e51b8152600401610a339190614c73565b6000613d3e826113d7565b9050613d4c81600084612df8565b613d576000836120ac565b6001600160a01b038116600090815260cc60205260408120805460019290613d80908490614f8d565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b606081613dfe5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115613e285780613e1281615022565b9150613e219050600a83614f5a565b9150613e02565b6000816001600160401b03811115613e5057634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613e7a576020820181803683370190505b5090505b84156121e257613e8f600183614f8d565b9150613e9c600a8661503d565b613ea7906030614f42565b60f81b818381518110613eca57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350613eec600a86614f5a565b9450613e7e565b60006001600160e01b03198216637965db0b60e01b148061093357506301ffc9a760e01b6001600160e01b0319831614610933565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115613f5f575060009050600361400c565b8460ff16601b14158015613f7757508460ff16601c14155b15613f88575060009050600461400c565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015613fdc573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166140055760006001925092505061400c565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b0161403687828885613f28565b935093505050935093915050565b60006001614051846118ce565b61405b9190614f8d565b600083815260fc60205260409020549091508082146140ae576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd546000906140f390600190614f8d565b600083815260fe602052604081205460fd805493945090928490811061412957634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd838154811061415857634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd80548061419e57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b60006141c5836118ce565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b82805461420a90614fe7565b90600052602060002090601f01602090048101928261422c5760008555614272565b82601f1061424557805160ff1916838001178555614272565b82800160010185558215614272579182015b82811115614272578251825591602001919060010190614257565b5061427e9291506142b8565b5090565b50805461428e90614fe7565b6000825580601f1061429e575050565b601f016020900490600052602060002090810190610fa691905b5b8082111561427e57600081556001016142b9565b80356001600160a01b03811681146142e457600080fd5b919050565b600082601f8301126142f9578081fd5b8135602061430e61430983614f1f565b614eef565b80838252828201915082860187848660051b890101111561432d578586fd5b855b8581101561435257614340826142cd565b8452928401929084019060010161432f565b5090979650505050505050565b600082601f83011261436f578081fd5b8135602061437f61430983614f1f565b80838252828201915082860187848660051b890101111561439e578586fd5b855b858110156143525781356143b381615093565b845292840192908401906001016143a0565b600082601f8301126143d5578081fd5b813560206143e561430983614f1f565b80838252828201915082860187848660051b8901011115614404578586fd5b855b858110156143525781356001600160401b03811115614423578788fd5b6144318a87838c01016144a1565b8552509284019290840190600101614406565b600082601f830112614454578081fd5b8135602061446461430983614f1f565b80838252828201915082860187848660051b8901011115614483578586fd5b855b8581101561435257813584529284019290840190600101614485565b600082601f8301126144b1578081fd5b81356001600160401b038111156144ca576144ca61507d565b6144dd601f8201601f1916602001614eef565b8181528460208386010111156144f1578283fd5b816020850160208301379081016020019190915292915050565b60006020828403121561451c578081fd5b611ab9826142cd565b60008060408385031215614537578081fd5b614540836142cd565b915061454e602084016142cd565b90509250929050565b60008060006060848603121561456b578081fd5b614574846142cd565b9250614582602085016142cd565b9150604084013590509250925092565b600080600080608085870312156145a7578081fd5b6145b0856142cd565b93506145be602086016142cd565b92506040850135915060608501356001600160401b038111156145df578182fd5b6145eb878288016144a1565b91505092959194509250565b60008060408385031215614609578182fd5b614612836142cd565b9150602083013561462281615093565b809150509250929050565b6000806040838503121561463f578182fd5b614648836142cd565b915060208301356001600160401b03811115614662578182fd5b61466e858286016144a1565b9150509250929050565b60008060006060848603121561468c578081fd5b614695846142cd565b925060208401356001600160401b03808211156146b0578283fd5b6146bc878388016144a1565b935060408601359150808211156146d1578283fd5b506146de868287016144a1565b9150509250925092565b600080600080608085870312156146fd578182fd5b614706856142cd565b935060208501356001600160401b0380821115614721578384fd5b61472d888389016144a1565b94506040870135915080821115614742578384fd5b61474e888389016144a1565b93506060870135915080821115614763578283fd5b506145eb878288016144a1565b60008060408385031215614782578182fd5b61478b836142cd565b946020939093013593505050565b6000806000606084860312156147ad578081fd5b83356001600160401b03808211156147c3578283fd5b6147cf878388016142e9565b945060208601359150808211156147e4578283fd5b6147f0878388016143c5565b93506040860135915080821115614805578283fd5b506146de868287016143c5565b60008060008060008060008060006101208a8c031215614830578687fd5b89356001600160401b0380821115614846578889fd5b6148528d838e016143c5565b9a5060208c0135915080821115614867578889fd5b6148738d838e0161435f565b995060408c0135915080821115614888578889fd5b6148948d838e0161435f565b985060608c01359150808211156148a9578687fd5b6148b58d838e0161435f565b975060808c01359150808211156148ca578687fd5b6148d68d838e0161435f565b965060a08c01359150808211156148eb578586fd5b6148f78d838e016142e9565b955060c08c013591508082111561490c578485fd5b6149188d838e01614444565b945060e08c013591508082111561492d578384fd5b6149398d838e016142e9565b93506101008c013591508082111561494f578283fd5b5061495c8c828d01614444565b9150509295985092959850929598565b60006020828403121561497d578081fd5b8151611ab981615093565b600060208284031215614999578081fd5b5035919050565b600080604083850312156149b2578182fd5b8235915061454e602084016142cd565b600080604083850312156149d4578182fd5b50508035926020909101359150565b6000602082840312156149f4578081fd5b8135611ab9816150a1565b600060208284031215614a10578081fd5b8151611ab9816150a1565b600060208284031215614a2c578081fd5b81356001600160401b03811115614a41578182fd5b6121e2848285016144a1565b60008060008060808587031215614a62578182fd5b84356001600160401b0380821115614a78578384fd5b614a84888389016144a1565b95506020870135915080821115614a99578384fd5b50614aa6878288016144a1565b935050614ab5604086016142cd565b9150614ac3606086016142cd565b905092959194509250565b60008060408385031215614ae0578182fd5b8235915060208301356001600160401b03811115614662578182fd5b60008151808452614b14816020860160208601614fa4565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b16815260008351614b52816014850160208801614fa4565b835190830190614b69816014840160208801614fa4565b0160140195945050505050565b60008251614b88818460208701614fa4565b9190910192915050565b60008351614ba4818460208801614fa4565b835190830190614bb8818360208801614fa4565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351614bf9816017850160208801614fa4565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351614c2a816028840160208801614fa4565b01602801949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090614c6990830184614afc565b9695505050505050565b602081526000611ab96020830184614afc565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b8281526040602082015260006121e26040830184614afc565b604051601f8201601f191681016001600160401b0381118282101715614f1757614f1761507d565b604052919050565b60006001600160401b03821115614f3857614f3861507d565b5060051b60200190565b60008219821115614f5557614f55615051565b500190565b600082614f6957614f69615067565b500490565b6000816000190483118215151615614f8857614f88615051565b500290565b600082821015614f9f57614f9f615051565b500390565b60005b83811015614fbf578181015183820152602001614fa7565b8381111561163a5750506000910152565b600081614fdf57614fdf615051565b506000190190565b600181811c90821680614ffb57607f821691505b6020821081141561501c57634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561503657615036615051565b5060010190565b60008261504c5761504c615067565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b8015158114610fa657600080fd5b6001600160e01b031981168114610fa657600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220c778da108e734ed8b9082d1d804fe95d1423598c81da4cde06daf2a20228610264736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
