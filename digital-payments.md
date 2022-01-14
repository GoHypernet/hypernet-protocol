<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Protocol Digital Payments

## Summary 

A successful payment protocol must solve problems on both sides of the market. On the consumer side, users expect a
payment solution that quickly executes transactions and is intuitive. To accomplish this, the Hypernet Protocol
integrates Connext's [Vector](https://github.com/connext/vector) payment channel engine to enable fast, secure, microtransactions,
with minimal user intervention. On the merchant side, adopters expect a similarly refined onboarding process. The
Hypernet Protocol stack offers merchant developers a flexible platform that can adapt to the idiosyncratic requirements
of their particular business, and tools to streamline software integration. Meeting these needs has led to the development
light-weight developer abstraction layer and an accompanying user interfact compenent library. Developer's are isolated 
from the particulars of Layer 2 scaling protocols and are presented with a small set of function calls bundled together in 
an npm package that looks familiar to those who have used a traditional payment service provider SDK.

All functionality related to the Hypernet Protocol can be accessed via the use of the [Hypernet Core](/packages/hypernet-core) package.
This section discusses a few key concepts of how payments are implemented in the Hypernet Protocol.

## Definitions & Key Terms

### **Layer 1**

This is an alternative name for a base-layer consensus network. Networks like Bitcoin, Ethereum, and Avalanche are examples of *layer 1* protocols. 
The term layer 1 does not imply a particular ledger data structure, i.e, a layer 1 protocol could be either blockchain-based or based on a 
directed acyclic graph (DAG) topology. 

### **Layer 2**

This is a colloquial term for any technology that inherently derives its security from a Layer 1 network. Typically, Layer 2 technologies are designed to circumvent
the throughput limitations of the layer 1 network they are secured against and therefor are ofter referred to as off-chain scaling techniques. Some communication
layer 2 approaches include: [state-channels](https://ethereum.org/en/developers/docs/scaling/state-channels/), 
[zk-rollups](https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/#zk-video), [side-chains](https://ethereum.org/en/developers/docs/scaling/sidechains/#top), etc.

### **Payment Channel**

[Payment channels](https://dl.acm.org/doi/pdf/10.1145/3243734.3243856?casa_token=ySJOdlwgPCcAAAAA%3AnkfO9uHl7fZ-c7C0_L3xrQSHhujnqNIJgtkB7Gt2yE6MZV9145qbyHsGHQaSV1NGZBNousWk-wQ) 
are a layer 2 technique that is a speciallization of state-channels. They are designed specifically for scaling trustless value transfers without having to submit 
transactions directly to a layer 1 network. This is accomplished via a two-party consensus protocol in which digital signatures are shared directly between two
participants via a p2p communication layer. 

### **Gateways**

Gateways are participants in the Hypernet Protocol payment network. They are *third-party* service providers built on top of the Hypernet Protocol primitives.
Gateways manage payment channels and processes payments on behalf of end-users and merchants while never having custody of funds (Gateways never know a user's private
key). It is necessary for a gateway service provider to register their gateway connector code signature in the Hypernet Protocol 
[Gateway registry](/packages/contracts/contracts/identity/README.md#gateways) in order for the Hypernet Core infrastructure to allow their service to process payments. 

## Hypernet Core as a _Serverless_ Payment Infrastructure Protocol

Most payment protocols require highly available centralized server infrastructure. For example, Visa processes credit card transactions 
via [mainframes](https://en.wikipedia.org/wiki/Mainframe_computer#Characteristics); Stripe processes payments in their cloud.

_Hypernet Core_ is peer-to-peer and serverless - mostly. Right now (as of Q4 2021), two clients communicate with each other 
via a [NATS](https://nats.io/) messaging network, and payments are _routed_ (via the [Vector protocol](https://github.com/connext/vector)) 
via a _routing node_ to the end participant.

Though the routing node is an active participant in transfers, it has no knowledge of participant activity otherwise; it simply routes a payment from one person 
to another. Importantly, routing nodes are never in custody of end user funds, and if they go (even permanently) offline, funds are not lost (though the end users 
that had active payment channels open will have to submit a blockchain transaction in order to claim their funds; more on that in the payment channels section!)

#### Layer 1

Though most of the payments and activity in the Hypernet Protocol payments stack occur at Layer 2 (see below), the Core relies on layer 1 for disputes, deposits, 
withdrawals, and other (hopefully rare) occasions.

As of Q4 2020, the Ethereum blockchain is capable of processing only 15 transactions per second; the supply and demand market for the fees associated with 
transactions on the blockchain, paired with this slow transaction speed, mean that individual transactions can be costly (sometimes as much as a few dollars!)

Helpful links / primers on blockchain, smart contracts, and Ethereum below:

- [3Blue1Brown, Youtube: "How does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4&t=3s)
- [Intro to Ethereum](https://ethereum.org/en/developers/docs/intro-to-ethereum/)
- [Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [Ethereum Whitepaper](https://ethereum.org/en/whitepaper/)

#### Payment Channels & Layer 2

As noted above, transacting on Ethereum itself is still slow. Thus, "Layer 2" solutions are needed. Layer 2 refers to the group of solutions that allow 
applications to transact "off-chain", and return to the chain when trust or communication breaks down. The below link is a very good primer & high level 
overview on layer 2 in general. Pay particular attention to the section on "Channels" - this is what Hypernet Core uses.

- [ethereum.org - Layer 2 Scaling](https://ethereum.org/en/developers/docs/layer-2-scaling/)

Hypernet Core specifically uses the payment channel framework developed by Connext called "Vector". In-progress documentation and a quick start guide on 
Vector can be found at the below link.

- [Connext - Vector](https://github.com/connext/vector)