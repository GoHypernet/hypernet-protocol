export default {
  "_format": "hh-sol-artifact-1",
  "contractName": "NonFungibleRegistryUpgradeable",
  "sourceName": "contracts/identity/NonFungibleRegistryUpgradeable.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "previousAdmin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newAdmin",
          "type": "address"
        }
      ],
      "name": "AdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "beacon",
          "type": "address"
        }
      ],
      "name": "BeaconUpgraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "label",
          "type": "string"
        }
      ],
      "name": "LabelUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "registrationData",
          "type": "bytes32"
        }
      ],
      "name": "StorageUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "Upgraded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "REGISTRAR_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "REGISTRAR_ROLE_ADMIN",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allowLabelChange",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allowLazyRegister",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allowStorageUpdate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allowTransfers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "recipients",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "labels",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "registrationDatas",
          "type": "string[]"
        }
      ],
      "name": "batchRegister",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "burnAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "burnFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getRoleMember",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleMemberCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "identityStakes",
      "outputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_registrar",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_admin",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "label",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "registrationData",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "lazyRegister",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "primaryRegistry",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "label",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "registrationData",
          "type": "string"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "label",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "registrationData",
          "type": "string"
        }
      ],
      "name": "registerByToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registrationFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registrationToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "registryMap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "reverseRegistryMap",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "schema",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encodedParameters",
          "type": "bytes"
        }
      ],
      "name": "setRegistryParameters",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "label",
          "type": "string"
        }
      ],
      "name": "updateLabel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "registrationData",
          "type": "string"
        }
      ],
      "name": "updateRegistration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  "bytecode": "0x60a06040523060601b6080523480156200001857600080fd5b50600054610100900460ff168062000033575060005460ff16155b6200009b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015620000be576000805461ffff19166101011790555b8015620000d1576000805461ff00191690555b5060805160601c61577e620001066000396000818161103b0152818161107b0152818161137501526113b5015261577e6000f3fe6080604052600436106102885760003560e01c80636f4c25aa1161015a578063a22cb465116100c1578063d547741f1161007a578063d547741f14610845578063e985e9c514610865578063f041b4a7146108ae578063f68e9553146108cf578063f8895cc8146108f1578063fce589d81461090657600080fd5b8063a22cb46514610771578063b88d4fde14610791578063bb87c1c8146107b1578063bce8542e146107cc578063c87b56dd14610805578063ca15c8731461082557600080fd5b80638f15b414116101135780638f15b414146106c75780639010d07c146106e757806391d148541461070757806393d0da071461072757806395d89b4114610747578063a217fddf1461075c57600080fd5b80636f4c25aa146106055780637092d9ea1461062657806370a082311461064657806370d5ae05146106665780638d59cc02146106875780638daf3f4e146106a757600080fd5b80633659cfe6116101fe5780634f1ef286116101b75780634f1ef2861461053e5780635471a0571461055157806358083969146105715780636017160b146105a55780636352211e146105c557806366e7b606146105e557600080fd5b80633659cfe61461043557806338f292d51461045557806342842e0e146104b557806342966c68146104d557806347f00d5a146104f55780634b08b0a31461051557600080fd5b806314c44e091161025057806314c44e091461035e5780632185810b1461038357806323b872dd146103a5578063248a9ca3146103c55780632f2ff15d146103f557806336568abe1461041557600080fd5b806301ffc9a71461028d57806306fdde03146102c2578063081812fc146102e4578063095ea7b31461031c5780630ecf9dfd1461033e575b600080fd5b34801561029957600080fd5b506102ad6102a8366004614d47565b61091d565b60405190151581526020015b60405180910390f35b3480156102ce57600080fd5b506102d761092e565b6040516102b99190615203565b3480156102f057600080fd5b506103046102ff366004614cec565b6109c0565b6040516001600160a01b0390911681526020016102b9565b34801561032857600080fd5b5061033c610337366004614c24565b610a4d565b005b34801561034a57600080fd5b5061033c610359366004614b7e565b610b63565b34801561036a57600080fd5b506103756101965481565b6040519081526020016102b9565b34801561038f57600080fd5b50610195546102ad906301000000900460ff1681565b3480156103b157600080fd5b5061033c6103c03660046149e0565b610f95565b3480156103d157600080fd5b506103756103e0366004614cec565b60009081526065602052604090206001015490565b34801561040157600080fd5b5061033c610410366004614d04565b610fec565b34801561042157600080fd5b5061033c610430366004614d04565b61100e565b34801561044157600080fd5b5061033c610450366004614994565b611030565b34801561046157600080fd5b50610496610470366004614cec565b61019460205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102b9565b3480156104c157600080fd5b5061033c6104d03660046149e0565b6110f9565b3480156104e157600080fd5b5061033c6104f0366004614cec565b611114565b34801561050157600080fd5b5061033c610510366004615033565b61122f565b34801561052157600080fd5b50610195546103049064010000000090046001600160a01b031681565b61033c61054c366004614ab6565b61136a565b34801561055d57600080fd5b50610195546102ad90610100900460ff1681565b34801561057d57600080fd5b506103757fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b3480156105b157600080fd5b506102d76105c0366004614cec565b611424565b3480156105d157600080fd5b506103046105e0366004614cec565b6114bf565b3480156105f157600080fd5b5061033c610600366004614c4d565b611536565b34801561061157600080fd5b50610195546102ad9062010000900460ff1681565b34801561063257600080fd5b5061033c610641366004614b01565b611728565b34801561065257600080fd5b50610375610661366004614994565b611a57565b34801561067257600080fd5b5061019754610304906001600160a01b031681565b34801561069357600080fd5b5061033c6106a2366004614b01565b611ade565b3480156106b357600080fd5b5061033c6106c2366004614d7f565b611b8e565b3480156106d357600080fd5b5061033c6106e2366004614df0565b61215b565b3480156106f357600080fd5b50610304610702366004614d26565b6122ce565b34801561071357600080fd5b506102ad610722366004614d04565b6122ed565b34801561073357600080fd5b5061033c610742366004615033565b612318565b34801561075357600080fd5b506102d761247a565b34801561076857600080fd5b50610375600081565b34801561077d57600080fd5b5061033c61078c366004614a80565b612489565b34801561079d57600080fd5b5061033c6107ac366004614a1b565b61254e565b3480156107bd57600080fd5b50610195546102ad9060ff1681565b3480156107d857600080fd5b506103756107e7366004614dbe565b80516020818301810180516101928252928201919093012091525481565b34801561081157600080fd5b506102d7610820366004614cec565b6125a5565b34801561083157600080fd5b50610375610840366004614cec565b6125b0565b34801561085157600080fd5b5061033c610860366004614d04565b6125c7565b34801561087157600080fd5b506102ad6108803660046149ae565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b3480156108ba57600080fd5b5061019954610304906001600160a01b031681565b3480156108db57600080fd5b5061037560008051602061572983398151915281565b3480156108fd57600080fd5b506102d76125d1565b34801561091257600080fd5b506103756101985481565b6000610928826125df565b92915050565b606060c9805461093d90615631565b80601f016020809104026020016040519081016040528092919081815260200182805461096990615631565b80156109b65780601f1061098b576101008083540402835291602001916109b6565b820191906000526020600020905b81548152906001019060200180831161099957829003601f168201915b5050505050905090565b60006109cb8261261f565b610a315760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a58826114bf565b9050806001600160a01b0316836001600160a01b03161415610ac65760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a28565b336001600160a01b0382161480610ae25750610ae28133610880565b610b545760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a28565b610b5e838361263c565b505050565b6101955460ff16610bd25760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a28565b610bdb876126aa565b610bf75760405162461bcd60e51b8152600401610a2890615466565b6101955462010000900460ff1615610c8a5760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a28565b84610cf35760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610a28565b610d3286868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061274792505050565b15610da55760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a28565b336001600160a01b03881614610e135760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a28565b610ebb8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061277292505050565b610f175760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a28565b610f8b8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525061281792505050565b5050505050505050565b610fa0335b826128a6565b610fbc5760405162461bcd60e51b8152600401610a289061534e565b610fc5826126aa565b610fe15760405162461bcd60e51b8152600401610a2890615466565b610b5e8383836129a6565b610ff68282612b51565b6000828152609760205260409020610b5e9082612b77565b6110188282612b8c565b6000828152609760205260409020610b5e9082612c06565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156110795760405162461bcd60e51b8152600401610a2890615268565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166110ab612c1b565b6001600160a01b0316146110d15760405162461bcd60e51b8152600401610a28906152b4565b6110da81612c49565b604080516000808252602082019092526110f691839190612c62565b50565b610b5e8383836040518060200160405280600081525061254e565b61111d33610f9a565b6111395760405162461bcd60e51b8152600401610a289061534e565b61114281612da6565b60008181526101946020526040902060010154156110f657600081815261019460205260409020546001600160a01b031663a9059cbb33600084815261019460205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156111d357600080fd5b505af11580156111e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061120b9190614cd0565b5060009081526101946020526040812080546001600160a01b031916815560010155565b611237612e8b565b61129e5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a28565b6112a9335b846128a6565b6112c55760405162461bcd60e51b8152600401610a289061534e565b6113058383838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612ebd92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f483838360405160200161133a929190615112565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156113b35760405162461bcd60e51b8152600401610a2890615268565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166113e5612c1b565b6001600160a01b03161461140b5760405162461bcd60e51b8152600401610a28906152b4565b61141482612c49565b61142082826001612c62565b5050565b610193602052600090815260409020805461143e90615631565b80601f016020809104026020016040519081016040528092919081815260200182805461146a90615631565b80156114b75780601f1061148c576101008083540402835291602001916114b7565b820191906000526020600020905b81548152906001019060200180831161149a57829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109285760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a28565b61154e600080516020615729833981519152336122ed565b61156a5760405162461bcd60e51b8152600401610a28906153b8565b81518351146115f45760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a28565b81518151146116855760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a28565b60005b8351811015611722576117118482815181106116b457634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106116dc57634e487b7160e01b600052603260045260246000fd5b602002602001015184848151811061170457634e487b7160e01b600052603260045260246000fd5b6020026020010151612817565b5061171b8161566c565b9050611688565b50505050565b6101955464010000000090046001600160a01b03166117af5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a28565b6117ee84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061274792505050565b1561180b5760405162461bcd60e51b8152600401610a2890615415565b6101955464010000000090046001600160a01b03166323b872dd33610196546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b15801561187657600080fd5b505af115801561188a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118ae9190614cd0565b5060006119258686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061281792505050565b90506000612710610198546101965461193e91906155b8565b61194891906155a4565b610195546101975460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b1580156119a557600080fd5b505af11580156119b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119dd9190614cd0565b50604080518082019091526101955464010000000090046001600160a01b03168152610196546020820190611a139084906155d7565b9052600092835261019460209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611ac25760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a28565b506001600160a01b0316600090815260cc602052604090205490565b611af6600080516020615729833981519152336122ed565b611b125760405162461bcd60e51b8152600401610a28906153b8565b611b868585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8901819004810282018101909252878152925087915086908190840183828082843760009201919091525061281792505050565b505050505050565b611ba6600080516020615729833981519152336122ed565b611c025760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a28565b6000611c1082840184614e71565b80515190915015611c5c5780518051600090611c3c57634e487b7160e01b600052603260045260246000fd5b60200260200101516101919080519060200190611c5a9291906145d4565b505b60208101515115611caf578060200151600081518110611c8c57634e487b7160e01b600052603260045260246000fd5b602002602001015161019560006101000a81548160ff0219169083151502179055505b60408101515115611d02578060400151600081518110611cdf57634e487b7160e01b600052603260045260246000fd5b602002602001015161019560016101000a81548160ff0219169083151502179055505b60608101515115611d55578060600151600081518110611d3257634e487b7160e01b600052603260045260246000fd5b602002602001015161019560026101000a81548160ff0219169083151502179055505b60808101515115611da8578060800151600081518110611d8557634e487b7160e01b600052603260045260246000fd5b602002602001015161019560036101000a81548160ff0219169083151502179055505b60a08101515115611e08578060a00151600081518110611dd857634e487b7160e01b600052603260045260246000fd5b602002602001015161019560046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115611e48578060c00151600081518110611e3857634e487b7160e01b600052603260045260246000fd5b6020026020010151610196819055505b60e08101515115611ea8578060e00151600081518110611e7857634e487b7160e01b600052603260045260246000fd5b602002602001015161019760006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b6101008101515115611fd357612710816101000151600081518110611edd57634e487b7160e01b600052603260045260246000fd5b602002602001015111158015611f2157506000816101000151600081518110611f1657634e487b7160e01b600052603260045260246000fd5b602002602001015110155b611f9d5760405162461bcd60e51b815260206004820152604160248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201527f74206265206765207468616e203020616e64206c65207468616e2031303030306064820152601760f91b608482015260a401610a28565b806101000151600081518110611fc357634e487b7160e01b600052603260045260246000fd5b6020026020010151610198819055505b6101208101515115610b5e5780610120015160008151811061200557634e487b7160e01b600052603260045260246000fd5b60209081029190910101516040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b03909116906301ffc9a79060240160206040518083038186803b15801561205757600080fd5b505afa15801561206b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061208f9190614cd0565b6121015760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610a28565b80610120015160008151811061212757634e487b7160e01b600052603260045260246000fd5b602002602001015161019960006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff1680612174575060005460ff16155b6121905760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff161580156121b2576000805461ffff19166101011790555b6121ba612f48565b6121c2612fbb565b6121ca61302a565b6121d2613088565b6121dc85856130e6565b6121e760008361316d565b6121ff6000805160206157298339815191528461316d565b6122376000805160206157298339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba613177565b6122617fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba8461316d565b61019580546001600160c01b0319166301000100179055670de0b6b3a76400006101965561019780546001600160a01b0384166001600160a01b0319918216179091556101f4610198556101998054909116905580156122c7576000805461ff00191690555b5050505050565b60008281526097602052604081206122e690836131c2565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6123206131ce565b6123855760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a28565b61238e336112a3565b6123aa5760405162461bcd60e51b8152600401610a289061534e565b6123e982828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061274792505050565b156124065760405162461bcd60e51b8152600401610a2890615415565b82610192838360405161241a929190615112565b908152604080516020928190038301902092909255600085815261019390915220612446908383614658565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161135d939291906154da565b606060ca805461093d90615631565b6001600160a01b0382163314156124e25760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a28565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61255833836128a6565b6125745760405162461bcd60e51b8152600401610a289061534e565b61257d836126aa565b6125995760405162461bcd60e51b8152600401610a2890615466565b611722848484846131fc565b60606109288261322f565b60008181526097602052604081206109289061339e565b61101882826133a8565b610191805461143e90615631565b60006001600160e01b031982166380ac58cd60e01b148061261057506001600160e01b03198216635b5e139f60e01b145b806109285750610928826133ce565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190612671826114bf565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b610199546000906001600160a01b031615806109285750610199546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561270857600080fd5b505afa15801561271c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612740919061501b565b1192915050565b60006101928260405161275a91906150f6565b90815260405190819003602001902054151592915050565b6000806127ed86868660405160200161278d939291906150a8565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b905061280b60008051602061572983398151915261072283866133f3565b9150505b949350505050565b81516000901561289c5761282a83612747565b156128475760405162461bcd60e51b8152600401610a2890615415565b6128518483613417565b9050806101928460405161286591906150f6565b90815260408051602092819003830190209290925560008381526101938252919091208451612896928601906145d4565b506122e6565b61280f8483613417565b60006128b18261261f565b6129125760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a28565b600061291d836114bf565b9050806001600160a01b0316846001600160a01b031614806129585750836001600160a01b031661294d846109c0565b6001600160a01b0316145b8061298857506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b8061280f575061280f600080516020615729833981519152856122ed565b826001600160a01b03166129b9826114bf565b6001600160a01b031614612a215760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a28565b6001600160a01b038216612a835760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a28565b612a8e838383613472565b612a9960008261263c565b6001600160a01b038316600090815260cc60205260408120805460019290612ac29084906155d7565b90915550506001600160a01b038216600090815260cc60205260408120805460019290612af090849061558c565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612b6d81336134db565b610b5e838361353f565b60006122e6836001600160a01b0384166135c5565b6001600160a01b0381163314612bfc5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a28565b6114208282613614565b60006122e6836001600160a01b03841661367b565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b60008051602061572983398151915261142081336134db565b6000612c6c612c1b565b9050612c7784613798565b600083511180612c845750815b15612c9557612c93848461383d565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff166122c757805460ff191660011781556040516001600160a01b0383166024820152612d1490869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b17905261383d565b50805460ff19168155612d25612c1b565b6001600160a01b0316826001600160a01b031614612d9d5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a28565b6122c785613928565b612daf81613968565b6000818152610193602052604081208054612dc990615631565b80601f0160208091040260200160405190810160405280929190818152602001828054612df590615631565b8015612e425780601f10612e1757610100808354040283529160200191612e42565b820191906000526020600020905b815481529060010190602001808311612e2557829003601f168201915b505050600085815261019360205260408120939450612e6493925090506146cc565b61019281604051612e7591906150f6565b9081526020016040518091039020600090555050565b61019554600090610100900460ff1680612eb85750612eb8600080516020615729833981519152336122ed565b905090565b612ec68261261f565b612f295760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a28565b600082815260fb602090815260409091208251610b5e928401906145d4565b600054610100900460ff1680612f61575060005460ff16155b612f7d5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015612f9f576000805461ffff19166101011790555b612fa76139a8565b80156110f6576000805461ff001916905550565b600054610100900460ff1680612fd4575060005460ff16155b612ff05760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015613012576000805461ffff19166101011790555b61301a6139a8565b6130226139a8565b612f9f6139a8565b600054610100900460ff1680613043575060005460ff16155b61305f5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff1615801561301a576000805461ffff19166101011790556130226139a8565b600054610100900460ff16806130a1575060005460ff16155b6130bd5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015613022576000805461ffff1916610101179055612f9f6139a8565b600054610100900460ff16806130ff575060005460ff16155b61311b5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff1615801561313d576000805461ffff19166101011790555b6131456139a8565b61314d6139a8565b6131578383613a12565b8015610b5e576000805461ff0019169055505050565b610ff68282613aa7565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006122e68383613ab1565b6101955460009062010000900460ff1680612eb85750612eb8600080516020615729833981519152336122ed565b6132078484846129a6565b61321384848484613ae9565b6117225760405162461bcd60e51b8152600401610a2890615216565b606061323a8261261f565b6132a05760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a28565b600082815260fb6020526040812080546132b990615631565b80601f01602080910402602001604051908101604052809291908181526020018280546132e590615631565b80156133325780601f1061330757610100808354040283529160200191613332565b820191906000526020600020905b81548152906001019060200180831161331557829003601f168201915b50505050509050600061335060408051602081019091526000815290565b9050805160001415613363575092915050565b81511561339557808260405160200161337d929190615122565b60405160208183030381529060405292505050919050565b61280f84613bf3565b6000610928825490565b6000828152606560205260409020600101546133c481336134db565b610b5e8383613614565b60006001600160e01b03198216635a05180f60e01b1480610928575061092882613cca565b60008060006134028585613cff565b9150915061340f81613d6f565b509392505050565b6000613422836126aa565b61343e5760405162461bcd60e51b8152600401610a2890615466565b61019a5461344d90600161558c565b90506134598382613f70565b61346861019a80546001019055565b6109288183612ebd565b61347a6140af565b610b5e5760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a28565b6134e582826122ed565b611420576134fd816001600160a01b031660146140de565b6135088360206140de565b604051602001613519929190615151565b60408051601f198184030181529082905262461bcd60e51b8252610a2891600401615203565b61354982826122ed565b6114205760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556135813390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600081815260018301602052604081205461360c57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610928565b506000610928565b61361e82826122ed565b156114205760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000818152600183016020526040812054801561378e57600061369f6001836155d7565b85549091506000906136b3906001906155d7565b90508181146137345760008660000182815481106136e157634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061371257634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061375357634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610928565b6000915050610928565b803b6137fc5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a28565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b61389c5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a28565b600080846001600160a01b0316846040516138b791906150f6565b600060405180830381855af49150503d80600081146138f2576040519150601f19603f3d011682016040523d82523d6000602084013e6138f7565b606091505b509150915061391f8282604051806060016040528060278152602001615702602791396142bf565b95945050505050565b61393181613798565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b613971816142f8565b600081815260fb60205260409020805461398a90615631565b1590506110f657600081815260fb602052604081206110f6916146cc565b600054610100900460ff16806139c1575060005460ff16155b6139dd5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015612fa7576000805461ffff191661010117905580156110f6576000805461ff001916905550565b600054610100900460ff1680613a2b575060005460ff16155b613a475760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015613a69576000805461ffff19166101011790555b8251613a7c9060c99060208601906145d4565b508151613a909060ca9060208501906145d4565b508015610b5e576000805461ff0019169055505050565b611420828261353f565b6000826000018281548110613ad657634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613beb57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613b2d9033908990889088906004016151c6565b602060405180830381600087803b158015613b4757600080fd5b505af1925050508015613b77575060408051601f3d908101601f19168201909252613b7491810190614d63565b60015b613bd1573d808015613ba5576040519150601f19603f3d011682016040523d82523d6000602084013e613baa565b606091505b508051613bc95760405162461bcd60e51b8152600401610a2890615216565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061280f565b50600161280f565b6060613bfe8261261f565b613c625760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a28565b6000613c7960408051602081019091526000815290565b90506000815111613c9957604051806020016040528060008152506122e6565b80613ca38461439f565b604051602001613cb4929190615122565b6040516020818303038152906040529392505050565b60006001600160e01b03198216637965db0b60e01b148061092857506301ffc9a760e01b6001600160e01b0319831614610928565b600080825160411415613d365760208301516040840151606085015160001a613d2a878285856144b8565b94509450505050613d68565b825160401415613d605760208301516040840151613d558683836145a5565b935093505050613d68565b506000905060025b9250929050565b6000816004811115613d9157634e487b7160e01b600052602160045260246000fd5b1415613d9a5750565b6001816004811115613dbc57634e487b7160e01b600052602160045260246000fd5b1415613e0a5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a28565b6002816004811115613e2c57634e487b7160e01b600052602160045260246000fd5b1415613e7a5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a28565b6003816004811115613e9c57634e487b7160e01b600052602160045260246000fd5b1415613ef55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a28565b6004816004811115613f1757634e487b7160e01b600052602160045260246000fd5b14156110f65760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a28565b6001600160a01b038216613fc65760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a28565b613fcf8161261f565b1561401c5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a28565b61402860008383613472565b6001600160a01b038216600090815260cc6020526040812080546001929061405190849061558c565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b610195546000906301000000900460ff1680612eb85750612eb8600080516020615729833981519152336122ed565b606060006140ed8360026155b8565b6140f890600261558c565b6001600160401b0381111561411d57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015614147576020820181803683370190505b509050600360fc1b8160008151811061417057634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106141ad57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006141d18460026155b8565b6141dc90600161558c565b90505b6001811115614270576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061421e57634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061424257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936142698161561a565b90506141df565b5083156122e65760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a28565b606083156142ce5750816122e6565b8251156142de5782518084602001fd5b8160405162461bcd60e51b8152600401610a289190615203565b6000614303826114bf565b905061431181600084613472565b61431c60008361263c565b6001600160a01b038116600090815260cc602052604081208054600192906143459084906155d7565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816143c35750506040805180820190915260018152600360fc1b602082015290565b8160005b81156143ed57806143d78161566c565b91506143e69050600a836155a4565b91506143c7565b6000816001600160401b0381111561441557634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f19166020018201604052801561443f576020820181803683370190505b5090505b841561280f576144546001836155d7565b9150614461600a86615687565b61446c90603061558c565b60f81b81838151811061448f57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506144b1600a866155a4565b9450614443565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156144ef575060009050600361459c565b8460ff16601b1415801561450757508460ff16601c14155b15614518575060009050600461459c565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561456c573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166145955760006001925092505061459c565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b016145c6878288856144b8565b935093505050935093915050565b8280546145e090615631565b90600052602060002090601f0160209004810192826146025760008555614648565b82601f1061461b57805160ff1916838001178555614648565b82800160010185558215614648579182015b8281111561464857825182559160200191906001019061462d565b50614654929150614702565b5090565b82805461466490615631565b90600052602060002090601f0160209004810192826146865760008555614648565b82601f1061469f5782800160ff19823516178555614648565b82800160010185558215614648579182015b828111156146485782358255916020019190600101906146b1565b5080546146d890615631565b6000825580601f106146e8575050565b601f0160209004906000526020600020908101906110f691905b5b808211156146545760008155600101614703565b80356001600160a01b038116811461472e57600080fd5b919050565b600082601f830112614743578081fd5b8135602061475861475383615569565b615539565b80838252828201915082860187848660051b8901011115614777578586fd5b855b8581101561479c5761478a82614717565b84529284019290840190600101614779565b5090979650505050505050565b600082601f8301126147b9578081fd5b813560206147c961475383615569565b80838252828201915082860187848660051b89010111156147e8578586fd5b855b8581101561479c5781356147fd816156dd565b845292840192908401906001016147ea565b600082601f83011261481f578081fd5b8135602061482f61475383615569565b80838252828201915082860187848660051b890101111561484e578586fd5b855b8581101561479c5781356001600160401b0381111561486d578788fd5b61487b8a87838c010161492a565b8552509284019290840190600101614850565b600082601f83011261489e578081fd5b813560206148ae61475383615569565b80838252828201915082860187848660051b89010111156148cd578586fd5b855b8581101561479c578135845292840192908401906001016148cf565b60008083601f8401126148fc578182fd5b5081356001600160401b03811115614912578182fd5b602083019150836020828501011115613d6857600080fd5b600082601f83011261493a578081fd5b81356001600160401b03811115614953576149536156c7565b614966601f8201601f1916602001615539565b81815284602083860101111561497a578283fd5b816020850160208301379081016020019190915292915050565b6000602082840312156149a5578081fd5b6122e682614717565b600080604083850312156149c0578081fd5b6149c983614717565b91506149d760208401614717565b90509250929050565b6000806000606084860312156149f4578081fd5b6149fd84614717565b9250614a0b60208501614717565b9150604084013590509250925092565b60008060008060808587031215614a30578182fd5b614a3985614717565b9350614a4760208601614717565b92506040850135915060608501356001600160401b03811115614a68578182fd5b614a748782880161492a565b91505092959194509250565b60008060408385031215614a92578182fd5b614a9b83614717565b91506020830135614aab816156dd565b809150509250929050565b60008060408385031215614ac8578182fd5b614ad183614717565b915060208301356001600160401b03811115614aeb578182fd5b614af78582860161492a565b9150509250929050565b600080600080600060608688031215614b18578283fd5b614b2186614717565b945060208601356001600160401b0380821115614b3c578485fd5b614b4889838a016148eb565b90965094506040880135915080821115614b60578283fd5b50614b6d888289016148eb565b969995985093965092949392505050565b60008060008060008060006080888a031215614b98578485fd5b614ba188614717565b965060208801356001600160401b0380821115614bbc578687fd5b614bc88b838c016148eb565b909850965060408a0135915080821115614be0578384fd5b614bec8b838c016148eb565b909650945060608a0135915080821115614c04578384fd5b50614c118a828b016148eb565b989b979a50959850939692959293505050565b60008060408385031215614c36578182fd5b614c3f83614717565b946020939093013593505050565b600080600060608486031215614c61578081fd5b83356001600160401b0380821115614c77578283fd5b614c8387838801614733565b94506020860135915080821115614c98578283fd5b614ca48783880161480f565b93506040860135915080821115614cb9578283fd5b50614cc68682870161480f565b9150509250925092565b600060208284031215614ce1578081fd5b81516122e6816156dd565b600060208284031215614cfd578081fd5b5035919050565b60008060408385031215614d16578182fd5b823591506149d760208401614717565b60008060408385031215614d38578182fd5b50508035926020909101359150565b600060208284031215614d58578081fd5b81356122e6816156eb565b600060208284031215614d74578081fd5b81516122e6816156eb565b60008060208385031215614d91578182fd5b82356001600160401b03811115614da6578283fd5b614db2858286016148eb565b90969095509350505050565b600060208284031215614dcf578081fd5b81356001600160401b03811115614de4578182fd5b61280f8482850161492a565b60008060008060808587031215614e05578182fd5b84356001600160401b0380821115614e1b578384fd5b614e278883890161492a565b95506020870135915080821115614e3c578384fd5b50614e498782880161492a565b935050614e5860408601614717565b9150614e6660608601614717565b905092959194509250565b600060208284031215614e82578081fd5b81356001600160401b0380821115614e98578283fd5b908301906101408286031215614eac578283fd5b614eb4615510565b823582811115614ec2578485fd5b614ece8782860161480f565b825250602083013582811115614ee2578485fd5b614eee878286016147a9565b602083015250604083013582811115614f05578485fd5b614f11878286016147a9565b604083015250606083013582811115614f28578485fd5b614f34878286016147a9565b606083015250608083013582811115614f4b578485fd5b614f57878286016147a9565b60808301525060a083013582811115614f6e578485fd5b614f7a87828601614733565b60a08301525060c083013582811115614f91578485fd5b614f9d8782860161488e565b60c08301525060e083013582811115614fb4578485fd5b614fc087828601614733565b60e0830152506101008084013583811115614fd9578586fd5b614fe58882870161488e565b8284015250506101208084013583811115614ffe578586fd5b61500a88828701614733565b918301919091525095945050505050565b60006020828403121561502c578081fd5b5051919050565b600080600060408486031215615047578081fd5b8335925060208401356001600160401b03811115615063578182fd5b61506f868287016148eb565b9497909650939450505050565b600081518084526150948160208601602086016155ee565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b168152600083516150d28160148501602088016155ee565b8351908301906150e98160148401602088016155ee565b0160140195945050505050565b600082516151088184602087016155ee565b9190910192915050565b8183823760009101908152919050565b600083516151348184602088016155ee565b8351908301906151488183602088016155ee565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516151898160178501602088016155ee565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516151ba8160288401602088016155ee565b01602801949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906151f99083018461507c565b9695505050505050565b6020815260006122e6602083018461507c565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b0381118282101715615533576155336156c7565b60405290565b604051601f8201601f191681016001600160401b0381118282101715615561576155616156c7565b604052919050565b60006001600160401b03821115615582576155826156c7565b5060051b60200190565b6000821982111561559f5761559f61569b565b500190565b6000826155b3576155b36156b1565b500490565b60008160001904831182151516156155d2576155d261569b565b500290565b6000828210156155e9576155e961569b565b500390565b60005b838110156156095781810151838201526020016155f1565b838111156117225750506000910152565b6000816156295761562961569b565b506000190190565b600181811c9082168061564557607f821691505b6020821081141561566657634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156156805761568061569b565b5060010190565b600082615696576156966156b1565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b80151581146110f657600080fd5b6001600160e01b0319811681146110f657600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220193e90fe04a45628acd2113ed8c013db3b12563a9bd2e40e84275b1a2e36b9a964736f6c63430008040033",
  "deployedBytecode": "0x6080604052600436106102885760003560e01c80636f4c25aa1161015a578063a22cb465116100c1578063d547741f1161007a578063d547741f14610845578063e985e9c514610865578063f041b4a7146108ae578063f68e9553146108cf578063f8895cc8146108f1578063fce589d81461090657600080fd5b8063a22cb46514610771578063b88d4fde14610791578063bb87c1c8146107b1578063bce8542e146107cc578063c87b56dd14610805578063ca15c8731461082557600080fd5b80638f15b414116101135780638f15b414146106c75780639010d07c146106e757806391d148541461070757806393d0da071461072757806395d89b4114610747578063a217fddf1461075c57600080fd5b80636f4c25aa146106055780637092d9ea1461062657806370a082311461064657806370d5ae05146106665780638d59cc02146106875780638daf3f4e146106a757600080fd5b80633659cfe6116101fe5780634f1ef286116101b75780634f1ef2861461053e5780635471a0571461055157806358083969146105715780636017160b146105a55780636352211e146105c557806366e7b606146105e557600080fd5b80633659cfe61461043557806338f292d51461045557806342842e0e146104b557806342966c68146104d557806347f00d5a146104f55780634b08b0a31461051557600080fd5b806314c44e091161025057806314c44e091461035e5780632185810b1461038357806323b872dd146103a5578063248a9ca3146103c55780632f2ff15d146103f557806336568abe1461041557600080fd5b806301ffc9a71461028d57806306fdde03146102c2578063081812fc146102e4578063095ea7b31461031c5780630ecf9dfd1461033e575b600080fd5b34801561029957600080fd5b506102ad6102a8366004614d47565b61091d565b60405190151581526020015b60405180910390f35b3480156102ce57600080fd5b506102d761092e565b6040516102b99190615203565b3480156102f057600080fd5b506103046102ff366004614cec565b6109c0565b6040516001600160a01b0390911681526020016102b9565b34801561032857600080fd5b5061033c610337366004614c24565b610a4d565b005b34801561034a57600080fd5b5061033c610359366004614b7e565b610b63565b34801561036a57600080fd5b506103756101965481565b6040519081526020016102b9565b34801561038f57600080fd5b50610195546102ad906301000000900460ff1681565b3480156103b157600080fd5b5061033c6103c03660046149e0565b610f95565b3480156103d157600080fd5b506103756103e0366004614cec565b60009081526065602052604090206001015490565b34801561040157600080fd5b5061033c610410366004614d04565b610fec565b34801561042157600080fd5b5061033c610430366004614d04565b61100e565b34801561044157600080fd5b5061033c610450366004614994565b611030565b34801561046157600080fd5b50610496610470366004614cec565b61019460205260009081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b0390931683526020830191909152016102b9565b3480156104c157600080fd5b5061033c6104d03660046149e0565b6110f9565b3480156104e157600080fd5b5061033c6104f0366004614cec565b611114565b34801561050157600080fd5b5061033c610510366004615033565b61122f565b34801561052157600080fd5b50610195546103049064010000000090046001600160a01b031681565b61033c61054c366004614ab6565b61136a565b34801561055d57600080fd5b50610195546102ad90610100900460ff1681565b34801561057d57600080fd5b506103757fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba81565b3480156105b157600080fd5b506102d76105c0366004614cec565b611424565b3480156105d157600080fd5b506103046105e0366004614cec565b6114bf565b3480156105f157600080fd5b5061033c610600366004614c4d565b611536565b34801561061157600080fd5b50610195546102ad9062010000900460ff1681565b34801561063257600080fd5b5061033c610641366004614b01565b611728565b34801561065257600080fd5b50610375610661366004614994565b611a57565b34801561067257600080fd5b5061019754610304906001600160a01b031681565b34801561069357600080fd5b5061033c6106a2366004614b01565b611ade565b3480156106b357600080fd5b5061033c6106c2366004614d7f565b611b8e565b3480156106d357600080fd5b5061033c6106e2366004614df0565b61215b565b3480156106f357600080fd5b50610304610702366004614d26565b6122ce565b34801561071357600080fd5b506102ad610722366004614d04565b6122ed565b34801561073357600080fd5b5061033c610742366004615033565b612318565b34801561075357600080fd5b506102d761247a565b34801561076857600080fd5b50610375600081565b34801561077d57600080fd5b5061033c61078c366004614a80565b612489565b34801561079d57600080fd5b5061033c6107ac366004614a1b565b61254e565b3480156107bd57600080fd5b50610195546102ad9060ff1681565b3480156107d857600080fd5b506103756107e7366004614dbe565b80516020818301810180516101928252928201919093012091525481565b34801561081157600080fd5b506102d7610820366004614cec565b6125a5565b34801561083157600080fd5b50610375610840366004614cec565b6125b0565b34801561085157600080fd5b5061033c610860366004614d04565b6125c7565b34801561087157600080fd5b506102ad6108803660046149ae565b6001600160a01b03918216600090815260ce6020908152604080832093909416825291909152205460ff1690565b3480156108ba57600080fd5b5061019954610304906001600160a01b031681565b3480156108db57600080fd5b5061037560008051602061572983398151915281565b3480156108fd57600080fd5b506102d76125d1565b34801561091257600080fd5b506103756101985481565b6000610928826125df565b92915050565b606060c9805461093d90615631565b80601f016020809104026020016040519081016040528092919081815260200182805461096990615631565b80156109b65780601f1061098b576101008083540402835291602001916109b6565b820191906000526020600020905b81548152906001019060200180831161099957829003601f168201915b5050505050905090565b60006109cb8261261f565b610a315760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b50600090815260cd60205260409020546001600160a01b031690565b6000610a58826114bf565b9050806001600160a01b0316836001600160a01b03161415610ac65760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a28565b336001600160a01b0382161480610ae25750610ae28133610880565b610b545760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a28565b610b5e838361263c565b505050565b6101955460ff16610bd25760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a204c617a79207265676973746044820152723930ba34b7b71034b9903234b9b0b13632b21760691b6064820152608401610a28565b610bdb876126aa565b610bf75760405162461bcd60e51b8152600401610a2890615466565b6101955462010000900460ff1615610c8a5760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206368616e6760448201527f6573206d7573742062652064697361626c656420666f72206c617a792072656760648201526934b9ba3930ba34b7b71760b11b608482015260a401610a28565b84610cf35760405162461bcd60e51b815260206004820152603360248201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c206669656c646044820152721036bab9ba103737ba10313290313630b7359760691b6064820152608401610a28565b610d3286868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061274792505050565b15610da55760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20526567697374726174696f60448201527f6e206c6162656c20616c7265616479206578697374732e0000000000000000006064820152608401610a28565b336001600160a01b03881614610e135760405162461bcd60e51b815260206004820152602d60248201527f4e6f6e46756e6769626c6552656769737472793a2043616c6c6572206973206e60448201526c37ba103932b1b4b834b2b73a1760991b6064820152608401610a28565b610ebb8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061277292505050565b610f175760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a207369676e6174757265206660448201526630b4b63ab9329760c91b6064820152608401610a28565b610f8b8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8b01819004810282018101909252898152925089915088908190840183828082843760009201919091525061281792505050565b5050505050505050565b610fa0335b826128a6565b610fbc5760405162461bcd60e51b8152600401610a289061534e565b610fc5826126aa565b610fe15760405162461bcd60e51b8152600401610a2890615466565b610b5e8383836129a6565b610ff68282612b51565b6000828152609760205260409020610b5e9082612b77565b6110188282612b8c565b6000828152609760205260409020610b5e9082612c06565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156110795760405162461bcd60e51b8152600401610a2890615268565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166110ab612c1b565b6001600160a01b0316146110d15760405162461bcd60e51b8152600401610a28906152b4565b6110da81612c49565b604080516000808252602082019092526110f691839190612c62565b50565b610b5e8383836040518060200160405280600081525061254e565b61111d33610f9a565b6111395760405162461bcd60e51b8152600401610a289061534e565b61114281612da6565b60008181526101946020526040902060010154156110f657600081815261019460205260409020546001600160a01b031663a9059cbb33600084815261019460205260409081902060010154905160e084901b6001600160e01b03191681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156111d357600080fd5b505af11580156111e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061120b9190614cd0565b5060009081526101946020526040812080546001600160a01b031916815560010155565b611237612e8b565b61129e5760405162461bcd60e51b815260206004820152603260248201527f4e6f6e46756e6769626c6552656769737472793a2053746f726167652075706460448201527130ba34b7339034b9903234b9b0b13632b21760711b6064820152608401610a28565b6112a9335b846128a6565b6112c55760405162461bcd60e51b8152600401610a289061534e565b6113058383838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612ebd92505050565b7f2f0b1fafb1d28d13e045afb299578515ce12beeff8ee8ca9c6a32f18be41f0f483838360405160200161133a929190615112565b60408051601f198184030181528282528051602091820120938352820192909252015b60405180910390a1505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156113b35760405162461bcd60e51b8152600401610a2890615268565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166113e5612c1b565b6001600160a01b03161461140b5760405162461bcd60e51b8152600401610a28906152b4565b61141482612c49565b61142082826001612c62565b5050565b610193602052600090815260409020805461143e90615631565b80601f016020809104026020016040519081016040528092919081815260200182805461146a90615631565b80156114b75780601f1061148c576101008083540402835291602001916114b7565b820191906000526020600020905b81548152906001019060200180831161149a57829003601f168201915b505050505081565b600081815260cb60205260408120546001600160a01b0316806109285760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a28565b61154e600080516020615729833981519152336122ed565b61156a5760405162461bcd60e51b8152600401610a28906153b8565b81518351146115f45760405162461bcd60e51b815260206004820152604a60248201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74732060448201527f6172726179206d7573742062652073616d65206c656e677468206173206c616260648201526932b6399030b93930bc9760b11b608482015260a401610a28565b81518151146116855760405162461bcd60e51b815260206004820152605160248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e4461746173206172726179206d7573742062652073616d65206c656e6774686064820152701030b9903630b132b6399030b93930bc9760791b608482015260a401610a28565b60005b8351811015611722576117118482815181106116b457634e487b7160e01b600052603260045260246000fd5b60200260200101518483815181106116dc57634e487b7160e01b600052603260045260246000fd5b602002602001015184848151811061170457634e487b7160e01b600052603260045260246000fd5b6020026020010151612817565b5061171b8161566c565b9050611688565b50505050565b6101955464010000000090046001600160a01b03166117af5760405162461bcd60e51b815260206004820152603760248201527f4e6f6e46756e6769626c6552656769737472793a20726567697374726174696f60448201527f6e20627920746f6b656e206e6f7420656e61626c65642e0000000000000000006064820152608401610a28565b6117ee84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061274792505050565b1561180b5760405162461bcd60e51b8152600401610a2890615415565b6101955464010000000090046001600160a01b03166323b872dd33610196546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301523060248301526044820152606401602060405180830381600087803b15801561187657600080fd5b505af115801561188a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118ae9190614cd0565b5060006119258686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a01819004810282018101909252888152925088915087908190840183828082843760009201919091525061281792505050565b90506000612710610198546101965461193e91906155b8565b61194891906155a4565b610195546101975460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101849052929350640100000000909104169063a9059cbb90604401602060405180830381600087803b1580156119a557600080fd5b505af11580156119b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119dd9190614cd0565b50604080518082019091526101955464010000000090046001600160a01b03168152610196546020820190611a139084906155d7565b9052600092835261019460209081526040909320815181546001600160a01b0319166001600160a01b03909116178155920151600190920191909155505050505050565b60006001600160a01b038216611ac25760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a28565b506001600160a01b0316600090815260cc602052604090205490565b611af6600080516020615729833981519152336122ed565b611b125760405162461bcd60e51b8152600401610a28906153b8565b611b868585858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8901819004810282018101909252878152925087915086908190840183828082843760009201919091525061281792505050565b505050505050565b611ba6600080516020615729833981519152336122ed565b611c025760405162461bcd60e51b815260206004820152602760248201527f4e6f6e46756e6769626c6552656769737472793a206d7573742062652072656760448201526634b9ba3930b91760c91b6064820152608401610a28565b6000611c1082840184614e71565b80515190915015611c5c5780518051600090611c3c57634e487b7160e01b600052603260045260246000fd5b60200260200101516101919080519060200190611c5a9291906145d4565b505b60208101515115611caf578060200151600081518110611c8c57634e487b7160e01b600052603260045260246000fd5b602002602001015161019560006101000a81548160ff0219169083151502179055505b60408101515115611d02578060400151600081518110611cdf57634e487b7160e01b600052603260045260246000fd5b602002602001015161019560016101000a81548160ff0219169083151502179055505b60608101515115611d55578060600151600081518110611d3257634e487b7160e01b600052603260045260246000fd5b602002602001015161019560026101000a81548160ff0219169083151502179055505b60808101515115611da8578060800151600081518110611d8557634e487b7160e01b600052603260045260246000fd5b602002602001015161019560036101000a81548160ff0219169083151502179055505b60a08101515115611e08578060a00151600081518110611dd857634e487b7160e01b600052603260045260246000fd5b602002602001015161019560046101000a8154816001600160a01b0302191690836001600160a01b031602179055505b60c08101515115611e48578060c00151600081518110611e3857634e487b7160e01b600052603260045260246000fd5b6020026020010151610196819055505b60e08101515115611ea8578060e00151600081518110611e7857634e487b7160e01b600052603260045260246000fd5b602002602001015161019760006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b6101008101515115611fd357612710816101000151600081518110611edd57634e487b7160e01b600052603260045260246000fd5b602002602001015111158015611f2157506000816101000151600081518110611f1657634e487b7160e01b600052603260045260246000fd5b602002602001015110155b611f9d5760405162461bcd60e51b815260206004820152604160248201527f4e6f6e46756e6769626c6552656769737472793a206275726e466565206d757360448201527f74206265206765207468616e203020616e64206c65207468616e2031303030306064820152601760f91b608482015260a401610a28565b806101000151600081518110611fc357634e487b7160e01b600052603260045260246000fd5b6020026020010151610198819055505b6101208101515115610b5e5780610120015160008151811061200557634e487b7160e01b600052603260045260246000fd5b60209081029190910101516040516301ffc9a760e01b81526380ac58cd60e01b60048201526001600160a01b03909116906301ffc9a79060240160206040518083038186803b15801561205757600080fd5b505afa15801561206b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061208f9190614cd0565b6121015760405162461bcd60e51b815260206004820152603f60248201527f4e6f6e46756e6769626c6552656769737472793a204164647265737320646f6560448201527f73206e6f7420737570706f72742045524337323120696e746572666163652e006064820152608401610a28565b80610120015160008151811061212757634e487b7160e01b600052603260045260246000fd5b602002602001015161019960006101000a8154816001600160a01b0302191690836001600160a01b03160217905550505050565b600054610100900460ff1680612174575060005460ff16155b6121905760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff161580156121b2576000805461ffff19166101011790555b6121ba612f48565b6121c2612fbb565b6121ca61302a565b6121d2613088565b6121dc85856130e6565b6121e760008361316d565b6121ff6000805160206157298339815191528461316d565b6122376000805160206157298339815191527fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba613177565b6122617fab17982698983e428c1b3359c794bb98c356bd485b8da9b6bffc27745eece3ba8461316d565b61019580546001600160c01b0319166301000100179055670de0b6b3a76400006101965561019780546001600160a01b0384166001600160a01b0319918216179091556101f4610198556101998054909116905580156122c7576000805461ff00191690555b5050505050565b60008281526097602052604081206122e690836131c2565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6123206131ce565b6123855760405162461bcd60e51b815260206004820152603060248201527f4e6f6e46756e6769626c6552656769737472793a204c6162656c20757064617460448201526f34b7339034b9903234b9b0b13632b21760811b6064820152608401610a28565b61238e336112a3565b6123aa5760405162461bcd60e51b8152600401610a289061534e565b6123e982828080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061274792505050565b156124065760405162461bcd60e51b8152600401610a2890615415565b82610192838360405161241a929190615112565b908152604080516020928190038301902092909255600085815261019390915220612446908383614658565b507fec8103a13d35079ee852a6e0f70658be4c82016236869c5283833b6721454b2c83838360405161135d939291906154da565b606060ca805461093d90615631565b6001600160a01b0382163314156124e25760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a28565b33600081815260ce602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61255833836128a6565b6125745760405162461bcd60e51b8152600401610a289061534e565b61257d836126aa565b6125995760405162461bcd60e51b8152600401610a2890615466565b611722848484846131fc565b60606109288261322f565b60008181526097602052604081206109289061339e565b61101882826133a8565b610191805461143e90615631565b60006001600160e01b031982166380ac58cd60e01b148061261057506001600160e01b03198216635b5e139f60e01b145b806109285750610928826133ce565b600090815260cb60205260409020546001600160a01b0316151590565b600081815260cd6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190612671826114bf565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b610199546000906001600160a01b031615806109285750610199546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b15801561270857600080fd5b505afa15801561271c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612740919061501b565b1192915050565b60006101928260405161275a91906150f6565b90815260405190819003602001902054151592915050565b6000806127ed86868660405160200161278d939291906150a8565b60408051601f1981840301815282825280516020918201207f19457468657265756d205369676e6564204d6573736167653a0a33320000000084830152603c8085019190915282518085039091018152605c909301909152815191012090565b905061280b60008051602061572983398151915261072283866133f3565b9150505b949350505050565b81516000901561289c5761282a83612747565b156128475760405162461bcd60e51b8152600401610a2890615415565b6128518483613417565b9050806101928460405161286591906150f6565b90815260408051602092819003830190209290925560008381526101938252919091208451612896928601906145d4565b506122e6565b61280f8483613417565b60006128b18261261f565b6129125760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a28565b600061291d836114bf565b9050806001600160a01b0316846001600160a01b031614806129585750836001600160a01b031661294d846109c0565b6001600160a01b0316145b8061298857506001600160a01b03808216600090815260ce602090815260408083209388168352929052205460ff165b8061280f575061280f600080516020615729833981519152856122ed565b826001600160a01b03166129b9826114bf565b6001600160a01b031614612a215760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a28565b6001600160a01b038216612a835760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a28565b612a8e838383613472565b612a9960008261263c565b6001600160a01b038316600090815260cc60205260408120805460019290612ac29084906155d7565b90915550506001600160a01b038216600090815260cc60205260408120805460019290612af090849061558c565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600082815260656020526040902060010154612b6d81336134db565b610b5e838361353f565b60006122e6836001600160a01b0384166135c5565b6001600160a01b0381163314612bfc5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610a28565b6114208282613614565b60006122e6836001600160a01b03841661367b565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b60008051602061572983398151915261142081336134db565b6000612c6c612c1b565b9050612c7784613798565b600083511180612c845750815b15612c9557612c93848461383d565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff166122c757805460ff191660011781556040516001600160a01b0383166024820152612d1490869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b17905261383d565b50805460ff19168155612d25612c1b565b6001600160a01b0316826001600160a01b031614612d9d5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610a28565b6122c785613928565b612daf81613968565b6000818152610193602052604081208054612dc990615631565b80601f0160208091040260200160405190810160405280929190818152602001828054612df590615631565b8015612e425780601f10612e1757610100808354040283529160200191612e42565b820191906000526020600020905b815481529060010190602001808311612e2557829003601f168201915b505050600085815261019360205260408120939450612e6493925090506146cc565b61019281604051612e7591906150f6565b9081526020016040518091039020600090555050565b61019554600090610100900460ff1680612eb85750612eb8600080516020615729833981519152336122ed565b905090565b612ec68261261f565b612f295760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a28565b600082815260fb602090815260409091208251610b5e928401906145d4565b600054610100900460ff1680612f61575060005460ff16155b612f7d5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015612f9f576000805461ffff19166101011790555b612fa76139a8565b80156110f6576000805461ff001916905550565b600054610100900460ff1680612fd4575060005460ff16155b612ff05760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015613012576000805461ffff19166101011790555b61301a6139a8565b6130226139a8565b612f9f6139a8565b600054610100900460ff1680613043575060005460ff16155b61305f5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff1615801561301a576000805461ffff19166101011790556130226139a8565b600054610100900460ff16806130a1575060005460ff16155b6130bd5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015613022576000805461ffff1916610101179055612f9f6139a8565b600054610100900460ff16806130ff575060005460ff16155b61311b5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff1615801561313d576000805461ffff19166101011790555b6131456139a8565b61314d6139a8565b6131578383613a12565b8015610b5e576000805461ff0019169055505050565b610ff68282613aa7565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006122e68383613ab1565b6101955460009062010000900460ff1680612eb85750612eb8600080516020615729833981519152336122ed565b6132078484846129a6565b61321384848484613ae9565b6117225760405162461bcd60e51b8152600401610a2890615216565b606061323a8261261f565b6132a05760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b6064820152608401610a28565b600082815260fb6020526040812080546132b990615631565b80601f01602080910402602001604051908101604052809291908181526020018280546132e590615631565b80156133325780601f1061330757610100808354040283529160200191613332565b820191906000526020600020905b81548152906001019060200180831161331557829003601f168201915b50505050509050600061335060408051602081019091526000815290565b9050805160001415613363575092915050565b81511561339557808260405160200161337d929190615122565b60405160208183030381529060405292505050919050565b61280f84613bf3565b6000610928825490565b6000828152606560205260409020600101546133c481336134db565b610b5e8383613614565b60006001600160e01b03198216635a05180f60e01b1480610928575061092882613cca565b60008060006134028585613cff565b9150915061340f81613d6f565b509392505050565b6000613422836126aa565b61343e5760405162461bcd60e51b8152600401610a2890615466565b61019a5461344d90600161558c565b90506134598382613f70565b61346861019a80546001019055565b6109288183612ebd565b61347a6140af565b610b5e5760405162461bcd60e51b815260206004820152602c60248201527f4e6f6e46756e6769626c6552656769737472793a207472616e7366657273206160448201526b3932903234b9b0b13632b21760a11b6064820152608401610a28565b6134e582826122ed565b611420576134fd816001600160a01b031660146140de565b6135088360206140de565b604051602001613519929190615151565b60408051601f198184030181529082905262461bcd60e51b8252610a2891600401615203565b61354982826122ed565b6114205760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556135813390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600081815260018301602052604081205461360c57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610928565b506000610928565b61361e82826122ed565b156114205760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000818152600183016020526040812054801561378e57600061369f6001836155d7565b85549091506000906136b3906001906155d7565b90508181146137345760008660000182815481106136e157634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061371257634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061375357634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610928565b6000915050610928565b803b6137fc5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610a28565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b61389c5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610a28565b600080846001600160a01b0316846040516138b791906150f6565b600060405180830381855af49150503d80600081146138f2576040519150601f19603f3d011682016040523d82523d6000602084013e6138f7565b606091505b509150915061391f8282604051806060016040528060278152602001615702602791396142bf565b95945050505050565b61393181613798565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b613971816142f8565b600081815260fb60205260409020805461398a90615631565b1590506110f657600081815260fb602052604081206110f6916146cc565b600054610100900460ff16806139c1575060005460ff16155b6139dd5760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015612fa7576000805461ffff191661010117905580156110f6576000805461ff001916905550565b600054610100900460ff1680613a2b575060005460ff16155b613a475760405162461bcd60e51b8152600401610a2890615300565b600054610100900460ff16158015613a69576000805461ffff19166101011790555b8251613a7c9060c99060208601906145d4565b508151613a909060ca9060208501906145d4565b508015610b5e576000805461ff0019169055505050565b611420828261353f565b6000826000018281548110613ad657634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b60006001600160a01b0384163b15613beb57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613b2d9033908990889088906004016151c6565b602060405180830381600087803b158015613b4757600080fd5b505af1925050508015613b77575060408051601f3d908101601f19168201909252613b7491810190614d63565b60015b613bd1573d808015613ba5576040519150601f19603f3d011682016040523d82523d6000602084013e613baa565b606091505b508051613bc95760405162461bcd60e51b8152600401610a2890615216565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061280f565b50600161280f565b6060613bfe8261261f565b613c625760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a28565b6000613c7960408051602081019091526000815290565b90506000815111613c9957604051806020016040528060008152506122e6565b80613ca38461439f565b604051602001613cb4929190615122565b6040516020818303038152906040529392505050565b60006001600160e01b03198216637965db0b60e01b148061092857506301ffc9a760e01b6001600160e01b0319831614610928565b600080825160411415613d365760208301516040840151606085015160001a613d2a878285856144b8565b94509450505050613d68565b825160401415613d605760208301516040840151613d558683836145a5565b935093505050613d68565b506000905060025b9250929050565b6000816004811115613d9157634e487b7160e01b600052602160045260246000fd5b1415613d9a5750565b6001816004811115613dbc57634e487b7160e01b600052602160045260246000fd5b1415613e0a5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a28565b6002816004811115613e2c57634e487b7160e01b600052602160045260246000fd5b1415613e7a5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a28565b6003816004811115613e9c57634e487b7160e01b600052602160045260246000fd5b1415613ef55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a28565b6004816004811115613f1757634e487b7160e01b600052602160045260246000fd5b14156110f65760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a28565b6001600160a01b038216613fc65760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a28565b613fcf8161261f565b1561401c5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a28565b61402860008383613472565b6001600160a01b038216600090815260cc6020526040812080546001929061405190849061558c565b9091555050600081815260cb602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b610195546000906301000000900460ff1680612eb85750612eb8600080516020615729833981519152336122ed565b606060006140ed8360026155b8565b6140f890600261558c565b6001600160401b0381111561411d57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015614147576020820181803683370190505b509050600360fc1b8160008151811061417057634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106141ad57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006141d18460026155b8565b6141dc90600161558c565b90505b6001811115614270576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061421e57634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061424257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936142698161561a565b90506141df565b5083156122e65760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610a28565b606083156142ce5750816122e6565b8251156142de5782518084602001fd5b8160405162461bcd60e51b8152600401610a289190615203565b6000614303826114bf565b905061431181600084613472565b61431c60008361263c565b6001600160a01b038116600090815260cc602052604081208054600192906143459084906155d7565b9091555050600082815260cb602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6060816143c35750506040805180820190915260018152600360fc1b602082015290565b8160005b81156143ed57806143d78161566c565b91506143e69050600a836155a4565b91506143c7565b6000816001600160401b0381111561441557634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f19166020018201604052801561443f576020820181803683370190505b5090505b841561280f576144546001836155d7565b9150614461600a86615687565b61446c90603061558c565b60f81b81838151811061448f57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506144b1600a866155a4565b9450614443565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156144ef575060009050600361459c565b8460ff16601b1415801561450757508460ff16601c14155b15614518575060009050600461459c565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561456c573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166145955760006001925092505061459c565b9150600090505b94509492505050565b6000806001600160ff1b03831660ff84901c601b016145c6878288856144b8565b935093505050935093915050565b8280546145e090615631565b90600052602060002090601f0160209004810192826146025760008555614648565b82601f1061461b57805160ff1916838001178555614648565b82800160010185558215614648579182015b8281111561464857825182559160200191906001019061462d565b50614654929150614702565b5090565b82805461466490615631565b90600052602060002090601f0160209004810192826146865760008555614648565b82601f1061469f5782800160ff19823516178555614648565b82800160010185558215614648579182015b828111156146485782358255916020019190600101906146b1565b5080546146d890615631565b6000825580601f106146e8575050565b601f0160209004906000526020600020908101906110f691905b5b808211156146545760008155600101614703565b80356001600160a01b038116811461472e57600080fd5b919050565b600082601f830112614743578081fd5b8135602061475861475383615569565b615539565b80838252828201915082860187848660051b8901011115614777578586fd5b855b8581101561479c5761478a82614717565b84529284019290840190600101614779565b5090979650505050505050565b600082601f8301126147b9578081fd5b813560206147c961475383615569565b80838252828201915082860187848660051b89010111156147e8578586fd5b855b8581101561479c5781356147fd816156dd565b845292840192908401906001016147ea565b600082601f83011261481f578081fd5b8135602061482f61475383615569565b80838252828201915082860187848660051b890101111561484e578586fd5b855b8581101561479c5781356001600160401b0381111561486d578788fd5b61487b8a87838c010161492a565b8552509284019290840190600101614850565b600082601f83011261489e578081fd5b813560206148ae61475383615569565b80838252828201915082860187848660051b89010111156148cd578586fd5b855b8581101561479c578135845292840192908401906001016148cf565b60008083601f8401126148fc578182fd5b5081356001600160401b03811115614912578182fd5b602083019150836020828501011115613d6857600080fd5b600082601f83011261493a578081fd5b81356001600160401b03811115614953576149536156c7565b614966601f8201601f1916602001615539565b81815284602083860101111561497a578283fd5b816020850160208301379081016020019190915292915050565b6000602082840312156149a5578081fd5b6122e682614717565b600080604083850312156149c0578081fd5b6149c983614717565b91506149d760208401614717565b90509250929050565b6000806000606084860312156149f4578081fd5b6149fd84614717565b9250614a0b60208501614717565b9150604084013590509250925092565b60008060008060808587031215614a30578182fd5b614a3985614717565b9350614a4760208601614717565b92506040850135915060608501356001600160401b03811115614a68578182fd5b614a748782880161492a565b91505092959194509250565b60008060408385031215614a92578182fd5b614a9b83614717565b91506020830135614aab816156dd565b809150509250929050565b60008060408385031215614ac8578182fd5b614ad183614717565b915060208301356001600160401b03811115614aeb578182fd5b614af78582860161492a565b9150509250929050565b600080600080600060608688031215614b18578283fd5b614b2186614717565b945060208601356001600160401b0380821115614b3c578485fd5b614b4889838a016148eb565b90965094506040880135915080821115614b60578283fd5b50614b6d888289016148eb565b969995985093965092949392505050565b60008060008060008060006080888a031215614b98578485fd5b614ba188614717565b965060208801356001600160401b0380821115614bbc578687fd5b614bc88b838c016148eb565b909850965060408a0135915080821115614be0578384fd5b614bec8b838c016148eb565b909650945060608a0135915080821115614c04578384fd5b50614c118a828b016148eb565b989b979a50959850939692959293505050565b60008060408385031215614c36578182fd5b614c3f83614717565b946020939093013593505050565b600080600060608486031215614c61578081fd5b83356001600160401b0380821115614c77578283fd5b614c8387838801614733565b94506020860135915080821115614c98578283fd5b614ca48783880161480f565b93506040860135915080821115614cb9578283fd5b50614cc68682870161480f565b9150509250925092565b600060208284031215614ce1578081fd5b81516122e6816156dd565b600060208284031215614cfd578081fd5b5035919050565b60008060408385031215614d16578182fd5b823591506149d760208401614717565b60008060408385031215614d38578182fd5b50508035926020909101359150565b600060208284031215614d58578081fd5b81356122e6816156eb565b600060208284031215614d74578081fd5b81516122e6816156eb565b60008060208385031215614d91578182fd5b82356001600160401b03811115614da6578283fd5b614db2858286016148eb565b90969095509350505050565b600060208284031215614dcf578081fd5b81356001600160401b03811115614de4578182fd5b61280f8482850161492a565b60008060008060808587031215614e05578182fd5b84356001600160401b0380821115614e1b578384fd5b614e278883890161492a565b95506020870135915080821115614e3c578384fd5b50614e498782880161492a565b935050614e5860408601614717565b9150614e6660608601614717565b905092959194509250565b600060208284031215614e82578081fd5b81356001600160401b0380821115614e98578283fd5b908301906101408286031215614eac578283fd5b614eb4615510565b823582811115614ec2578485fd5b614ece8782860161480f565b825250602083013582811115614ee2578485fd5b614eee878286016147a9565b602083015250604083013582811115614f05578485fd5b614f11878286016147a9565b604083015250606083013582811115614f28578485fd5b614f34878286016147a9565b606083015250608083013582811115614f4b578485fd5b614f57878286016147a9565b60808301525060a083013582811115614f6e578485fd5b614f7a87828601614733565b60a08301525060c083013582811115614f91578485fd5b614f9d8782860161488e565b60c08301525060e083013582811115614fb4578485fd5b614fc087828601614733565b60e0830152506101008084013583811115614fd9578586fd5b614fe58882870161488e565b8284015250506101208084013583811115614ffe578586fd5b61500a88828701614733565b918301919091525095945050505050565b60006020828403121561502c578081fd5b5051919050565b600080600060408486031215615047578081fd5b8335925060208401356001600160401b03811115615063578182fd5b61506f868287016148eb565b9497909650939450505050565b600081518084526150948160208601602086016155ee565b601f01601f19169290920160200192915050565b6bffffffffffffffffffffffff198460601b168152600083516150d28160148501602088016155ee565b8351908301906150e98160148401602088016155ee565b0160140195945050505050565b600082516151088184602087016155ee565b9190910192915050565b8183823760009101908152919050565b600083516151348184602088016155ee565b8351908301906151488183602088016155ee565b01949350505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516151898160178501602088016155ee565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516151ba8160288401602088016155ee565b01602801949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906151f99083018461507c565b9695505050505050565b6020815260006122e6602083018461507c565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526044908201527f4e6f6e46756e6769626c6552656769737472793a2063616c6c6572206973206e60408201527f6f74206f776e6572206e6f7220617070726f766564206e6f72207265676973746060820152633930b91760e11b608082015260a00190565b6020808252603a908201527f4e6f6e46756e6769626c6552656769737472793a206d7573742068617665207260408201527f656769737472617220726f6c6520746f2072656769737465722e000000000000606082015260800190565b60208082526031908201527f4e6f6e46756e6769626c6552656769737472793a206c6162656c20697320616c6040820152703932b0b23c903932b3b4b9ba32b932b21760791b606082015260800190565b6020808252604e908201527f4e6f6e46756e6769626c6552656769737472793a20726563697069656e74206d60408201527f7573742068617665206e6f6e2d7a65726f2062616c616e636520696e2070726960608201526d36b0b93c903932b3b4b9ba393c9760911b608082015260a00190565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b60405161014081016001600160401b0381118282101715615533576155336156c7565b60405290565b604051601f8201601f191681016001600160401b0381118282101715615561576155616156c7565b604052919050565b60006001600160401b03821115615582576155826156c7565b5060051b60200190565b6000821982111561559f5761559f61569b565b500190565b6000826155b3576155b36156b1565b500490565b60008160001904831182151516156155d2576155d261569b565b500290565b6000828210156155e9576155e961569b565b500390565b60005b838110156156095781810151838201526020016155f1565b838111156117225750506000910152565b6000816156295761562961569b565b506000190190565b600181811c9082168061564557607f821691505b6020821081141561566657634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156156805761568061569b565b5060010190565b600082615696576156966156b1565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b80151581146110f657600080fd5b6001600160e01b0319811681146110f657600080fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564edcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c309238a2646970667358221220193e90fe04a45628acd2113ed8c013db3b12563a9bd2e40e84275b1a2e36b9a964736f6c63430008040033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}
