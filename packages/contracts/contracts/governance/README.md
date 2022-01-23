<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Governance

## Summary

The governance portion of the Hypernet Protocol consists of the [Hypertoken contract](/packages/contracts/contracts/governance/Hypertoken.sol) 
and its associated [Distributed Autonomous Organization](/packages/contracts/contracts/governance/HypernetGovernor.sol) (DAO). 
Hypertoken (token symbol `H`) is [EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and is limited to a total supply of `100,000,000` with `18` decimal 
places of precision. The DAO is based on OpenZeppelin's [Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which 
is itself based on a reference implementation by [Compound Finance](https://compound.finance/docs/governance). Given below is a sequence 
diagram for the proposal lifecycle. 

![Proposal sequence diagram.](/documentation/images/governance-proposal-sequence-diagram.svg)

This particular governance architecture has been adopted by a number of highly influential projects including
[Uniswap](https://docs.uniswap.org/protocol/reference/Governance/governance-reference) and has proven quite
successful in practice at adopting beneficial proposals to protocol upgrades while preventing
[adversarial attacks](https://docs.uniswap.org/protocol/concepts/governance/adversarial-circumstances).

The Hypernet DAO is used for proposing and vetting (by the token holder community) new 
[Non-Fungible Registries](/packages/contracts/contracts/identity/README.md) (NFRs), which are deployed 
through the [registry factory contract](/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol), and 
updating various parameters in the protocol itself. Particularly, the DAO can change the length of a proposal's voting 
period, the minimum proposal threshold, and the voting delay peroid. Additionally, the DAO is the `DEFAULT_ADMIN_ROLE` of every NFR
created by the registry factory (and thus can be used as a recovery mechanism if a `REGISTRAR_ROLE_ADMIN` loses control of 
their registry). The DAO is also the `REGISTRAR_ROLE_ADMIN`, and `REGISTRAR` of several NFRs that are instrumental for 
the secure functioning of the Hypernet Protocol ecosystem (thus functioning as a form of [token curated registry](https://arxiv.org/pdf/1809.01756.pdf)): 

1. [Hypernet Profiles](/packages/contracts/contracts/identity/README.md#hypernet-profiles)
2. [Gateways](/packages/contracts/contracts/identity/README.md#gateways)
3. [Liquidity Providers](/packages/contracts/contracts/identity/README.md#liquidity-providers)
4. [Payment Tokens](/packages/contracts/contracts/identity/README.md#payment-tokens)
5. [Registry Modules](/packages/contracts/contracts/identity/README.md#registry-modules)

## DAO Access and Usage

Users can see all past and present proposals in the official Hypernet [launchpad dashboard](https://rinkeby.launchpad.hypernet.foundation/proposals). 
Interacting with proposals (i.e. creating a proposal, casting a vote, etc.) requires that the active account first posses a 
[Hypernet Profile Non-Fungible Identity](/packages/contracts/contracts/identity/README.md#hypernet-profiles). Creating a new proposal requires that 
the initiating account posses an amount of Hypertoken equivalent to `_proposalThreshold` which is a public variable stored 
by the DAO contract (the default threshold is `1,000,000 H`). For a given active proposal, users may vote for, against, or abstain. 
Each Hypertoken in an account's balance counts as 1 vote (i.e. 100 Hypertoken = 100 votes). A proposal will be defeated if quorum is not 
reached (quorum for the Hypernet DAO is 4% of the total token supply). 

## Treasury Management

The Hypernet DAO [timelock](/packages/contracts/deployments.md) contract is the default 
[`burnAddress`](/packages/contracts/contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol#L68) of all 
[DAO-managed registries](/packages/contracts/contracts/identity/README.md#official-hypernet-protocol-non-fungible-registries). The burn fee from [token-based
registration](/packages/contracts/contracts/identity/README.md#token-based-registration) from all of these registries is sent to the timelock contract and its 
utilization is controlled by the token-holder community.