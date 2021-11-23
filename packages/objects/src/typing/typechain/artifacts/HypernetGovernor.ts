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
      name: "hypernetProfileRegistry",
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
          internalType: "address",
          name: "_hypernetProfileRegistry",
          type: "address",
        },
      ],
      name: "setProfileRegistry",
      outputs: [],
      stateMutability: "nonpayable",
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
    "0x61014060405260016009556014600a5569d3c21bcecceda1000000600b55600c80546001600160a01b03191690553480156200003a57600080fd5b50604051620047e8380380620047e88339810160408190526200005d916200035f565b806004836040518060400160405280601081526020016f243cb832b93732ba23b7bb32b93737b960811b815250806200009b6200016860201b60201c565b815160209283012081519183019190912060c082815260e08290524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810195909552608080860193909352308583015280518086039092018252939092019092528051908401209052610100528151620001359160009190840190620002b9565b505060601b6001600160601b03191661012052620001538162000183565b506200015f8162000250565b505050620003f3565b6040805180820190915260018152603160f81b602082015290565b60648111156200020b5760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a40160405180910390fd5b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b828054620002c7906200039d565b90600052602060002090601f016020900481019282620002eb576000855562000336565b82601f106200030657805160ff191683800117855562000336565b8280016001018555821562000336579182015b828111156200033657825182559160200191906001019062000319565b506200034492915062000348565b5090565b5b8082111562000344576000815560010162000349565b6000806040838503121562000372578182fd5b82516200037f81620003da565b60208401519092506200039281620003da565b809150509250929050565b600181811c90821680620003b257607f821691505b60208210811415620003d457634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b0381168114620003f057600080fd5b50565b60805160a05160c05160e051610100516101205160601c6143946200045460003960008181610936015281816125f2015261268b0152600061281f0152600061286e01526000612849015260006127cd015260006127f601526143946000f3fe6080604052600436106102675760003560e01c80638059f7e111610144578063dc45c5c1116100b6578063ea0217cf1161007a578063ea0217cf146108a4578063eb9019d4146108c4578063ece40cc1146108e4578063f8ce560a14610904578063fc0c546a14610924578063fe0d94c11461095857600080fd5b8063dc45c5c114610720578063dd4e2ba514610740578063ddf0b00914610786578063deaaa7cc146107a6578063e23a9a52146107da57600080fd5b8063b58131b011610108578063b58131b01461066d578063b6a67c4b14610682578063c01f9e37146106a2578063c59057e4146106c2578063d33219b4146106e2578063da95691a1461070057600080fd5b80638059f7e1146105ed57806397c3d33414610604578063a7713a7014610618578063a890c9101461062d578063ab58fb8e1461064d57600080fd5b80633bccf4fd116101dd57806356781388116101a157806356781388146105085780635aeb927e146105285780636a8828da1461055557806370b0f6601461058d5780637b3c71d3146105ad5780637d5e81e2146105cd57600080fd5b80633bccf4fd146104275780633e4f49e61461044757806340e58ee514610474578063438596321461049457806354fd4d50146104de57600080fd5b8063160cbed71161022f578063160cbed71461037a57806324bc1a641461039a5780632656227d146103af5780632d63f693146103c2578063328dd982146103e25780633932abb11461041257600080fd5b8063013cf08b1461026c57806301ffc9a7146102e757806302a251a31461031757806306f3f9e61461033657806306fdde0314610358575b600080fd5b34801561027857600080fd5b5061028c610287366004613c16565b61096b565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b3480156102f357600080fd5b50610307610302366004613bee565b610a30565b60405190151581526020016102de565b34801561032357600080fd5b50600a545b6040519081526020016102de565b34801561034257600080fd5b50610356610351366004613c16565b610a41565b005b34801561036457600080fd5b5061036d610a8e565b6040516102de9190613fa2565b34801561038657600080fd5b506103286103953660046139b9565b610b20565b3480156103a657600080fd5b50610328610d57565b6103286103bd3660046139b9565b610d6c565b3480156103ce57600080fd5b506103286103dd366004613c16565b610e5b565b3480156103ee57600080fd5b506104026103fd366004613c16565b610e92565b6040516102de9493929190613f55565b34801561041e57600080fd5b50600954610328565b34801561043357600080fd5b50610328610442366004613d09565b611123565b34801561045357600080fd5b50610467610462366004613c16565b6111b7565b6040516102de9190613fb5565b34801561048057600080fd5b5061035661048f366004613c16565b6111c2565b3480156104a057600080fd5b506103076104af366004613c2e565b60008281526002602090815260408083206001600160a01b038516845260080190915290205460ff1692915050565b3480156104ea57600080fd5b506040805180820190915260018152603160f81b602082015261036d565b34801561051457600080fd5b50610328610523366004613c5d565b6114d5565b34801561053457600080fd5b50610328610543366004613c16565b60066020526000908152604090205481565b34801561056157600080fd5b50600c54610575906001600160a01b031681565b6040516001600160a01b0390911681526020016102de565b34801561059957600080fd5b506103566105a8366004613c16565b6114fe565b3480156105b957600080fd5b506103286105c8366004613c88565b61153b565b3480156105d957600080fd5b506103286105e8366004613a44565b61158d565b3480156105f957600080fd5b506007546103289081565b34801561061057600080fd5b506064610328565b34801561062457600080fd5b50600354610328565b34801561063957600080fd5b50610356610648366004613972565b611626565b34801561065957600080fd5b50610328610668366004613c16565b611667565b34801561067957600080fd5b50600b54610328565b34801561068e57600080fd5b5061035661069d366004613972565b61170b565b3480156106ae57600080fd5b506103286106bd366004613c16565b611765565b3480156106ce57600080fd5b506103286106dd3660046139b9565b611794565b3480156106ee57600080fd5b506004546001600160a01b0316610575565b34801561070c57600080fd5b5061032861071b366004613aeb565b6117ce565b34801561072c57600080fd5b5061036d61073b366004613c16565b6117f3565b34801561074c57600080fd5b5060408051808201909152601a81527f737570706f72743d627261766f2671756f72756d3d627261766f000000000000602082015261036d565b34801561079257600080fd5b506103566107a1366004613c16565b61188d565b3480156107b257600080fd5b506103287f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b3480156107e657600080fd5b506108746107f5366004613c2e565b60408051606081018252600080825260208201819052918101919091525060009182526002602090815260408084206001600160a01b0393909316845260089092018152918190208151606081018352905460ff8082161515835261010082041693820193909352620100009092046001600160601b03169082015290565b6040805182511515815260208084015160ff1690820152918101516001600160601b0316908201526060016102de565b3480156108b057600080fd5b506103566108bf366004613c16565b611afb565b3480156108d057600080fd5b506103286108df36600461398e565b611b38565b3480156108f057600080fd5b506103566108ff366004613c16565b611b44565b34801561091057600080fd5b5061032861091f366004613c16565b611b81565b34801561093057600080fd5b506105757f000000000000000000000000000000000000000000000000000000000000000081565b610356610966366004613c16565b611b8c565b806000808080808080808061097f8a611667565b975061098a8b610e5b565b96506109958b611765565b60008c815260026020526040812080546005820154600683015460078401546001600160a01b039093169e50949a5098509296509194506109d58d6111b7565b905060028160078111156109f957634e487b7160e01b600052602160045260246000fd5b1493506007816007811115610a1e57634e487b7160e01b600052602160045260246000fd5b14925050509193959799509193959799565b6000610a3b82611dfa565b92915050565b610a49611e1f565b6001600160a01b0316336001600160a01b031614610a825760405162461bcd60e51b8152600401610a7990613fdd565b60405180910390fd5b610a8b81611e33565b50565b606060008054610a9d906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054610ac9906142cd565b8015610b165780601f10610aeb57610100808354040283529160200191610b16565b820191906000526020600020905b815481529060010190602001808311610af957829003601f168201915b5050505050905090565b600080610b2f86868686611794565b90506004610b3c826111b7565b6007811115610b5b57634e487b7160e01b600052602160045260246000fd5b14610b785760405162461bcd60e51b8152600401610a7990614055565b6000600460009054906101000a90046001600160a01b03166001600160a01b031663f27a0c926040518163ffffffff1660e01b815260040160206040518083038186803b158015610bc857600080fd5b505afa158015610bdc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c009190613bd6565b6004805460405163b1c5f42760e01b81529293506001600160a01b03169163b1c5f42791610c39918b918b918b916000918c9101613eaf565b60206040518083038186803b158015610c5157600080fd5b505afa158015610c65573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c899190613bd6565b600083815260056020526040808220929092556004805492516308f2a0bb60e41b81526001600160a01b0390931692638f2a0bb092610cd4928c928c928c9290918c918a9101613efd565b600060405180830381600087803b158015610cee57600080fd5b505af1158015610d02573d6000803e3d6000fd5b505050507f9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892828242610d349190614204565b604080519283526020830191909152015b60405180910390a15095945050505050565b6000610d6761091f600143614286565b905090565b600080610d7b86868686611794565b90506000610d88826111b7565b90506004816007811115610dac57634e487b7160e01b600052602160045260246000fd5b1480610dd757506005816007811115610dd557634e487b7160e01b600052602160045260246000fd5b145b610df35760405162461bcd60e51b8152600401610a7990614055565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610e518288888888611efb565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b60608060608060006002600087815260200190815260200160002090508060010181600201826003018360040183805480602002602001604051908101604052809291908181526020018280548015610f1457602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610ef6575b5050505050935082805480602002602001604051908101604052809291908181526020018280548015610f6657602002820191906000526020600020905b815481526020019060010190808311610f52575b5050505050925081805480602002602001604051908101604052809291908181526020016000905b8282101561103a578382906000526020600020018054610fad906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054610fd9906142cd565b80156110265780601f10610ffb57610100808354040283529160200191611026565b820191906000526020600020905b81548152906001019060200180831161100957829003601f168201915b505050505081526020019060010190610f8e565b50505050915080805480602002602001604051908101604052809291908181526020016000905b8282101561110d578382906000526020600020018054611080906142cd565b80601f01602080910402602001604051908101604052809291908181526020018280546110ac906142cd565b80156110f95780601f106110ce576101008083540402835291602001916110f9565b820191906000526020600020905b8154815290600101906020018083116110dc57829003601f168201915b505050505081526020019060010190611061565b5050505090509450945094509450509193509193565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff85166060820152600090819061118f906111879060800160405160208183030381529060405280519060200120611f34565b868686611f82565b90506111ac87828860405180602001604052806000815250611fa0565b979650505050505050565b6000610a3b826120b9565b600081815260026020526040902080546001600160a01b0316336001600160a01b0316148061120b5750600b548154611209906001600160a01b03166108df600143614286565b105b6112675760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72427261766f3a2070726f706f7365722061626f76652074686044820152661c995cda1bdb1960ca1b6064820152608401610a79565b6114d0816001018054806020026020016040519081016040528092919081815260200182805480156112c257602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116112a4575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561131557602002820191906000526020600020905b815481526020019060010190808311611301575b50505050506114c684600301805480602002602001604051908101604052809291908181526020016000905b828210156113ed578382906000526020600020018054611360906142cd565b80601f016020809104026020016040519081016040528092919081815260200182805461138c906142cd565b80156113d95780601f106113ae576101008083540402835291602001916113d9565b820191906000526020600020905b8154815290600101906020018083116113bc57829003601f168201915b505050505081526020019060010190611341565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114bd578382906000526020600020018054611430906142cd565b80601f016020809104026020016040519081016040528092919081815260200182805461145c906142cd565b80156114a95780601f1061147e576101008083540402835291602001916114a9565b820191906000526020600020905b81548152906001019060200180831161148c57829003601f168201915b505050505081526020019060010190611411565b505050506121a2565b8460090154612356565b505050565b6000803390506114f684828560405180602001604052806000815250611fa0565b949350505050565b611506611e1f565b6001600160a01b0316336001600160a01b0316146115365760405162461bcd60e51b8152600401610a7990613fdd565b600955565b60008033905061158386828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611fa092505050565b9695505050505050565b600061159833612392565b6115b45760405162461bcd60e51b8152600401610a7990614096565b60006115c28686868661242d565b905060006115cf60075490565b6115da906001614204565b600081815260066020526040902083905590506115fb600780546001019055565b6000828152600860209081526040909120855161161a928701906134b6565b50909695505050505050565b61162e611e1f565b6001600160a01b0316336001600160a01b03161461165e5760405162461bcd60e51b8152600401610a7990613fdd565b610a8b816124a3565b6004805460008381526005602052604080822054905163d45c443560e01b8152938401529182916001600160a01b03169063d45c44359060240160206040518083038186803b1580156116b957600080fd5b505afa1580156116cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116f19190613bd6565b9050806001146117015780611704565b60005b9392505050565b611713611e1f565b6001600160a01b0316336001600160a01b0316146117435760405162461bcd60e51b8152600401610a7990613fdd565b600c80546001600160a01b0319166001600160a01b0392909216919091179055565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610e83565b6000848484846040516020016117ad9493929190613e64565b60408051601f19818403018152919052805160209091012095945050505050565b60006117de33878787878761250c565b61158386866117ed87876121a2565b8561158d565b6008602052600090815260409020805461180c906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611838906142cd565b80156118855780601f1061185a57610100808354040283529160200191611885565b820191906000526020600020905b81548152906001019060200180831161186857829003601f168201915b505050505081565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936114d0939092908301828280156118f657602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116118d8575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561194957602002820191906000526020600020905b815481526020019060010190808311611935575b5050505050611af184600301805480602002602001604051908101604052809291908181526020016000905b82821015611a21578382906000526020600020018054611994906142cd565b80601f01602080910402602001604051908101604052809291908181526020018280546119c0906142cd565b8015611a0d5780601f106119e257610100808354040283529160200191611a0d565b820191906000526020600020905b8154815290600101906020018083116119f057829003601f168201915b505050505081526020019060010190611975565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114bd578382906000526020600020018054611a64906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611a90906142cd565b8015611add5780601f10611ab257610100808354040283529160200191611add565b820191906000526020600020905b815481529060010190602001808311611ac057829003601f168201915b505050505081526020019060010190611a45565b8460090154610b20565b611b03611e1f565b6001600160a01b0316336001600160a01b031614611b335760405162461bcd60e51b8152600401610a7990613fdd565b600a55565b600061170483836125c9565b611b4c611e1f565b6001600160a01b0316336001600160a01b031614611b7c5760405162461bcd60e51b8152600401610a7990613fdd565b600b55565b6000610a3b8261266e565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936114d093909290830182828015611bf557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611bd7575b505050505082600201805480602002602001604051908101604052809291908181526020018280548015611c4857602002820191906000526020600020905b815481526020019060010190808311611c34575b5050505050611df084600301805480602002602001604051908101604052809291908181526020016000905b82821015611d20578382906000526020600020018054611c93906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611cbf906142cd565b8015611d0c5780601f10611ce157610100808354040283529160200191611d0c565b820191906000526020600020905b815481529060010190602001808311611cef57829003601f168201915b505050505081526020019060010190611c74565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114bd578382906000526020600020018054611d63906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611d8f906142cd565b8015611ddc5780601f10611db157610100808354040283529160200191611ddc565b820191906000526020600020905b815481529060010190602001808311611dbf57829003601f168201915b505050505081526020019060010190611d44565b8460090154610d6c565b60006001600160e01b03198216636e665ced60e01b1480610a3b5750610a3b82612721565b6000610d676004546001600160a01b031690565b6064811115611eb65760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a401610a79565b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611f0433612392565b611f205760405162461bcd60e51b8152600401610a7990614096565b611f2d8585858585612756565b5050505050565b6000610a3b611f416127c9565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611f93878787876128bc565b91509150610e51816129a9565b6000848152600160208190526040822090611fba876111b7565b6007811115611fd957634e487b7160e01b600052602160045260246000fd5b146120325760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b6064820152608401610a79565b604080516020810190915281546001600160401b03169081905260009061205a908790611b38565b905061206887878784612baa565b856001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4888784886040516120a79493929190614189565b60405180910390a29695505050505050565b6000806120c583612d4f565b905060048160078111156120e957634e487b7160e01b600052602160045260246000fd5b146120f45792915050565b6000838152600560205260409020548061210f575092915050565b60048054604051632ab0f52960e01b81529182018390526001600160a01b031690632ab0f5299060240160206040518083038186803b15801561215157600080fd5b505afa158015612165573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121899190613bb6565b15612198575060079392505050565b5060059392505050565b6060600082516001600160401b038111156121cd57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561220057816020015b60608152602001906001900390816121eb5790505b50905060005b845181101561234e5784818151811061222f57634e487b7160e01b600052603260045260246000fd5b6020026020010151516000146122e95784818151811061225f57634e487b7160e01b600052603260045260246000fd5b602002602001015184828151811061228757634e487b7160e01b600052603260045260246000fd5b602002602001015160405160240161229f9190613fa2565b60408051601f1981840301815290829052916122ba91613e48565b6040519081900390206020820180516001600160e01b03166001600160e01b0319909216919091179052612312565b83818151811061230957634e487b7160e01b600052603260045260246000fd5b60200260200101515b82828151811061233257634e487b7160e01b600052603260045260246000fd5b60200260200101819052508061234790614302565b9050612206565b509392505050565b600061236133612392565b61237d5760405162461bcd60e51b8152600401610a7990614096565b61238985858585612eb5565b95945050505050565b600c546000906001600160a01b03161580610a3b5750600c546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b1580156123ee57600080fd5b505afa158015612402573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124269190613bd6565b1192915050565b600061249733868686516001600160401b0381111561245c57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561248f57816020015b606081526020019060019003908161247a5790505b50878761250c565b61238985858585612f5d565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b80516020820120600061252a878761252488886121a2565b85611794565b60008181526002602052604090206009810154919250906125be5780546001600160a01b0319166001600160a01b038a16178155875161257390600183019060208b0190613536565b50865161258990600283019060208a019061358b565b50855161259f90600383019060208901906135c5565b5084516125b5906004830190602088019061361e565b50600981018390555b505050505050505050565b604051630748d63560e31b81526001600160a01b038381166004830152602482018390526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a89060440160206040518083038186803b15801561263657600080fd5b505afa15801561264a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117049190613bd6565b60006064600354604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c9060240160206040518083038186803b1580156126d557600080fd5b505afa1580156126e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061270d9190613bd6565b6127179190614267565b610a3b9190614247565b60006001600160e01b0319821663bf26d89760e01b1480610a3b57506301ffc9a760e01b6001600160e01b0319831614610a3b565b6004805460405163e38335e560e01b81526001600160a01b039091169163e38335e5913491612790918991899189916000918a9101613eaf565b6000604051808303818588803b1580156127a957600080fd5b505af11580156127bd573d6000803e3d6000fd5b50505050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000046141561281857507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156128f357506000905060036129a0565b8460ff16601b1415801561290b57508460ff16601c14155b1561291c57506000905060046129a0565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015612970573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116612999576000600192509250506129a0565b9150600090505b94509492505050565b60008160048111156129cb57634e487b7160e01b600052602160045260246000fd5b14156129d45750565b60018160048111156129f657634e487b7160e01b600052602160045260246000fd5b1415612a445760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a79565b6002816004811115612a6657634e487b7160e01b600052602160045260246000fd5b1415612ab45760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a79565b6003816004811115612ad657634e487b7160e01b600052602160045260246000fd5b1415612b2f5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a79565b6004816004811115612b5157634e487b7160e01b600052602160045260246000fd5b1415610a8b5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a79565b60008481526002602090815260408083206001600160a01b038716845260088101909252909120805460ff1615612c395760405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20766f746560448201526c08185b1c9958591e4818d85cdd609a1b6064820152608401610a79565b805460ff85166101000261ffff19909116176001178155612c5983613003565b81546001600160601b039190911662010000026dffffffffffffffffffffffff00001990911617815560ff8416612ca95782826006016000828254612c9e9190614204565b90915550612d479050565b60ff841660011415612cc95782826005016000828254612c9e9190614204565b60ff841660021415612ce95782826007016000828254612c9e9190614204565b60405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20696e766160448201526c6c696420766f7465207479706560981b6064820152608401610a79565b505050505050565b6000818152600160208181526040808420815160a08101835281546001600160401b0390811660808301908152825283518086018552958301541685529283019390935260029092015460ff80821615801594840194909452610100909104161515606082015290612dc45750600792915050565b806060015115612dd75750600292915050565b805151436001600160401b039091161115612df55750600092915050565b602081015151436001600160401b039091161115612e165750600192915050565b612e23816020015161306f565b15612e6757612e318361309e565b8015612e53575060008381526002602052604090206006810154600590910154115b612e5e576003611704565b60049392505050565b60405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c2069640000006044820152606401610a79565b50919050565b600080612ec4868686866130c5565b6000818152600560205260409020549091501561238957600480546000838152600560205260409081902054905163c4d252f560e01b8152928301526001600160a01b03169063c4d252f590602401600060405180830381600087803b158015612f2d57600080fd5b505af1158015612f41573d6000803e3d6000fd5b5050506000828152600560205260408120555095945050505050565b6000612f68600b5490565b612f77336108df600143614286565b1015612ff75760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a2070726f7060448201527f6f73657220766f7465732062656c6f772070726f706f73616c207468726573686064820152621bdb1960ea1b608482015260a401610a79565b612389858585856131fb565b60006001600160601b0382111561306b5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203960448201526536206269747360d01b6064820152608401610a79565b5090565b600061308482516001600160401b0316151590565b8015610a3b57505051436001600160401b03909116111590565b600081815260026020526040812060058101546130bd61091f85610e5b565b109392505050565b6000806130d486868686611794565b905060006130e1826111b7565b9050600281600781111561310557634e487b7160e01b600052602160045260246000fd5b141580156131335750600681600781111561313057634e487b7160e01b600052602160045260246000fd5b14155b801561315f5750600781600781111561315c57634e487b7160e01b600052602160045260246000fd5b14155b6131ab5760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a2070726f706f73616c206e6f74206163746976650000006044820152606401610a79565b60008281526001602052604090819020600201805461ff001916610100179055517f789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c90610d459084815260200190565b6000806132118686868680519060200120611794565b905084518651146132345760405162461bcd60e51b8152600401610a7990614014565b83518651146132555760405162461bcd60e51b8152600401610a7990614014565b60008651116132a65760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c00000000000000006044820152606401610a79565b600081815260016020908152604091829020825191820190925281546001600160401b031690819052156133265760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b6064820152608401610a79565b600061333961333460095490565b61344e565b6133424361344e565b61334c919061421c565b9050600061335c613334600a5490565b613366908361421c565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b038111156133ec57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561341f57816020015b606081526020019060019003908161340a5790505b508c88888e604051613439999897969594939291906140e6565b60405180910390a15091979650505050505050565b60006001600160401b0382111561306b5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b6064820152608401610a79565b8280546134c2906142cd565b90600052602060002090601f0160209004810192826134e4576000855561352a565b82601f106134fd57805160ff191683800117855561352a565b8280016001018555821561352a579182015b8281111561352a57825182559160200191906001019061350f565b5061306b929150613677565b82805482825590600052602060002090810192821561352a579160200282015b8281111561352a57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190613556565b82805482825590600052602060002090810192821561352a579160200282018281111561352a57825182559160200191906001019061350f565b828054828255906000526020600020908101928215613612579160200282015b8281111561361257825180516136029184916020909101906134b6565b50916020019190600101906135e5565b5061306b92915061368c565b82805482825590600052602060002090810192821561366b579160200282015b8281111561366b578251805161365b9184916020909101906134b6565b509160200191906001019061363e565b5061306b9291506136a9565b5b8082111561306b5760008155600101613678565b8082111561306b5760006136a082826136c6565b5060010161368c565b8082111561306b5760006136bd82826136c6565b506001016136a9565b5080546136d2906142cd565b6000825580601f106136e2575050565b601f016020900490600052602060002090810190610a8b9190613677565b60006001600160401b0383111561371957613719614333565b61372c601f8401601f19166020016141b1565b905082815283838301111561374057600080fd5b828260208301376000602084830101529392505050565b600082601f830112613767578081fd5b8135602061377c613777836141e1565b6141b1565b80838252828201915082860187848660051b890101111561379b578586fd5b855b858110156137c25781356137b081614349565b8452928401929084019060010161379d565b5090979650505050505050565b600082601f8301126137df578081fd5b813560206137ef613777836141e1565b80838252828201915082860187848660051b890101111561380e578586fd5b855b858110156137c25781356001600160401b0381111561382d578788fd5b8801603f81018a1361383d578788fd5b61384e8a8783013560408401613700565b8552509284019290840190600101613810565b600082601f830112613871578081fd5b81356020613881613777836141e1565b80838252828201915082860187848660051b89010111156138a0578586fd5b855b858110156137c25781356001600160401b038111156138bf578788fd5b6138cd8a87838c010161393d565b85525092840192908401906001016138a2565b600082601f8301126138f0578081fd5b81356020613900613777836141e1565b80838252828201915082860187848660051b890101111561391f578586fd5b855b858110156137c257813584529284019290840190600101613921565b600082601f83011261394d578081fd5b61170483833560208501613700565b803560ff8116811461396d57600080fd5b919050565b600060208284031215613983578081fd5b813561170481614349565b600080604083850312156139a0578081fd5b82356139ab81614349565b946020939093013593505050565b600080600080608085870312156139ce578182fd5b84356001600160401b03808211156139e4578384fd5b6139f088838901613757565b95506020870135915080821115613a05578384fd5b613a11888389016138e0565b94506040870135915080821115613a26578384fd5b50613a33878288016137cf565b949793965093946060013593505050565b60008060008060808587031215613a59578182fd5b84356001600160401b0380821115613a6f578384fd5b613a7b88838901613757565b95506020870135915080821115613a90578384fd5b613a9c888389016138e0565b94506040870135915080821115613ab1578384fd5b613abd888389016137cf565b93506060870135915080821115613ad2578283fd5b50613adf8782880161393d565b91505092959194509250565b600080600080600060a08688031215613b02578283fd5b85356001600160401b0380821115613b18578485fd5b613b2489838a01613757565b96506020880135915080821115613b39578485fd5b613b4589838a016138e0565b95506040880135915080821115613b5a578485fd5b613b6689838a01613861565b94506060880135915080821115613b7b578283fd5b613b8789838a016137cf565b93506080880135915080821115613b9c578283fd5b50613ba98882890161393d565b9150509295509295909350565b600060208284031215613bc7578081fd5b81518015158114611704578182fd5b600060208284031215613be7578081fd5b5051919050565b600060208284031215613bff578081fd5b81356001600160e01b031981168114611704578182fd5b600060208284031215613c27578081fd5b5035919050565b60008060408385031215613c40578182fd5b823591506020830135613c5281614349565b809150509250929050565b60008060408385031215613c6f578182fd5b82359150613c7f6020840161395c565b90509250929050565b60008060008060608587031215613c9d578182fd5b84359350613cad6020860161395c565b925060408501356001600160401b0380821115613cc8578384fd5b818701915087601f830112613cdb578384fd5b813581811115613ce9578485fd5b886020828501011115613cfa578485fd5b95989497505060200194505050565b600080600080600060a08688031215613d20578283fd5b85359450613d306020870161395c565b9350613d3e6040870161395c565b94979396509394606081013594506080013592915050565b6000815180845260208085019450808401835b83811015613d8e5781516001600160a01b031687529582019590820190600101613d69565b509495945050505050565b600081518084526020808501808196508360051b81019150828601855b85811015613de0578284038952613dce848351613e1c565b98850198935090840190600101613db6565b5091979650505050505050565b6000815180845260208085019450808401835b83811015613d8e57815187529582019590820190600101613e00565b60008151808452613e3481602086016020860161429d565b601f01601f19169290920160200192915050565b60008251613e5a81846020870161429d565b9190910192915050565b608081526000613e776080830187613d56565b8281036020840152613e898187613ded565b90508281036040840152613e9d8186613d99565b91505082606083015295945050505050565b60a081526000613ec260a0830188613d56565b8281036020840152613ed48188613ded565b90508281036040840152613ee88187613d99565b60608401959095525050608001529392505050565b60c081526000613f1060c0830189613d56565b8281036020840152613f228189613ded565b90508281036040840152613f368188613d99565b60608401969096525050608081019290925260a0909101529392505050565b608081526000613f686080830187613d56565b8281036020840152613f7a8187613ded565b90508281036040840152613f8e8186613d99565b905082810360608401526111ac8185613d99565b6020815260006117046020830184613e1c565b6020810160088310613fd757634e487b7160e01b600052602160045260246000fd5b91905290565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b60208082526021908201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756040820152601b60fa1b606082015260800190565b60208082526030908201527f476f7665726e616e63653a2063616c6c6572206d75737420686176652061204860408201526f3cb832b93732ba10283937b334b6329760811b606082015260800190565b8981526001600160a01b0389166020820152610120604082018190526000906141118382018b613d56565b90508281036060840152614125818a613ded565b905082810360808401526141398189613d99565b905082810360a084015261414d8188613d99565b6001600160401b0387811660c0860152861660e085015283810361010085015290506141798185613e1c565b9c9b505050505050505050505050565b84815260ff841660208201528260408201526080606082015260006115836080830184613e1c565b604051601f8201601f191681016001600160401b03811182821017156141d9576141d9614333565b604052919050565b60006001600160401b038211156141fa576141fa614333565b5060051b60200190565b600082198211156142175761421761431d565b500190565b60006001600160401b0380831681851680830382111561423e5761423e61431d565b01949350505050565b60008261426257634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156142815761428161431d565b500290565b6000828210156142985761429861431d565b500390565b60005b838110156142b85781810151838201526020016142a0565b838111156142c7576000848401525b50505050565b600181811c908216806142e157607f821691505b60208210811415612eaf57634e487b7160e01b600052602260045260246000fd5b60006000198214156143165761431661431d565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114610a8b57600080fdfea2646970667358221220048a23e53cf7fc737ed47ff134c625a23b758713ec53fe3363f59ccbf327185f64736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102675760003560e01c80638059f7e111610144578063dc45c5c1116100b6578063ea0217cf1161007a578063ea0217cf146108a4578063eb9019d4146108c4578063ece40cc1146108e4578063f8ce560a14610904578063fc0c546a14610924578063fe0d94c11461095857600080fd5b8063dc45c5c114610720578063dd4e2ba514610740578063ddf0b00914610786578063deaaa7cc146107a6578063e23a9a52146107da57600080fd5b8063b58131b011610108578063b58131b01461066d578063b6a67c4b14610682578063c01f9e37146106a2578063c59057e4146106c2578063d33219b4146106e2578063da95691a1461070057600080fd5b80638059f7e1146105ed57806397c3d33414610604578063a7713a7014610618578063a890c9101461062d578063ab58fb8e1461064d57600080fd5b80633bccf4fd116101dd57806356781388116101a157806356781388146105085780635aeb927e146105285780636a8828da1461055557806370b0f6601461058d5780637b3c71d3146105ad5780637d5e81e2146105cd57600080fd5b80633bccf4fd146104275780633e4f49e61461044757806340e58ee514610474578063438596321461049457806354fd4d50146104de57600080fd5b8063160cbed71161022f578063160cbed71461037a57806324bc1a641461039a5780632656227d146103af5780632d63f693146103c2578063328dd982146103e25780633932abb11461041257600080fd5b8063013cf08b1461026c57806301ffc9a7146102e757806302a251a31461031757806306f3f9e61461033657806306fdde0314610358575b600080fd5b34801561027857600080fd5b5061028c610287366004613c16565b61096b565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b3480156102f357600080fd5b50610307610302366004613bee565b610a30565b60405190151581526020016102de565b34801561032357600080fd5b50600a545b6040519081526020016102de565b34801561034257600080fd5b50610356610351366004613c16565b610a41565b005b34801561036457600080fd5b5061036d610a8e565b6040516102de9190613fa2565b34801561038657600080fd5b506103286103953660046139b9565b610b20565b3480156103a657600080fd5b50610328610d57565b6103286103bd3660046139b9565b610d6c565b3480156103ce57600080fd5b506103286103dd366004613c16565b610e5b565b3480156103ee57600080fd5b506104026103fd366004613c16565b610e92565b6040516102de9493929190613f55565b34801561041e57600080fd5b50600954610328565b34801561043357600080fd5b50610328610442366004613d09565b611123565b34801561045357600080fd5b50610467610462366004613c16565b6111b7565b6040516102de9190613fb5565b34801561048057600080fd5b5061035661048f366004613c16565b6111c2565b3480156104a057600080fd5b506103076104af366004613c2e565b60008281526002602090815260408083206001600160a01b038516845260080190915290205460ff1692915050565b3480156104ea57600080fd5b506040805180820190915260018152603160f81b602082015261036d565b34801561051457600080fd5b50610328610523366004613c5d565b6114d5565b34801561053457600080fd5b50610328610543366004613c16565b60066020526000908152604090205481565b34801561056157600080fd5b50600c54610575906001600160a01b031681565b6040516001600160a01b0390911681526020016102de565b34801561059957600080fd5b506103566105a8366004613c16565b6114fe565b3480156105b957600080fd5b506103286105c8366004613c88565b61153b565b3480156105d957600080fd5b506103286105e8366004613a44565b61158d565b3480156105f957600080fd5b506007546103289081565b34801561061057600080fd5b506064610328565b34801561062457600080fd5b50600354610328565b34801561063957600080fd5b50610356610648366004613972565b611626565b34801561065957600080fd5b50610328610668366004613c16565b611667565b34801561067957600080fd5b50600b54610328565b34801561068e57600080fd5b5061035661069d366004613972565b61170b565b3480156106ae57600080fd5b506103286106bd366004613c16565b611765565b3480156106ce57600080fd5b506103286106dd3660046139b9565b611794565b3480156106ee57600080fd5b506004546001600160a01b0316610575565b34801561070c57600080fd5b5061032861071b366004613aeb565b6117ce565b34801561072c57600080fd5b5061036d61073b366004613c16565b6117f3565b34801561074c57600080fd5b5060408051808201909152601a81527f737570706f72743d627261766f2671756f72756d3d627261766f000000000000602082015261036d565b34801561079257600080fd5b506103566107a1366004613c16565b61188d565b3480156107b257600080fd5b506103287f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b3480156107e657600080fd5b506108746107f5366004613c2e565b60408051606081018252600080825260208201819052918101919091525060009182526002602090815260408084206001600160a01b0393909316845260089092018152918190208151606081018352905460ff8082161515835261010082041693820193909352620100009092046001600160601b03169082015290565b6040805182511515815260208084015160ff1690820152918101516001600160601b0316908201526060016102de565b3480156108b057600080fd5b506103566108bf366004613c16565b611afb565b3480156108d057600080fd5b506103286108df36600461398e565b611b38565b3480156108f057600080fd5b506103566108ff366004613c16565b611b44565b34801561091057600080fd5b5061032861091f366004613c16565b611b81565b34801561093057600080fd5b506105757f000000000000000000000000000000000000000000000000000000000000000081565b610356610966366004613c16565b611b8c565b806000808080808080808061097f8a611667565b975061098a8b610e5b565b96506109958b611765565b60008c815260026020526040812080546005820154600683015460078401546001600160a01b039093169e50949a5098509296509194506109d58d6111b7565b905060028160078111156109f957634e487b7160e01b600052602160045260246000fd5b1493506007816007811115610a1e57634e487b7160e01b600052602160045260246000fd5b14925050509193959799509193959799565b6000610a3b82611dfa565b92915050565b610a49611e1f565b6001600160a01b0316336001600160a01b031614610a825760405162461bcd60e51b8152600401610a7990613fdd565b60405180910390fd5b610a8b81611e33565b50565b606060008054610a9d906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054610ac9906142cd565b8015610b165780601f10610aeb57610100808354040283529160200191610b16565b820191906000526020600020905b815481529060010190602001808311610af957829003601f168201915b5050505050905090565b600080610b2f86868686611794565b90506004610b3c826111b7565b6007811115610b5b57634e487b7160e01b600052602160045260246000fd5b14610b785760405162461bcd60e51b8152600401610a7990614055565b6000600460009054906101000a90046001600160a01b03166001600160a01b031663f27a0c926040518163ffffffff1660e01b815260040160206040518083038186803b158015610bc857600080fd5b505afa158015610bdc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c009190613bd6565b6004805460405163b1c5f42760e01b81529293506001600160a01b03169163b1c5f42791610c39918b918b918b916000918c9101613eaf565b60206040518083038186803b158015610c5157600080fd5b505afa158015610c65573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c899190613bd6565b600083815260056020526040808220929092556004805492516308f2a0bb60e41b81526001600160a01b0390931692638f2a0bb092610cd4928c928c928c9290918c918a9101613efd565b600060405180830381600087803b158015610cee57600080fd5b505af1158015610d02573d6000803e3d6000fd5b505050507f9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892828242610d349190614204565b604080519283526020830191909152015b60405180910390a15095945050505050565b6000610d6761091f600143614286565b905090565b600080610d7b86868686611794565b90506000610d88826111b7565b90506004816007811115610dac57634e487b7160e01b600052602160045260246000fd5b1480610dd757506005816007811115610dd557634e487b7160e01b600052602160045260246000fd5b145b610df35760405162461bcd60e51b8152600401610a7990614055565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610e518288888888611efb565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b60608060608060006002600087815260200190815260200160002090508060010181600201826003018360040183805480602002602001604051908101604052809291908181526020018280548015610f1457602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610ef6575b5050505050935082805480602002602001604051908101604052809291908181526020018280548015610f6657602002820191906000526020600020905b815481526020019060010190808311610f52575b5050505050925081805480602002602001604051908101604052809291908181526020016000905b8282101561103a578382906000526020600020018054610fad906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054610fd9906142cd565b80156110265780601f10610ffb57610100808354040283529160200191611026565b820191906000526020600020905b81548152906001019060200180831161100957829003601f168201915b505050505081526020019060010190610f8e565b50505050915080805480602002602001604051908101604052809291908181526020016000905b8282101561110d578382906000526020600020018054611080906142cd565b80601f01602080910402602001604051908101604052809291908181526020018280546110ac906142cd565b80156110f95780601f106110ce576101008083540402835291602001916110f9565b820191906000526020600020905b8154815290600101906020018083116110dc57829003601f168201915b505050505081526020019060010190611061565b5050505090509450945094509450509193509193565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff85166060820152600090819061118f906111879060800160405160208183030381529060405280519060200120611f34565b868686611f82565b90506111ac87828860405180602001604052806000815250611fa0565b979650505050505050565b6000610a3b826120b9565b600081815260026020526040902080546001600160a01b0316336001600160a01b0316148061120b5750600b548154611209906001600160a01b03166108df600143614286565b105b6112675760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72427261766f3a2070726f706f7365722061626f76652074686044820152661c995cda1bdb1960ca1b6064820152608401610a79565b6114d0816001018054806020026020016040519081016040528092919081815260200182805480156112c257602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116112a4575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561131557602002820191906000526020600020905b815481526020019060010190808311611301575b50505050506114c684600301805480602002602001604051908101604052809291908181526020016000905b828210156113ed578382906000526020600020018054611360906142cd565b80601f016020809104026020016040519081016040528092919081815260200182805461138c906142cd565b80156113d95780601f106113ae576101008083540402835291602001916113d9565b820191906000526020600020905b8154815290600101906020018083116113bc57829003601f168201915b505050505081526020019060010190611341565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114bd578382906000526020600020018054611430906142cd565b80601f016020809104026020016040519081016040528092919081815260200182805461145c906142cd565b80156114a95780601f1061147e576101008083540402835291602001916114a9565b820191906000526020600020905b81548152906001019060200180831161148c57829003601f168201915b505050505081526020019060010190611411565b505050506121a2565b8460090154612356565b505050565b6000803390506114f684828560405180602001604052806000815250611fa0565b949350505050565b611506611e1f565b6001600160a01b0316336001600160a01b0316146115365760405162461bcd60e51b8152600401610a7990613fdd565b600955565b60008033905061158386828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611fa092505050565b9695505050505050565b600061159833612392565b6115b45760405162461bcd60e51b8152600401610a7990614096565b60006115c28686868661242d565b905060006115cf60075490565b6115da906001614204565b600081815260066020526040902083905590506115fb600780546001019055565b6000828152600860209081526040909120855161161a928701906134b6565b50909695505050505050565b61162e611e1f565b6001600160a01b0316336001600160a01b03161461165e5760405162461bcd60e51b8152600401610a7990613fdd565b610a8b816124a3565b6004805460008381526005602052604080822054905163d45c443560e01b8152938401529182916001600160a01b03169063d45c44359060240160206040518083038186803b1580156116b957600080fd5b505afa1580156116cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116f19190613bd6565b9050806001146117015780611704565b60005b9392505050565b611713611e1f565b6001600160a01b0316336001600160a01b0316146117435760405162461bcd60e51b8152600401610a7990613fdd565b600c80546001600160a01b0319166001600160a01b0392909216919091179055565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610e83565b6000848484846040516020016117ad9493929190613e64565b60408051601f19818403018152919052805160209091012095945050505050565b60006117de33878787878761250c565b61158386866117ed87876121a2565b8561158d565b6008602052600090815260409020805461180c906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611838906142cd565b80156118855780601f1061185a57610100808354040283529160200191611885565b820191906000526020600020905b81548152906001019060200180831161186857829003601f168201915b505050505081565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936114d0939092908301828280156118f657602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116118d8575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561194957602002820191906000526020600020905b815481526020019060010190808311611935575b5050505050611af184600301805480602002602001604051908101604052809291908181526020016000905b82821015611a21578382906000526020600020018054611994906142cd565b80601f01602080910402602001604051908101604052809291908181526020018280546119c0906142cd565b8015611a0d5780601f106119e257610100808354040283529160200191611a0d565b820191906000526020600020905b8154815290600101906020018083116119f057829003601f168201915b505050505081526020019060010190611975565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114bd578382906000526020600020018054611a64906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611a90906142cd565b8015611add5780601f10611ab257610100808354040283529160200191611add565b820191906000526020600020905b815481529060010190602001808311611ac057829003601f168201915b505050505081526020019060010190611a45565b8460090154610b20565b611b03611e1f565b6001600160a01b0316336001600160a01b031614611b335760405162461bcd60e51b8152600401610a7990613fdd565b600a55565b600061170483836125c9565b611b4c611e1f565b6001600160a01b0316336001600160a01b031614611b7c5760405162461bcd60e51b8152600401610a7990613fdd565b600b55565b6000610a3b8261266e565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936114d093909290830182828015611bf557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611bd7575b505050505082600201805480602002602001604051908101604052809291908181526020018280548015611c4857602002820191906000526020600020905b815481526020019060010190808311611c34575b5050505050611df084600301805480602002602001604051908101604052809291908181526020016000905b82821015611d20578382906000526020600020018054611c93906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611cbf906142cd565b8015611d0c5780601f10611ce157610100808354040283529160200191611d0c565b820191906000526020600020905b815481529060010190602001808311611cef57829003601f168201915b505050505081526020019060010190611c74565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156114bd578382906000526020600020018054611d63906142cd565b80601f0160208091040260200160405190810160405280929190818152602001828054611d8f906142cd565b8015611ddc5780601f10611db157610100808354040283529160200191611ddc565b820191906000526020600020905b815481529060010190602001808311611dbf57829003601f168201915b505050505081526020019060010190611d44565b8460090154610d6c565b60006001600160e01b03198216636e665ced60e01b1480610a3b5750610a3b82612721565b6000610d676004546001600160a01b031690565b6064811115611eb65760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a401610a79565b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611f0433612392565b611f205760405162461bcd60e51b8152600401610a7990614096565b611f2d8585858585612756565b5050505050565b6000610a3b611f416127c9565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611f93878787876128bc565b91509150610e51816129a9565b6000848152600160208190526040822090611fba876111b7565b6007811115611fd957634e487b7160e01b600052602160045260246000fd5b146120325760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b6064820152608401610a79565b604080516020810190915281546001600160401b03169081905260009061205a908790611b38565b905061206887878784612baa565b856001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4888784886040516120a79493929190614189565b60405180910390a29695505050505050565b6000806120c583612d4f565b905060048160078111156120e957634e487b7160e01b600052602160045260246000fd5b146120f45792915050565b6000838152600560205260409020548061210f575092915050565b60048054604051632ab0f52960e01b81529182018390526001600160a01b031690632ab0f5299060240160206040518083038186803b15801561215157600080fd5b505afa158015612165573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121899190613bb6565b15612198575060079392505050565b5060059392505050565b6060600082516001600160401b038111156121cd57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561220057816020015b60608152602001906001900390816121eb5790505b50905060005b845181101561234e5784818151811061222f57634e487b7160e01b600052603260045260246000fd5b6020026020010151516000146122e95784818151811061225f57634e487b7160e01b600052603260045260246000fd5b602002602001015184828151811061228757634e487b7160e01b600052603260045260246000fd5b602002602001015160405160240161229f9190613fa2565b60408051601f1981840301815290829052916122ba91613e48565b6040519081900390206020820180516001600160e01b03166001600160e01b0319909216919091179052612312565b83818151811061230957634e487b7160e01b600052603260045260246000fd5b60200260200101515b82828151811061233257634e487b7160e01b600052603260045260246000fd5b60200260200101819052508061234790614302565b9050612206565b509392505050565b600061236133612392565b61237d5760405162461bcd60e51b8152600401610a7990614096565b61238985858585612eb5565b95945050505050565b600c546000906001600160a01b03161580610a3b5750600c546040516370a0823160e01b81526001600160a01b03848116600483015260009216906370a082319060240160206040518083038186803b1580156123ee57600080fd5b505afa158015612402573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124269190613bd6565b1192915050565b600061249733868686516001600160401b0381111561245c57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561248f57816020015b606081526020019060019003908161247a5790505b50878761250c565b61238985858585612f5d565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b80516020820120600061252a878761252488886121a2565b85611794565b60008181526002602052604090206009810154919250906125be5780546001600160a01b0319166001600160a01b038a16178155875161257390600183019060208b0190613536565b50865161258990600283019060208a019061358b565b50855161259f90600383019060208901906135c5565b5084516125b5906004830190602088019061361e565b50600981018390555b505050505050505050565b604051630748d63560e31b81526001600160a01b038381166004830152602482018390526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a89060440160206040518083038186803b15801561263657600080fd5b505afa15801561264a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117049190613bd6565b60006064600354604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c9060240160206040518083038186803b1580156126d557600080fd5b505afa1580156126e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061270d9190613bd6565b6127179190614267565b610a3b9190614247565b60006001600160e01b0319821663bf26d89760e01b1480610a3b57506301ffc9a760e01b6001600160e01b0319831614610a3b565b6004805460405163e38335e560e01b81526001600160a01b039091169163e38335e5913491612790918991899189916000918a9101613eaf565b6000604051808303818588803b1580156127a957600080fd5b505af11580156127bd573d6000803e3d6000fd5b50505050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000046141561281857507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156128f357506000905060036129a0565b8460ff16601b1415801561290b57508460ff16601c14155b1561291c57506000905060046129a0565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015612970573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116612999576000600192509250506129a0565b9150600090505b94509492505050565b60008160048111156129cb57634e487b7160e01b600052602160045260246000fd5b14156129d45750565b60018160048111156129f657634e487b7160e01b600052602160045260246000fd5b1415612a445760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610a79565b6002816004811115612a6657634e487b7160e01b600052602160045260246000fd5b1415612ab45760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610a79565b6003816004811115612ad657634e487b7160e01b600052602160045260246000fd5b1415612b2f5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610a79565b6004816004811115612b5157634e487b7160e01b600052602160045260246000fd5b1415610a8b5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610a79565b60008481526002602090815260408083206001600160a01b038716845260088101909252909120805460ff1615612c395760405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20766f746560448201526c08185b1c9958591e4818d85cdd609a1b6064820152608401610a79565b805460ff85166101000261ffff19909116176001178155612c5983613003565b81546001600160601b039190911662010000026dffffffffffffffffffffffff00001990911617815560ff8416612ca95782826006016000828254612c9e9190614204565b90915550612d479050565b60ff841660011415612cc95782826005016000828254612c9e9190614204565b60ff841660021415612ce95782826007016000828254612c9e9190614204565b60405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20696e766160448201526c6c696420766f7465207479706560981b6064820152608401610a79565b505050505050565b6000818152600160208181526040808420815160a08101835281546001600160401b0390811660808301908152825283518086018552958301541685529283019390935260029092015460ff80821615801594840194909452610100909104161515606082015290612dc45750600792915050565b806060015115612dd75750600292915050565b805151436001600160401b039091161115612df55750600092915050565b602081015151436001600160401b039091161115612e165750600192915050565b612e23816020015161306f565b15612e6757612e318361309e565b8015612e53575060008381526002602052604090206006810154600590910154115b612e5e576003611704565b60049392505050565b60405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c2069640000006044820152606401610a79565b50919050565b600080612ec4868686866130c5565b6000818152600560205260409020549091501561238957600480546000838152600560205260409081902054905163c4d252f560e01b8152928301526001600160a01b03169063c4d252f590602401600060405180830381600087803b158015612f2d57600080fd5b505af1158015612f41573d6000803e3d6000fd5b5050506000828152600560205260408120555095945050505050565b6000612f68600b5490565b612f77336108df600143614286565b1015612ff75760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a2070726f7060448201527f6f73657220766f7465732062656c6f772070726f706f73616c207468726573686064820152621bdb1960ea1b608482015260a401610a79565b612389858585856131fb565b60006001600160601b0382111561306b5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203960448201526536206269747360d01b6064820152608401610a79565b5090565b600061308482516001600160401b0316151590565b8015610a3b57505051436001600160401b03909116111590565b600081815260026020526040812060058101546130bd61091f85610e5b565b109392505050565b6000806130d486868686611794565b905060006130e1826111b7565b9050600281600781111561310557634e487b7160e01b600052602160045260246000fd5b141580156131335750600681600781111561313057634e487b7160e01b600052602160045260246000fd5b14155b801561315f5750600781600781111561315c57634e487b7160e01b600052602160045260246000fd5b14155b6131ab5760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a2070726f706f73616c206e6f74206163746976650000006044820152606401610a79565b60008281526001602052604090819020600201805461ff001916610100179055517f789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c90610d459084815260200190565b6000806132118686868680519060200120611794565b905084518651146132345760405162461bcd60e51b8152600401610a7990614014565b83518651146132555760405162461bcd60e51b8152600401610a7990614014565b60008651116132a65760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c00000000000000006044820152606401610a79565b600081815260016020908152604091829020825191820190925281546001600160401b031690819052156133265760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b6064820152608401610a79565b600061333961333460095490565b61344e565b6133424361344e565b61334c919061421c565b9050600061335c613334600a5490565b613366908361421c565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b038111156133ec57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561341f57816020015b606081526020019060019003908161340a5790505b508c88888e604051613439999897969594939291906140e6565b60405180910390a15091979650505050505050565b60006001600160401b0382111561306b5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b6064820152608401610a79565b8280546134c2906142cd565b90600052602060002090601f0160209004810192826134e4576000855561352a565b82601f106134fd57805160ff191683800117855561352a565b8280016001018555821561352a579182015b8281111561352a57825182559160200191906001019061350f565b5061306b929150613677565b82805482825590600052602060002090810192821561352a579160200282015b8281111561352a57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190613556565b82805482825590600052602060002090810192821561352a579160200282018281111561352a57825182559160200191906001019061350f565b828054828255906000526020600020908101928215613612579160200282015b8281111561361257825180516136029184916020909101906134b6565b50916020019190600101906135e5565b5061306b92915061368c565b82805482825590600052602060002090810192821561366b579160200282015b8281111561366b578251805161365b9184916020909101906134b6565b509160200191906001019061363e565b5061306b9291506136a9565b5b8082111561306b5760008155600101613678565b8082111561306b5760006136a082826136c6565b5060010161368c565b8082111561306b5760006136bd82826136c6565b506001016136a9565b5080546136d2906142cd565b6000825580601f106136e2575050565b601f016020900490600052602060002090810190610a8b9190613677565b60006001600160401b0383111561371957613719614333565b61372c601f8401601f19166020016141b1565b905082815283838301111561374057600080fd5b828260208301376000602084830101529392505050565b600082601f830112613767578081fd5b8135602061377c613777836141e1565b6141b1565b80838252828201915082860187848660051b890101111561379b578586fd5b855b858110156137c25781356137b081614349565b8452928401929084019060010161379d565b5090979650505050505050565b600082601f8301126137df578081fd5b813560206137ef613777836141e1565b80838252828201915082860187848660051b890101111561380e578586fd5b855b858110156137c25781356001600160401b0381111561382d578788fd5b8801603f81018a1361383d578788fd5b61384e8a8783013560408401613700565b8552509284019290840190600101613810565b600082601f830112613871578081fd5b81356020613881613777836141e1565b80838252828201915082860187848660051b89010111156138a0578586fd5b855b858110156137c25781356001600160401b038111156138bf578788fd5b6138cd8a87838c010161393d565b85525092840192908401906001016138a2565b600082601f8301126138f0578081fd5b81356020613900613777836141e1565b80838252828201915082860187848660051b890101111561391f578586fd5b855b858110156137c257813584529284019290840190600101613921565b600082601f83011261394d578081fd5b61170483833560208501613700565b803560ff8116811461396d57600080fd5b919050565b600060208284031215613983578081fd5b813561170481614349565b600080604083850312156139a0578081fd5b82356139ab81614349565b946020939093013593505050565b600080600080608085870312156139ce578182fd5b84356001600160401b03808211156139e4578384fd5b6139f088838901613757565b95506020870135915080821115613a05578384fd5b613a11888389016138e0565b94506040870135915080821115613a26578384fd5b50613a33878288016137cf565b949793965093946060013593505050565b60008060008060808587031215613a59578182fd5b84356001600160401b0380821115613a6f578384fd5b613a7b88838901613757565b95506020870135915080821115613a90578384fd5b613a9c888389016138e0565b94506040870135915080821115613ab1578384fd5b613abd888389016137cf565b93506060870135915080821115613ad2578283fd5b50613adf8782880161393d565b91505092959194509250565b600080600080600060a08688031215613b02578283fd5b85356001600160401b0380821115613b18578485fd5b613b2489838a01613757565b96506020880135915080821115613b39578485fd5b613b4589838a016138e0565b95506040880135915080821115613b5a578485fd5b613b6689838a01613861565b94506060880135915080821115613b7b578283fd5b613b8789838a016137cf565b93506080880135915080821115613b9c578283fd5b50613ba98882890161393d565b9150509295509295909350565b600060208284031215613bc7578081fd5b81518015158114611704578182fd5b600060208284031215613be7578081fd5b5051919050565b600060208284031215613bff578081fd5b81356001600160e01b031981168114611704578182fd5b600060208284031215613c27578081fd5b5035919050565b60008060408385031215613c40578182fd5b823591506020830135613c5281614349565b809150509250929050565b60008060408385031215613c6f578182fd5b82359150613c7f6020840161395c565b90509250929050565b60008060008060608587031215613c9d578182fd5b84359350613cad6020860161395c565b925060408501356001600160401b0380821115613cc8578384fd5b818701915087601f830112613cdb578384fd5b813581811115613ce9578485fd5b886020828501011115613cfa578485fd5b95989497505060200194505050565b600080600080600060a08688031215613d20578283fd5b85359450613d306020870161395c565b9350613d3e6040870161395c565b94979396509394606081013594506080013592915050565b6000815180845260208085019450808401835b83811015613d8e5781516001600160a01b031687529582019590820190600101613d69565b509495945050505050565b600081518084526020808501808196508360051b81019150828601855b85811015613de0578284038952613dce848351613e1c565b98850198935090840190600101613db6565b5091979650505050505050565b6000815180845260208085019450808401835b83811015613d8e57815187529582019590820190600101613e00565b60008151808452613e3481602086016020860161429d565b601f01601f19169290920160200192915050565b60008251613e5a81846020870161429d565b9190910192915050565b608081526000613e776080830187613d56565b8281036020840152613e898187613ded565b90508281036040840152613e9d8186613d99565b91505082606083015295945050505050565b60a081526000613ec260a0830188613d56565b8281036020840152613ed48188613ded565b90508281036040840152613ee88187613d99565b60608401959095525050608001529392505050565b60c081526000613f1060c0830189613d56565b8281036020840152613f228189613ded565b90508281036040840152613f368188613d99565b60608401969096525050608081019290925260a0909101529392505050565b608081526000613f686080830187613d56565b8281036020840152613f7a8187613ded565b90508281036040840152613f8e8186613d99565b905082810360608401526111ac8185613d99565b6020815260006117046020830184613e1c565b6020810160088310613fd757634e487b7160e01b600052602160045260246000fd5b91905290565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b60208082526021908201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756040820152601b60fa1b606082015260800190565b60208082526030908201527f476f7665726e616e63653a2063616c6c6572206d75737420686176652061204860408201526f3cb832b93732ba10283937b334b6329760811b606082015260800190565b8981526001600160a01b0389166020820152610120604082018190526000906141118382018b613d56565b90508281036060840152614125818a613ded565b905082810360808401526141398189613d99565b905082810360a084015261414d8188613d99565b6001600160401b0387811660c0860152861660e085015283810361010085015290506141798185613e1c565b9c9b505050505050505050505050565b84815260ff841660208201528260408201526080606082015260006115836080830184613e1c565b604051601f8201601f191681016001600160401b03811182821017156141d9576141d9614333565b604052919050565b60006001600160401b038211156141fa576141fa614333565b5060051b60200190565b600082198211156142175761421761431d565b500190565b60006001600160401b0380831681851680830382111561423e5761423e61431d565b01949350505050565b60008261426257634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156142815761428161431d565b500290565b6000828210156142985761429861431d565b500390565b60005b838110156142b85781810151838201526020016142a0565b838111156142c7576000848401525b50505050565b600181811c908216806142e157607f821691505b60208210811415612eaf57634e487b7160e01b600052602260045260246000fd5b60006000198214156143165761431661431d565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114610a8b57600080fdfea2646970667358221220048a23e53cf7fc737ed47ff134c625a23b758713ec53fe3363f59ccbf327185f64736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
