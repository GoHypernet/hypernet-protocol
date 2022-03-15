## Hardhat tasks

This directory contains network constants and tasks definitions for use via the Hardhat CLI. To see all available 
tasks available through the Hardhat CLI run:

```shell
npx hardhat help
```

Get Governance contract parameters:

```shell
npx hardhat governanceParameters --network dev
```

Propose a new Non-Fungible Registry, your account must have at least `1000000` Hypertoken (1% of the total supply)
for the proposal to go through:

```shell
npx hardhat proposeRegistry --network dev --name Gateways --symbol GTW --owner 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

Additionally, if at any point during the voting process your voting power drops below this 1% threshold, your proposal
is vulnerable to being canceled:

```shell
npx hardhat cancelProposal --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
```

Check the state of an existing Proposal:

```shell
npx hardhat proposalState --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
```

Delegate your voting power to a given address:

```shell
npx hardhat delegateVote --network dev --delegate 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Cast a vote on a proposal (Against (0), For (1), Abstain (2)):

```shell
npx hardhat castVote --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490 --support 1
```

If a proposal has reached quorum and >50% of votes are in favor, once its deadline has passed it can be queued then executed:

```shell
npx hardhat queueProposal --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
npx hardhat executeProposal --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
```

Once a registry has been deployed via the proposal process, get the registry's info:

```shell
npx hardhat registryParameters --network dev --name Gateways
```

and set the registry's parameters:

````shell
npx hardhat setRegistryParameters --network dev --name HyperId --regtoken 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
``

Propose a new Gateway be added to the Gateways NonFunglebleRegistry we just deployed:

```shell
npx hardhat proposeRegistryEntry --network dev --name Gateways --label "https://hyperpay.io" --data "biglongsignatureblock" --recipient 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
````

Set the registration token address for an NFR:

```shell
npx hardhat setRegistryParameters --network dev --name Gateways --regtoken 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

If the registry is owned by the DAO, update the parameters with a proposal:

```shell
npx hardhat proposeRegistryParameterUpdate --network dev --name "Hypernet Profiles" --schema "" --storageupdate "" --labelchange "" --allowtransfers "" --registrationtoken "0x5FbDB2315678afecb367f032d93F642f64180aa3"  --registrationfee "" --burnaddress "" --burnfee ""
```

Add a new NFI by staking tokens:

```shell
npx hardhat registerWithToken --network dev --name Gateways --label "https://hyperpay.io" --data "biglongsignatureblock" --recipient 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --tokenid 007
```

burn an NFI if you are the owner or registrar:

```shell
npx hardhat burnToken --network dev --registry Gateways --tokenid 1
```

Retrieve data pertaining to a specific entry in a named Hypernet Gateway:

```shell
npx hardhat registryEntryByLabel --network dev --label https://hyperpay.io --name Gateways
```

create a new registry by burning hypertoken:

```shell
npx hardhat createRegistryByToken --network dev --name Gateways --symbol GTW --registrar 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --enumerable true
```