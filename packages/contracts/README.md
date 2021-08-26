# Hypernet Protocol Contracts

This package contains the Hypernet Protocol solidity contracts for the token and governance. The token is 
[EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and is limited to a total supploy of `100,000,000` 
with `18` decimal places of precision. The governance contracts are based on OpenZeppelin's 
[Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which are based on a reference 
implementation by [Compound Finance](https://compound.finance/docs/governance).

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/governance/governance-reference) and has proven highly
successful in practice at adopting beneficial proposals to protocol upgrades while preventing adversarial attacks. 

The Hypernet Governance application is used for proposing and vetting new Gateway providers that wish to be added to
the Hypernet Non-Fungible Registry (HNFR). Hypernet Core uses the HNFR to prevent cross-site attacks which 
would attempt to load a malicious Gateway iframe instance into the user's browser context to steal funds. The HNFR is
based on the [EIP721](https://eips.ethereum.org/EIPS/eip-721) non-fungible token standard. Registration token can be 
transfered to new ownership accounts and can be burned if a Gateway is voted out of the HNFR by the Governance contract.

## Install Dependencies

```shell
npm install
```

## Running Contract Tests

```shell
npx hardhat test
```

## Hardhat Network

First, start a hardhat node (edit [hardhat.config.js](https://hardhat.org/config/#networks-configuration) 
to customize the Hardhat network settings):

```shell
npx hardhat node
```

You can run the node on a custom port by adding the `--port flag`:

```shell
npx hardhat test --port 8569
```

Once the node is running, deploy the Solidity contracts to the Hardhat network:

```shell
npx hardhat run scripts/sample-script.js --network hardhat
```