# Hypernet Governance

## Introduction

The Hypernet Protocol governance consists of contracts for the  token, Distributed Autonomous Organization (DAO). 
The [token](/packages/contracts/contracts/governance/Hypertoken.sol) is [EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and 
is limited to a total supploy of `100,000,000` with `18` decimal places of precision. The DAO is based on OpenZeppelin's 
[Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which is itself based on a reference implementation by 
[Compound Finance](https://compound.finance/docs/governance). Given below is a sequence diagram for the proposal lifecycle. 

![alt text](/documentation/images/Governance-sequence-diagram.png)

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/governance/governance-reference) and has proven quite
successful in practice at adopting beneficial proposals to protocol upgrades while preventing
[adversarial attacks](https://docs.uniswap.org/protocol/V2/concepts/governance/adversarial-circumstances).

The [Hypernet DAO](/packages/contracts/contracts/governance/HypernetGovernor.sol) is used for proposing and vetting 
(by the token holder community) new Non-Fungible Registries (NFRs), which are deployed through the 
[registry factory contract](/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol), and 
updating various parameters in the protocol itself. Particularly, the DAO can change the length of a proposal's voting 
period, the minimum proposal threshold, and the voting delay peroid. Additionally, the DAO is the `REGISTRAR` and `REGISTRAR_ROLE_ADMIN`
of several registries that key for the functioning of the Hypernet Protocol ecosystem: 

1. Hypernet Profiles
2. Gateways
3. Liquidity Providers
4. Payment Tokens
5. Registry Modules

## DAO Access and Usage

Users can see all past and present proposals in the official Hypernet [launchpad dashboard](https://rinkeby.launchpad.hypernet.foundation/proposals). 
Interacting with proposals requires that active account first posses a [Hypernet Profile NFI](/packages/contracts/contracts/identity/README.md#hypernet-profiles). 
Creating a new proposal requires that the initiating account posses an amount of Hypertoken equivalent to `_proposalThreshold` which is a public variable stored 
by the DAO contract. For a given active proposal, users may vote for, against, or abstain. Each token in a user's balance counts as 1 vote. A vote will be 
defeated if less than 4% of total votes do not participate. 