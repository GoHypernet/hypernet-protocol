export default {
  _format: "hh-sol-artifact-1",
  contractName: "BatchModule",
  sourceName: "contracts/modules/BatchModule.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
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
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]",
        },
        {
          internalType: "address",
          name: "registry",
          type: "address",
        },
      ],
      name: "batchRegister",
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
  ],
  bytecode:
    "0x60806040523480156200001157600080fd5b5060405162000ba338038062000ba38339810160408190526200003491620000f7565b80516200004990600090602084019062000051565b505062000220565b8280546200005f90620001cd565b90600052602060002090601f016020900481019282620000835760008555620000ce565b82601f106200009e57805160ff1916838001178555620000ce565b82800160010185558215620000ce579182015b82811115620000ce578251825591602001919060010190620000b1565b50620000dc929150620000e0565b5090565b5b80821115620000dc5760008155600101620000e1565b600060208083850312156200010a578182fd5b82516001600160401b038082111562000121578384fd5b818501915085601f83011262000135578384fd5b8151818111156200014a576200014a6200020a565b604051601f8201601f19908116603f011681019083821181831017156200017557620001756200020a565b8160405282815288868487010111156200018d578687fd5b8693505b82841015620001b0578484018601518185018701529285019262000191565b82841115620001c157868684830101525b98975050505050505050565b600181811c90821680620001e257607f821691505b602082108114156200020457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61097380620002306000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806306fdde031461003b5780639706803014610059575b600080fd5b61004361006e565b604051610050919061085d565b60405180910390f35b61006c610067366004610672565b6100fc565b005b6000805461007b906108c5565b80601f01602080910402602001604051908101604052809291908181526020018280546100a7906108c5565b80156100f45780601f106100c9576101008083540402835291602001916100f4565b820191906000526020600020905b8154815290600101906020018083116100d757829003601f168201915b505050505081565b806001600160a01b03166391d14854826001600160a01b031663f68e95536040518163ffffffff1660e01b815260040160206040518083038186803b15801561014457600080fd5b505afa158015610158573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061017c91906107b2565b336040516001600160e01b031960e085901b16815260048101929092526001600160a01b0316602482015260440160206040518083038186803b1580156101c257600080fd5b505afa1580156101d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101fa919061078b565b61025d5760405162461bcd60e51b815260206004820152602960248201527f42617463684d6f64756c653a206d736753656e646572206d757374206265207260448201526832b3b4b9ba3930b91760b91b60648201526084015b60405180910390fd5b83518551146102df5760405162461bcd60e51b815260206004820152604260248201527f42617463684d6f64756c653a20726563697069656e7473206172726179206d7560448201527f73742062652073616d65206c656e677468206173206c6162656c7320617272616064820152613c9760f11b608482015260a401610254565b83518351146103685760405162461bcd60e51b815260206004820152604960248201527f42617463684d6f64756c653a20726567697374726174696f6e4461746173206160448201527f72726179206d7573742062652073616d65206c656e677468206173206c61626560648201526836399030b93930bc9760b91b608482015260a401610254565b83518251146103e1576040805162461bcd60e51b81526020600482015260248101919091527f42617463684d6f64756c653a20746f6b656e496473206172726179206d75737460448201527f2062652073616d65206c656e677468206173206c6162656c732061727261792e6064820152608401610254565b60005b85518110156104fe57816001600160a01b0316638792ffef87838151811061041c57634e487b7160e01b600052603260045260246000fd5b602002602001015187848151811061044457634e487b7160e01b600052603260045260246000fd5b602002602001015187858151811061046c57634e487b7160e01b600052603260045260246000fd5b602002602001015187868151811061049457634e487b7160e01b600052603260045260246000fd5b60200260200101516040518563ffffffff1660e01b81526004016104bb9493929190610815565b600060405180830381600087803b1580156104d557600080fd5b505af11580156104e9573d6000803e3d6000fd5b50505050806104f790610900565b90506103e4565b505050505050565b80356001600160a01b038116811461051d57600080fd5b919050565b6000601f8381840112610533578182fd5b82356020610548610543836108a1565b610870565b80838252828201915082870188848660051b8a01011115610567578687fd5b865b858110156105fa57813567ffffffffffffffff8082111561058857898afd5b818b0191508b603f83011261059b57898afd5b868201356040828211156105b1576105b1610927565b6105c2828c01601f19168a01610870565b92508183528d818386010111156105d7578b8cfd5b818185018a85013750810187018a90528552509284019290840190600101610569565b509098975050505050505050565b600082601f830112610618578081fd5b81356020610628610543836108a1565b80838252828201915082860187848660051b8901011115610647578586fd5b855b8581101561066557813584529284019290840190600101610649565b5090979650505050505050565b600080600080600060a08688031215610689578081fd5b853567ffffffffffffffff808211156106a0578283fd5b818801915088601f8301126106b3578283fd5b813560206106c3610543836108a1565b8083825282820191508286018d848660051b89010111156106e2578788fd5b8796505b8487101561070b576106f781610506565b8352600196909601959183019183016106e6565b5099505089013592505080821115610721578283fd5b61072d89838a01610522565b95506040880135915080821115610742578283fd5b61074e89838a01610522565b94506060880135915080821115610763578283fd5b5061077088828901610608565b92505061077f60808701610506565b90509295509295909350565b60006020828403121561079c578081fd5b815180151581146107ab578182fd5b9392505050565b6000602082840312156107c3578081fd5b5051919050565b60008151808452815b818110156107ef576020818501810151868301820152016107d3565b818111156108005782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0385168152608060208201819052600090610839908301866107ca565b828103604084015261084b81866107ca565b91505082606083015295945050505050565b6020815260006107ab60208301846107ca565b604051601f8201601f1916810167ffffffffffffffff8111828210171561089957610899610927565b604052919050565b600067ffffffffffffffff8211156108bb576108bb610927565b5060051b60200190565b600181811c908216806108d957607f821691505b602082108114156108fa57634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561092057634e487b7160e01b81526011600452602481fd5b5060010190565b634e487b7160e01b600052604160045260246000fdfea26469706673582212207f62d986221dd2bf34cdf02d7ed83568edebfe1eed680861c05efa29cb225c5264736f6c63430008040033",
  deployedBytecode:
    "0x608060405234801561001057600080fd5b50600436106100365760003560e01c806306fdde031461003b5780639706803014610059575b600080fd5b61004361006e565b604051610050919061085d565b60405180910390f35b61006c610067366004610672565b6100fc565b005b6000805461007b906108c5565b80601f01602080910402602001604051908101604052809291908181526020018280546100a7906108c5565b80156100f45780601f106100c9576101008083540402835291602001916100f4565b820191906000526020600020905b8154815290600101906020018083116100d757829003601f168201915b505050505081565b806001600160a01b03166391d14854826001600160a01b031663f68e95536040518163ffffffff1660e01b815260040160206040518083038186803b15801561014457600080fd5b505afa158015610158573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061017c91906107b2565b336040516001600160e01b031960e085901b16815260048101929092526001600160a01b0316602482015260440160206040518083038186803b1580156101c257600080fd5b505afa1580156101d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101fa919061078b565b61025d5760405162461bcd60e51b815260206004820152602960248201527f42617463684d6f64756c653a206d736753656e646572206d757374206265207260448201526832b3b4b9ba3930b91760b91b60648201526084015b60405180910390fd5b83518551146102df5760405162461bcd60e51b815260206004820152604260248201527f42617463684d6f64756c653a20726563697069656e7473206172726179206d7560448201527f73742062652073616d65206c656e677468206173206c6162656c7320617272616064820152613c9760f11b608482015260a401610254565b83518351146103685760405162461bcd60e51b815260206004820152604960248201527f42617463684d6f64756c653a20726567697374726174696f6e4461746173206160448201527f72726179206d7573742062652073616d65206c656e677468206173206c61626560648201526836399030b93930bc9760b91b608482015260a401610254565b83518251146103e1576040805162461bcd60e51b81526020600482015260248101919091527f42617463684d6f64756c653a20746f6b656e496473206172726179206d75737460448201527f2062652073616d65206c656e677468206173206c6162656c732061727261792e6064820152608401610254565b60005b85518110156104fe57816001600160a01b0316638792ffef87838151811061041c57634e487b7160e01b600052603260045260246000fd5b602002602001015187848151811061044457634e487b7160e01b600052603260045260246000fd5b602002602001015187858151811061046c57634e487b7160e01b600052603260045260246000fd5b602002602001015187868151811061049457634e487b7160e01b600052603260045260246000fd5b60200260200101516040518563ffffffff1660e01b81526004016104bb9493929190610815565b600060405180830381600087803b1580156104d557600080fd5b505af11580156104e9573d6000803e3d6000fd5b50505050806104f790610900565b90506103e4565b505050505050565b80356001600160a01b038116811461051d57600080fd5b919050565b6000601f8381840112610533578182fd5b82356020610548610543836108a1565b610870565b80838252828201915082870188848660051b8a01011115610567578687fd5b865b858110156105fa57813567ffffffffffffffff8082111561058857898afd5b818b0191508b603f83011261059b57898afd5b868201356040828211156105b1576105b1610927565b6105c2828c01601f19168a01610870565b92508183528d818386010111156105d7578b8cfd5b818185018a85013750810187018a90528552509284019290840190600101610569565b509098975050505050505050565b600082601f830112610618578081fd5b81356020610628610543836108a1565b80838252828201915082860187848660051b8901011115610647578586fd5b855b8581101561066557813584529284019290840190600101610649565b5090979650505050505050565b600080600080600060a08688031215610689578081fd5b853567ffffffffffffffff808211156106a0578283fd5b818801915088601f8301126106b3578283fd5b813560206106c3610543836108a1565b8083825282820191508286018d848660051b89010111156106e2578788fd5b8796505b8487101561070b576106f781610506565b8352600196909601959183019183016106e6565b5099505089013592505080821115610721578283fd5b61072d89838a01610522565b95506040880135915080821115610742578283fd5b61074e89838a01610522565b94506060880135915080821115610763578283fd5b5061077088828901610608565b92505061077f60808701610506565b90509295509295909350565b60006020828403121561079c578081fd5b815180151581146107ab578182fd5b9392505050565b6000602082840312156107c3578081fd5b5051919050565b60008151808452815b818110156107ef576020818501810151868301820152016107d3565b818111156108005782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0385168152608060208201819052600090610839908301866107ca565b828103604084015261084b81866107ca565b91505082606083015295945050505050565b6020815260006107ab60208301846107ca565b604051601f8201601f1916810167ffffffffffffffff8111828210171561089957610899610927565b604052919050565b600067ffffffffffffffff8211156108bb576108bb610927565b5060051b60200190565b600181811c908216806108d957607f821691505b602082108114156108fa57634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561092057634e487b7160e01b81526011600452602481fd5b5060010190565b634e487b7160e01b600052604160045260246000fdfea26469706673582212207f62d986221dd2bf34cdf02d7ed83568edebfe1eed680861c05efa29cb225c5264736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};