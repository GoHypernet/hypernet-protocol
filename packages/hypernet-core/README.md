# `core`

## Purpose

Hypernet Core is meant to be a drop-in component of applications that wish to quickly and easily send funds from a service or product consumer to a service or product provider. It is meant to be a payment protocol that allows funds to be sent quickly, often, and with minimal (or no!) fees (most of the time). While developers that build on top of Hypernet Core may need to somewhat know how it works, the goal is for the Core to be completely transparent to end users - they shouldn't even need to know how blockchain works, or even what blockchain is, in order to use the Core.

## Key Concepts

As a developer or contributor to the Core, there are a few key concepts that need to be understood; most relate to blockchain and the underlying technologies used by the core.

### Hypernet Core as a *Serverless* Payment Infrastructure Protocol

Most payment protocols requires a central server infrastructure; Visa processes credit card transactions via mainframes; Stripe processes payments in their cloud. 

*Hypernet Core* is peer to peer and serverless - mostly. Right now (as of Q4 2020), two clients communicate with each other via a central NATS messaging server, and payments are *routed* (via the Vector protocol) via a *routing node* to the end participant. 

Though the routing node (we'll call it 'Roger') is an active participant in transfers, it has no knowledge of participant activity otherwise; it simply routes a payment from A to B (Alice to Bob). Routing nodes never have custody of end user funds, and if they go (even permanently) offline, funds are not lost (though the end users that had active payment channels open will have to submit a blockchain transaction in order to claim their funds; more on that in the payment channels section!)

### Blockchain, Payment Channels, & Layer 2

Developers will need to know the basics of how blockchain works, as well as what payment channels are and how they work at a high level overview, in order to develop Hypernet Core.

#### Blockchain & Ethereum

Though most of the payments and activity occur at Layer 2 (see below), the Core must go down to Layer 1 for disputes, deposits, withdrawals, and other (hopefully rare) occasions.

As of Q4 2020, the Ethereum blockchain is capable of processing only 15 transactions per second; the supply and demand market for the fees associated with transactions on the blockchain, paired with this slow transaction speed, mean that individual transactions can be costly (sometimes as much as a few dollars!)

Helpful links / primers on blockchain, smart contracts, and Ethereum below:

- [3Blue1Brown, Youtube: "How does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4&t=3s)
- [Intro to Ethereum](https://ethereum.org/en/developers/docs/intro-to-ethereum/)
- [Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [Ethereum Whitepaper](https://ethereum.org/en/whitepaper/)

#### Payment Channels & Layer 2

As noted above, transaction on Ethereum itself is still slow. Thus, "Layer 2" solutions are needed. Layer 2 refers to the group of solutions that allow applications to transact "off-chain", and return to the chain when trust or communication breaks down. The below link is a very good primer & high level overview on layer 2 in general. Pay particular attention to the section on "Channels" - this is what Hypernet Core uses.

- [ethereum.org - Layer 2 Scaling](https://ethereum.org/en/developers/docs/layer-2-scaling/)

Hypernet Core specifically uses the payment channel framework developed by Connext called "Vector". In-progress documentation and a quick start guide on Vector can be found at the below link.

- [Connext - Vector](https://connext.github.io/vector/)

### Definitions & Key Terms

#### Hypernet Link

A *Hypernet Link* is an abstraction representing the collective group of payments & transfers between two participants in the Hypernet Core ecosystem - namely, a service/product provider and a service/product consumer.

There can be up to *two* Hypernet Links between two individuals/clients - one where Alice is a consumer and Bob is a provider, and one where Alice is a provider and Bob is a consumer.

#### Payment Channel

Similar to a *Hypernet Link*, but at a lower level of abstraction; a *payment channel* represents an agreed-upon set of parameters between two participants on the Ethereum blockchain. When using the term payment channel henceforth, we are specifically referring to payment channels within the Connext/Vector framework. 

**Important** - **Note the difference between a Hypernet Link and a Payment Channel, and at what layers they each live. It can be very easy to confuse the two if one isn't careful**

## System Architecture

Hypernet Core is built using a layered architecture with 4 layers; see the system diagram below for a brief description of each one and a sample of the modules within.

![HypernetCore System Architecture](https://github.com/GoHypernet/hypernet-protocol/raw/dev/documentation/images/HypernetCore.png)

## Usage

This will be one of the last sections filled in.
For now, see the `web-demo` package.

```
const core = require('core');

// TODO: DEMONSTRATE API
```
