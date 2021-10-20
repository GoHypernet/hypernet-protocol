export default {
  _format: "hh-sol-artifact-1",
  contractName: "HypernetGovernor",
  sourceName: "contracts/governance/HypernetGovernor.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "contract ERC20Votes",
          name: "_token",
          type: "address",
        },
        {
          internalType: "contract TimelockController",
          name: "_timelock",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "ProposalCanceled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "proposer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "string[]",
          name: "signatures",
          type: "string[]",
        },
        {
          indexed: false,
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "startBlock",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endBlock",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string",
        },
      ],
      name: "ProposalCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "ProposalExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "eta",
          type: "uint256",
        },
      ],
      name: "ProposalQueued",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldQuorumNumerator",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newQuorumNumerator",
          type: "uint256",
        },
      ],
      name: "QuorumNumeratorUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldTimelock",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newTimelock",
          type: "address",
        },
      ],
      name: "TimelockChange",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "support",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "weight",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "VoteCast",
      type: "event",
    },
    {
      inputs: [],
      name: "BALLOT_TYPEHASH",
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
      name: "COUNTING_MODE",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "_proposalIdTracker",
      outputs: [
        {
          internalType: "uint256",
          name: "_value",
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
          name: "",
          type: "uint256",
        },
      ],
      name: "_proposalMap",
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
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "cancel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "support",
          type: "uint8",
        },
      ],
      name: "castVote",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "support",
          type: "uint8",
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "castVoteBySig",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "support",
          type: "uint8",
        },
        {
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "castVoteWithReason",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "bytes32",
          name: "descriptionHash",
          type: "bytes32",
        },
      ],
      name: "execute",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "execute",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "getActions",
      outputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "string[]",
          name: "signatures",
          type: "string[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "voter",
          type: "address",
        },
      ],
      name: "getReceipt",
      outputs: [
        {
          components: [
            {
              internalType: "bool",
              name: "hasVoted",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "support",
              type: "uint8",
            },
            {
              internalType: "uint96",
              name: "votes",
              type: "uint96",
            },
          ],
          internalType: "struct IGovernorCompatibilityBravo.Receipt",
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
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "blockNumber",
          type: "uint256",
        },
      ],
      name: "getVotes",
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
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasVoted",
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
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "bytes32",
          name: "descriptionHash",
          type: "bytes32",
        },
      ],
      name: "hashProposal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
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
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "proposalDeadline",
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
          name: "",
          type: "uint256",
        },
      ],
      name: "proposalDescriptions",
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
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "proposalEta",
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
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "proposalSnapshot",
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
      name: "proposalThreshold",
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
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "proposals",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "proposer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "eta",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "startBlock",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endBlock",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "forVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "againstVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "abstainVotes",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "canceled",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "executed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
      ],
      name: "propose",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "string[]",
          name: "signatures",
          type: "string[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
      ],
      name: "propose",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "bytes32",
          name: "descriptionHash",
          type: "bytes32",
        },
      ],
      name: "queue",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "queue",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "blockNumber",
          type: "uint256",
        },
      ],
      name: "quorum",
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
      name: "quorumDenominator",
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
      name: "quorumNumerator",
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
      name: "quorumVotes",
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
          name: "newProposalThreshold",
          type: "uint256",
        },
      ],
      name: "setProposalThreshold",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newVotingDelay",
          type: "uint256",
        },
      ],
      name: "setVotingDelay",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newVotingPeriod",
          type: "uint256",
        },
      ],
      name: "setVotingPeriod",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "state",
      outputs: [
        {
          internalType: "enum IGovernor.ProposalState",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
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
      name: "timelock",
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
      name: "token",
      outputs: [
        {
          internalType: "contract ERC20Votes",
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
          internalType: "uint256",
          name: "newQuorumNumerator",
          type: "uint256",
        },
      ],
      name: "updateQuorumNumerator",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract TimelockController",
          name: "newTimelock",
          type: "address",
        },
      ],
      name: "updateTimelock",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
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
      name: "votingDelay",
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
      name: "votingPeriod",
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
  ],
  bytecode:
    "0x61014060405260016009556014600a5569d3c21bcecceda1000000600b553480156200002a57600080fd5b50604051620045c9380380620045c98339810160408190526200004d916200034f565b806004836040518060400160405280601081526020016f243cb832b93732ba23b7bb32b93737b960811b815250806200008b6200015860201b60201c565b815160209283012081519183019190912060c082815260e08290524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810195909552608080860193909352308583015280518086039092018252939092019092528051908401209052610100528151620001259160009190840190620002a9565b505060601b6001600160601b03191661012052620001438162000173565b506200014f8162000240565b505050620003e3565b6040805180820190915260018152603160f81b602082015290565b6064811115620001fb5760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a40160405180910390fd5b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b828054620002b7906200038d565b90600052602060002090601f016020900481019282620002db576000855562000326565b82601f10620002f657805160ff191683800117855562000326565b8280016001018555821562000326579182015b828111156200032657825182559160200191906001019062000309565b506200033492915062000338565b5090565b5b8082111562000334576000815560010162000339565b6000806040838503121562000362578182fd5b82516200036f81620003ca565b60208401519092506200038281620003ca565b809150509250929050565b600181811c90821680620003a257607f821691505b60208210811415620003c457634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b0381168114620003e057600080fd5b50565b60805160a05160c05160e051610100516101205160601c61418562000444600039600081816108dc0152818161243301526124cc01526000612660015260006126af0152600061268a0152600061260e0152600061263701526141856000f3fe6080604052600436106102515760003560e01c80638059f7e111610139578063dc45c5c1116100b6578063ea0217cf1161007a578063ea0217cf1461084a578063eb9019d41461086a578063ece40cc11461088a578063f8ce560a146108aa578063fc0c546a146108ca578063fe0d94c1146108fe57600080fd5b8063dc45c5c1146106c6578063dd4e2ba5146106e6578063ddf0b0091461072c578063deaaa7cc1461074c578063e23a9a521461078057600080fd5b8063b58131b0116100fd578063b58131b01461061f578063c01f9e3714610634578063c59057e414610654578063d33219b414610674578063da95691a146106a657600080fd5b80638059f7e11461059f57806397c3d334146105b6578063a7713a70146105ca578063a890c910146105df578063ab58fb8e146105ff57600080fd5b80633932abb1116101d257806354fd4d501161019657806354fd4d50146104c857806356781388146104f25780635aeb927e1461051257806370b0f6601461053f5780637b3c71d31461055f5780637d5e81e21461057f57600080fd5b80633932abb1146103fc5780633bccf4fd146104115780633e4f49e61461043157806340e58ee51461045e578063438596321461047e57600080fd5b8063160cbed711610219578063160cbed71461036457806324bc1a64146103845780632656227d146103995780632d63f693146103ac578063328dd982146103cc57600080fd5b8063013cf08b1461025657806301ffc9a7146102d157806302a251a31461030157806306f3f9e61461032057806306fdde0314610342575b600080fd5b34801561026257600080fd5b50610276610271366004613a57565b610911565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b3480156102dd57600080fd5b506102f16102ec366004613a13565b6109d6565b60405190151581526020016102c8565b34801561030d57600080fd5b50600a545b6040519081526020016102c8565b34801561032c57600080fd5b5061034061033b366004613a57565b6109e7565b005b34801561034e57600080fd5b50610357610a34565b6040516102c89190613de3565b34801561037057600080fd5b5061031261037f3660046137de565b610ac6565b34801561039057600080fd5b50610312610cfd565b6103126103a73660046137de565b610d12565b3480156103b857600080fd5b506103126103c7366004613a57565b610e01565b3480156103d857600080fd5b506103ec6103e7366004613a57565b610e38565b6040516102c89493929190613d96565b34801561040857600080fd5b50600954610312565b34801561041d57600080fd5b5061031261042c366004613b4a565b6110c9565b34801561043d57600080fd5b5061045161044c366004613a57565b61115d565b6040516102c89190613df6565b34801561046a57600080fd5b50610340610479366004613a57565b611168565b34801561048a57600080fd5b506102f1610499366004613a6f565b60008281526002602090815260408083206001600160a01b038516845260080190915290205460ff1692915050565b3480156104d457600080fd5b506040805180820190915260018152603160f81b6020820152610357565b3480156104fe57600080fd5b5061031261050d366004613a9e565b61147b565b34801561051e57600080fd5b5061031261052d366004613a57565b60066020526000908152604090205481565b34801561054b57600080fd5b5061034061055a366004613a57565b6114a4565b34801561056b57600080fd5b5061031261057a366004613ac9565b6114e1565b34801561058b57600080fd5b5061031261059a366004613869565b611533565b3480156105ab57600080fd5b506007546103129081565b3480156105c257600080fd5b506064610312565b3480156105d657600080fd5b50600354610312565b3480156105eb57600080fd5b506103406105fa366004613a3b565b6115a6565b34801561060b57600080fd5b5061031261061a366004613a57565b6115e7565b34801561062b57600080fd5b50600b54610312565b34801561064057600080fd5b5061031261064f366004613a57565b61168b565b34801561066057600080fd5b5061031261066f3660046137de565b6116ba565b34801561068057600080fd5b506004546001600160a01b03165b6040516001600160a01b0390911681526020016102c8565b3480156106b257600080fd5b506103126106c1366004613910565b6116f4565b3480156106d257600080fd5b506103576106e1366004613a57565b611719565b3480156106f257600080fd5b5060408051808201909152601a81527f737570706f72743d627261766f2671756f72756d3d627261766f0000000000006020820152610357565b34801561073857600080fd5b50610340610747366004613a57565b6117b3565b34801561075857600080fd5b506103127f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b34801561078c57600080fd5b5061081a61079b366004613a6f565b60408051606081018252600080825260208201819052918101919091525060009182526002602090815260408084206001600160a01b0393909316845260089092018152918190208151606081018352905460ff8082161515835261010082041693820193909352620100009092046001600160601b03169082015290565b6040805182511515815260208084015160ff1690820152918101516001600160601b0316908201526060016102c8565b34801561085657600080fd5b50610340610865366004613a57565b611a21565b34801561087657600080fd5b506103126108853660046137b3565b611a5e565b34801561089657600080fd5b506103406108a5366004613a57565b611a6a565b3480156108b657600080fd5b506103126108c5366004613a57565b611aa7565b3480156108d657600080fd5b5061068e7f000000000000000000000000000000000000000000000000000000000000000081565b61034061090c366004613a57565b611ab2565b80600080808080808080806109258a6115e7565b97506109308b610e01565b965061093b8b61168b565b60008c815260026020526040812080546005820154600683015460078401546001600160a01b039093169e50949a50985092965091945061097b8d61115d565b9050600281600781111561099f57634e487b7160e01b600052602160045260246000fd5b14935060078160078111156109c457634e487b7160e01b600052602160045260246000fd5b14925050509193959799509193959799565b60006109e182611d20565b92915050565b6109ef611d45565b6001600160a01b0316336001600160a01b031614610a285760405162461bcd60e51b8152600401610a1f90613e1e565b60405180910390fd5b610a3181611d59565b50565b606060008054610a43906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054610a6f906140be565b8015610abc5780601f10610a9157610100808354040283529160200191610abc565b820191906000526020600020905b815481529060010190602001808311610a9f57829003601f168201915b5050505050905090565b600080610ad5868686866116ba565b90506004610ae28261115d565b6007811115610b0157634e487b7160e01b600052602160045260246000fd5b14610b1e5760405162461bcd60e51b8152600401610a1f90613e96565b6000600460009054906101000a90046001600160a01b03166001600160a01b031663f27a0c926040518163ffffffff1660e01b815260040160206040518083038186803b158015610b6e57600080fd5b505afa158015610b82573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ba691906139fb565b6004805460405163b1c5f42760e01b81529293506001600160a01b03169163b1c5f42791610bdf918b918b918b916000918c9101613cf0565b60206040518083038186803b158015610bf757600080fd5b505afa158015610c0b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c2f91906139fb565b600083815260056020526040808220929092556004805492516308f2a0bb60e41b81526001600160a01b0390931692638f2a0bb092610c7a928c928c928c9290918c918a9101613d3e565b600060405180830381600087803b158015610c9457600080fd5b505af1158015610ca8573d6000803e3d6000fd5b505050507f9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892828242610cda9190613ff5565b604080519283526020830191909152015b60405180910390a15095945050505050565b6000610d0d6108c5600143614077565b905090565b600080610d21868686866116ba565b90506000610d2e8261115d565b90506004816007811115610d5257634e487b7160e01b600052602160045260246000fd5b1480610d7d57506005816007811115610d7b57634e487b7160e01b600052602160045260246000fd5b145b610d995760405162461bcd60e51b8152600401610a1f90613e96565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610df78288888888611e21565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b60608060608060006002600087815260200190815260200160002090508060010181600201826003018360040183805480602002602001604051908101604052809291908181526020018280548015610eba57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610e9c575b5050505050935082805480602002602001604051908101604052809291908181526020018280548015610f0c57602002820191906000526020600020905b815481526020019060010190808311610ef8575b5050505050925081805480602002602001604051908101604052809291908181526020016000905b82821015610fe0578382906000526020600020018054610f53906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054610f7f906140be565b8015610fcc5780601f10610fa157610100808354040283529160200191610fcc565b820191906000526020600020905b815481529060010190602001808311610faf57829003601f168201915b505050505081526020019060010190610f34565b50505050915080805480602002602001604051908101604052809291908181526020016000905b828210156110b3578382906000526020600020018054611026906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611052906140be565b801561109f5780601f106110745761010080835404028352916020019161109f565b820191906000526020600020905b81548152906001019060200180831161108257829003601f168201915b505050505081526020019060010190611007565b5050505090509450945094509450509193509193565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff8516606082015260009081906111359061112d9060800160405160208183030381529060405280519060200120611e35565b868686611e83565b905061115287828860405180602001604052806000815250611ea1565b979650505050505050565b60006109e182611fba565b600081815260026020526040902080546001600160a01b0316336001600160a01b031614806111b15750600b5481546111af906001600160a01b0316610885600143614077565b105b61120d5760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72427261766f3a2070726f706f7365722061626f76652074686044820152661c995cda1bdb1960ca1b6064820152608401610a1f565b6114768160010180548060200260200160405190810160405280929190818152602001828054801561126857602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161124a575b5050505050826002018054806020026020016040519081016040528092919081815260200182805480156112bb57602002820191906000526020600020905b8154815260200190600101908083116112a7575b505050505061146c84600301805480602002602001604051908101604052809291908181526020016000905b82821015611393578382906000526020600020018054611306906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611332906140be565b801561137f5780601f106113545761010080835404028352916020019161137f565b820191906000526020600020905b81548152906001019060200180831161136257829003601f168201915b5050505050815260200190600101906112e7565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114635783829060005260206000200180546113d6906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611402906140be565b801561144f5780601f106114245761010080835404028352916020019161144f565b820191906000526020600020905b81548152906001019060200180831161143257829003601f168201915b5050505050815260200190600101906113b7565b505050506120a3565b8460090154612257565b505050565b60008033905061149c84828560405180602001604052806000815250611ea1565b949350505050565b6114ac611d45565b6001600160a01b0316336001600160a01b0316146114dc5760405162461bcd60e51b8152600401610a1f90613e1e565b600955565b60008033905061152986828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611ea192505050565b9695505050505050565b6000806115428686868661226e565b9050600061154f60075490565b61155a906001613ff5565b6000818152600660205260409020839055905061157b600780546001019055565b6000828152600860209081526040909120855161159a928701906132f7565b50909695505050505050565b6115ae611d45565b6001600160a01b0316336001600160a01b0316146115de5760405162461bcd60e51b8152600401610a1f90613e1e565b610a31816122e4565b6004805460008381526005602052604080822054905163d45c443560e01b8152938401529182916001600160a01b03169063d45c44359060240160206040518083038186803b15801561163957600080fd5b505afa15801561164d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061167191906139fb565b9050806001146116815780611684565b60005b9392505050565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610e29565b6000848484846040516020016116d39493929190613ca5565b60408051601f19818403018152919052805160209091012095945050505050565b600061170433878787878761234d565b611529868661171387876120a3565b85611533565b60086020526000908152604090208054611732906140be565b80601f016020809104026020016040519081016040528092919081815260200182805461175e906140be565b80156117ab5780601f10611780576101008083540402835291602001916117ab565b820191906000526020600020905b81548152906001019060200180831161178e57829003601f168201915b505050505081565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936114769390929083018282801561181c57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116117fe575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561186f57602002820191906000526020600020905b81548152602001906001019080831161185b575b5050505050611a1784600301805480602002602001604051908101604052809291908181526020016000905b828210156119475783829060005260206000200180546118ba906140be565b80601f01602080910402602001604051908101604052809291908181526020018280546118e6906140be565b80156119335780601f1061190857610100808354040283529160200191611933565b820191906000526020600020905b81548152906001019060200180831161191657829003601f168201915b50505050508152602001906001019061189b565b50505060048701805460408051602080840282018101909252828152935060009084015b8282101561146357838290600052602060002001805461198a906140be565b80601f01602080910402602001604051908101604052809291908181526020018280546119b6906140be565b8015611a035780601f106119d857610100808354040283529160200191611a03565b820191906000526020600020905b8154815290600101906020018083116119e657829003601f168201915b50505050508152602001906001019061196b565b8460090154610ac6565b611a29611d45565b6001600160a01b0316336001600160a01b031614611a595760405162461bcd60e51b8152600401610a1f90613e1e565b600a55565b6000611684838361240a565b611a72611d45565b6001600160a01b0316336001600160a01b031614611aa25760405162461bcd60e51b8152600401610a1f90613e1e565b600b55565b60006109e1826124af565b600081815260026020908152604091829020600181018054845181850281018501909552808552919361147693909290830182828015611b1b57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611afd575b505050505082600201805480602002602001604051908101604052809291908181526020018280548015611b6e57602002820191906000526020600020905b815481526020019060010190808311611b5a575b5050505050611d1684600301805480602002602001604051908101604052809291908181526020016000905b82821015611c46578382906000526020600020018054611bb9906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611be5906140be565b8015611c325780601f10611c0757610100808354040283529160200191611c32565b820191906000526020600020905b815481529060010190602001808311611c1557829003601f168201915b505050505081526020019060010190611b9a565b50505060048701805460408051602080840282018101909252828152935060009084015b82821015611463578382906000526020600020018054611c89906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611cb5906140be565b8015611d025780601f10611cd757610100808354040283529160200191611d02565b820191906000526020600020905b815481529060010190602001808311611ce557829003601f168201915b505050505081526020019060010190611c6a565b8460090154610d12565b60006001600160e01b03198216636e665ced60e01b14806109e157506109e182612562565b6000610d0d6004546001600160a01b031690565b6064811115611ddc5760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a401610a1f565b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611e2e8585858585612597565b5050505050565b60006109e1611e4261260a565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611e94878787876126fd565b91509150610df7816127ea565b6000848152600160208190526040822090611ebb8761115d565b6007811115611eda57634e487b7160e01b600052602160045260246000fd5b14611f335760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b6064820152608401610a1f565b604080516020810190915281546001600160401b031690819052600090611f5b908790611a5e565b9050611f69878787846129eb565b856001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda488878488604051611fa89493929190613f7a565b60405180910390a29695505050505050565b600080611fc683612b90565b90506004816007811115611fea57634e487b7160e01b600052602160045260246000fd5b14611ff55792915050565b60008381526005602052604090205480612010575092915050565b60048054604051632ab0f52960e01b81529182018390526001600160a01b031690632ab0f5299060240160206040518083038186803b15801561205257600080fd5b505afa158015612066573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061208a91906139db565b15612099575060079392505050565b5060059392505050565b6060600082516001600160401b038111156120ce57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561210157816020015b60608152602001906001900390816120ec5790505b50905060005b845181101561224f5784818151811061213057634e487b7160e01b600052603260045260246000fd5b6020026020010151516000146121ea5784818151811061216057634e487b7160e01b600052603260045260246000fd5b602002602001015184828151811061218857634e487b7160e01b600052603260045260246000fd5b60200260200101516040516024016121a09190613de3565b60408051601f1981840301815290829052916121bb91613c89565b6040519081900390206020820180516001600160e01b03166001600160e01b0319909216919091179052612213565b83818151811061220a57634e487b7160e01b600052603260045260246000fd5b60200260200101515b82828151811061223357634e487b7160e01b600052603260045260246000fd5b602002602001018190525080612248906140f3565b9050612107565b509392505050565b600061226585858585612cf6565b95945050505050565b60006122d833868686516001600160401b0381111561229d57634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156122d057816020015b60608152602001906001900390816122bb5790505b50878761234d565b61226585858585612d9e565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b80516020820120600061236b878761236588886120a3565b856116ba565b60008181526002602052604090206009810154919250906123ff5780546001600160a01b0319166001600160a01b038a1617815587516123b490600183019060208b0190613377565b5086516123ca90600283019060208a01906133cc565b5085516123e09060038301906020890190613406565b5084516123f6906004830190602088019061345f565b50600981018390555b505050505050505050565b604051630748d63560e31b81526001600160a01b038381166004830152602482018390526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a89060440160206040518083038186803b15801561247757600080fd5b505afa15801561248b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061168491906139fb565b60006064600354604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c9060240160206040518083038186803b15801561251657600080fd5b505afa15801561252a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061254e91906139fb565b6125589190614058565b6109e19190614038565b60006001600160e01b0319821663bf26d89760e01b14806109e157506301ffc9a760e01b6001600160e01b03198316146109e1565b6004805460405163e38335e560e01b81526001600160a01b039091169163e38335e59134916125d1918991899189916000918a9101613cf0565b6000604051808303818588803b1580156125ea57600080fd5b505af11580156125fe573d6000803e3d6000fd5b50505050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000046141561265957507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561273457506000905060036127e1565b8460ff16601b1415801561274c57508460ff16601c14155b1561275d57506000905060046127e1565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156127b1573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166127da576000600192509250506127e1565b9150600090505b94509492505050565b600081600481111561280c57634e487b7160e01b600052602160045260246000fd5b14156128155750565b600181600481111561283757634e487b7160e01b600052602160045260246000fd5b14156128855760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a1f565b60028160048111156128a757634e487b7160e01b600052602160045260246000fd5b14156128f55760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a1f565b600381600481111561291757634e487b7160e01b600052602160045260246000fd5b14156129705760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a1f565b600481600481111561299257634e487b7160e01b600052602160045260246000fd5b1415610a315760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a1f565b60008481526002602090815260408083206001600160a01b038716845260088101909252909120805460ff1615612a7a5760405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20766f746560448201526c08185b1c9958591e4818d85cdd609a1b6064820152608401610a1f565b805460ff85166101000261ffff19909116176001178155612a9a83612e44565b81546001600160601b039190911662010000026dffffffffffffffffffffffff00001990911617815560ff8416612aea5782826006016000828254612adf9190613ff5565b90915550612b889050565b60ff841660011415612b0a5782826005016000828254612adf9190613ff5565b60ff841660021415612b2a5782826007016000828254612adf9190613ff5565b60405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20696e766160448201526c6c696420766f7465207479706560981b6064820152608401610a1f565b505050505050565b6000818152600160208181526040808420815160a08101835281546001600160401b0390811660808301908152825283518086018552958301541685529283019390935260029092015460ff80821615801594840194909452610100909104161515606082015290612c055750600792915050565b806060015115612c185750600292915050565b805151436001600160401b039091161115612c365750600092915050565b602081015151436001600160401b039091161115612c575750600192915050565b612c648160200151612eb0565b15612ca857612c7283612edf565b8015612c94575060008381526002602052604090206006810154600590910154115b612c9f576003611684565b60049392505050565b60405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c2069640000006044820152606401610a1f565b50919050565b600080612d0586868686612f06565b6000818152600560205260409020549091501561226557600480546000838152600560205260409081902054905163c4d252f560e01b8152928301526001600160a01b03169063c4d252f590602401600060405180830381600087803b158015612d6e57600080fd5b505af1158015612d82573d6000803e3d6000fd5b5050506000828152600560205260408120555095945050505050565b6000612da9600b5490565b612db833610885600143614077565b1015612e385760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a2070726f7060448201527f6f73657220766f7465732062656c6f772070726f706f73616c207468726573686064820152621bdb1960ea1b608482015260a401610a1f565b6122658585858561303c565b60006001600160601b03821115612eac5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203960448201526536206269747360d01b6064820152608401610a1f565b5090565b6000612ec582516001600160401b0316151590565b80156109e157505051436001600160401b03909116111590565b60008181526002602052604081206005810154612efe6108c585610e01565b109392505050565b600080612f15868686866116ba565b90506000612f228261115d565b90506002816007811115612f4657634e487b7160e01b600052602160045260246000fd5b14158015612f7457506006816007811115612f7157634e487b7160e01b600052602160045260246000fd5b14155b8015612fa057506007816007811115612f9d57634e487b7160e01b600052602160045260246000fd5b14155b612fec5760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a2070726f706f73616c206e6f74206163746976650000006044820152606401610a1f565b60008281526001602052604090819020600201805461ff001916610100179055517f789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c90610ceb9084815260200190565b60008061305286868686805190602001206116ba565b905084518651146130755760405162461bcd60e51b8152600401610a1f90613e55565b83518651146130965760405162461bcd60e51b8152600401610a1f90613e55565b60008651116130e75760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c00000000000000006044820152606401610a1f565b600081815260016020908152604091829020825191820190925281546001600160401b031690819052156131675760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b6064820152608401610a1f565b600061317a61317560095490565b61328f565b6131834361328f565b61318d919061400d565b9050600061319d613175600a5490565b6131a7908361400d565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b0381111561322d57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561326057816020015b606081526020019060019003908161324b5790505b508c88888e60405161327a99989796959493929190613ed7565b60405180910390a15091979650505050505050565b60006001600160401b03821115612eac5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b6064820152608401610a1f565b828054613303906140be565b90600052602060002090601f016020900481019282613325576000855561336b565b82601f1061333e57805160ff191683800117855561336b565b8280016001018555821561336b579182015b8281111561336b578251825591602001919060010190613350565b50612eac9291506134b8565b82805482825590600052602060002090810192821561336b579160200282015b8281111561336b57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190613397565b82805482825590600052602060002090810192821561336b579160200282018281111561336b578251825591602001919060010190613350565b828054828255906000526020600020908101928215613453579160200282015b8281111561345357825180516134439184916020909101906132f7565b5091602001919060010190613426565b50612eac9291506134cd565b8280548282559060005260206000209081019282156134ac579160200282015b828111156134ac578251805161349c9184916020909101906132f7565b509160200191906001019061347f565b50612eac9291506134ea565b5b80821115612eac57600081556001016134b9565b80821115612eac5760006134e18282613507565b506001016134cd565b80821115612eac5760006134fe8282613507565b506001016134ea565b508054613513906140be565b6000825580601f10613523575050565b601f016020900490600052602060002090810190610a3191906134b8565b60006001600160401b0383111561355a5761355a614124565b61356d601f8401601f1916602001613fa2565b905082815283838301111561358157600080fd5b828260208301376000602084830101529392505050565b600082601f8301126135a8578081fd5b813560206135bd6135b883613fd2565b613fa2565b80838252828201915082860187848660051b89010111156135dc578586fd5b855b858110156136035781356135f18161413a565b845292840192908401906001016135de565b5090979650505050505050565b600082601f830112613620578081fd5b813560206136306135b883613fd2565b80838252828201915082860187848660051b890101111561364f578586fd5b855b858110156136035781356001600160401b0381111561366e578788fd5b8801603f81018a1361367e578788fd5b61368f8a8783013560408401613541565b8552509284019290840190600101613651565b600082601f8301126136b2578081fd5b813560206136c26135b883613fd2565b80838252828201915082860187848660051b89010111156136e1578586fd5b855b858110156136035781356001600160401b03811115613700578788fd5b61370e8a87838c010161377e565b85525092840192908401906001016136e3565b600082601f830112613731578081fd5b813560206137416135b883613fd2565b80838252828201915082860187848660051b8901011115613760578586fd5b855b8581101561360357813584529284019290840190600101613762565b600082601f83011261378e578081fd5b61168483833560208501613541565b803560ff811681146137ae57600080fd5b919050565b600080604083850312156137c5578182fd5b82356137d08161413a565b946020939093013593505050565b600080600080608085870312156137f3578182fd5b84356001600160401b0380821115613809578384fd5b61381588838901613598565b9550602087013591508082111561382a578384fd5b61383688838901613721565b9450604087013591508082111561384b578384fd5b5061385887828801613610565b949793965093946060013593505050565b6000806000806080858703121561387e578182fd5b84356001600160401b0380821115613894578384fd5b6138a088838901613598565b955060208701359150808211156138b5578384fd5b6138c188838901613721565b945060408701359150808211156138d6578384fd5b6138e288838901613610565b935060608701359150808211156138f7578283fd5b506139048782880161377e565b91505092959194509250565b600080600080600060a08688031215613927578283fd5b85356001600160401b038082111561393d578485fd5b61394989838a01613598565b9650602088013591508082111561395e578485fd5b61396a89838a01613721565b9550604088013591508082111561397f578485fd5b61398b89838a016136a2565b945060608801359150808211156139a0578283fd5b6139ac89838a01613610565b935060808801359150808211156139c1578283fd5b506139ce8882890161377e565b9150509295509295909350565b6000602082840312156139ec578081fd5b81518015158114611684578182fd5b600060208284031215613a0c578081fd5b5051919050565b600060208284031215613a24578081fd5b81356001600160e01b031981168114611684578182fd5b600060208284031215613a4c578081fd5b81356116848161413a565b600060208284031215613a68578081fd5b5035919050565b60008060408385031215613a81578182fd5b823591506020830135613a938161413a565b809150509250929050565b60008060408385031215613ab0578182fd5b82359150613ac06020840161379d565b90509250929050565b60008060008060608587031215613ade578182fd5b84359350613aee6020860161379d565b925060408501356001600160401b0380821115613b09578384fd5b818701915087601f830112613b1c578384fd5b813581811115613b2a578485fd5b886020828501011115613b3b578485fd5b95989497505060200194505050565b600080600080600060a08688031215613b61578283fd5b85359450613b716020870161379d565b9350613b7f6040870161379d565b94979396509394606081013594506080013592915050565b6000815180845260208085019450808401835b83811015613bcf5781516001600160a01b031687529582019590820190600101613baa565b509495945050505050565b600081518084526020808501808196508360051b81019150828601855b85811015613c21578284038952613c0f848351613c5d565b98850198935090840190600101613bf7565b5091979650505050505050565b6000815180845260208085019450808401835b83811015613bcf57815187529582019590820190600101613c41565b60008151808452613c7581602086016020860161408e565b601f01601f19169290920160200192915050565b60008251613c9b81846020870161408e565b9190910192915050565b608081526000613cb86080830187613b97565b8281036020840152613cca8187613c2e565b90508281036040840152613cde8186613bda565b91505082606083015295945050505050565b60a081526000613d0360a0830188613b97565b8281036020840152613d158188613c2e565b90508281036040840152613d298187613bda565b60608401959095525050608001529392505050565b60c081526000613d5160c0830189613b97565b8281036020840152613d638189613c2e565b90508281036040840152613d778188613bda565b60608401969096525050608081019290925260a0909101529392505050565b608081526000613da96080830187613b97565b8281036020840152613dbb8187613c2e565b90508281036040840152613dcf8186613bda565b905082810360608401526111528185613bda565b6020815260006116846020830184613c5d565b6020810160088310613e1857634e487b7160e01b600052602160045260246000fd5b91905290565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b60208082526021908201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756040820152601b60fa1b606082015260800190565b8981526001600160a01b038916602082015261012060408201819052600090613f028382018b613b97565b90508281036060840152613f16818a613c2e565b90508281036080840152613f2a8189613bda565b905082810360a0840152613f3e8188613bda565b6001600160401b0387811660c0860152861660e08501528381036101008501529050613f6a8185613c5d565b9c9b505050505050505050505050565b84815260ff841660208201528260408201526080606082015260006115296080830184613c5d565b604051601f8201601f191681016001600160401b0381118282101715613fca57613fca614124565b604052919050565b60006001600160401b03821115613feb57613feb614124565b5060051b60200190565b600082198211156140085761400861410e565b500190565b60006001600160401b0380831681851680830382111561402f5761402f61410e565b01949350505050565b60008261405357634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156140725761407261410e565b500290565b6000828210156140895761408961410e565b500390565b60005b838110156140a9578181015183820152602001614091565b838111156140b8576000848401525b50505050565b600181811c908216806140d257607f821691505b60208210811415612cf057634e487b7160e01b600052602260045260246000fd5b60006000198214156141075761410761410e565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114610a3157600080fdfea264697066735822122058edbaefd2a220c9a0409adbc1ff6a4db1d13d4e9cec9b89c50724215c4cc94064736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102515760003560e01c80638059f7e111610139578063dc45c5c1116100b6578063ea0217cf1161007a578063ea0217cf1461084a578063eb9019d41461086a578063ece40cc11461088a578063f8ce560a146108aa578063fc0c546a146108ca578063fe0d94c1146108fe57600080fd5b8063dc45c5c1146106c6578063dd4e2ba5146106e6578063ddf0b0091461072c578063deaaa7cc1461074c578063e23a9a521461078057600080fd5b8063b58131b0116100fd578063b58131b01461061f578063c01f9e3714610634578063c59057e414610654578063d33219b414610674578063da95691a146106a657600080fd5b80638059f7e11461059f57806397c3d334146105b6578063a7713a70146105ca578063a890c910146105df578063ab58fb8e146105ff57600080fd5b80633932abb1116101d257806354fd4d501161019657806354fd4d50146104c857806356781388146104f25780635aeb927e1461051257806370b0f6601461053f5780637b3c71d31461055f5780637d5e81e21461057f57600080fd5b80633932abb1146103fc5780633bccf4fd146104115780633e4f49e61461043157806340e58ee51461045e578063438596321461047e57600080fd5b8063160cbed711610219578063160cbed71461036457806324bc1a64146103845780632656227d146103995780632d63f693146103ac578063328dd982146103cc57600080fd5b8063013cf08b1461025657806301ffc9a7146102d157806302a251a31461030157806306f3f9e61461032057806306fdde0314610342575b600080fd5b34801561026257600080fd5b50610276610271366004613a57565b610911565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b3480156102dd57600080fd5b506102f16102ec366004613a13565b6109d6565b60405190151581526020016102c8565b34801561030d57600080fd5b50600a545b6040519081526020016102c8565b34801561032c57600080fd5b5061034061033b366004613a57565b6109e7565b005b34801561034e57600080fd5b50610357610a34565b6040516102c89190613de3565b34801561037057600080fd5b5061031261037f3660046137de565b610ac6565b34801561039057600080fd5b50610312610cfd565b6103126103a73660046137de565b610d12565b3480156103b857600080fd5b506103126103c7366004613a57565b610e01565b3480156103d857600080fd5b506103ec6103e7366004613a57565b610e38565b6040516102c89493929190613d96565b34801561040857600080fd5b50600954610312565b34801561041d57600080fd5b5061031261042c366004613b4a565b6110c9565b34801561043d57600080fd5b5061045161044c366004613a57565b61115d565b6040516102c89190613df6565b34801561046a57600080fd5b50610340610479366004613a57565b611168565b34801561048a57600080fd5b506102f1610499366004613a6f565b60008281526002602090815260408083206001600160a01b038516845260080190915290205460ff1692915050565b3480156104d457600080fd5b506040805180820190915260018152603160f81b6020820152610357565b3480156104fe57600080fd5b5061031261050d366004613a9e565b61147b565b34801561051e57600080fd5b5061031261052d366004613a57565b60066020526000908152604090205481565b34801561054b57600080fd5b5061034061055a366004613a57565b6114a4565b34801561056b57600080fd5b5061031261057a366004613ac9565b6114e1565b34801561058b57600080fd5b5061031261059a366004613869565b611533565b3480156105ab57600080fd5b506007546103129081565b3480156105c257600080fd5b506064610312565b3480156105d657600080fd5b50600354610312565b3480156105eb57600080fd5b506103406105fa366004613a3b565b6115a6565b34801561060b57600080fd5b5061031261061a366004613a57565b6115e7565b34801561062b57600080fd5b50600b54610312565b34801561064057600080fd5b5061031261064f366004613a57565b61168b565b34801561066057600080fd5b5061031261066f3660046137de565b6116ba565b34801561068057600080fd5b506004546001600160a01b03165b6040516001600160a01b0390911681526020016102c8565b3480156106b257600080fd5b506103126106c1366004613910565b6116f4565b3480156106d257600080fd5b506103576106e1366004613a57565b611719565b3480156106f257600080fd5b5060408051808201909152601a81527f737570706f72743d627261766f2671756f72756d3d627261766f0000000000006020820152610357565b34801561073857600080fd5b50610340610747366004613a57565b6117b3565b34801561075857600080fd5b506103127f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b34801561078c57600080fd5b5061081a61079b366004613a6f565b60408051606081018252600080825260208201819052918101919091525060009182526002602090815260408084206001600160a01b0393909316845260089092018152918190208151606081018352905460ff8082161515835261010082041693820193909352620100009092046001600160601b03169082015290565b6040805182511515815260208084015160ff1690820152918101516001600160601b0316908201526060016102c8565b34801561085657600080fd5b50610340610865366004613a57565b611a21565b34801561087657600080fd5b506103126108853660046137b3565b611a5e565b34801561089657600080fd5b506103406108a5366004613a57565b611a6a565b3480156108b657600080fd5b506103126108c5366004613a57565b611aa7565b3480156108d657600080fd5b5061068e7f000000000000000000000000000000000000000000000000000000000000000081565b61034061090c366004613a57565b611ab2565b80600080808080808080806109258a6115e7565b97506109308b610e01565b965061093b8b61168b565b60008c815260026020526040812080546005820154600683015460078401546001600160a01b039093169e50949a50985092965091945061097b8d61115d565b9050600281600781111561099f57634e487b7160e01b600052602160045260246000fd5b14935060078160078111156109c457634e487b7160e01b600052602160045260246000fd5b14925050509193959799509193959799565b60006109e182611d20565b92915050565b6109ef611d45565b6001600160a01b0316336001600160a01b031614610a285760405162461bcd60e51b8152600401610a1f90613e1e565b60405180910390fd5b610a3181611d59565b50565b606060008054610a43906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054610a6f906140be565b8015610abc5780601f10610a9157610100808354040283529160200191610abc565b820191906000526020600020905b815481529060010190602001808311610a9f57829003601f168201915b5050505050905090565b600080610ad5868686866116ba565b90506004610ae28261115d565b6007811115610b0157634e487b7160e01b600052602160045260246000fd5b14610b1e5760405162461bcd60e51b8152600401610a1f90613e96565b6000600460009054906101000a90046001600160a01b03166001600160a01b031663f27a0c926040518163ffffffff1660e01b815260040160206040518083038186803b158015610b6e57600080fd5b505afa158015610b82573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ba691906139fb565b6004805460405163b1c5f42760e01b81529293506001600160a01b03169163b1c5f42791610bdf918b918b918b916000918c9101613cf0565b60206040518083038186803b158015610bf757600080fd5b505afa158015610c0b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c2f91906139fb565b600083815260056020526040808220929092556004805492516308f2a0bb60e41b81526001600160a01b0390931692638f2a0bb092610c7a928c928c928c9290918c918a9101613d3e565b600060405180830381600087803b158015610c9457600080fd5b505af1158015610ca8573d6000803e3d6000fd5b505050507f9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892828242610cda9190613ff5565b604080519283526020830191909152015b60405180910390a15095945050505050565b6000610d0d6108c5600143614077565b905090565b600080610d21868686866116ba565b90506000610d2e8261115d565b90506004816007811115610d5257634e487b7160e01b600052602160045260246000fd5b1480610d7d57506005816007811115610d7b57634e487b7160e01b600052602160045260246000fd5b145b610d995760405162461bcd60e51b8152600401610a1f90613e96565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610df78288888888611e21565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b60608060608060006002600087815260200190815260200160002090508060010181600201826003018360040183805480602002602001604051908101604052809291908181526020018280548015610eba57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610e9c575b5050505050935082805480602002602001604051908101604052809291908181526020018280548015610f0c57602002820191906000526020600020905b815481526020019060010190808311610ef8575b5050505050925081805480602002602001604051908101604052809291908181526020016000905b82821015610fe0578382906000526020600020018054610f53906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054610f7f906140be565b8015610fcc5780601f10610fa157610100808354040283529160200191610fcc565b820191906000526020600020905b815481529060010190602001808311610faf57829003601f168201915b505050505081526020019060010190610f34565b50505050915080805480602002602001604051908101604052809291908181526020016000905b828210156110b3578382906000526020600020018054611026906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611052906140be565b801561109f5780601f106110745761010080835404028352916020019161109f565b820191906000526020600020905b81548152906001019060200180831161108257829003601f168201915b505050505081526020019060010190611007565b5050505090509450945094509450509193509193565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff8516606082015260009081906111359061112d9060800160405160208183030381529060405280519060200120611e35565b868686611e83565b905061115287828860405180602001604052806000815250611ea1565b979650505050505050565b60006109e182611fba565b600081815260026020526040902080546001600160a01b0316336001600160a01b031614806111b15750600b5481546111af906001600160a01b0316610885600143614077565b105b61120d5760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72427261766f3a2070726f706f7365722061626f76652074686044820152661c995cda1bdb1960ca1b6064820152608401610a1f565b6114768160010180548060200260200160405190810160405280929190818152602001828054801561126857602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161124a575b5050505050826002018054806020026020016040519081016040528092919081815260200182805480156112bb57602002820191906000526020600020905b8154815260200190600101908083116112a7575b505050505061146c84600301805480602002602001604051908101604052809291908181526020016000905b82821015611393578382906000526020600020018054611306906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611332906140be565b801561137f5780601f106113545761010080835404028352916020019161137f565b820191906000526020600020905b81548152906001019060200180831161136257829003601f168201915b5050505050815260200190600101906112e7565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114635783829060005260206000200180546113d6906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611402906140be565b801561144f5780601f106114245761010080835404028352916020019161144f565b820191906000526020600020905b81548152906001019060200180831161143257829003601f168201915b5050505050815260200190600101906113b7565b505050506120a3565b8460090154612257565b505050565b60008033905061149c84828560405180602001604052806000815250611ea1565b949350505050565b6114ac611d45565b6001600160a01b0316336001600160a01b0316146114dc5760405162461bcd60e51b8152600401610a1f90613e1e565b600955565b60008033905061152986828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611ea192505050565b9695505050505050565b6000806115428686868661226e565b9050600061154f60075490565b61155a906001613ff5565b6000818152600660205260409020839055905061157b600780546001019055565b6000828152600860209081526040909120855161159a928701906132f7565b50909695505050505050565b6115ae611d45565b6001600160a01b0316336001600160a01b0316146115de5760405162461bcd60e51b8152600401610a1f90613e1e565b610a31816122e4565b6004805460008381526005602052604080822054905163d45c443560e01b8152938401529182916001600160a01b03169063d45c44359060240160206040518083038186803b15801561163957600080fd5b505afa15801561164d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061167191906139fb565b9050806001146116815780611684565b60005b9392505050565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610e29565b6000848484846040516020016116d39493929190613ca5565b60408051601f19818403018152919052805160209091012095945050505050565b600061170433878787878761234d565b611529868661171387876120a3565b85611533565b60086020526000908152604090208054611732906140be565b80601f016020809104026020016040519081016040528092919081815260200182805461175e906140be565b80156117ab5780601f10611780576101008083540402835291602001916117ab565b820191906000526020600020905b81548152906001019060200180831161178e57829003601f168201915b505050505081565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936114769390929083018282801561181c57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116117fe575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561186f57602002820191906000526020600020905b81548152602001906001019080831161185b575b5050505050611a1784600301805480602002602001604051908101604052809291908181526020016000905b828210156119475783829060005260206000200180546118ba906140be565b80601f01602080910402602001604051908101604052809291908181526020018280546118e6906140be565b80156119335780601f1061190857610100808354040283529160200191611933565b820191906000526020600020905b81548152906001019060200180831161191657829003601f168201915b50505050508152602001906001019061189b565b50505060048701805460408051602080840282018101909252828152935060009084015b8282101561146357838290600052602060002001805461198a906140be565b80601f01602080910402602001604051908101604052809291908181526020018280546119b6906140be565b8015611a035780601f106119d857610100808354040283529160200191611a03565b820191906000526020600020905b8154815290600101906020018083116119e657829003601f168201915b50505050508152602001906001019061196b565b8460090154610ac6565b611a29611d45565b6001600160a01b0316336001600160a01b031614611a595760405162461bcd60e51b8152600401610a1f90613e1e565b600a55565b6000611684838361240a565b611a72611d45565b6001600160a01b0316336001600160a01b031614611aa25760405162461bcd60e51b8152600401610a1f90613e1e565b600b55565b60006109e1826124af565b600081815260026020908152604091829020600181018054845181850281018501909552808552919361147693909290830182828015611b1b57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611afd575b505050505082600201805480602002602001604051908101604052809291908181526020018280548015611b6e57602002820191906000526020600020905b815481526020019060010190808311611b5a575b5050505050611d1684600301805480602002602001604051908101604052809291908181526020016000905b82821015611c46578382906000526020600020018054611bb9906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611be5906140be565b8015611c325780601f10611c0757610100808354040283529160200191611c32565b820191906000526020600020905b815481529060010190602001808311611c1557829003601f168201915b505050505081526020019060010190611b9a565b50505060048701805460408051602080840282018101909252828152935060009084015b82821015611463578382906000526020600020018054611c89906140be565b80601f0160208091040260200160405190810160405280929190818152602001828054611cb5906140be565b8015611d025780601f10611cd757610100808354040283529160200191611d02565b820191906000526020600020905b815481529060010190602001808311611ce557829003601f168201915b505050505081526020019060010190611c6a565b8460090154610d12565b60006001600160e01b03198216636e665ced60e01b14806109e157506109e182612562565b6000610d0d6004546001600160a01b031690565b6064811115611ddc5760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a401610a1f565b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611e2e8585858585612597565b5050505050565b60006109e1611e4261260a565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611e94878787876126fd565b91509150610df7816127ea565b6000848152600160208190526040822090611ebb8761115d565b6007811115611eda57634e487b7160e01b600052602160045260246000fd5b14611f335760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b6064820152608401610a1f565b604080516020810190915281546001600160401b031690819052600090611f5b908790611a5e565b9050611f69878787846129eb565b856001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda488878488604051611fa89493929190613f7a565b60405180910390a29695505050505050565b600080611fc683612b90565b90506004816007811115611fea57634e487b7160e01b600052602160045260246000fd5b14611ff55792915050565b60008381526005602052604090205480612010575092915050565b60048054604051632ab0f52960e01b81529182018390526001600160a01b031690632ab0f5299060240160206040518083038186803b15801561205257600080fd5b505afa158015612066573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061208a91906139db565b15612099575060079392505050565b5060059392505050565b6060600082516001600160401b038111156120ce57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561210157816020015b60608152602001906001900390816120ec5790505b50905060005b845181101561224f5784818151811061213057634e487b7160e01b600052603260045260246000fd5b6020026020010151516000146121ea5784818151811061216057634e487b7160e01b600052603260045260246000fd5b602002602001015184828151811061218857634e487b7160e01b600052603260045260246000fd5b60200260200101516040516024016121a09190613de3565b60408051601f1981840301815290829052916121bb91613c89565b6040519081900390206020820180516001600160e01b03166001600160e01b0319909216919091179052612213565b83818151811061220a57634e487b7160e01b600052603260045260246000fd5b60200260200101515b82828151811061223357634e487b7160e01b600052603260045260246000fd5b602002602001018190525080612248906140f3565b9050612107565b509392505050565b600061226585858585612cf6565b95945050505050565b60006122d833868686516001600160401b0381111561229d57634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156122d057816020015b60608152602001906001900390816122bb5790505b50878761234d565b61226585858585612d9e565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b80516020820120600061236b878761236588886120a3565b856116ba565b60008181526002602052604090206009810154919250906123ff5780546001600160a01b0319166001600160a01b038a1617815587516123b490600183019060208b0190613377565b5086516123ca90600283019060208a01906133cc565b5085516123e09060038301906020890190613406565b5084516123f6906004830190602088019061345f565b50600981018390555b505050505050505050565b604051630748d63560e31b81526001600160a01b038381166004830152602482018390526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a89060440160206040518083038186803b15801561247757600080fd5b505afa15801561248b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061168491906139fb565b60006064600354604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c9060240160206040518083038186803b15801561251657600080fd5b505afa15801561252a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061254e91906139fb565b6125589190614058565b6109e19190614038565b60006001600160e01b0319821663bf26d89760e01b14806109e157506301ffc9a760e01b6001600160e01b03198316146109e1565b6004805460405163e38335e560e01b81526001600160a01b039091169163e38335e59134916125d1918991899189916000918a9101613cf0565b6000604051808303818588803b1580156125ea57600080fd5b505af11580156125fe573d6000803e3d6000fd5b50505050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000046141561265957507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561273457506000905060036127e1565b8460ff16601b1415801561274c57508460ff16601c14155b1561275d57506000905060046127e1565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156127b1573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166127da576000600192509250506127e1565b9150600090505b94509492505050565b600081600481111561280c57634e487b7160e01b600052602160045260246000fd5b14156128155750565b600181600481111561283757634e487b7160e01b600052602160045260246000fd5b14156128855760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a1f565b60028160048111156128a757634e487b7160e01b600052602160045260246000fd5b14156128f55760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a1f565b600381600481111561291757634e487b7160e01b600052602160045260246000fd5b14156129705760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a1f565b600481600481111561299257634e487b7160e01b600052602160045260246000fd5b1415610a315760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a1f565b60008481526002602090815260408083206001600160a01b038716845260088101909252909120805460ff1615612a7a5760405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20766f746560448201526c08185b1c9958591e4818d85cdd609a1b6064820152608401610a1f565b805460ff85166101000261ffff19909116176001178155612a9a83612e44565b81546001600160601b039190911662010000026dffffffffffffffffffffffff00001990911617815560ff8416612aea5782826006016000828254612adf9190613ff5565b90915550612b889050565b60ff841660011415612b0a5782826005016000828254612adf9190613ff5565b60ff841660021415612b2a5782826007016000828254612adf9190613ff5565b60405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20696e766160448201526c6c696420766f7465207479706560981b6064820152608401610a1f565b505050505050565b6000818152600160208181526040808420815160a08101835281546001600160401b0390811660808301908152825283518086018552958301541685529283019390935260029092015460ff80821615801594840194909452610100909104161515606082015290612c055750600792915050565b806060015115612c185750600292915050565b805151436001600160401b039091161115612c365750600092915050565b602081015151436001600160401b039091161115612c575750600192915050565b612c648160200151612eb0565b15612ca857612c7283612edf565b8015612c94575060008381526002602052604090206006810154600590910154115b612c9f576003611684565b60049392505050565b60405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c2069640000006044820152606401610a1f565b50919050565b600080612d0586868686612f06565b6000818152600560205260409020549091501561226557600480546000838152600560205260409081902054905163c4d252f560e01b8152928301526001600160a01b03169063c4d252f590602401600060405180830381600087803b158015612d6e57600080fd5b505af1158015612d82573d6000803e3d6000fd5b5050506000828152600560205260408120555095945050505050565b6000612da9600b5490565b612db833610885600143614077565b1015612e385760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a2070726f7060448201527f6f73657220766f7465732062656c6f772070726f706f73616c207468726573686064820152621bdb1960ea1b608482015260a401610a1f565b6122658585858561303c565b60006001600160601b03821115612eac5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203960448201526536206269747360d01b6064820152608401610a1f565b5090565b6000612ec582516001600160401b0316151590565b80156109e157505051436001600160401b03909116111590565b60008181526002602052604081206005810154612efe6108c585610e01565b109392505050565b600080612f15868686866116ba565b90506000612f228261115d565b90506002816007811115612f4657634e487b7160e01b600052602160045260246000fd5b14158015612f7457506006816007811115612f7157634e487b7160e01b600052602160045260246000fd5b14155b8015612fa057506007816007811115612f9d57634e487b7160e01b600052602160045260246000fd5b14155b612fec5760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a2070726f706f73616c206e6f74206163746976650000006044820152606401610a1f565b60008281526001602052604090819020600201805461ff001916610100179055517f789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c90610ceb9084815260200190565b60008061305286868686805190602001206116ba565b905084518651146130755760405162461bcd60e51b8152600401610a1f90613e55565b83518651146130965760405162461bcd60e51b8152600401610a1f90613e55565b60008651116130e75760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c00000000000000006044820152606401610a1f565b600081815260016020908152604091829020825191820190925281546001600160401b031690819052156131675760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b6064820152608401610a1f565b600061317a61317560095490565b61328f565b6131834361328f565b61318d919061400d565b9050600061319d613175600a5490565b6131a7908361400d565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b0381111561322d57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561326057816020015b606081526020019060019003908161324b5790505b508c88888e60405161327a99989796959493929190613ed7565b60405180910390a15091979650505050505050565b60006001600160401b03821115612eac5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b6064820152608401610a1f565b828054613303906140be565b90600052602060002090601f016020900481019282613325576000855561336b565b82601f1061333e57805160ff191683800117855561336b565b8280016001018555821561336b579182015b8281111561336b578251825591602001919060010190613350565b50612eac9291506134b8565b82805482825590600052602060002090810192821561336b579160200282015b8281111561336b57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190613397565b82805482825590600052602060002090810192821561336b579160200282018281111561336b578251825591602001919060010190613350565b828054828255906000526020600020908101928215613453579160200282015b8281111561345357825180516134439184916020909101906132f7565b5091602001919060010190613426565b50612eac9291506134cd565b8280548282559060005260206000209081019282156134ac579160200282015b828111156134ac578251805161349c9184916020909101906132f7565b509160200191906001019061347f565b50612eac9291506134ea565b5b80821115612eac57600081556001016134b9565b80821115612eac5760006134e18282613507565b506001016134cd565b80821115612eac5760006134fe8282613507565b506001016134ea565b508054613513906140be565b6000825580601f10613523575050565b601f016020900490600052602060002090810190610a3191906134b8565b60006001600160401b0383111561355a5761355a614124565b61356d601f8401601f1916602001613fa2565b905082815283838301111561358157600080fd5b828260208301376000602084830101529392505050565b600082601f8301126135a8578081fd5b813560206135bd6135b883613fd2565b613fa2565b80838252828201915082860187848660051b89010111156135dc578586fd5b855b858110156136035781356135f18161413a565b845292840192908401906001016135de565b5090979650505050505050565b600082601f830112613620578081fd5b813560206136306135b883613fd2565b80838252828201915082860187848660051b890101111561364f578586fd5b855b858110156136035781356001600160401b0381111561366e578788fd5b8801603f81018a1361367e578788fd5b61368f8a8783013560408401613541565b8552509284019290840190600101613651565b600082601f8301126136b2578081fd5b813560206136c26135b883613fd2565b80838252828201915082860187848660051b89010111156136e1578586fd5b855b858110156136035781356001600160401b03811115613700578788fd5b61370e8a87838c010161377e565b85525092840192908401906001016136e3565b600082601f830112613731578081fd5b813560206137416135b883613fd2565b80838252828201915082860187848660051b8901011115613760578586fd5b855b8581101561360357813584529284019290840190600101613762565b600082601f83011261378e578081fd5b61168483833560208501613541565b803560ff811681146137ae57600080fd5b919050565b600080604083850312156137c5578182fd5b82356137d08161413a565b946020939093013593505050565b600080600080608085870312156137f3578182fd5b84356001600160401b0380821115613809578384fd5b61381588838901613598565b9550602087013591508082111561382a578384fd5b61383688838901613721565b9450604087013591508082111561384b578384fd5b5061385887828801613610565b949793965093946060013593505050565b6000806000806080858703121561387e578182fd5b84356001600160401b0380821115613894578384fd5b6138a088838901613598565b955060208701359150808211156138b5578384fd5b6138c188838901613721565b945060408701359150808211156138d6578384fd5b6138e288838901613610565b935060608701359150808211156138f7578283fd5b506139048782880161377e565b91505092959194509250565b600080600080600060a08688031215613927578283fd5b85356001600160401b038082111561393d578485fd5b61394989838a01613598565b9650602088013591508082111561395e578485fd5b61396a89838a01613721565b9550604088013591508082111561397f578485fd5b61398b89838a016136a2565b945060608801359150808211156139a0578283fd5b6139ac89838a01613610565b935060808801359150808211156139c1578283fd5b506139ce8882890161377e565b9150509295509295909350565b6000602082840312156139ec578081fd5b81518015158114611684578182fd5b600060208284031215613a0c578081fd5b5051919050565b600060208284031215613a24578081fd5b81356001600160e01b031981168114611684578182fd5b600060208284031215613a4c578081fd5b81356116848161413a565b600060208284031215613a68578081fd5b5035919050565b60008060408385031215613a81578182fd5b823591506020830135613a938161413a565b809150509250929050565b60008060408385031215613ab0578182fd5b82359150613ac06020840161379d565b90509250929050565b60008060008060608587031215613ade578182fd5b84359350613aee6020860161379d565b925060408501356001600160401b0380821115613b09578384fd5b818701915087601f830112613b1c578384fd5b813581811115613b2a578485fd5b886020828501011115613b3b578485fd5b95989497505060200194505050565b600080600080600060a08688031215613b61578283fd5b85359450613b716020870161379d565b9350613b7f6040870161379d565b94979396509394606081013594506080013592915050565b6000815180845260208085019450808401835b83811015613bcf5781516001600160a01b031687529582019590820190600101613baa565b509495945050505050565b600081518084526020808501808196508360051b81019150828601855b85811015613c21578284038952613c0f848351613c5d565b98850198935090840190600101613bf7565b5091979650505050505050565b6000815180845260208085019450808401835b83811015613bcf57815187529582019590820190600101613c41565b60008151808452613c7581602086016020860161408e565b601f01601f19169290920160200192915050565b60008251613c9b81846020870161408e565b9190910192915050565b608081526000613cb86080830187613b97565b8281036020840152613cca8187613c2e565b90508281036040840152613cde8186613bda565b91505082606083015295945050505050565b60a081526000613d0360a0830188613b97565b8281036020840152613d158188613c2e565b90508281036040840152613d298187613bda565b60608401959095525050608001529392505050565b60c081526000613d5160c0830189613b97565b8281036020840152613d638189613c2e565b90508281036040840152613d778188613bda565b60608401969096525050608081019290925260a0909101529392505050565b608081526000613da96080830187613b97565b8281036020840152613dbb8187613c2e565b90508281036040840152613dcf8186613bda565b905082810360608401526111528185613bda565b6020815260006116846020830184613c5d565b6020810160088310613e1857634e487b7160e01b600052602160045260246000fd5b91905290565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b60208082526021908201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756040820152601b60fa1b606082015260800190565b8981526001600160a01b038916602082015261012060408201819052600090613f028382018b613b97565b90508281036060840152613f16818a613c2e565b90508281036080840152613f2a8189613bda565b905082810360a0840152613f3e8188613bda565b6001600160401b0387811660c0860152861660e08501528381036101008501529050613f6a8185613c5d565b9c9b505050505050505050505050565b84815260ff841660208201528260408201526080606082015260006115296080830184613c5d565b604051601f8201601f191681016001600160401b0381118282101715613fca57613fca614124565b604052919050565b60006001600160401b03821115613feb57613feb614124565b5060051b60200190565b600082198211156140085761400861410e565b500190565b60006001600160401b0380831681851680830382111561402f5761402f61410e565b01949350505050565b60008261405357634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156140725761407261410e565b500290565b6000828210156140895761408961410e565b500390565b60005b838110156140a9578181015183820152602001614091565b838111156140b8576000848401525b50505050565b600181811c908216806140d257607f821691505b60208210811415612cf057634e487b7160e01b600052602260045260246000fd5b60006000198214156141075761410761410e565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114610a3157600080fdfea264697066735822122058edbaefd2a220c9a0409adbc1ff6a4db1d13d4e9cec9b89c50724215c4cc94064736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
