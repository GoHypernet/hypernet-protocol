export default {
  _format: "hh-sol-artifact-1",
  contractName: "HypernetGovernor",
  sourceName: "contracts/HypernetGovernor.sol",
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
    "0x6101406040526001600655606460075569d3c21bcecceda10000006008553480156200002a57600080fd5b5060405162004445380380620044458339810160408190526200004d916200034f565b806004836040518060400160405280601081526020016f243cb832b93732ba23b7bb32b93737b960811b815250806200008b6200015860201b60201c565b815160209283012081519183019190912060c082815260e08290524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810195909552608080860193909352308583015280518086039092018252939092019092528051908401209052610100528151620001259160009190840190620002a9565b505060601b6001600160601b03191661012052620001438162000173565b506200014f8162000240565b505050620003e3565b6040805180820190915260018152603160f81b602082015290565b6064811115620001fb5760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a40160405180910390fd5b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b828054620002b7906200038d565b90600052602060002090601f016020900481019282620002db576000855562000326565b82601f10620002f657805160ff191683800117855562000326565b8280016001018555821562000326579182015b828111156200032657825182559160200191906001019062000309565b506200033492915062000338565b5090565b5b8082111562000334576000815560010162000339565b6000806040838503121562000362578182fd5b82516200036f81620003ca565b60208401519092506200038281620003ca565b809150509250929050565b600181811c90821680620003a257607f821691505b60208210811415620003c457634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b0381168114620003e057600080fd5b50565b60805160a05160c05160e051610100516101205160601c6140016200044460003960008181610857015281816122af0152612348015260006124dc0152600061252b015260006125060152600061248a015260006124b301526140016000f3fe6080604052600436106102305760003560e01c80637d5e81e21161012e578063dd4e2ba5116100ab578063eb9019d41161006f578063eb9019d4146107e5578063ece40cc114610805578063f8ce560a14610825578063fc0c546a14610845578063fe0d94c11461087957600080fd5b8063dd4e2ba514610661578063ddf0b009146106a7578063deaaa7cc146106c7578063e23a9a52146106fb578063ea0217cf146107c557600080fd5b8063b58131b0116100f2578063b58131b0146105ba578063c01f9e37146105cf578063c59057e4146105ef578063d33219b41461060f578063da95691a1461064157600080fd5b80637d5e81e21461053157806397c3d33414610551578063a7713a7014610565578063a890c9101461057a578063ab58fb8e1461059a57600080fd5b8063328dd982116101bc5780634385963211610180578063438596321461045d57806354fd4d50146104a757806356781388146104d157806370b0f660146104f15780637b3c71d31461051157600080fd5b8063328dd982146103ab5780633932abb1146103db5780633bccf4fd146103f05780633e4f49e61461041057806340e58ee51461043d57600080fd5b806306fdde031161020357806306fdde0314610321578063160cbed71461034357806324bc1a64146103635780632656227d146103785780632d63f6931461038b57600080fd5b8063013cf08b1461023557806301ffc9a7146102b057806302a251a3146102e057806306f3f9e6146102ff575b600080fd5b34801561024157600080fd5b506102556102503660046138d3565b61088c565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b3480156102bc57600080fd5b506102d06102cb36600461388f565b610951565b60405190151581526020016102a7565b3480156102ec57600080fd5b506007545b6040519081526020016102a7565b34801561030b57600080fd5b5061031f61031a3660046138d3565b610962565b005b34801561032d57600080fd5b506103366109af565b6040516102a79190613c5f565b34801561034f57600080fd5b506102f161035e36600461365a565b610a41565b34801561036f57600080fd5b506102f1610c78565b6102f161038636600461365a565b610c8d565b34801561039757600080fd5b506102f16103a63660046138d3565b610d7c565b3480156103b757600080fd5b506103cb6103c63660046138d3565b610db3565b6040516102a79493929190613c12565b3480156103e757600080fd5b506006546102f1565b3480156103fc57600080fd5b506102f161040b3660046139c6565b611044565b34801561041c57600080fd5b5061043061042b3660046138d3565b6110d8565b6040516102a79190613c72565b34801561044957600080fd5b5061031f6104583660046138d3565b6110e3565b34801561046957600080fd5b506102d06104783660046138eb565b60008281526002602090815260408083206001600160a01b038516845260080190915290205460ff1692915050565b3480156104b357600080fd5b506040805180820190915260018152603160f81b6020820152610336565b3480156104dd57600080fd5b506102f16104ec36600461391a565b6113f6565b3480156104fd57600080fd5b5061031f61050c3660046138d3565b61141f565b34801561051d57600080fd5b506102f161052c366004613945565b61145c565b34801561053d57600080fd5b506102f161054c3660046136e5565b6114ae565b34801561055d57600080fd5b5060646102f1565b34801561057157600080fd5b506003546102f1565b34801561058657600080fd5b5061031f6105953660046138b7565b6114c5565b3480156105a657600080fd5b506102f16105b53660046138d3565b611506565b3480156105c657600080fd5b506008546102f1565b3480156105db57600080fd5b506102f16105ea3660046138d3565b6115aa565b3480156105fb57600080fd5b506102f161060a36600461365a565b6115d9565b34801561061b57600080fd5b506004546001600160a01b03165b6040516001600160a01b0390911681526020016102a7565b34801561064d57600080fd5b506102f161065c36600461378c565b611613565b34801561066d57600080fd5b5060408051808201909152601a81527f737570706f72743d627261766f2671756f72756d3d627261766f0000000000006020820152610336565b3480156106b357600080fd5b5061031f6106c23660046138d3565b611638565b3480156106d357600080fd5b506102f17f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b34801561070757600080fd5b506107956107163660046138eb565b60408051606081018252600080825260208201819052918101919091525060009182526002602090815260408084206001600160a01b0393909316845260089092018152918190208151606081018352905460ff8082161515835261010082041693820193909352620100009092046001600160601b03169082015290565b6040805182511515815260208084015160ff1690820152918101516001600160601b0316908201526060016102a7565b3480156107d157600080fd5b5061031f6107e03660046138d3565b6118a6565b3480156107f157600080fd5b506102f161080036600461362f565b6118e3565b34801561081157600080fd5b5061031f6108203660046138d3565b6118ef565b34801561083157600080fd5b506102f16108403660046138d3565b61192c565b34801561085157600080fd5b506106297f000000000000000000000000000000000000000000000000000000000000000081565b61031f6108873660046138d3565b611937565b80600080808080808080806108a08a611506565b97506108ab8b610d7c565b96506108b68b6115aa565b60008c815260026020526040812080546005820154600683015460078401546001600160a01b039093169e50949a5098509296509194506108f68d6110d8565b9050600281600781111561091a57634e487b7160e01b600052602160045260246000fd5b149350600781600781111561093f57634e487b7160e01b600052602160045260246000fd5b14925050509193959799509193959799565b600061095c82611ba5565b92915050565b61096a611bca565b6001600160a01b0316336001600160a01b0316146109a35760405162461bcd60e51b815260040161099a90613c9a565b60405180910390fd5b6109ac81611bde565b50565b6060600080546109be90613f3a565b80601f01602080910402602001604051908101604052809291908181526020018280546109ea90613f3a565b8015610a375780601f10610a0c57610100808354040283529160200191610a37565b820191906000526020600020905b815481529060010190602001808311610a1a57829003601f168201915b5050505050905090565b600080610a50868686866115d9565b90506004610a5d826110d8565b6007811115610a7c57634e487b7160e01b600052602160045260246000fd5b14610a995760405162461bcd60e51b815260040161099a90613d12565b6000600460009054906101000a90046001600160a01b03166001600160a01b031663f27a0c926040518163ffffffff1660e01b815260040160206040518083038186803b158015610ae957600080fd5b505afa158015610afd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b219190613877565b6004805460405163b1c5f42760e01b81529293506001600160a01b03169163b1c5f42791610b5a918b918b918b916000918c9101613b6c565b60206040518083038186803b158015610b7257600080fd5b505afa158015610b86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610baa9190613877565b600083815260056020526040808220929092556004805492516308f2a0bb60e41b81526001600160a01b0390931692638f2a0bb092610bf5928c928c928c9290918c918a9101613bba565b600060405180830381600087803b158015610c0f57600080fd5b505af1158015610c23573d6000803e3d6000fd5b505050507f9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892828242610c559190613e71565b604080519283526020830191909152015b60405180910390a15095945050505050565b6000610c88610840600143613ef3565b905090565b600080610c9c868686866115d9565b90506000610ca9826110d8565b90506004816007811115610ccd57634e487b7160e01b600052602160045260246000fd5b1480610cf857506005816007811115610cf657634e487b7160e01b600052602160045260246000fd5b145b610d145760405162461bcd60e51b815260040161099a90613d12565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610d728288888888611ca6565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b60608060608060006002600087815260200190815260200160002090508060010181600201826003018360040183805480602002602001604051908101604052809291908181526020018280548015610e3557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610e17575b5050505050935082805480602002602001604051908101604052809291908181526020018280548015610e8757602002820191906000526020600020905b815481526020019060010190808311610e73575b5050505050925081805480602002602001604051908101604052809291908181526020016000905b82821015610f5b578382906000526020600020018054610ece90613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054610efa90613f3a565b8015610f475780601f10610f1c57610100808354040283529160200191610f47565b820191906000526020600020905b815481529060010190602001808311610f2a57829003601f168201915b505050505081526020019060010190610eaf565b50505050915080805480602002602001604051908101604052809291908181526020016000905b8282101561102e578382906000526020600020018054610fa190613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054610fcd90613f3a565b801561101a5780601f10610fef5761010080835404028352916020019161101a565b820191906000526020600020905b815481529060010190602001808311610ffd57829003601f168201915b505050505081526020019060010190610f82565b5050505090509450945094509450509193509193565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff8516606082015260009081906110b0906110a89060800160405160208183030381529060405280519060200120611cba565b868686611d08565b90506110cd87828860405180602001604052806000815250611d26565b979650505050505050565b600061095c82611e3f565b600081815260026020526040902080546001600160a01b0316336001600160a01b0316148061112c5750600854815461112a906001600160a01b0316610800600143613ef3565b105b6111885760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72427261766f3a2070726f706f7365722061626f76652074686044820152661c995cda1bdb1960ca1b606482015260840161099a565b6113f1816001018054806020026020016040519081016040528092919081815260200182805480156111e357602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116111c5575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561123657602002820191906000526020600020905b815481526020019060010190808311611222575b50505050506113e784600301805480602002602001604051908101604052809291908181526020016000905b8282101561130e57838290600052602060002001805461128190613f3a565b80601f01602080910402602001604051908101604052809291908181526020018280546112ad90613f3a565b80156112fa5780601f106112cf576101008083540402835291602001916112fa565b820191906000526020600020905b8154815290600101906020018083116112dd57829003601f168201915b505050505081526020019060010190611262565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156113de57838290600052602060002001805461135190613f3a565b80601f016020809104026020016040519081016040528092919081815260200182805461137d90613f3a565b80156113ca5780601f1061139f576101008083540402835291602001916113ca565b820191906000526020600020905b8154815290600101906020018083116113ad57829003601f168201915b505050505081526020019060010190611332565b50505050611f28565b84600901546120dc565b505050565b60008033905061141784828560405180602001604052806000815250611d26565b949350505050565b611427611bca565b6001600160a01b0316336001600160a01b0316146114575760405162461bcd60e51b815260040161099a90613c9a565b600655565b6000803390506114a486828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611d2692505050565b9695505050505050565b60006114bc858585856120ea565b95945050505050565b6114cd611bca565b6001600160a01b0316336001600160a01b0316146114fd5760405162461bcd60e51b815260040161099a90613c9a565b6109ac81612160565b6004805460008381526005602052604080822054905163d45c443560e01b8152938401529182916001600160a01b03169063d45c44359060240160206040518083038186803b15801561155857600080fd5b505afa15801561156c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115909190613877565b9050806001146115a057806115a3565b60005b9392505050565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610da4565b6000848484846040516020016115f29493929190613b21565b60408051601f19818403018152919052805160209091012095945050505050565b60006116233387878787876121c9565b6114a486866116328787611f28565b856114ae565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936113f1939092908301828280156116a157602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611683575b5050505050826002018054806020026020016040519081016040528092919081815260200182805480156116f457602002820191906000526020600020905b8154815260200190600101908083116116e0575b505050505061189c84600301805480602002602001604051908101604052809291908181526020016000905b828210156117cc57838290600052602060002001805461173f90613f3a565b80601f016020809104026020016040519081016040528092919081815260200182805461176b90613f3a565b80156117b85780601f1061178d576101008083540402835291602001916117b8565b820191906000526020600020905b81548152906001019060200180831161179b57829003601f168201915b505050505081526020019060010190611720565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156113de57838290600052602060002001805461180f90613f3a565b80601f016020809104026020016040519081016040528092919081815260200182805461183b90613f3a565b80156118885780601f1061185d57610100808354040283529160200191611888565b820191906000526020600020905b81548152906001019060200180831161186b57829003601f168201915b5050505050815260200190600101906117f0565b8460090154610a41565b6118ae611bca565b6001600160a01b0316336001600160a01b0316146118de5760405162461bcd60e51b815260040161099a90613c9a565b600755565b60006115a38383612286565b6118f7611bca565b6001600160a01b0316336001600160a01b0316146119275760405162461bcd60e51b815260040161099a90613c9a565b600855565b600061095c8261232b565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936113f1939092908301828280156119a057602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611982575b5050505050826002018054806020026020016040519081016040528092919081815260200182805480156119f357602002820191906000526020600020905b8154815260200190600101908083116119df575b5050505050611b9b84600301805480602002602001604051908101604052809291908181526020016000905b82821015611acb578382906000526020600020018054611a3e90613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054611a6a90613f3a565b8015611ab75780601f10611a8c57610100808354040283529160200191611ab7565b820191906000526020600020905b815481529060010190602001808311611a9a57829003601f168201915b505050505081526020019060010190611a1f565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156113de578382906000526020600020018054611b0e90613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054611b3a90613f3a565b8015611b875780601f10611b5c57610100808354040283529160200191611b87565b820191906000526020600020905b815481529060010190602001808311611b6a57829003601f168201915b505050505081526020019060010190611aef565b8460090154610c8d565b60006001600160e01b03198216636e665ced60e01b148061095c575061095c826123de565b6000610c886004546001600160a01b031690565b6064811115611c615760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a40161099a565b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611cb38585858585612413565b5050505050565b600061095c611cc7612486565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611d1987878787612579565b91509150610d7281612666565b6000848152600160208190526040822090611d40876110d8565b6007811115611d5f57634e487b7160e01b600052602160045260246000fd5b14611db85760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b606482015260840161099a565b604080516020810190915281546001600160401b031690819052600090611de09087906118e3565b9050611dee87878784612867565b856001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda488878488604051611e2d9493929190613df6565b60405180910390a29695505050505050565b600080611e4b83612a0c565b90506004816007811115611e6f57634e487b7160e01b600052602160045260246000fd5b14611e7a5792915050565b60008381526005602052604090205480611e95575092915050565b60048054604051632ab0f52960e01b81529182018390526001600160a01b031690632ab0f5299060240160206040518083038186803b158015611ed757600080fd5b505afa158015611eeb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611f0f9190613857565b15611f1e575060079392505050565b5060059392505050565b6060600082516001600160401b03811115611f5357634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015611f8657816020015b6060815260200190600190039081611f715790505b50905060005b84518110156120d457848181518110611fb557634e487b7160e01b600052603260045260246000fd5b60200260200101515160001461206f57848181518110611fe557634e487b7160e01b600052603260045260246000fd5b602002602001015184828151811061200d57634e487b7160e01b600052603260045260246000fd5b60200260200101516040516024016120259190613c5f565b60408051601f19818403018152908290529161204091613b05565b6040519081900390206020820180516001600160e01b03166001600160e01b0319909216919091179052612098565b83818151811061208f57634e487b7160e01b600052603260045260246000fd5b60200260200101515b8282815181106120b857634e487b7160e01b600052603260045260246000fd5b6020026020010181905250806120cd90613f6f565b9050611f8c565b509392505050565b60006114bc85858585612b72565b600061215433868686516001600160401b0381111561211957634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561214c57816020015b60608152602001906001900390816121375790505b5087876121c9565b6114bc85858585612c1a565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b8051602082012060006121e787876121e18888611f28565b856115d9565b600081815260026020526040902060098101549192509061227b5780546001600160a01b0319166001600160a01b038a16178155875161223090600183019060208b0190613173565b50865161224690600283019060208a01906131d4565b50855161225c906003830190602089019061320f565b5084516122729060048301906020880190613268565b50600981018390555b505050505050505050565b604051630748d63560e31b81526001600160a01b038381166004830152602482018390526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a89060440160206040518083038186803b1580156122f357600080fd5b505afa158015612307573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115a39190613877565b60006064600354604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c9060240160206040518083038186803b15801561239257600080fd5b505afa1580156123a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123ca9190613877565b6123d49190613ed4565b61095c9190613eb4565b60006001600160e01b0319821663bf26d89760e01b148061095c57506301ffc9a760e01b6001600160e01b031983161461095c565b6004805460405163e38335e560e01b81526001600160a01b039091169163e38335e591349161244d918991899189916000918a9101613b6c565b6000604051808303818588803b15801561246657600080fd5b505af115801561247a573d6000803e3d6000fd5b50505050505050505050565b60007f00000000000000000000000000000000000000000000000000000000000000004614156124d557507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156125b0575060009050600361265d565b8460ff16601b141580156125c857508460ff16601c14155b156125d9575060009050600461265d565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561262d573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166126565760006001925092505061265d565b9150600090505b94509492505050565b600081600481111561268857634e487b7160e01b600052602160045260246000fd5b14156126915750565b60018160048111156126b357634e487b7160e01b600052602160045260246000fd5b14156127015760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161099a565b600281600481111561272357634e487b7160e01b600052602160045260246000fd5b14156127715760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161099a565b600381600481111561279357634e487b7160e01b600052602160045260246000fd5b14156127ec5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161099a565b600481600481111561280e57634e487b7160e01b600052602160045260246000fd5b14156109ac5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161099a565b60008481526002602090815260408083206001600160a01b038716845260088101909252909120805460ff16156128f65760405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20766f746560448201526c08185b1c9958591e4818d85cdd609a1b606482015260840161099a565b805460ff85166101000261ffff1990911617600117815561291683612cc0565b81546001600160601b039190911662010000026dffffffffffffffffffffffff00001990911617815560ff8416612966578282600601600082825461295b9190613e71565b90915550612a049050565b60ff841660011415612986578282600501600082825461295b9190613e71565b60ff8416600214156129a6578282600701600082825461295b9190613e71565b60405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20696e766160448201526c6c696420766f7465207479706560981b606482015260840161099a565b505050505050565b6000818152600160208181526040808420815160a08101835281546001600160401b0390811660808301908152825283518086018552958301541685529283019390935260029092015460ff80821615801594840194909452610100909104161515606082015290612a815750600792915050565b806060015115612a945750600292915050565b805151436001600160401b039091161115612ab25750600092915050565b602081015151436001600160401b039091161115612ad35750600192915050565b612ae08160200151612d2c565b15612b2457612aee83612d5b565b8015612b10575060008381526002602052604090206006810154600590910154115b612b1b5760036115a3565b60049392505050565b60405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c206964000000604482015260640161099a565b50919050565b600080612b8186868686612d82565b600081815260056020526040902054909150156114bc57600480546000838152600560205260409081902054905163c4d252f560e01b8152928301526001600160a01b03169063c4d252f590602401600060405180830381600087803b158015612bea57600080fd5b505af1158015612bfe573d6000803e3d6000fd5b5050506000828152600560205260408120555095945050505050565b6000612c2560085490565b612c3433610800600143613ef3565b1015612cb45760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a2070726f7060448201527f6f73657220766f7465732062656c6f772070726f706f73616c207468726573686064820152621bdb1960ea1b608482015260a40161099a565b6114bc85858585612eb8565b60006001600160601b03821115612d285760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203960448201526536206269747360d01b606482015260840161099a565b5090565b6000612d4182516001600160401b0316151590565b801561095c57505051436001600160401b03909116111590565b60008181526002602052604081206005810154612d7a61084085610d7c565b109392505050565b600080612d91868686866115d9565b90506000612d9e826110d8565b90506002816007811115612dc257634e487b7160e01b600052602160045260246000fd5b14158015612df057506006816007811115612ded57634e487b7160e01b600052602160045260246000fd5b14155b8015612e1c57506007816007811115612e1957634e487b7160e01b600052602160045260246000fd5b14155b612e685760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a2070726f706f73616c206e6f7420616374697665000000604482015260640161099a565b60008281526001602052604090819020600201805461ff001916610100179055517f789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c90610c669084815260200190565b600080612ece86868686805190602001206115d9565b90508451865114612ef15760405162461bcd60e51b815260040161099a90613cd1565b8351865114612f125760405162461bcd60e51b815260040161099a90613cd1565b6000865111612f635760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c0000000000000000604482015260640161099a565b600081815260016020908152604091829020825191820190925281546001600160401b03169081905215612fe35760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b606482015260840161099a565b6000612ff6612ff160065490565b61310b565b612fff4361310b565b6130099190613e89565b90506000613019612ff160075490565b6130239083613e89565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b038111156130a957634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156130dc57816020015b60608152602001906001900390816130c75790505b508c88888e6040516130f699989796959493929190613d53565b60405180910390a15091979650505050505050565b60006001600160401b03821115612d285760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b606482015260840161099a565b8280548282559060005260206000209081019282156131c8579160200282015b828111156131c857825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190613193565b50612d289291506132c1565b8280548282559060005260206000209081019282156131c8579160200282015b828111156131c85782518255916020019190600101906131f4565b82805482825590600052602060002090810192821561325c579160200282015b8281111561325c578251805161324c9184916020909101906132d6565b509160200191906001019061322f565b50612d28929150613349565b8280548282559060005260206000209081019282156132b5579160200282015b828111156132b557825180516132a59184916020909101906132d6565b5091602001919060010190613288565b50612d28929150613366565b5b80821115612d2857600081556001016132c2565b8280546132e290613f3a565b90600052602060002090601f01602090048101928261330457600085556131c8565b82601f1061331d57805160ff19168380011785556131c8565b828001600101855582156131c857918201828111156131c85782518255916020019190600101906131f4565b80821115612d2857600061335d8282613383565b50600101613349565b80821115612d2857600061337a8282613383565b50600101613366565b50805461338f90613f3a565b6000825580601f1061339f575050565b601f0160209004906000526020600020908101906109ac91906132c1565b60006001600160401b038311156133d6576133d6613fa0565b6133e9601f8401601f1916602001613e1e565b90508281528383830111156133fd57600080fd5b828260208301376000602084830101529392505050565b600082601f830112613424578081fd5b8135602061343961343483613e4e565b613e1e565b80838252828201915082860187848660051b8901011115613458578586fd5b855b8581101561347f57813561346d81613fb6565b8452928401929084019060010161345a565b5090979650505050505050565b600082601f83011261349c578081fd5b813560206134ac61343483613e4e565b80838252828201915082860187848660051b89010111156134cb578586fd5b855b8581101561347f5781356001600160401b038111156134ea578788fd5b8801603f81018a136134fa578788fd5b61350b8a87830135604084016133bd565b85525092840192908401906001016134cd565b600082601f83011261352e578081fd5b8135602061353e61343483613e4e565b80838252828201915082860187848660051b890101111561355d578586fd5b855b8581101561347f5781356001600160401b0381111561357c578788fd5b61358a8a87838c01016135fa565b855250928401929084019060010161355f565b600082601f8301126135ad578081fd5b813560206135bd61343483613e4e565b80838252828201915082860187848660051b89010111156135dc578586fd5b855b8581101561347f578135845292840192908401906001016135de565b600082601f83011261360a578081fd5b6115a3838335602085016133bd565b803560ff8116811461362a57600080fd5b919050565b60008060408385031215613641578182fd5b823561364c81613fb6565b946020939093013593505050565b6000806000806080858703121561366f578182fd5b84356001600160401b0380821115613685578384fd5b61369188838901613414565b955060208701359150808211156136a6578384fd5b6136b28883890161359d565b945060408701359150808211156136c7578384fd5b506136d48782880161348c565b949793965093946060013593505050565b600080600080608085870312156136fa578182fd5b84356001600160401b0380821115613710578384fd5b61371c88838901613414565b95506020870135915080821115613731578384fd5b61373d8883890161359d565b94506040870135915080821115613752578384fd5b61375e8883890161348c565b93506060870135915080821115613773578283fd5b50613780878288016135fa565b91505092959194509250565b600080600080600060a086880312156137a3578283fd5b85356001600160401b03808211156137b9578485fd5b6137c589838a01613414565b965060208801359150808211156137da578485fd5b6137e689838a0161359d565b955060408801359150808211156137fb578485fd5b61380789838a0161351e565b9450606088013591508082111561381c578283fd5b61382889838a0161348c565b9350608088013591508082111561383d578283fd5b5061384a888289016135fa565b9150509295509295909350565b600060208284031215613868578081fd5b815180151581146115a3578182fd5b600060208284031215613888578081fd5b5051919050565b6000602082840312156138a0578081fd5b81356001600160e01b0319811681146115a3578182fd5b6000602082840312156138c8578081fd5b81356115a381613fb6565b6000602082840312156138e4578081fd5b5035919050565b600080604083850312156138fd578182fd5b82359150602083013561390f81613fb6565b809150509250929050565b6000806040838503121561392c578182fd5b8235915061393c60208401613619565b90509250929050565b6000806000806060858703121561395a578182fd5b8435935061396a60208601613619565b925060408501356001600160401b0380821115613985578384fd5b818701915087601f830112613998578384fd5b8135818111156139a6578485fd5b8860208285010111156139b7578485fd5b95989497505060200194505050565b600080600080600060a086880312156139dd578283fd5b853594506139ed60208701613619565b93506139fb60408701613619565b94979396509394606081013594506080013592915050565b6000815180845260208085019450808401835b83811015613a4b5781516001600160a01b031687529582019590820190600101613a26565b509495945050505050565b600081518084526020808501808196508360051b81019150828601855b85811015613a9d578284038952613a8b848351613ad9565b98850198935090840190600101613a73565b5091979650505050505050565b6000815180845260208085019450808401835b83811015613a4b57815187529582019590820190600101613abd565b60008151808452613af1816020860160208601613f0a565b601f01601f19169290920160200192915050565b60008251613b17818460208701613f0a565b9190910192915050565b608081526000613b346080830187613a13565b8281036020840152613b468187613aaa565b90508281036040840152613b5a8186613a56565b91505082606083015295945050505050565b60a081526000613b7f60a0830188613a13565b8281036020840152613b918188613aaa565b90508281036040840152613ba58187613a56565b60608401959095525050608001529392505050565b60c081526000613bcd60c0830189613a13565b8281036020840152613bdf8189613aaa565b90508281036040840152613bf38188613a56565b60608401969096525050608081019290925260a0909101529392505050565b608081526000613c256080830187613a13565b8281036020840152613c378187613aaa565b90508281036040840152613c4b8186613a56565b905082810360608401526110cd8185613a56565b6020815260006115a36020830184613ad9565b6020810160088310613c9457634e487b7160e01b600052602160045260246000fd5b91905290565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b60208082526021908201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756040820152601b60fa1b606082015260800190565b8981526001600160a01b038916602082015261012060408201819052600090613d7e8382018b613a13565b90508281036060840152613d92818a613aaa565b90508281036080840152613da68189613a56565b905082810360a0840152613dba8188613a56565b6001600160401b0387811660c0860152861660e08501528381036101008501529050613de68185613ad9565b9c9b505050505050505050505050565b84815260ff841660208201528260408201526080606082015260006114a46080830184613ad9565b604051601f8201601f191681016001600160401b0381118282101715613e4657613e46613fa0565b604052919050565b60006001600160401b03821115613e6757613e67613fa0565b5060051b60200190565b60008219821115613e8457613e84613f8a565b500190565b60006001600160401b03808316818516808303821115613eab57613eab613f8a565b01949350505050565b600082613ecf57634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615613eee57613eee613f8a565b500290565b600082821015613f0557613f05613f8a565b500390565b60005b83811015613f25578181015183820152602001613f0d565b83811115613f34576000848401525b50505050565b600181811c90821680613f4e57607f821691505b60208210811415612b6c57634e487b7160e01b600052602260045260246000fd5b6000600019821415613f8357613f83613f8a565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146109ac57600080fdfea2646970667358221220f4cd3b4b0ae32de8589dca9ecacec3bd3327645d27f0fce5db5d0d95feb663f964736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106102305760003560e01c80637d5e81e21161012e578063dd4e2ba5116100ab578063eb9019d41161006f578063eb9019d4146107e5578063ece40cc114610805578063f8ce560a14610825578063fc0c546a14610845578063fe0d94c11461087957600080fd5b8063dd4e2ba514610661578063ddf0b009146106a7578063deaaa7cc146106c7578063e23a9a52146106fb578063ea0217cf146107c557600080fd5b8063b58131b0116100f2578063b58131b0146105ba578063c01f9e37146105cf578063c59057e4146105ef578063d33219b41461060f578063da95691a1461064157600080fd5b80637d5e81e21461053157806397c3d33414610551578063a7713a7014610565578063a890c9101461057a578063ab58fb8e1461059a57600080fd5b8063328dd982116101bc5780634385963211610180578063438596321461045d57806354fd4d50146104a757806356781388146104d157806370b0f660146104f15780637b3c71d31461051157600080fd5b8063328dd982146103ab5780633932abb1146103db5780633bccf4fd146103f05780633e4f49e61461041057806340e58ee51461043d57600080fd5b806306fdde031161020357806306fdde0314610321578063160cbed71461034357806324bc1a64146103635780632656227d146103785780632d63f6931461038b57600080fd5b8063013cf08b1461023557806301ffc9a7146102b057806302a251a3146102e057806306f3f9e6146102ff575b600080fd5b34801561024157600080fd5b506102556102503660046138d3565b61088c565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b3480156102bc57600080fd5b506102d06102cb36600461388f565b610951565b60405190151581526020016102a7565b3480156102ec57600080fd5b506007545b6040519081526020016102a7565b34801561030b57600080fd5b5061031f61031a3660046138d3565b610962565b005b34801561032d57600080fd5b506103366109af565b6040516102a79190613c5f565b34801561034f57600080fd5b506102f161035e36600461365a565b610a41565b34801561036f57600080fd5b506102f1610c78565b6102f161038636600461365a565b610c8d565b34801561039757600080fd5b506102f16103a63660046138d3565b610d7c565b3480156103b757600080fd5b506103cb6103c63660046138d3565b610db3565b6040516102a79493929190613c12565b3480156103e757600080fd5b506006546102f1565b3480156103fc57600080fd5b506102f161040b3660046139c6565b611044565b34801561041c57600080fd5b5061043061042b3660046138d3565b6110d8565b6040516102a79190613c72565b34801561044957600080fd5b5061031f6104583660046138d3565b6110e3565b34801561046957600080fd5b506102d06104783660046138eb565b60008281526002602090815260408083206001600160a01b038516845260080190915290205460ff1692915050565b3480156104b357600080fd5b506040805180820190915260018152603160f81b6020820152610336565b3480156104dd57600080fd5b506102f16104ec36600461391a565b6113f6565b3480156104fd57600080fd5b5061031f61050c3660046138d3565b61141f565b34801561051d57600080fd5b506102f161052c366004613945565b61145c565b34801561053d57600080fd5b506102f161054c3660046136e5565b6114ae565b34801561055d57600080fd5b5060646102f1565b34801561057157600080fd5b506003546102f1565b34801561058657600080fd5b5061031f6105953660046138b7565b6114c5565b3480156105a657600080fd5b506102f16105b53660046138d3565b611506565b3480156105c657600080fd5b506008546102f1565b3480156105db57600080fd5b506102f16105ea3660046138d3565b6115aa565b3480156105fb57600080fd5b506102f161060a36600461365a565b6115d9565b34801561061b57600080fd5b506004546001600160a01b03165b6040516001600160a01b0390911681526020016102a7565b34801561064d57600080fd5b506102f161065c36600461378c565b611613565b34801561066d57600080fd5b5060408051808201909152601a81527f737570706f72743d627261766f2671756f72756d3d627261766f0000000000006020820152610336565b3480156106b357600080fd5b5061031f6106c23660046138d3565b611638565b3480156106d357600080fd5b506102f17f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f81565b34801561070757600080fd5b506107956107163660046138eb565b60408051606081018252600080825260208201819052918101919091525060009182526002602090815260408084206001600160a01b0393909316845260089092018152918190208151606081018352905460ff8082161515835261010082041693820193909352620100009092046001600160601b03169082015290565b6040805182511515815260208084015160ff1690820152918101516001600160601b0316908201526060016102a7565b3480156107d157600080fd5b5061031f6107e03660046138d3565b6118a6565b3480156107f157600080fd5b506102f161080036600461362f565b6118e3565b34801561081157600080fd5b5061031f6108203660046138d3565b6118ef565b34801561083157600080fd5b506102f16108403660046138d3565b61192c565b34801561085157600080fd5b506106297f000000000000000000000000000000000000000000000000000000000000000081565b61031f6108873660046138d3565b611937565b80600080808080808080806108a08a611506565b97506108ab8b610d7c565b96506108b68b6115aa565b60008c815260026020526040812080546005820154600683015460078401546001600160a01b039093169e50949a5098509296509194506108f68d6110d8565b9050600281600781111561091a57634e487b7160e01b600052602160045260246000fd5b149350600781600781111561093f57634e487b7160e01b600052602160045260246000fd5b14925050509193959799509193959799565b600061095c82611ba5565b92915050565b61096a611bca565b6001600160a01b0316336001600160a01b0316146109a35760405162461bcd60e51b815260040161099a90613c9a565b60405180910390fd5b6109ac81611bde565b50565b6060600080546109be90613f3a565b80601f01602080910402602001604051908101604052809291908181526020018280546109ea90613f3a565b8015610a375780601f10610a0c57610100808354040283529160200191610a37565b820191906000526020600020905b815481529060010190602001808311610a1a57829003601f168201915b5050505050905090565b600080610a50868686866115d9565b90506004610a5d826110d8565b6007811115610a7c57634e487b7160e01b600052602160045260246000fd5b14610a995760405162461bcd60e51b815260040161099a90613d12565b6000600460009054906101000a90046001600160a01b03166001600160a01b031663f27a0c926040518163ffffffff1660e01b815260040160206040518083038186803b158015610ae957600080fd5b505afa158015610afd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b219190613877565b6004805460405163b1c5f42760e01b81529293506001600160a01b03169163b1c5f42791610b5a918b918b918b916000918c9101613b6c565b60206040518083038186803b158015610b7257600080fd5b505afa158015610b86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610baa9190613877565b600083815260056020526040808220929092556004805492516308f2a0bb60e41b81526001600160a01b0390931692638f2a0bb092610bf5928c928c928c9290918c918a9101613bba565b600060405180830381600087803b158015610c0f57600080fd5b505af1158015610c23573d6000803e3d6000fd5b505050507f9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892828242610c559190613e71565b604080519283526020830191909152015b60405180910390a15095945050505050565b6000610c88610840600143613ef3565b905090565b600080610c9c868686866115d9565b90506000610ca9826110d8565b90506004816007811115610ccd57634e487b7160e01b600052602160045260246000fd5b1480610cf857506005816007811115610cf657634e487b7160e01b600052602160045260246000fd5b145b610d145760405162461bcd60e51b815260040161099a90613d12565b600082815260016020818152604092839020600201805460ff191690921790915590518381527f712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f910160405180910390a1610d728288888888611ca6565b5095945050505050565b60008181526001602090815260408083208151928301909152546001600160401b0316908190525b6001600160401b031692915050565b60608060608060006002600087815260200190815260200160002090508060010181600201826003018360040183805480602002602001604051908101604052809291908181526020018280548015610e3557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610e17575b5050505050935082805480602002602001604051908101604052809291908181526020018280548015610e8757602002820191906000526020600020905b815481526020019060010190808311610e73575b5050505050925081805480602002602001604051908101604052809291908181526020016000905b82821015610f5b578382906000526020600020018054610ece90613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054610efa90613f3a565b8015610f475780601f10610f1c57610100808354040283529160200191610f47565b820191906000526020600020905b815481529060010190602001808311610f2a57829003601f168201915b505050505081526020019060010190610eaf565b50505050915080805480602002602001604051908101604052809291908181526020016000905b8282101561102e578382906000526020600020018054610fa190613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054610fcd90613f3a565b801561101a5780601f10610fef5761010080835404028352916020019161101a565b820191906000526020600020905b815481529060010190602001808311610ffd57829003601f168201915b505050505081526020019060010190610f82565b5050505090509450945094509450509193509193565b604080517f150214d74d59b7d1e90c73fc22ef3d991dd0a76b046543d4d80ab92d2a50328f602082015290810186905260ff8516606082015260009081906110b0906110a89060800160405160208183030381529060405280519060200120611cba565b868686611d08565b90506110cd87828860405180602001604052806000815250611d26565b979650505050505050565b600061095c82611e3f565b600081815260026020526040902080546001600160a01b0316336001600160a01b0316148061112c5750600854815461112a906001600160a01b0316610800600143613ef3565b105b6111885760405162461bcd60e51b815260206004820152602760248201527f476f7665726e6f72427261766f3a2070726f706f7365722061626f76652074686044820152661c995cda1bdb1960ca1b606482015260840161099a565b6113f1816001018054806020026020016040519081016040528092919081815260200182805480156111e357602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116111c5575b50505050508260020180548060200260200160405190810160405280929190818152602001828054801561123657602002820191906000526020600020905b815481526020019060010190808311611222575b50505050506113e784600301805480602002602001604051908101604052809291908181526020016000905b8282101561130e57838290600052602060002001805461128190613f3a565b80601f01602080910402602001604051908101604052809291908181526020018280546112ad90613f3a565b80156112fa5780601f106112cf576101008083540402835291602001916112fa565b820191906000526020600020905b8154815290600101906020018083116112dd57829003601f168201915b505050505081526020019060010190611262565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156113de57838290600052602060002001805461135190613f3a565b80601f016020809104026020016040519081016040528092919081815260200182805461137d90613f3a565b80156113ca5780601f1061139f576101008083540402835291602001916113ca565b820191906000526020600020905b8154815290600101906020018083116113ad57829003601f168201915b505050505081526020019060010190611332565b50505050611f28565b84600901546120dc565b505050565b60008033905061141784828560405180602001604052806000815250611d26565b949350505050565b611427611bca565b6001600160a01b0316336001600160a01b0316146114575760405162461bcd60e51b815260040161099a90613c9a565b600655565b6000803390506114a486828787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611d2692505050565b9695505050505050565b60006114bc858585856120ea565b95945050505050565b6114cd611bca565b6001600160a01b0316336001600160a01b0316146114fd5760405162461bcd60e51b815260040161099a90613c9a565b6109ac81612160565b6004805460008381526005602052604080822054905163d45c443560e01b8152938401529182916001600160a01b03169063d45c44359060240160206040518083038186803b15801561155857600080fd5b505afa15801561156c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115909190613877565b9050806001146115a057806115a3565b60005b9392505050565b60008181526001602081815260408084208151928301909152909101546001600160401b031690819052610da4565b6000848484846040516020016115f29493929190613b21565b60408051601f19818403018152919052805160209091012095945050505050565b60006116233387878787876121c9565b6114a486866116328787611f28565b856114ae565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936113f1939092908301828280156116a157602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611683575b5050505050826002018054806020026020016040519081016040528092919081815260200182805480156116f457602002820191906000526020600020905b8154815260200190600101908083116116e0575b505050505061189c84600301805480602002602001604051908101604052809291908181526020016000905b828210156117cc57838290600052602060002001805461173f90613f3a565b80601f016020809104026020016040519081016040528092919081815260200182805461176b90613f3a565b80156117b85780601f1061178d576101008083540402835291602001916117b8565b820191906000526020600020905b81548152906001019060200180831161179b57829003601f168201915b505050505081526020019060010190611720565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156113de57838290600052602060002001805461180f90613f3a565b80601f016020809104026020016040519081016040528092919081815260200182805461183b90613f3a565b80156118885780601f1061185d57610100808354040283529160200191611888565b820191906000526020600020905b81548152906001019060200180831161186b57829003601f168201915b5050505050815260200190600101906117f0565b8460090154610a41565b6118ae611bca565b6001600160a01b0316336001600160a01b0316146118de5760405162461bcd60e51b815260040161099a90613c9a565b600755565b60006115a38383612286565b6118f7611bca565b6001600160a01b0316336001600160a01b0316146119275760405162461bcd60e51b815260040161099a90613c9a565b600855565b600061095c8261232b565b60008181526002602090815260409182902060018101805484518185028101850190955280855291936113f1939092908301828280156119a057602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611982575b5050505050826002018054806020026020016040519081016040528092919081815260200182805480156119f357602002820191906000526020600020905b8154815260200190600101908083116119df575b5050505050611b9b84600301805480602002602001604051908101604052809291908181526020016000905b82821015611acb578382906000526020600020018054611a3e90613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054611a6a90613f3a565b8015611ab75780601f10611a8c57610100808354040283529160200191611ab7565b820191906000526020600020905b815481529060010190602001808311611a9a57829003601f168201915b505050505081526020019060010190611a1f565b50505060048701805460408051602080840282018101909252828152935060009084015b828210156113de578382906000526020600020018054611b0e90613f3a565b80601f0160208091040260200160405190810160405280929190818152602001828054611b3a90613f3a565b8015611b875780601f10611b5c57610100808354040283529160200191611b87565b820191906000526020600020905b815481529060010190602001808311611b6a57829003601f168201915b505050505081526020019060010190611aef565b8460090154610c8d565b60006001600160e01b03198216636e665ced60e01b148061095c575061095c826123de565b6000610c886004546001600160a01b031690565b6064811115611c615760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72566f74657351756f72756d4672616374696f6e3a2071756f60448201527f72756d4e756d657261746f72206f7665722071756f72756d44656e6f6d696e616064820152623a37b960e91b608482015260a40161099a565b600380549082905560408051828152602081018490527f0553476bf02ef2726e8ce5ced78d63e26e602e4a2257b1f559418e24b4633997910160405180910390a15050565b611cb38585858585612413565b5050505050565b600061095c611cc7612486565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611d1987878787612579565b91509150610d7281612666565b6000848152600160208190526040822090611d40876110d8565b6007811115611d5f57634e487b7160e01b600052602160045260246000fd5b14611db85760405162461bcd60e51b815260206004820152602360248201527f476f7665726e6f723a20766f7465206e6f742063757272656e746c792061637460448201526269766560e81b606482015260840161099a565b604080516020810190915281546001600160401b031690819052600090611de09087906118e3565b9050611dee87878784612867565b856001600160a01b03167fb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda488878488604051611e2d9493929190613df6565b60405180910390a29695505050505050565b600080611e4b83612a0c565b90506004816007811115611e6f57634e487b7160e01b600052602160045260246000fd5b14611e7a5792915050565b60008381526005602052604090205480611e95575092915050565b60048054604051632ab0f52960e01b81529182018390526001600160a01b031690632ab0f5299060240160206040518083038186803b158015611ed757600080fd5b505afa158015611eeb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611f0f9190613857565b15611f1e575060079392505050565b5060059392505050565b6060600082516001600160401b03811115611f5357634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015611f8657816020015b6060815260200190600190039081611f715790505b50905060005b84518110156120d457848181518110611fb557634e487b7160e01b600052603260045260246000fd5b60200260200101515160001461206f57848181518110611fe557634e487b7160e01b600052603260045260246000fd5b602002602001015184828151811061200d57634e487b7160e01b600052603260045260246000fd5b60200260200101516040516024016120259190613c5f565b60408051601f19818403018152908290529161204091613b05565b6040519081900390206020820180516001600160e01b03166001600160e01b0319909216919091179052612098565b83818151811061208f57634e487b7160e01b600052603260045260246000fd5b60200260200101515b8282815181106120b857634e487b7160e01b600052603260045260246000fd5b6020026020010181905250806120cd90613f6f565b9050611f8c565b509392505050565b60006114bc85858585612b72565b600061215433868686516001600160401b0381111561211957634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561214c57816020015b60608152602001906001900390816121375790505b5087876121c9565b6114bc85858585612c1a565b600454604080516001600160a01b03928316815291831660208301527f08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401910160405180910390a1600480546001600160a01b0319166001600160a01b0392909216919091179055565b8051602082012060006121e787876121e18888611f28565b856115d9565b600081815260026020526040902060098101549192509061227b5780546001600160a01b0319166001600160a01b038a16178155875161223090600183019060208b0190613173565b50865161224690600283019060208a01906131d4565b50855161225c906003830190602089019061320f565b5084516122729060048301906020880190613268565b50600981018390555b505050505050505050565b604051630748d63560e31b81526001600160a01b038381166004830152602482018390526000917f000000000000000000000000000000000000000000000000000000000000000090911690633a46b1a89060440160206040518083038186803b1580156122f357600080fd5b505afa158015612307573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115a39190613877565b60006064600354604051632394e7a360e21b8152600481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690638e539e8c9060240160206040518083038186803b15801561239257600080fd5b505afa1580156123a6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123ca9190613877565b6123d49190613ed4565b61095c9190613eb4565b60006001600160e01b0319821663bf26d89760e01b148061095c57506301ffc9a760e01b6001600160e01b031983161461095c565b6004805460405163e38335e560e01b81526001600160a01b039091169163e38335e591349161244d918991899189916000918a9101613b6c565b6000604051808303818588803b15801561246657600080fd5b505af115801561247a573d6000803e3d6000fd5b50505050505050505050565b60007f00000000000000000000000000000000000000000000000000000000000000004614156124d557507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156125b0575060009050600361265d565b8460ff16601b141580156125c857508460ff16601c14155b156125d9575060009050600461265d565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561262d573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166126565760006001925092505061265d565b9150600090505b94509492505050565b600081600481111561268857634e487b7160e01b600052602160045260246000fd5b14156126915750565b60018160048111156126b357634e487b7160e01b600052602160045260246000fd5b14156127015760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161099a565b600281600481111561272357634e487b7160e01b600052602160045260246000fd5b14156127715760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161099a565b600381600481111561279357634e487b7160e01b600052602160045260246000fd5b14156127ec5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161099a565b600481600481111561280e57634e487b7160e01b600052602160045260246000fd5b14156109ac5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161099a565b60008481526002602090815260408083206001600160a01b038716845260088101909252909120805460ff16156128f65760405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20766f746560448201526c08185b1c9958591e4818d85cdd609a1b606482015260840161099a565b805460ff85166101000261ffff1990911617600117815561291683612cc0565b81546001600160601b039190911662010000026dffffffffffffffffffffffff00001990911617815560ff8416612966578282600601600082825461295b9190613e71565b90915550612a049050565b60ff841660011415612986578282600501600082825461295b9190613e71565b60ff8416600214156129a6578282600701600082825461295b9190613e71565b60405162461bcd60e51b815260206004820152602d60248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a20696e766160448201526c6c696420766f7465207479706560981b606482015260840161099a565b505050505050565b6000818152600160208181526040808420815160a08101835281546001600160401b0390811660808301908152825283518086018552958301541685529283019390935260029092015460ff80821615801594840194909452610100909104161515606082015290612a815750600792915050565b806060015115612a945750600292915050565b805151436001600160401b039091161115612ab25750600092915050565b602081015151436001600160401b039091161115612ad35750600192915050565b612ae08160200151612d2c565b15612b2457612aee83612d5b565b8015612b10575060008381526002602052604090206006810154600590910154115b612b1b5760036115a3565b60049392505050565b60405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a20756e6b6e6f776e2070726f706f73616c206964000000604482015260640161099a565b50919050565b600080612b8186868686612d82565b600081815260056020526040902054909150156114bc57600480546000838152600560205260409081902054905163c4d252f560e01b8152928301526001600160a01b03169063c4d252f590602401600060405180830381600087803b158015612bea57600080fd5b505af1158015612bfe573d6000803e3d6000fd5b5050506000828152600560205260408120555095945050505050565b6000612c2560085490565b612c3433610800600143613ef3565b1015612cb45760405162461bcd60e51b815260206004820152604360248201527f476f7665726e6f72436f6d7061746962696c697479427261766f3a2070726f7060448201527f6f73657220766f7465732062656c6f772070726f706f73616c207468726573686064820152621bdb1960ea1b608482015260a40161099a565b6114bc85858585612eb8565b60006001600160601b03821115612d285760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203960448201526536206269747360d01b606482015260840161099a565b5090565b6000612d4182516001600160401b0316151590565b801561095c57505051436001600160401b03909116111590565b60008181526002602052604081206005810154612d7a61084085610d7c565b109392505050565b600080612d91868686866115d9565b90506000612d9e826110d8565b90506002816007811115612dc257634e487b7160e01b600052602160045260246000fd5b14158015612df057506006816007811115612ded57634e487b7160e01b600052602160045260246000fd5b14155b8015612e1c57506007816007811115612e1957634e487b7160e01b600052602160045260246000fd5b14155b612e685760405162461bcd60e51b815260206004820152601d60248201527f476f7665726e6f723a2070726f706f73616c206e6f7420616374697665000000604482015260640161099a565b60008281526001602052604090819020600201805461ff001916610100179055517f789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c90610c669084815260200190565b600080612ece86868686805190602001206115d9565b90508451865114612ef15760405162461bcd60e51b815260040161099a90613cd1565b8351865114612f125760405162461bcd60e51b815260040161099a90613cd1565b6000865111612f635760405162461bcd60e51b815260206004820152601860248201527f476f7665726e6f723a20656d7074792070726f706f73616c0000000000000000604482015260640161099a565b600081815260016020908152604091829020825191820190925281546001600160401b03169081905215612fe35760405162461bcd60e51b815260206004820152602160248201527f476f7665726e6f723a2070726f706f73616c20616c72656164792065786973746044820152607360f81b606482015260840161099a565b6000612ff6612ff160065490565b61310b565b612fff4361310b565b6130099190613e89565b90506000613019612ff160075490565b6130239083613e89565b835467ffffffffffffffff19166001600160401b038416178455905060018301805467ffffffffffffffff19166001600160401b0383161790557f7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e084338b8b8d516001600160401b038111156130a957634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156130dc57816020015b60608152602001906001900390816130c75790505b508c88888e6040516130f699989796959493929190613d53565b60405180910390a15091979650505050505050565b60006001600160401b03821115612d285760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203660448201526534206269747360d01b606482015260840161099a565b8280548282559060005260206000209081019282156131c8579160200282015b828111156131c857825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190613193565b50612d289291506132c1565b8280548282559060005260206000209081019282156131c8579160200282015b828111156131c85782518255916020019190600101906131f4565b82805482825590600052602060002090810192821561325c579160200282015b8281111561325c578251805161324c9184916020909101906132d6565b509160200191906001019061322f565b50612d28929150613349565b8280548282559060005260206000209081019282156132b5579160200282015b828111156132b557825180516132a59184916020909101906132d6565b5091602001919060010190613288565b50612d28929150613366565b5b80821115612d2857600081556001016132c2565b8280546132e290613f3a565b90600052602060002090601f01602090048101928261330457600085556131c8565b82601f1061331d57805160ff19168380011785556131c8565b828001600101855582156131c857918201828111156131c85782518255916020019190600101906131f4565b80821115612d2857600061335d8282613383565b50600101613349565b80821115612d2857600061337a8282613383565b50600101613366565b50805461338f90613f3a565b6000825580601f1061339f575050565b601f0160209004906000526020600020908101906109ac91906132c1565b60006001600160401b038311156133d6576133d6613fa0565b6133e9601f8401601f1916602001613e1e565b90508281528383830111156133fd57600080fd5b828260208301376000602084830101529392505050565b600082601f830112613424578081fd5b8135602061343961343483613e4e565b613e1e565b80838252828201915082860187848660051b8901011115613458578586fd5b855b8581101561347f57813561346d81613fb6565b8452928401929084019060010161345a565b5090979650505050505050565b600082601f83011261349c578081fd5b813560206134ac61343483613e4e565b80838252828201915082860187848660051b89010111156134cb578586fd5b855b8581101561347f5781356001600160401b038111156134ea578788fd5b8801603f81018a136134fa578788fd5b61350b8a87830135604084016133bd565b85525092840192908401906001016134cd565b600082601f83011261352e578081fd5b8135602061353e61343483613e4e565b80838252828201915082860187848660051b890101111561355d578586fd5b855b8581101561347f5781356001600160401b0381111561357c578788fd5b61358a8a87838c01016135fa565b855250928401929084019060010161355f565b600082601f8301126135ad578081fd5b813560206135bd61343483613e4e565b80838252828201915082860187848660051b89010111156135dc578586fd5b855b8581101561347f578135845292840192908401906001016135de565b600082601f83011261360a578081fd5b6115a3838335602085016133bd565b803560ff8116811461362a57600080fd5b919050565b60008060408385031215613641578182fd5b823561364c81613fb6565b946020939093013593505050565b6000806000806080858703121561366f578182fd5b84356001600160401b0380821115613685578384fd5b61369188838901613414565b955060208701359150808211156136a6578384fd5b6136b28883890161359d565b945060408701359150808211156136c7578384fd5b506136d48782880161348c565b949793965093946060013593505050565b600080600080608085870312156136fa578182fd5b84356001600160401b0380821115613710578384fd5b61371c88838901613414565b95506020870135915080821115613731578384fd5b61373d8883890161359d565b94506040870135915080821115613752578384fd5b61375e8883890161348c565b93506060870135915080821115613773578283fd5b50613780878288016135fa565b91505092959194509250565b600080600080600060a086880312156137a3578283fd5b85356001600160401b03808211156137b9578485fd5b6137c589838a01613414565b965060208801359150808211156137da578485fd5b6137e689838a0161359d565b955060408801359150808211156137fb578485fd5b61380789838a0161351e565b9450606088013591508082111561381c578283fd5b61382889838a0161348c565b9350608088013591508082111561383d578283fd5b5061384a888289016135fa565b9150509295509295909350565b600060208284031215613868578081fd5b815180151581146115a3578182fd5b600060208284031215613888578081fd5b5051919050565b6000602082840312156138a0578081fd5b81356001600160e01b0319811681146115a3578182fd5b6000602082840312156138c8578081fd5b81356115a381613fb6565b6000602082840312156138e4578081fd5b5035919050565b600080604083850312156138fd578182fd5b82359150602083013561390f81613fb6565b809150509250929050565b6000806040838503121561392c578182fd5b8235915061393c60208401613619565b90509250929050565b6000806000806060858703121561395a578182fd5b8435935061396a60208601613619565b925060408501356001600160401b0380821115613985578384fd5b818701915087601f830112613998578384fd5b8135818111156139a6578485fd5b8860208285010111156139b7578485fd5b95989497505060200194505050565b600080600080600060a086880312156139dd578283fd5b853594506139ed60208701613619565b93506139fb60408701613619565b94979396509394606081013594506080013592915050565b6000815180845260208085019450808401835b83811015613a4b5781516001600160a01b031687529582019590820190600101613a26565b509495945050505050565b600081518084526020808501808196508360051b81019150828601855b85811015613a9d578284038952613a8b848351613ad9565b98850198935090840190600101613a73565b5091979650505050505050565b6000815180845260208085019450808401835b83811015613a4b57815187529582019590820190600101613abd565b60008151808452613af1816020860160208601613f0a565b601f01601f19169290920160200192915050565b60008251613b17818460208701613f0a565b9190910192915050565b608081526000613b346080830187613a13565b8281036020840152613b468187613aaa565b90508281036040840152613b5a8186613a56565b91505082606083015295945050505050565b60a081526000613b7f60a0830188613a13565b8281036020840152613b918188613aaa565b90508281036040840152613ba58187613a56565b60608401959095525050608001529392505050565b60c081526000613bcd60c0830189613a13565b8281036020840152613bdf8189613aaa565b90508281036040840152613bf38188613a56565b60608401969096525050608081019290925260a0909101529392505050565b608081526000613c256080830187613a13565b8281036020840152613c378187613aaa565b90508281036040840152613c4b8186613a56565b905082810360608401526110cd8185613a56565b6020815260006115a36020830184613ad9565b6020810160088310613c9457634e487b7160e01b600052602160045260246000fd5b91905290565b60208082526018908201527f476f7665726e6f723a206f6e6c79476f7665726e616e63650000000000000000604082015260600190565b60208082526021908201527f476f7665726e6f723a20696e76616c69642070726f706f73616c206c656e67746040820152600d60fb1b606082015260800190565b60208082526021908201527f476f7665726e6f723a2070726f706f73616c206e6f74207375636365737366756040820152601b60fa1b606082015260800190565b8981526001600160a01b038916602082015261012060408201819052600090613d7e8382018b613a13565b90508281036060840152613d92818a613aaa565b90508281036080840152613da68189613a56565b905082810360a0840152613dba8188613a56565b6001600160401b0387811660c0860152861660e08501528381036101008501529050613de68185613ad9565b9c9b505050505050505050505050565b84815260ff841660208201528260408201526080606082015260006114a46080830184613ad9565b604051601f8201601f191681016001600160401b0381118282101715613e4657613e46613fa0565b604052919050565b60006001600160401b03821115613e6757613e67613fa0565b5060051b60200190565b60008219821115613e8457613e84613f8a565b500190565b60006001600160401b03808316818516808303821115613eab57613eab613f8a565b01949350505050565b600082613ecf57634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615613eee57613eee613f8a565b500290565b600082821015613f0557613f05613f8a565b500390565b60005b83811015613f25578181015183820152602001613f0d565b83811115613f34576000848401525b50505050565b600181811c90821680613f4e57607f821691505b60208210811415612b6c57634e487b7160e01b600052602260045260246000fd5b6000600019821415613f8357613f83613f8a565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146109ac57600080fdfea2646970667358221220f4cd3b4b0ae32de8589dca9ecacec3bd3327645d27f0fce5db5d0d95feb663f964736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};
