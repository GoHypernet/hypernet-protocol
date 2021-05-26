# Governance Platform

## Table of Contents

- [What is Smart Account and Voting?](#what-is-smart-account)
- [Overview](#overview)
- [Voting App](#voting-app)
- [Getting Started](#getting-started)
- [Licensing](#licensing)

## What is Smart Account?

Today, Smart Account uses the Ethereum blockchain to represent an account using a smart contract, attributes can be added by the account owner and are stored in hash form. Attributes can be endorsed by any user, this is done by storing a corresponding endorsement hash against the attribute hash. Endorsements are revocable and are considered current if not revoked.

To verify underlying attribute and endorsement data, corresponding hashes must be computed, and their presence verified within the corresponding account contract.

Attributes and endorsements are formed of field sets, merkle-root hashes are used to allow sharing and verification of partial data (such as date of birth within a driving license).

Smart Account and Voting is a platform that uses Ethereum and solidity smart contracts as a framework for its core protocol.

## Prerequisites

- min [Node.js 6.9](https://nodejs.org)
- min [Python 2.7](https://www.python.org/download/releases/2.7/)
- Command Line Tools
- **Mac OS X**: [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`) and `brew install libgcrypt`
- **Ubuntu / Linux**: `sudo apt-get install build-essential python-software-properties libssl-dev`

## Overview

### The Smart Account structure: Smart Contracts, Attributes and Endorsements

The Smart Account construct uses an attribute-endorsement model enabled by the use of smart contracts which provide rudimentary role based permissions. An account-owner can attest that an 'attribute' is a correct representation of a part of their account (by storing a corresponding hash value within their account), following which third parties are can be attest/voting to the validity of each attribute (by storing a corresponding hash value against the attribute within the account)

#### Smart Contracts

##### SmartAccount.sol

This is the Smart Account contract as used by the Smart Account instance. It describes the core functionality required as part of a Smart Account contracts with encryption keys, attributes & endorsements.

A Smart Account is an [Ethereum](https://www.ethereum.org/) Smart Contract address. The smart contract must be constructed using valid Smart Account bytecode. It provides access to account management commands and stores hash representations of account data.

The Smart Contract has a constructor that defines the owner and core elements of the account:

- Contract address - a 32byte hash of the address at which the contract is deployed.
- Encryption key - a changeable encryption (public) key that allows other actors to send data for encrypted receipt and decryption by this account. This can be changed at any point.
- Signing key - a changeable encryption (public) key that allows other actors to verify Endorsements signed by this account.
- Attribute mapping - A mapping that stores the Attributes (and associated Endorsements) related to the contract/account.
- It also implements a kill function so that an account can be retired (though the record of it's 'active' period is of course retained in the blockchain).

#### SmartAccountRegistry.sol

This contract holds a curated list of valid contracts have approved as valid implementations of Smart Account. These are curated by hashing the bytecode of a known good contract. This should be maintained as a list on the Blockchain so that other contracts can perform (optional) real-time verification that a contract is present on this list, and therefore a valid smart account. There may be multiple statuses on this registry (initially Pending / Accepted / Rejected) so that the contracts can be better maintained.

### Attributes

An Attribute is a specific instance of an attribute template which has been populated and (the corresponding hash) stored within a Smart Account.

If verification of attribute field subsets is required, for instance to use a digital driving license in order to prove age but not disclose address, the attribute hash should be the merkle root of the attribute field set (with appropriate salt or RND values applied at the leaf node level to prevent reverse engineering of leaf node hash values).

**The attribute hash corresponds to an attribute record stored off-chain, which consists of at least:**

- AttributeHash
- AttributeId (attribute template accounting)
- Attribute field set

Attribute creation/update/removal transactions can only be submitted by the account owner.

### Endorsements

An endorsement is a notarised record of attestation by a third party in relation to a specified attribute, stored with the attribute within the account contract. Our initial implementation uses a single endorsement template. The definition of what 'endorsement' means for a given attribute can also be varied within the underlying attribute definition to provide some flexibility.

Receivers/consumers of account data may (should) privately manage the Endorser identities they are prepared to trust.

**The endorsement hash corresponds to an endorsement record stored off-chain, which consists of at least:**

- Endorsement Hash
- Endorsee Address (Smart Account)
- Endorsed Attribute Hash
- Endorsement Expiry Date
- Endorser Address (Smart Account or Voting ID)
- Endorser signature of endorsement

Whilst attributes can only be added by an account owner, endorsements must be added anonymously from previously unused ethereum public keys. This is to preserve privacy and prevent unwanted account identification of an endorsing party. This will also allow endorsements to be created 'off chain', and added in by the owner themselves, providing the signature of the endorsement can be verified against an on-chain Account. The unrestricted ability to add endorsements presents a risk of spam or unwanted endorsements, for which there are a number of potential solutions, and for which future protocol updates may be introduced.

### Value of the account / attribute / endorsement model

Given that an attribute has been endorsed by a trusted third party, the weight of that endorsement is what adds value to the attribute. An attribute without endorsement requires complete trust in the account. For the benefit of the ecosystem, each time a user chooses to trust such an attribute, they should endorse the fact that they trust it.

The challenge lies in providing the transparency of endorsement types, if not endorsement people. For example, if I simply endorse a driving licence for the purpose of accounting a person qualfies for entry into a nightclub, then that same endorsement should hold far less weight on whether a person is entititled to drive. To that end I should only endorse the attributes of the driving licence that I have relied upon for my judgement, and rarely the document as a whole.

### Attribute Templates

An Attribute Template can describe either a single field, or collection of fields representing a logical set of account data.

Attribute templates are created and stored within the Smart account application instance (see Admin Microservice below).

The model for templates should follow that of jsonschemaform - whereby the definition of the form is kept in the attribute.

Whilst bespoke attribute templates can be configured for any purpose (consider an attribute template as a data collection form which facilitates personal data notarisation), it is expected that common attributes (e.g. driving license) will be standardised and endorsable, and in time repositories of common templates will be curated and shared for common reference.

---

## Voting App

#### 🐲 Project stage: Rinkeby

Deployed audited version on APM: v1.1.0

Beware some changes have been made to the contract since this audit. Specifically the contract now implements the TokenManagerHook to enable the use of transferable tokens.

#### 🚨 Security review status: Not audited

The Voting app is a fork of the Original Voting app.
It serves the same purpose as the original Voting app but also enables organizations to restrict actions to members who have expressed approval in recent votes. It basically means that by voting yes on a proposal you are committing to a decision in the Org.

The main changes that have been implemented which differ from the original Voting app are:

- Removed the ability for a user to change their vote.
- Added a buffer period which determines how much time in blocks must pass between the start of each vote.
- Added an execution delay period in blocks (this means that the `full vote duration` + `full execution delay period` must pass before being able to execute a vote in case it passes).
- Removed the early execution functionality.
- Changed the vote duration to blocks. The main reason for this is that since proposals are queued we do not necessarily know which block number to use for the vote snapshot (since we are not necessarily processing the transaction right when the vote starts).
- Keep track of the latest vote ids users have voted yes on.
- Make the app an [ACL Oracle](https://hack.aragon.org/docs/acl_IACLOracle).

## How does it work?

It has the same funcionality as the regular voting app with some exceptions:

- Proposals are now queued with a minimum number of blocks between the start of each one.
- Users cannot change their decision after they have already voted.
- Votes are delayed a configurable period of time since when they are closed till when they can be executed (in the case they pass).
- Votes cannot be early executed. This means that the `full vote duration` + the `full delay period` has to pass in order to be able to execute a vote (in case it passes).

It also acts as an [ACL Oracle](https://hack.aragon.org/docs/acl_IACLOracle). ACL Oracles are small helper functions that plug in to Aragon's access control list (ACL) to do more sophisticated permission evaluation. This Oracle is intended to restrict actions to members who have expressed approval in recent votes.

The app keeps track of the latest vote ids users have voted yes on. This way when the Oracle function is queried, it can properly evaluate whether a member can perform a certain action or not within the Organization.

In the context of Hypernetlabs Orgs, the redeem functionality will be guarded by a role set behind this ACL Oracle. This means that whenever a user wants to redeem some tokens, it will first call the ACL Oracle function to check whether s/he can perform the action or not.

**Users will be able to redeem tokens if one of this conditions is met:**

- The latest vote in which the user voted yea failed (did not passed) and the execution delay for this vote has already passed.
- The latest vote in which the user voted yea passed and has been executed.
- The latest vote in which the user voted yea passed and the fallback period has passed.

### What's the fallback period ?

The fallback period is intended to ensure users are both locked in for votes they voted yes on, but still have an opportunity to exit before the next vote that they didn't vote yes on gets executed. The idea here is that it gives other members an opportunity to execute the vote before anyone who voted yes on the proposal has the opportunity to exit. It also takes into account the possibility of a vote to fail its execution due to reasons that are outside of the Org's control.

## Initialization

The Voting app is initialized with a `MiniMeToken _token`, `uint64 _supportRequiredPct`, `uint64 _minAcceptQuorumPct`, `uint64 _durationBlocks`, `uint64 _bufferBlocks` and `uint64 _executionDelayBlocks`.

- `MiniMeToken _token` refers to the token that will be used to vote
- `uint64 _supportRequiredPct` refers to the support required to pass a vote
- `uint64 _minAcceptQuorumPct` refers to the quorum required to pass a vote
- `uint64 _durationBlocks` refers to the number of blocks that a vote stays open
- `uint64 _bufferBlocks` refers to the minimum number of blocks between the start block of each vote
- `uint64 _executionDelayBlocks` refers to the number of blocks that a vote will be delayed from when is closed to when it actually can be executed (in case it passes).

## Roles

The Voting app should implement the following roles:

- **CREATE_VOTES_ROLE**: This allows for changing the Aragon app that can create votes
- **MODIFY_SUPPORT_ROLE**: This allows for changing the amount of support required to pass a vote
- **MODIFY_QUORUM_ROLE**: This allows for changing the quorum required to pass votes
- **MODIFY_BUFFER_BLOCKS_ROLE**: This allows for changing the minimum number of blocks between the start block of each vote
- **MODIFY_EXECUTION_DELAY_ROLE**; This allows for changing the number of blocks that votes are delayed from when they are closed till when they can be executed (in case they pass).

### Interface

The interface is pretty much the same as the original Voting app with the exception that now you can see when future votes will start (upcoming votes).

## How to try Voting app immediately

### Template

If you would like to see the Voting App in action, we recommend the Hypernetlabs Org template available in the Aragon templates directory. Just go to https://mainnet.aragon.org/, then create a new organization, and choose Hypernetlabs from the template options.

## Getting Started

## How to run the Governance App locally

For `contracts` directory installation:

```sh
yarn
```

For `ui` directory installation and build ui package.

```sh
cd app && yarn && yarn build
```

Deploy a `dao` with Governance App installed on your local environment.

```sh
cd .. && yarn start
```

For `all contracts` test:

```sh
yarn test
```

## Wider architecture

The distributed ledger and account smart contract form just one layer in the Smart Account ecosystem, outside of this layer, numerous applications support the various off-chain storage and processing tasks needed during interaction with the blockchain.

## Licensing

This code is released under the Apache v2 open source licence.
