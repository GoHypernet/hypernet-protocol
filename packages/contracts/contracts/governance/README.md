<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Governance

## Summary

The governance portion of the Hypernet Protocol consists of the [Hypertoken contract](/packages/contracts/contracts/governance/Hypertoken.sol) 
and its associated [Distributed Autonomous Organization](/packages/contracts/contracts/governance/HypernetGovernor.sol) (DAO). 
Hypertoken is [EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and is limited to a total supploy of `100,000,000` with `18` decimal 
places of precision. The DAO is based on OpenZeppelin's [Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which 
is itself based on a reference implementation by [Compound Finance](https://compound.finance/docs/governance). Given below is a sequence 
diagram for the proposal lifecycle. 

![alt text](/documentation/images/Governance-sequence-diagram.png)

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/reference/Governance/governance-reference) and has proven quite
successful in practice at adopting beneficial proposals to protocol upgrades while preventing
[adversarial attacks](https://docs.uniswap.org/protocol/concepts/governance/adversarial-circumstances).

The Hypernet DAO is used for proposing and vetting (by the token holder community) new 
[Non-Fungible Registries](/packages/contracts/contracts/identity/README.md) (NFRs), which are deployed 
through the [registry factory contract](/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol), and 
updating various parameters in the protocol itself. Particularly, the DAO can change the length of a proposal's voting 
period, the minimum proposal threshold, and the voting delay peroid. Additionally, the DAO is the `ADMIN`, `REGISTRAR_ROLE_ADMIN`, and `REGISTRAR`
of several NFRs that are isntrumental for the secure functioning of the Hypernet Protocol ecosystem: 

1. [Hypernet Profiles](/packages/contracts/contracts/identity/README.md#hypernet-profiles)
2. [Gateways](/packages/contracts/contracts/identity/README.md#gateways)
3. [Liquidity Providers](/packages/contracts/contracts/identity/README.md#liquidity-providers)
4. [Payment Tokens](/packages/contracts/contracts/identity/README.md#payment-tokens)
5. [Registry Modules](/packages/contracts/contracts/identity/README.md#registry-modules)

## DAO Access and Usage

Users can see all past and present proposals in the official Hypernet [launchpad dashboard](https://rinkeby.launchpad.hypernet.foundation/proposals). 
Interacting with proposals requires that active account first posses a [Hypernet Profile NFI](/packages/contracts/contracts/identity/README.md#hypernet-profiles). 
Creating a new proposal requires that the initiating account posses an amount of Hypertoken equivalent to `_proposalThreshold` which is a public variable stored 
by the DAO contract. For a given active proposal, users may vote for, against, or abstain. Each Hypertoken in a user's balance counts as 1 vote 
(i.e. 100 Hyptertoken = 100 votes). A vote will be defeated if less than 4% of total votes do not participate. 