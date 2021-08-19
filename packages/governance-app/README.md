# Hypernet Protocol Governance

This package contains the Hypernet Protocol governance contracts. The governance contracts are based on 
OpenZeppelin's [Governer](https://docs.openzeppelin.com/contracts/4.x/governance) library which are based
on a reference implementation by [Compound Finance](https://compound.finance/docs/governance).

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/governance/governance-reference) and has proven highly
successful in practice at adopting beneficial proposals to protocol upgrades while preventing adversarial attacks. 

The Hypernet Governance application is used for proposing and vetting new Gateway providers that wish to be added to
the Hypernet Gateway registry. Hypernet Core uses the Hypernet Gateway registry to prevent cross-site attacks which 
would attempt to load a malicious Gateway iframe instance into the user's browser context. 

Gateways can also be removed from the Hypernet Gateway registry through a proposal that will delete their registration 
from the public registry. 

NOTE:

Everything required to start building UI components is available throught the HypernetGovernor contract. However, I still
need to add the gateway and liquidity provider mappings and expose the functions required to update them. 

## Running Contract Tests

```shell
npx hardhat test
```