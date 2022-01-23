# Definitions & Key Terms

## **Layer 1**

This is an alternative name for a base-layer consensus network. Networks like Bitcoin, Ethereum, and Avalanche are examples of *layer 1* protocols. 
The term layer 1 does not imply a particular ledger data structure, i.e., a layer 1 protocol could be either blockchain-based or based on a 
directed acyclic graph (DAG) topology. 

Though most of the payments and activity in the Hypernet Protocol payments stack occur at layer 2 (see below), Hypernet Core relies on layer 1 for 
disputes, deposits, withdrawals, and other (hopefully rare) occasions.

Helpful links / primers on blockchain, smart contracts, and Ethereum below:

- [3Blue1Brown, Youtube: "How does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4&t=3s)
- [Intro to Ethereum](https://ethereum.org/en/developers/docs/intro-to-ethereum/)
- [Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [Ethereum Whitepaper](https://ethereum.org/en/whitepaper/)

## **Layer 2**

This is a colloquial term for any technology that inherently derives its security from a layer 1 network. Typically, layer 2 technologies are designed to circumvent
the throughput limitations of the layer 1 network they are secured against and therefor are often referred to as off-chain [scaling](https://ethereum.org/en/developers/docs/scaling/) 
techniques. Some common layer 2 approaches that are under active research and development include: [state-channels](https://ethereum.org/en/developers/docs/scaling/state-channels/), 
[zk-rollups](https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/#zk-video), [side-chains](https://ethereum.org/en/developers/docs/scaling/sidechains/#top), etc.

Hypernet Core specifically uses the payment channel framework developed by Connext called "Vector". In-progress documentation and a quick start guide on 
Vector can be found at the below link.

- [Connext - Vector](https://github.com/connext/vector)

## **Payment Channel**

[Payment channels](https://dl.acm.org/doi/pdf/10.1145/3243734.3243856?casa_token=ySJOdlwgPCcAAAAA%3AnkfO9uHl7fZ-c7C0_L3xrQSHhujnqNIJgtkB7Gt2yE6MZV9145qbyHsGHQaSV1NGZBNousWk-wQ) 
are a layer 2 technique that is a specialization of state-channels. They are designed specifically for scaling trustless value transfers without having to submit 
transactions directly to a layer 1 network. This is accomplished via a two-party consensus protocol in which digital signatures are shared directly between two
participants via a p2p communication layer. 

## Non-Fungible Registry (NFR)

Non-Fungible Registries are the primary datastructure of the Hypernet Protocol identity stack. NFRs are an extension of the [EIP721](https://eips.ethereum.org/EIPS/eip-721) 
non-fungible token standard. NFRs are multipurpose and have extensible logic via registry [modules](/packages/contracts/contracts/modules/README.md). See the section on 
[digital identity](/packages/contracts/contracts/identity/README.md) for more details. 

## Non-Fungible Identity (NFI)

Non-Fungible Identities are entries within an [NFR](/documentation/gitbook/definitions-and-key-terms.md#non-fungible-registry-nfr). An NFI consists of the following data:

1. A unique token ID number
2. An optional unique label (usually human-readable, like a URL)
3. A tokenURI

## Non-Fungible Token (NFT)

A non-fungible token (NFT) is a unique digital asset that exists on the blockchain. It can be owned and interacted with via the functionality provided by a crypto wallet. 
Simply put, an NFT consists of three parts: a contract address (the storage location on the blockchain), a token ID (a unique reference number within that storage location), 
and metadata (like a URL). Currently, the most common code standard for implementing NFTs is given by the [EIP721](https://eips.ethereum.org/EIPS/eip-721) standard definition.
Other consensus protocols that are not based on the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/) (EVM) have developed their own NFT standard definitions. 

## Hypertoken

The [EIP20](https://eips.ethereum.org/EIPS/eip-20)-compatible governance token (1 token = 1 vote) of the Hypernet Protocol (token symbol `H`). It's two primary use cases are for proposing and voting on 
protocol upgrades via the DAO and as a collateral token in the [layer 2](/documentation/gitbook/definitions-and-key-terms.md#layer-2) [payments network](/documentation/gitbook/digital-payments.md).

## Decentralized Autonomous Organization (DAO)

A [DAO](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization) is the entity and mechanism by which upgrades to the Hypernet Protocol are proposed and exectued on the 
blockchain. The Hypernet Protocol DAO is implemented in [Solidity](https://docs.soliditylang.org/) and currently deployed on the Rinkeby Ethereum testnet. More information about how 
governance is implemented in the Hyperent Protocol can be found [here](/packages/contracts/contracts/governance/README.md). 