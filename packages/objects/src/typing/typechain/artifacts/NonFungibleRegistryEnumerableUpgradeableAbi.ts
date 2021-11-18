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
    "0x60806040523480156200001157600080fd5b50600054610100900460ff16806200002c575060005460ff16155b620000945760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000b7576000805461ffff19166101011790555b8015620000ca576000805461ff00191690555b506147a580620000db6000396000f3fe608060405234801561001057600080fd5b50600436106102bb5760003560e01c80636352211e11610182578063a22cb465116100e9578063d547741f116100a2578063f041b4a71161007c578063f041b4a7146106c9578063f68e9553146106dd578063f8895cc8146106f2578063fce589d8146106fa57600080fd5b8063d547741f14610667578063db0ed6a01461067a578063e985e9c51461068d57600080fd5b8063a22cb465146105dc578063a8f1c6d8146105ef578063b88d4fde14610602578063bce8542e14610615578063c87b56dd14610641578063ca15c8731461065457600080fd5b80639010d07c1161013b5780639010d07c1461058057806391d148541461059357806393d0da07146105a657806395d89b41146105b9578063a10474c7146105c1578063a217fddf146105d457600080fd5b80636352211e1461050d5780636f4c25aa1461052057806370a082311461053357806370d5ae05146105465780638792ffef1461055a5780638daf3f4e1461056d57600080fd5b80632f2ff15d1161022657806347f00d5a116101df57806347f00d5a146104845780634b08b0a3146104975780634f6ccce7146104b25780635471a057146104c557806358083969146104d35780636017160b146104fa57600080fd5b80632f2ff15d146103d25780632f745c59146103e557806336568abe146103f857806338f292d51461040b57806342842e0e1461045e57806342966c681461047157600080fd5b806318160ddd1161027857806318160ddd146103635780632185810b1461036b57806323b872dd1461037f578063248a9ca314610392578063267be25c146103b55780632eb4a7ab146103c857600080fd5b806301ffc9a7146102c0578063054f7d9c146102e857806306fdde03146102f6578063081812fc1461030b578063095ea7b31461033657806314c44e091461034b575b600080fd5b6102d36102ce366004613ecc565b610704565b60405190151581526020015b60405180910390f35b610169546102d39060ff1681565b6102fe610715565b6040516102df91906142ff565b61031e610319366004613e4d565b6107a7565b6040516001600160a01b0390911681526020016102df565b610349610344366004613e08565b610834565b005b6103556101645481565b6040519081526020016102df565b60fd54610355565b610163546102d39062010000900460ff1681565b61034961038d366004613c9a565b61094a565b6103556103a0366004613e4d565b60009081526065602052604090206001015490565b6103496103c3366004613d83565b6109a1565b6103556101685481565b6103496103e0366004613e65565b610cca565b6103556103f3366004613e08565b610cec565b610349610406366004613e65565b610d82565b61043f610419366004613e4d565b61016260205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102df565b61034961046c366004613c9a565b610da4565b61034961047f366004613e4d565b610dbf565b61034961049236600461417d565b610edc565b6101635461031e90630100000090046001600160a01b031681565b6103556104c0366004613e4d565b611017565b610163546102d39060ff1681565b6103557fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b6102fe610508366004613e4d565b6110b8565b61031e61051b366004613e4d565b611153565b610163546102d390610100900460ff1681565b610355610541366004613c4e565b6111ca565b6101655461031e906001600160a01b031681565b610349610568366004613d83565b611251565b61034961057b366004613f04565b611359565b61031e61058e366004613eab565b6116b9565b6102d36105a1366004613e65565b6116d8565b6103496105b436600461417d565b611703565b6102fe611865565b6103496105cf366004613c4e565b611874565b610355600081565b6103496105ea366004613d4d565b611a0a565b6103496105fd366004613e87565b611acf565b610349610610366004613cd5565b611bca565b610355610623366004613f43565b80516020818301810180516101608252928201919093012091525481565b6102fe61064f366004613e4d565b611c27565b610355610662366004613e4d565b611c32565b610349610675366004613e65565b611c49565b610349610688366004613f75565b611c53565b6102d361069b366004613c68565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b6101675461031e906001600160a01b031681565b61035560008051602061475083398151915281565b6102fe611dd9565b6103556101665481565b600061070f82611de7565b92915050565b606060c980546107249061467f565b80601f01602080910402602001604051908101604052809291908181526020018280546107509061467f565b801561079d5780601f106107725761010080835404028352916020019161079d565b820191906000526020600020905b81548152906001019060200180831161078057829003601f168201915b5050505050905090565b60006107b282611e0c565b6108185760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b600061083f82611153565b9050806001600160a01b0316836001600160a01b031614156108ad5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b606482015260840161080f565b336001600160a01b03821614806108c957506108c9813361069b565b61093b5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000606482015260840161080f565b6109458383611e29565b505050565b610955335b82611e97565b6109715760405162461bcd60e51b815260040161080f906143f9565b61097a82611f9f565b6109965760405162461bcd60e51b815260040161080f906144b4565b61094583838361203c565b61016354630100000090046001600160a01b0316610a275760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e000000000000000000606482015260840161080f565b610a6685858080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506121e792505050565b15610a835760405162461bcd60e51b815260040161080f90614463565b61016354630100000090046001600160a01b03166323b872dd33610164546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015610aed57600080fd5b505af1158015610b01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b259190613e31565b50610b9c8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612212915050565b60006127106101665461016454610bb39190614606565b610bbd91906145f2565b610163546101655460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018490529293506301000000909104169063a9059cbb90604401602060405180830381600087803b158015610c1957600080fd5b505af1158015610c2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c519190613e31565b506040805180820190915261016354630100000090046001600160a01b03168152610164546020820190610c86908490614625565b9052600092835261016260209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b610cd4828261229e565b600082815260976020526040902061094590826122c4565b6000610cf7836111ca565b8210610d595760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b606482015260840161080f565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b610d8c82826122d9565b60008281526097602052604090206109459082612357565b61094583838360405180602001604052806000815250611bca565b610dc83361094f565b610de45760405162461bcd60e51b815260040161080f906143f9565b610ded8161236c565b6000818152610162602052604090206001015415610ed957600081815261016260205260409020546001600160a01b031663a9059cbb33600084815261016260205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b158015610e7e57600080fd5b505af1158015610e92573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eb69190613e31565b5060008181526101626020526040812080546001600160a01b0319168155600101555b50565b610ee4612451565b610f4b5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b606482015260840161080f565b610f56335b84611e97565b610f725760405162461bcd60e51b815260040161080f906143f9565b610fb28383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061247e92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f4838383604051602001610fe79291906141f2565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b600061102260fd5490565b82106110855760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b606482015260840161080f565b60fd82815481106110a657634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b61016160205260009081526040902080546110d29061467f565b80601f01602080910402602001604051908101604052809291908181526020018280546110fe9061467f565b801561114b5780601f106111205761010080835404028352916020019161114b565b820191906000526020600020905b81548152906001019060200180831161112e57829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b03168061070f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b606482015260840161080f565b60006001600160a01b0382166112355760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b606482015260840161080f565b506001600160a01b0316600090815260cc602052604090205490565b611269600080516020614750833981519152336116d8565b6112db5760405162461bcd60e51b815260206004820152603a60248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260448201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606482015260840161080f565b6113518686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612212915050565b505050505050565b611371600080516020614750833981519152336116d8565b61138d5760405162461bcd60e51b815260040161080f90614364565b600061139b82840184614007565b805151909150156113e757805180516000906113c757634e487b7160e01b600052603260045260246000fd5b602002602001015161015f90805190602001906113e592919061387b565b505b6020810151511561143a57806020015160008151811061141757634e487b7160e01b600052603260045260246000fd5b602002602001015161016360006101000a81548160ff0219169083151502179055505b6040810151511561148d57806040015160008151811061146a57634e487b7160e01b600052603260045260246000fd5b602002602001015161016360016101000a81548160ff0219169083151502179055505b606081015151156114e05780606001516000815181106114bd57634e487b7160e01b600052603260045260246000fd5b602002602001015161016360026101000a81548160ff0219169083151502179055505b6080810151511561154057806080015160008151811061151057634e487b7160e01b600052603260045260246000fd5b602002602001015161016360036101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60a08101515115611580578060a0015160008151811061157057634e487b7160e01b600052603260045260246000fd5b6020026020010151610164819055505b60c081015151156115e0578060c001516000815181106115b057634e487b7160e01b600052603260045260246000fd5b602002602001015161016560006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60e08101515115610945576127108160e0015160008151811061161357634e487b7160e01b600052603260045260246000fd5b602002602001015111156116805760405162461bcd60e51b815260206004820152602e60248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201526d3a1031329036329018981818181760911b606482015260840161080f565b8060e001516000815181106116a557634e487b7160e01b600052603260045260246000fd5b602002602001015161016681905550505050565b60008281526097602052604081206116d1908361250a565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b61170b612516565b6117705760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b606482015260840161080f565b61177933610f50565b6117955760405162461bcd60e51b815260040161080f906143f9565b6117d482828080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506121e792505050565b156117f15760405162461bcd60e51b815260040161080f90614463565b8261016083836040516118059291906141f2565b9081526040805160209281900383019020929092556000858152610161909152206118319083836138ff565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161100a93929190614528565b606060ca80546107249061467f565b61187f6000336116d8565b6118d75760405162461bcd60e51b815260206004820152602360248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652061646d60448201526234b71760e91b606482015260840161080f565b6001600160a01b0381166118f95761016780546001600160a01b031916905550565b6040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b038216906301ffc9a79060240160206040518083038186803b15801561193f57600080fd5b505afa158015611953573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119779190613e31565b6119e95760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e00606482015260840161080f565b61016780546001600160a01b0383166001600160a01b031990911617905550565b6001600160a01b038216331415611a635760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015260640161080f565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611ae7600080516020614750833981519152336116d8565b611b035760405162461bcd60e51b815260040161080f90614364565b6101695460ff1615611b705760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a206d65726b6c65526f6f742060448201526f3430b9903132b2b710333937bd32b71760811b606482015260840161080f565b610168829055610169805460ff19168215159081179091556040805184815260ff909216151560208301527fc72271867375e4dc99b635d35b37f44698b889895effb6891602e23128d4f68d910160405180910390a15050565b611bd43383611e97565b611bf05760405162461bcd60e51b815260040161080f906143f9565b611bf983611f9f565b611c155760405162461bcd60e51b815260040161080f906144b4565b611c2184848484612543565b50505050565b606061070f82612576565b600081815260976020526040812061070f906126e6565b610d8c82826126f0565b600054610100900460ff1680611c6c575060005460ff16155b611c885760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff16158015611caa576000805461ffff19166101011790555b611cb2612716565b611cba612789565b611cc26127f8565b611cca6127f8565b611cd48686612856565b611cdf6000836128dd565b611cf7600080516020614750833981519152846128dd565b611d2f6000805160206147508339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba6128e7565b611d597fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba846128dd565b61016380546001600160b81b03191662010001179055670de0b6b3a76400006101645561016580546001600160a01b038481166001600160a01b0319928316179092556101f461016655610167805492871692909116919091179055610169805460ff191690558015611351576000805461ff0019169055505050505050565b61015f80546110d29061467f565b60006001600160e01b0319821663780e9d6360e01b148061070f575061070f82612932565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190611e5e82611153565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611ea282611e0c565b611f035760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b606482015260840161080f565b6000611f0e83611153565b9050806001600160a01b0316846001600160a01b03161480611f495750836001600160a01b0316611f3e846107a7565b6001600160a01b0316145b80611f7957506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b80611f975750611f97600080516020614750833981519152856116d8565b949350505050565b610167546000906001600160a01b0316158061070f5750610167546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b158015611ffd57600080fd5b505afa158015612011573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120359190614165565b1192915050565b826001600160a01b031661204f82611153565b6001600160a01b0316146120b75760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b606482015260840161080f565b6001600160a01b0382166121195760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b606482015260840161080f565b612124838383612972565b61212f600082611e29565b6001600160a01b038316600090815260cc60205260408120805460019290612158908490614625565b90915550506001600160a01b038216600090815260cc602052604081208054600192906121869084906145da565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000610160826040516121fa9190614202565b90815260405190819003602001902054151592915050565b82511561229357612222836121e7565b1561223f5760405162461bcd60e51b815260040161080f90614463565b61224a8483836129e6565b806101608460405161225c9190614202565b9081526040805160209281900383019020929092556000838152610161825291909120845161228d9286019061387b565b50611c21565b611c218483836129e6565b6000828152606560205260409020600101546122ba8133612a7d565b6109458383612ae1565b60006116d1836001600160a01b038416612b67565b6001600160a01b03811633146123495760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161080f565b6123538282612bb6565b5050565b60006116d1836001600160a01b038416612c1d565b61237581612d3a565b600081815261016160205260408120805461238f9061467f565b80601f01602080910402602001604051908101604052809291908181526020018280546123bb9061467f565b80156124085780601f106123dd57610100808354040283529160200191612408565b820191906000526020600020905b8154815290600101906020018083116123eb57829003601f168201915b50505060008581526101616020526040812093945061242a9392509050613973565b6101608160405161243b9190614202565b9081526020016040518091039020600090555050565b6101635460009060ff16806124795750612479600080516020614750833981519152336116d8565b905090565b61248782611e0c565b6124ea5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b606482015260840161080f565b600082815261012d6020908152604090912082516109459284019061387b565b60006116d18383612d7c565b61016354600090610100900460ff16806124795750612479600080516020614750833981519152336116d8565b61254e84848461203c565b61255a84848484612db4565b611c215760405162461bcd60e51b815260040161080f90614312565b606061258182611e0c565b6125e75760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b606482015260840161080f565b600082815261012d6020526040812080546126019061467f565b80601f016020809104026020016040519081016040528092919081815260200182805461262d9061467f565b801561267a5780601f1061264f5761010080835404028352916020019161267a565b820191906000526020600020905b81548152906001019060200180831161265d57829003601f168201915b50505050509050600061269860408051602081019091526000815290565b90508051600014156126ab575092915050565b8151156126dd5780826040516020016126c592919061421e565b60405160208183030381529060405292505050919050565b611f9784612ec1565b600061070f825490565b60008281526065602052604090206001015461270c8133612a7d565b6109458383612bb6565b600054610100900460ff168061272f575060005460ff16155b61274b5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff1615801561276d576000805461ffff19166101011790555b612775612f98565b8015610ed9576000805461ff001916905550565b600054610100900460ff16806127a2575060005460ff16155b6127be5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff161580156127e0576000805461ffff19166101011790555b6127e8612f98565b6127f0612f98565b61276d612f98565b600054610100900460ff1680612811575060005460ff16155b61282d5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff161580156127e8576000805461ffff19166101011790556127f0612f98565b600054610100900460ff168061286f575060005460ff16155b61288b5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff161580156128ad576000805461ffff19166101011790555b6128b5612f98565b6128bd612f98565b6128c78383613002565b8015610945576000805461ff0019169055505050565b610cd48282613097565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006001600160e01b031982166380ac58cd60e01b148061296357506001600160e01b03198216635b5e139f60e01b145b8061070f575061070f826130a1565b61297a6130c6565b6129db5760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b606482015260840161080f565b6109458383836130f4565b6129ef83611f9f565b612a0b5760405162461bcd60e51b815260040161080f906144b4565b80612a695760405162461bcd60e51b815260206004820152602860248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e49642063616e60448201526706e6f7420626520360c41b606482015260840161080f565b612a7383826131ac565b610945818361247e565b612a8782826116d8565b61235357612a9f816001600160a01b031660146132eb565b612aaa8360206132eb565b604051602001612abb92919061424d565b60408051601f198184030181529082905262461bcd60e51b825261080f916004016142ff565b612aeb82826116d8565b6123535760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612b233390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000818152600183016020526040812054612bae5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561070f565b50600061070f565b612bc082826116d8565b156123535760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008181526001830160205260408120548015612d30576000612c41600183614625565b8554909150600090612c5590600190614625565b9050818114612cd6576000866000018281548110612c8357634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905080876000018481548110612cb457634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612cf557634e487b7160e01b600052603160045260246000fd5b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061070f565b600091505061070f565b612d43816134cc565b600081815261012d602052604090208054612d5d9061467f565b159050610ed957600081815261012d60205260408120610ed991613973565b6000826000018281548110612da157634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15612eb657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612df89033908990889088906004016142c2565b602060405180830381600087803b158015612e1257600080fd5b505af1925050508015612e42575060408051601f3d908101601f19168201909252612e3f91810190613ee8565b60015b612e9c573d808015612e70576040519150601f19603f3d011682016040523d82523d6000602084013e612e75565b606091505b508051612e945760405162461bcd60e51b815260040161080f90614312565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611f97565b506001949350505050565b6060612ecc82611e0c565b612f305760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b606482015260840161080f565b6000612f4760408051602081019091526000815290565b90506000815111612f6757604051806020016040528060008152506116d1565b80612f7184613573565b604051602001612f8292919061421e565b6040516020818303038152906040529392505050565b600054610100900460ff1680612fb1575060005460ff16155b612fcd5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff16158015612775576000805461ffff19166101011790558015610ed9576000805461ff001916905550565b600054610100900460ff168061301b575060005460ff16155b6130375760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff16158015613059576000805461ffff19166101011790555b825161306c9060c990602086019061387b565b5081516130809060ca90602085019061387b565b508015610945576000805461ff0019169055505050565b6123538282612ae1565b60006001600160e01b03198216635a05180f60e01b148061070f575061070f8261368c565b6101635460009062010000900460ff16806124795750612479600080516020614750833981519152336116d8565b6001600160a01b03831661314f5761314a8160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b613172565b816001600160a01b0316836001600160a01b0316146131725761317283826136c1565b6001600160a01b038216613189576109458161375e565b826001600160a01b0316826001600160a01b031614610945576109458282613837565b6001600160a01b0382166132025760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640161080f565b61320b81611e0c565b156132585760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640161080f565b61326460008383612972565b6001600160a01b038216600090815260cc6020526040812080546001929061328d9084906145da565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b606060006132fa836002614606565b6133059060026145da565b6001600160401b0381111561332a57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613354576020820181803683370190505b509050600360fc1b8160008151811061337d57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106133ba57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006133de846002614606565b6133e99060016145da565b90505b600181111561347d576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061342b57634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061344f57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361347681614668565b90506133ec565b5083156116d15760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161080f565b60006134d782611153565b90506134e581600084612972565b6134f0600083611e29565b6001600160a01b038116600090815260cc60205260408120805460019290613519908490614625565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816135975750506040805180820190915260018152600360fc1b602082015290565b8160005b81156135c157806135ab816146ba565b91506135ba9050600a836145f2565b915061359b565b6000816001600160401b038111156135e957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613613576020820181803683370190505b5090505b8415611f9757613628600183614625565b9150613635600a866146d5565b6136409060306145da565b60f81b81838151811061366357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350613685600a866145f2565b9450613617565b60006001600160e01b03198216637965db0b60e01b148061070f57506301ffc9a760e01b6001600160e01b031983161461070f565b600060016136ce846111ca565b6136d89190614625565b600083815260fc602052604090205490915080821461372b576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061377090600190614625565b600083815260fe602052604081205460fd80549394509092849081106137a657634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106137d557634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd80548061381b57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000613842836111ca565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b8280546138879061467f565b90600052602060002090601f0160209004810192826138a957600085556138ef565b82601f106138c257805160ff19168380011785556138ef565b828001600101855582156138ef579182015b828111156138ef5782518255916020019190600101906138d4565b506138fb9291506139a9565b5090565b82805461390b9061467f565b90600052602060002090601f01602090048101928261392d57600085556138ef565b82601f106139465782800160ff198235161785556138ef565b828001600101855582156138ef579182015b828111156138ef578235825591602001919060010190613958565b50805461397f9061467f565b6000825580601f1061398f575050565b601f016020900490600052602060002090810190610ed991905b5b808211156138fb57600081556001016139aa565b60006001600160401b038311156139d7576139d7614715565b6139ea601f8401601f1916602001614587565b90508281528383830111156139fe57600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114613a2c57600080fd5b919050565b600082601f830112613a41578081fd5b81356020613a56613a51836145b7565b614587565b80838252828201915082860187848660051b8901011115613a75578586fd5b855b85811015613a9a57613a8882613a15565b84529284019290840190600101613a77565b5090979650505050505050565b600082601f830112613ab7578081fd5b81356020613ac7613a51836145b7565b80838252828201915082860187848660051b8901011115613ae6578586fd5b855b85811015613a9a578135613afb8161472b565b84529284019290840190600101613ae8565b600082601f830112613b1d578081fd5b81356020613b2d613a51836145b7565b80838252828201915082860187848660051b8901011115613b4c578586fd5b855b85811015613a9a5781356001600160401b03811115613b6b578788fd5b613b798a87838c0101613c2f565b8552509284019290840190600101613b4e565b600082601f830112613b9c578081fd5b81356020613bac613a51836145b7565b80838252828201915082860187848660051b8901011115613bcb578586fd5b855b85811015613a9a57813584529284019290840190600101613bcd565b60008083601f840112613bfa578182fd5b5081356001600160401b03811115613c10578182fd5b602083019150836020828501011115613c2857600080fd5b9250929050565b600082601f830112613c3f578081fd5b6116d1838335602085016139be565b600060208284031215613c5f578081fd5b6116d182613a15565b60008060408385031215613c7a578081fd5b613c8383613a15565b9150613c9160208401613a15565b90509250929050565b600080600060608486031215613cae578081fd5b613cb784613a15565b9250613cc560208501613a15565b9150604084013590509250925092565b60008060008060808587031215613cea578182fd5b613cf385613a15565b9350613d0160208601613a15565b92506040850135915060608501356001600160401b03811115613d22578182fd5b8501601f81018713613d32578182fd5b613d41878235602084016139be565b91505092959194509250565b60008060408385031215613d5f578182fd5b613d6883613a15565b91506020830135613d788161472b565b809150509250929050565b60008060008060008060808789031215613d9b578384fd5b613da487613a15565b955060208701356001600160401b0380821115613dbf578586fd5b613dcb8a838b01613be9565b90975095506040890135915080821115613de3578384fd5b50613df089828a01613be9565b979a9699509497949695606090950135949350505050565b60008060408385031215613e1a578182fd5b613e2383613a15565b946020939093013593505050565b600060208284031215613e42578081fd5b81516116d18161472b565b600060208284031215613e5e578081fd5b5035919050565b60008060408385031215613e77578182fd5b82359150613c9160208401613a15565b60008060408385031215613e99578182fd5b823591506020830135613d788161472b565b60008060408385031215613ebd578182fd5b50508035926020909101359150565b600060208284031215613edd578081fd5b81356116d181614739565b600060208284031215613ef9578081fd5b81516116d181614739565b60008060208385031215613f16578182fd5b82356001600160401b03811115613f2b578283fd5b613f3785828601613be9565b90969095509350505050565b600060208284031215613f54578081fd5b81356001600160401b03811115613f69578182fd5b611f9784828501613c2f565b600080600080600060a08688031215613f8c578283fd5b85356001600160401b0380821115613fa2578485fd5b613fae89838a01613c2f565b96506020880135915080821115613fc3578485fd5b50613fd088828901613c2f565b945050613fdf60408701613a15565b9250613fed60608701613a15565b9150613ffb60808701613a15565b90509295509295909350565b600060208284031215614018578081fd5b81356001600160401b038082111561402e578283fd5b908301906101008286031215614042578283fd5b61404a61455e565b823582811115614058578485fd5b61406487828601613b0d565b825250602083013582811115614078578485fd5b61408487828601613aa7565b60208301525060408301358281111561409b578485fd5b6140a787828601613aa7565b6040830152506060830135828111156140be578485fd5b6140ca87828601613aa7565b6060830152506080830135828111156140e1578485fd5b6140ed87828601613a31565b60808301525060a083013582811115614104578485fd5b61411087828601613b8c565b60a08301525060c083013582811115614127578485fd5b61413387828601613a31565b60c08301525060e08301358281111561414a578485fd5b61415687828601613b8c565b60e08301525095945050505050565b600060208284031215614176578081fd5b5051919050565b600080600060408486031215614191578081fd5b8335925060208401356001600160401b038111156141ad578182fd5b6141b986828701613be9565b9497909650939450505050565b600081518084526141de81602086016020860161463c565b601f01601f19169290920160200192915050565b8183823760009101908152919050565b6000825161421481846020870161463c565b9190910192915050565b6000835161423081846020880161463c565b83519083019061424481836020880161463c565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161428581601785016020880161463c565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516142b681602884016020880161463c565b01602801949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906142f5908301846141c6565b9695505050505050565b6020815260006116d160208301846141c6565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526027908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760408201526634b9ba3930b91760c91b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161010081016001600160401b038111828210171561458157614581614715565b60405290565b604051601f8201601f191681016001600160401b03811182821017156145af576145af614715565b604052919050565b60006001600160401b038211156145d0576145d0614715565b5060051b60200190565b600082198211156145ed576145ed6146e9565b500190565b600082614601576146016146ff565b500490565b6000816000190483118215151615614620576146206146e9565b500290565b600082821015614637576146376146e9565b500390565b60005b8381101561465757818101518382015260200161463f565b83811115611c215750506000910152565b600081614677576146776146e9565b506000190190565b600181811c9082168061469357607f821691505b602082108114156146b457634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156146ce576146ce6146e9565b5060010190565b6000826146e4576146e46146ff565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b8015158114610ed957600080fd5b6001600160e01b031981168114610ed957600080fdfeedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a264697066735822122090e6d3f9c2d0849fb6a5c80f1dc7292ae7891cc4f49e9c7aaff1119831a9fd0b64736f6c63430008040033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106102bb5760003560e01c80636352211e11610182578063a22cb465116100e9578063d547741f116100a2578063f041b4a71161007c578063f041b4a7146106c9578063f68e9553146106dd578063f8895cc8146106f2578063fce589d8146106fa57600080fd5b8063d547741f14610667578063db0ed6a01461067a578063e985e9c51461068d57600080fd5b8063a22cb465146105dc578063a8f1c6d8146105ef578063b88d4fde14610602578063bce8542e14610615578063c87b56dd14610641578063ca15c8731461065457600080fd5b80639010d07c1161013b5780639010d07c1461058057806391d148541461059357806393d0da07146105a657806395d89b41146105b9578063a10474c7146105c1578063a217fddf146105d457600080fd5b80636352211e1461050d5780636f4c25aa1461052057806370a082311461053357806370d5ae05146105465780638792ffef1461055a5780638daf3f4e1461056d57600080fd5b80632f2ff15d1161022657806347f00d5a116101df57806347f00d5a146104845780634b08b0a3146104975780634f6ccce7146104b25780635471a057146104c557806358083969146104d35780636017160b146104fa57600080fd5b80632f2ff15d146103d25780632f745c59146103e557806336568abe146103f857806338f292d51461040b57806342842e0e1461045e57806342966c681461047157600080fd5b806318160ddd1161027857806318160ddd146103635780632185810b1461036b57806323b872dd1461037f578063248a9ca314610392578063267be25c146103b55780632eb4a7ab146103c857600080fd5b806301ffc9a7146102c0578063054f7d9c146102e857806306fdde03146102f6578063081812fc1461030b578063095ea7b31461033657806314c44e091461034b575b600080fd5b6102d36102ce366004613ecc565b610704565b60405190151581526020015b60405180910390f35b610169546102d39060ff1681565b6102fe610715565b6040516102df91906142ff565b61031e610319366004613e4d565b6107a7565b6040516001600160a01b0390911681526020016102df565b610349610344366004613e08565b610834565b005b6103556101645481565b6040519081526020016102df565b60fd54610355565b610163546102d39062010000900460ff1681565b61034961038d366004613c9a565b61094a565b6103556103a0366004613e4d565b60009081526065602052604090206001015490565b6103496103c3366004613d83565b6109a1565b6103556101685481565b6103496103e0366004613e65565b610cca565b6103556103f3366004613e08565b610cec565b610349610406366004613e65565b610d82565b61043f610419366004613e4d565b61016260205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102df565b61034961046c366004613c9a565b610da4565b61034961047f366004613e4d565b610dbf565b61034961049236600461417d565b610edc565b6101635461031e90630100000090046001600160a01b031681565b6103556104c0366004613e4d565b611017565b610163546102d39060ff1681565b6103557fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b6102fe610508366004613e4d565b6110b8565b61031e61051b366004613e4d565b611153565b610163546102d390610100900460ff1681565b610355610541366004613c4e565b6111ca565b6101655461031e906001600160a01b031681565b610349610568366004613d83565b611251565b61034961057b366004613f04565b611359565b61031e61058e366004613eab565b6116b9565b6102d36105a1366004613e65565b6116d8565b6103496105b436600461417d565b611703565b6102fe611865565b6103496105cf366004613c4e565b611874565b610355600081565b6103496105ea366004613d4d565b611a0a565b6103496105fd366004613e87565b611acf565b610349610610366004613cd5565b611bca565b610355610623366004613f43565b80516020818301810180516101608252928201919093012091525481565b6102fe61064f366004613e4d565b611c27565b610355610662366004613e4d565b611c32565b610349610675366004613e65565b611c49565b610349610688366004613f75565b611c53565b6102d361069b366004613c68565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b6101675461031e906001600160a01b031681565b61035560008051602061475083398151915281565b6102fe611dd9565b6103556101665481565b600061070f82611de7565b92915050565b606060c980546107249061467f565b80601f01602080910402602001604051908101604052809291908181526020018280546107509061467f565b801561079d5780601f106107725761010080835404028352916020019161079d565b820191906000526020600020905b81548152906001019060200180831161078057829003601f168201915b5050505050905090565b60006107b282611e0c565b6108185760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b600061083f82611153565b9050806001600160a01b0316836001600160a01b031614156108ad5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b606482015260840161080f565b336001600160a01b03821614806108c957506108c9813361069b565b61093b5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000606482015260840161080f565b6109458383611e29565b505050565b610955335b82611e97565b6109715760405162461bcd60e51b815260040161080f906143f9565b61097a82611f9f565b6109965760405162461bcd60e51b815260040161080f906144b4565b61094583838361203c565b61016354630100000090046001600160a01b0316610a275760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e000000000000000000606482015260840161080f565b610a6685858080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506121e792505050565b15610a835760405162461bcd60e51b815260040161080f90614463565b61016354630100000090046001600160a01b03166323b872dd33610164546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b158015610aed57600080fd5b505af1158015610b01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b259190613e31565b50610b9c8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612212915050565b60006127106101665461016454610bb39190614606565b610bbd91906145f2565b610163546101655460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018490529293506301000000909104169063a9059cbb90604401602060405180830381600087803b158015610c1957600080fd5b505af1158015610c2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c519190613e31565b506040805180820190915261016354630100000090046001600160a01b03168152610164546020820190610c86908490614625565b9052600092835261016260209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b610cd4828261229e565b600082815260976020526040902061094590826122c4565b6000610cf7836111ca565b8210610d595760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b606482015260840161080f565b506001600160a01b0391909116600090815260fb60209081526040808320938352929052205490565b610d8c82826122d9565b60008281526097602052604090206109459082612357565b61094583838360405180602001604052806000815250611bca565b610dc83361094f565b610de45760405162461bcd60e51b815260040161080f906143f9565b610ded8161236c565b6000818152610162602052604090206001015415610ed957600081815261016260205260409020546001600160a01b031663a9059cbb33600084815261016260205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b158015610e7e57600080fd5b505af1158015610e92573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eb69190613e31565b5060008181526101626020526040812080546001600160a01b0319168155600101555b50565b610ee4612451565b610f4b5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b606482015260840161080f565b610f56335b84611e97565b610f725760405162461bcd60e51b815260040161080f906143f9565b610fb28383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061247e92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f4838383604051602001610fe79291906141f2565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b600061102260fd5490565b82106110855760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b606482015260840161080f565b60fd82815481106110a657634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b61016160205260009081526040902080546110d29061467f565b80601f01602080910402602001604051908101604052809291908181526020018280546110fe9061467f565b801561114b5780601f106111205761010080835404028352916020019161114b565b820191906000526020600020905b81548152906001019060200180831161112e57829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b03168061070f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b606482015260840161080f565b60006001600160a01b0382166112355760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b606482015260840161080f565b506001600160a01b0316600090815260cc602052604090205490565b611269600080516020614750833981519152336116d8565b6112db5760405162461bcd60e51b815260206004820152603a60248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260448201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606482015260840161080f565b6113518686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881529250889150879081908401838280828437600092019190915250879250612212915050565b505050505050565b611371600080516020614750833981519152336116d8565b61138d5760405162461bcd60e51b815260040161080f90614364565b600061139b82840184614007565b805151909150156113e757805180516000906113c757634e487b7160e01b600052603260045260246000fd5b602002602001015161015f90805190602001906113e592919061387b565b505b6020810151511561143a57806020015160008151811061141757634e487b7160e01b600052603260045260246000fd5b602002602001015161016360006101000a81548160ff0219169083151502179055505b6040810151511561148d57806040015160008151811061146a57634e487b7160e01b600052603260045260246000fd5b602002602001015161016360016101000a81548160ff0219169083151502179055505b606081015151156114e05780606001516000815181106114bd57634e487b7160e01b600052603260045260246000fd5b602002602001015161016360026101000a81548160ff0219169083151502179055505b6080810151511561154057806080015160008151811061151057634e487b7160e01b600052603260045260246000fd5b602002602001015161016360036101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60a08101515115611580578060a0015160008151811061157057634e487b7160e01b600052603260045260246000fd5b6020026020010151610164819055505b60c081015151156115e0578060c001516000815181106115b057634e487b7160e01b600052603260045260246000fd5b602002602001015161016560006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60e08101515115610945576127108160e0015160008151811061161357634e487b7160e01b600052603260045260246000fd5b602002602001015111156116805760405162461bcd60e51b815260206004820152602e60248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201526d3a1031329036329018981818181760911b606482015260840161080f565b8060e001516000815181106116a557634e487b7160e01b600052603260045260246000fd5b602002602001015161016681905550505050565b60008281526097602052604081206116d1908361250a565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b61170b612516565b6117705760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b606482015260840161080f565b61177933610f50565b6117955760405162461bcd60e51b815260040161080f906143f9565b6117d482828080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506121e792505050565b156117f15760405162461bcd60e51b815260040161080f90614463565b8261016083836040516118059291906141f2565b9081526040805160209281900383019020929092556000858152610161909152206118319083836138ff565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161100a93929190614528565b606060ca80546107249061467f565b61187f6000336116d8565b6118d75760405162461bcd60e51b815260206004820152602360248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652061646d60448201526234b71760e91b606482015260840161080f565b6001600160a01b0381166118f95761016780546001600160a01b031916905550565b6040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b038216906301ffc9a79060240160206040518083038186803b15801561193f57600080fd5b505afa158015611953573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119779190613e31565b6119e95760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e00606482015260840161080f565b61016780546001600160a01b0383166001600160a01b031990911617905550565b6001600160a01b038216331415611a635760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015260640161080f565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611ae7600080516020614750833981519152336116d8565b611b035760405162461bcd60e51b815260040161080f90614364565b6101695460ff1615611b705760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a206d65726b6c65526f6f742060448201526f3430b9903132b2b710333937bd32b71760811b606482015260840161080f565b610168829055610169805460ff19168215159081179091556040805184815260ff909216151560208301527fc72271867375e4dc99b635d35b37f44698b889895effb6891602e23128d4f68d910160405180910390a15050565b611bd43383611e97565b611bf05760405162461bcd60e51b815260040161080f906143f9565b611bf983611f9f565b611c155760405162461bcd60e51b815260040161080f906144b4565b611c2184848484612543565b50505050565b606061070f82612576565b600081815260976020526040812061070f906126e6565b610d8c82826126f0565b600054610100900460ff1680611c6c575060005460ff16155b611c885760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff16158015611caa576000805461ffff19166101011790555b611cb2612716565b611cba612789565b611cc26127f8565b611cca6127f8565b611cd48686612856565b611cdf6000836128dd565b611cf7600080516020614750833981519152846128dd565b611d2f6000805160206147508339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba6128e7565b611d597fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba846128dd565b61016380546001600160b81b03191662010001179055670de0b6b3a76400006101645561016580546001600160a01b038481166001600160a01b0319928316179092556101f461016655610167805492871692909116919091179055610169805460ff191690558015611351576000805461ff0019169055505050505050565b61015f80546110d29061467f565b60006001600160e01b0319821663780e9d6360e01b148061070f575061070f82612932565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190611e5e82611153565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611ea282611e0c565b611f035760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b606482015260840161080f565b6000611f0e83611153565b9050806001600160a01b0316846001600160a01b03161480611f495750836001600160a01b0316611f3e846107a7565b6001600160a01b0316145b80611f7957506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b80611f975750611f97600080516020614750833981519152856116d8565b949350505050565b610167546000906001600160a01b0316158061070f5750610167546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b158015611ffd57600080fd5b505afa158015612011573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120359190614165565b1192915050565b826001600160a01b031661204f82611153565b6001600160a01b0316146120b75760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b606482015260840161080f565b6001600160a01b0382166121195760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b606482015260840161080f565b612124838383612972565b61212f600082611e29565b6001600160a01b038316600090815260cc60205260408120805460019290612158908490614625565b90915550506001600160a01b038216600090815260cc602052604081208054600192906121869084906145da565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000610160826040516121fa9190614202565b90815260405190819003602001902054151592915050565b82511561229357612222836121e7565b1561223f5760405162461bcd60e51b815260040161080f90614463565b61224a8483836129e6565b806101608460405161225c9190614202565b9081526040805160209281900383019020929092556000838152610161825291909120845161228d9286019061387b565b50611c21565b611c218483836129e6565b6000828152606560205260409020600101546122ba8133612a7d565b6109458383612ae1565b60006116d1836001600160a01b038416612b67565b6001600160a01b03811633146123495760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161080f565b6123538282612bb6565b5050565b60006116d1836001600160a01b038416612c1d565b61237581612d3a565b600081815261016160205260408120805461238f9061467f565b80601f01602080910402602001604051908101604052809291908181526020018280546123bb9061467f565b80156124085780601f106123dd57610100808354040283529160200191612408565b820191906000526020600020905b8154815290600101906020018083116123eb57829003601f168201915b50505060008581526101616020526040812093945061242a9392509050613973565b6101608160405161243b9190614202565b9081526020016040518091039020600090555050565b6101635460009060ff16806124795750612479600080516020614750833981519152336116d8565b905090565b61248782611e0c565b6124ea5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b606482015260840161080f565b600082815261012d6020908152604090912082516109459284019061387b565b60006116d18383612d7c565b61016354600090610100900460ff16806124795750612479600080516020614750833981519152336116d8565b61254e84848461203c565b61255a84848484612db4565b611c215760405162461bcd60e51b815260040161080f90614312565b606061258182611e0c565b6125e75760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b606482015260840161080f565b600082815261012d6020526040812080546126019061467f565b80601f016020809104026020016040519081016040528092919081815260200182805461262d9061467f565b801561267a5780601f1061264f5761010080835404028352916020019161267a565b820191906000526020600020905b81548152906001019060200180831161265d57829003601f168201915b50505050509050600061269860408051602081019091526000815290565b90508051600014156126ab575092915050565b8151156126dd5780826040516020016126c592919061421e565b60405160208183030381529060405292505050919050565b611f9784612ec1565b600061070f825490565b60008281526065602052604090206001015461270c8133612a7d565b6109458383612bb6565b600054610100900460ff168061272f575060005460ff16155b61274b5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff1615801561276d576000805461ffff19166101011790555b612775612f98565b8015610ed9576000805461ff001916905550565b600054610100900460ff16806127a2575060005460ff16155b6127be5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff161580156127e0576000805461ffff19166101011790555b6127e8612f98565b6127f0612f98565b61276d612f98565b600054610100900460ff1680612811575060005460ff16155b61282d5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff161580156127e8576000805461ffff19166101011790556127f0612f98565b600054610100900460ff168061286f575060005460ff16155b61288b5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff161580156128ad576000805461ffff19166101011790555b6128b5612f98565b6128bd612f98565b6128c78383613002565b8015610945576000805461ff0019169055505050565b610cd48282613097565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006001600160e01b031982166380ac58cd60e01b148061296357506001600160e01b03198216635b5e139f60e01b145b8061070f575061070f826130a1565b61297a6130c6565b6129db5760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b606482015260840161080f565b6109458383836130f4565b6129ef83611f9f565b612a0b5760405162461bcd60e51b815260040161080f906144b4565b80612a695760405162461bcd60e51b815260206004820152602860248201527f4e6f6e46756e6769626c6552656769737472793a20746f6b656e49642063616e60448201526706e6f7420626520360c41b606482015260840161080f565b612a7383826131ac565b610945818361247e565b612a8782826116d8565b61235357612a9f816001600160a01b031660146132eb565b612aaa8360206132eb565b604051602001612abb92919061424d565b60408051601f198184030181529082905262461bcd60e51b825261080f916004016142ff565b612aeb82826116d8565b6123535760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055612b233390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000818152600183016020526040812054612bae5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561070f565b50600061070f565b612bc082826116d8565b156123535760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008181526001830160205260408120548015612d30576000612c41600183614625565b8554909150600090612c5590600190614625565b9050818114612cd6576000866000018281548110612c8357634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905080876000018481548110612cb457634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612cf557634e487b7160e01b600052603160045260246000fd5b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061070f565b600091505061070f565b612d43816134cc565b600081815261012d602052604090208054612d5d9061467f565b159050610ed957600081815261012d60205260408120610ed991613973565b6000826000018281548110612da157634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15612eb657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612df89033908990889088906004016142c2565b602060405180830381600087803b158015612e1257600080fd5b505af1925050508015612e42575060408051601f3d908101601f19168201909252612e3f91810190613ee8565b60015b612e9c573d808015612e70576040519150601f19603f3d011682016040523d82523d6000602084013e612e75565b606091505b508051612e945760405162461bcd60e51b815260040161080f90614312565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611f97565b506001949350505050565b6060612ecc82611e0c565b612f305760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b606482015260840161080f565b6000612f4760408051602081019091526000815290565b90506000815111612f6757604051806020016040528060008152506116d1565b80612f7184613573565b604051602001612f8292919061421e565b6040516020818303038152906040529392505050565b600054610100900460ff1680612fb1575060005460ff16155b612fcd5760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff16158015612775576000805461ffff19166101011790558015610ed9576000805461ff001916905550565b600054610100900460ff168061301b575060005460ff16155b6130375760405162461bcd60e51b815260040161080f906143ab565b600054610100900460ff16158015613059576000805461ffff19166101011790555b825161306c9060c990602086019061387b565b5081516130809060ca90602085019061387b565b508015610945576000805461ff0019169055505050565b6123538282612ae1565b60006001600160e01b03198216635a05180f60e01b148061070f575061070f8261368c565b6101635460009062010000900460ff16806124795750612479600080516020614750833981519152336116d8565b6001600160a01b03831661314f5761314a8160fd8054600083815260fe60205260408120829055600182018355919091527f9346ac6dd7de6b96975fec380d4d994c4c12e6a8897544f22915316cc6cca2800155565b613172565b816001600160a01b0316836001600160a01b0316146131725761317283826136c1565b6001600160a01b038216613189576109458161375e565b826001600160a01b0316826001600160a01b031614610945576109458282613837565b6001600160a01b0382166132025760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640161080f565b61320b81611e0c565b156132585760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640161080f565b61326460008383612972565b6001600160a01b038216600090815260cc6020526040812080546001929061328d9084906145da565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b606060006132fa836002614606565b6133059060026145da565b6001600160401b0381111561332a57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613354576020820181803683370190505b509050600360fc1b8160008151811061337d57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106133ba57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006133de846002614606565b6133e99060016145da565b90505b600181111561347d576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061342b57634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061344f57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361347681614668565b90506133ec565b5083156116d15760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161080f565b60006134d782611153565b90506134e581600084612972565b6134f0600083611e29565b6001600160a01b038116600090815260cc60205260408120805460019290613519908490614625565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816135975750506040805180820190915260018152600360fc1b602082015290565b8160005b81156135c157806135ab816146ba565b91506135ba9050600a836145f2565b915061359b565b6000816001600160401b038111156135e957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015613613576020820181803683370190505b5090505b8415611f9757613628600183614625565b9150613635600a866146d5565b6136409060306145da565b60f81b81838151811061366357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350613685600a866145f2565b9450613617565b60006001600160e01b03198216637965db0b60e01b148061070f57506301ffc9a760e01b6001600160e01b031983161461070f565b600060016136ce846111ca565b6136d89190614625565b600083815260fc602052604090205490915080821461372b576001600160a01b038416600090815260fb60209081526040808320858452825280832054848452818420819055835260fc90915290208190555b50600091825260fc602090815260408084208490556001600160a01b03909416835260fb81528383209183525290812055565b60fd5460009061377090600190614625565b600083815260fe602052604081205460fd80549394509092849081106137a657634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508060fd83815481106137d557634e487b7160e01b600052603260045260246000fd5b600091825260208083209091019290925582815260fe909152604080822084905585825281205560fd80548061381b57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b6000613842836111ca565b6001600160a01b03909316600090815260fb60209081526040808320868452825280832085905593825260fc9052919091209190915550565b8280546138879061467f565b90600052602060002090601f0160209004810192826138a957600085556138ef565b82601f106138c257805160ff19168380011785556138ef565b828001600101855582156138ef579182015b828111156138ef5782518255916020019190600101906138d4565b506138fb9291506139a9565b5090565b82805461390b9061467f565b90600052602060002090601f01602090048101928261392d57600085556138ef565b82601f106139465782800160ff198235161785556138ef565b828001600101855582156138ef579182015b828111156138ef578235825591602001919060010190613958565b50805461397f9061467f565b6000825580601f1061398f575050565b601f016020900490600052602060002090810190610ed991905b5b808211156138fb57600081556001016139aa565b60006001600160401b038311156139d7576139d7614715565b6139ea601f8401601f1916602001614587565b90508281528383830111156139fe57600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114613a2c57600080fd5b919050565b600082601f830112613a41578081fd5b81356020613a56613a51836145b7565b614587565b80838252828201915082860187848660051b8901011115613a75578586fd5b855b85811015613a9a57613a8882613a15565b84529284019290840190600101613a77565b5090979650505050505050565b600082601f830112613ab7578081fd5b81356020613ac7613a51836145b7565b80838252828201915082860187848660051b8901011115613ae6578586fd5b855b85811015613a9a578135613afb8161472b565b84529284019290840190600101613ae8565b600082601f830112613b1d578081fd5b81356020613b2d613a51836145b7565b80838252828201915082860187848660051b8901011115613b4c578586fd5b855b85811015613a9a5781356001600160401b03811115613b6b578788fd5b613b798a87838c0101613c2f565b8552509284019290840190600101613b4e565b600082601f830112613b9c578081fd5b81356020613bac613a51836145b7565b80838252828201915082860187848660051b8901011115613bcb578586fd5b855b85811015613a9a57813584529284019290840190600101613bcd565b60008083601f840112613bfa578182fd5b5081356001600160401b03811115613c10578182fd5b602083019150836020828501011115613c2857600080fd5b9250929050565b600082601f830112613c3f578081fd5b6116d1838335602085016139be565b600060208284031215613c5f578081fd5b6116d182613a15565b60008060408385031215613c7a578081fd5b613c8383613a15565b9150613c9160208401613a15565b90509250929050565b600080600060608486031215613cae578081fd5b613cb784613a15565b9250613cc560208501613a15565b9150604084013590509250925092565b60008060008060808587031215613cea578182fd5b613cf385613a15565b9350613d0160208601613a15565b92506040850135915060608501356001600160401b03811115613d22578182fd5b8501601f81018713613d32578182fd5b613d41878235602084016139be565b91505092959194509250565b60008060408385031215613d5f578182fd5b613d6883613a15565b91506020830135613d788161472b565b809150509250929050565b60008060008060008060808789031215613d9b578384fd5b613da487613a15565b955060208701356001600160401b0380821115613dbf578586fd5b613dcb8a838b01613be9565b90975095506040890135915080821115613de3578384fd5b50613df089828a01613be9565b979a9699509497949695606090950135949350505050565b60008060408385031215613e1a578182fd5b613e2383613a15565b946020939093013593505050565b600060208284031215613e42578081fd5b81516116d18161472b565b600060208284031215613e5e578081fd5b5035919050565b60008060408385031215613e77578182fd5b82359150613c9160208401613a15565b60008060408385031215613e99578182fd5b823591506020830135613d788161472b565b60008060408385031215613ebd578182fd5b50508035926020909101359150565b600060208284031215613edd578081fd5b81356116d181614739565b600060208284031215613ef9578081fd5b81516116d181614739565b60008060208385031215613f16578182fd5b82356001600160401b03811115613f2b578283fd5b613f3785828601613be9565b90969095509350505050565b600060208284031215613f54578081fd5b81356001600160401b03811115613f69578182fd5b611f9784828501613c2f565b600080600080600060a08688031215613f8c578283fd5b85356001600160401b0380821115613fa2578485fd5b613fae89838a01613c2f565b96506020880135915080821115613fc3578485fd5b50613fd088828901613c2f565b945050613fdf60408701613a15565b9250613fed60608701613a15565b9150613ffb60808701613a15565b90509295509295909350565b600060208284031215614018578081fd5b81356001600160401b038082111561402e578283fd5b908301906101008286031215614042578283fd5b61404a61455e565b823582811115614058578485fd5b61406487828601613b0d565b825250602083013582811115614078578485fd5b61408487828601613aa7565b60208301525060408301358281111561409b578485fd5b6140a787828601613aa7565b6040830152506060830135828111156140be578485fd5b6140ca87828601613aa7565b6060830152506080830135828111156140e1578485fd5b6140ed87828601613a31565b60808301525060a083013582811115614104578485fd5b61411087828601613b8c565b60a08301525060c083013582811115614127578485fd5b61413387828601613a31565b60c08301525060e08301358281111561414a578485fd5b61415687828601613b8c565b60e08301525095945050505050565b600060208284031215614176578081fd5b5051919050565b600080600060408486031215614191578081fd5b8335925060208401356001600160401b038111156141ad578182fd5b6141b986828701613be9565b9497909650939450505050565b600081518084526141de81602086016020860161463c565b601f01601f19169290920160200192915050565b8183823760009101908152919050565b6000825161421481846020870161463c565b9190910192915050565b6000835161423081846020880161463c565b83519083019061424481836020880161463c565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161428581601785016020880161463c565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516142b681602884016020880161463c565b01602801949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906142f5908301846141c6565b9695505050505050565b6020815260006116d160208301846141c6565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526027908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760408201526634b9ba3930b91760c91b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161010081016001600160401b038111828210171561458157614581614715565b60405290565b604051601f8201601f191681016001600160401b03811182821017156145af576145af614715565b604052919050565b60006001600160401b038211156145d0576145d0614715565b5060051b60200190565b600082198211156145ed576145ed6146e9565b500190565b600082614601576146016146ff565b500490565b6000816000190483118215151615614620576146206146e9565b500290565b600082821015614637576146376146e9565b500390565b60005b8381101561465757818101518382015260200161463f565b83811115611c215750506000910152565b600081614677576146776146e9565b506000190190565b600181811c9082168061469357607f821691505b602082108114156146b457634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156146ce576146ce6146e9565b5060010190565b6000826146e4576146e46146ff565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b8015158114610ed957600080fd5b6001600160e01b031981168114610ed957600080fdfeedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a264697066735822122090e6d3f9c2d0849fb6a5c80f1dc7292ae7891cc4f49e9c7aaff1119831a9fd0b64736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
