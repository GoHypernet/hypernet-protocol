<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Protocol Digital Payments

## Summary 

A successful payment protocol must solve problems on both sides of the market. On the consumer side, users expect a
payment solution that quickly executes transactions and is intuitive. To accomplish this, the Hypernet Protocol
integrates Connext's [Vector](https://github.com/connext/vector) payment channel engine to enable fast and secure microtransactions,
with minimal user intervention. On the merchant side, adopters expect a similarly refined onboarding process. The
Hypernet Protocol stack offers merchant developers a flexible platform that can adapt to the idiosyncratic requirements
of their particular business, and tools to streamline software integration. Meeting these needs has led to the development of a 
light-weight developer abstraction layer and an accompanying user interface component library. Developers are isolated 
from the particulars of layer 2 scaling protocols and are presented with a small set of function calls bundled together in 
an npm package that looks familiar to those who have used a traditional payment service provider SDK.

## Hypernet Protocol as a _Serverless_ Payment Infrastructure Protocol

Most payment protocols require highly available centralized server infrastructure. For example, Visa processes credit card transactions 
via [mainframes](https://en.wikipedia.org/wiki/Mainframe_computer#Characteristics); Stripe processes payments in their cloud.

_Hypernet Core_ is peer-to-peer and serverless - mostly. Right now (as of Q4 2021), two clients (typically and end-user and a merchant) are 
directed by a gateway to communicate with each other via a [NATS](https://nats.io/) messaging network, and payments are _routed_ (via the [Vector protocol](https://github.com/connext/vector)) 
via a _routing node_ to the end participant.

Though the routing node is an active participant in transfers, it has no knowledge of participant activity otherwise; it simply routes a payment from one person 
to another. Importantly, routing nodes are never in custody of end user funds, and if they go (even permanently) offline, funds are not lost (though the end users 
that had active payment channels open will have to submit a blockchain transaction to claim their funds; more on that in the payment channels section!)
