# Hypernet Core Package

## Purpose

Hypernet Core is meant to be a drop-in component of applications that wish to quickly and easily send funds from a service or product consumer to a service or product 
provider. It is meant to be a payment protocol that allows funds to be sent quickly, often, and with minimal (or no!) fees (most of the time). While developers 
that build on top of Hypernet Core may need to somewhat know how it works, the goal is for the Core to be completely transparent to end users - they shouldn't 
even need to know how blockchain works, or even what blockchain is, in order to use the Core.

The hypernet-core package contains all of the off-chain logic of the Hypernet Protocol, encapsulated in the HypernetCore class. You probably will not instantiate this 
object directly, especially for in-browser use. In a browser, the HypernetCore instance should always be run within its own iframe for security. The `iframe` package 
provides a wrapper for HypernetCore to do just that.

The HypernetCore object is basically a server. The HypernetCore instance coordinates all of the payment activities, interacting with multiple Gateways and a single 
Vector node. In the browser, the gateway connectors are sandboxed in their own iframes for security purposes (see the `gateway-iframe` package for details), and the 
Vector browser node also runs as an iframe for security. It's iframes all the way down around here.

HypernetCore can be configured for either in-browser or Node operation. In-browser mode makes use of browser specific technologies to enhance the security model 
(iframes), while the Node mode uses worker threads.

## Key Concepts

### N-Tier Architecture

hypernet-core uses a tiered architecture, consisting of 4 major layers.

It makes use of the call down, event-up and sideways model. Classes at a higher layer can inject classes at any lower layer and user their functions at will. Classes 
at lower layers can not communicate directly with the layer above; they must instead emit events. RXJS is used (poorly) for the events; this is a bit of a heavy 
handed approach since we are not otherwise using reactive programming patterns, but was chosen because it is well known and should be compatible with most things 
the end user may be using.

It is important to note that classes within a layer can not communicate laterally either. ServiceA can not inject and use ServiceB, and must instead emit an event. 
This distinction gets a little fuzzy within the Utilities layer but is otherwise adhered to quite strictly. To make this a bit easier, the top 3 layers each include 
a sub layer where code that needs to be shared AND that needs to use lower layers can live. Currently, only the Data layer is making use of this.

![alt text](/documentation/images/hypercore-diagram.png)

From the top down, the layers are:

1. API

   Anything that talks to, or listens to, the world outside of HypernetCore is an API. This includes things like Vector, which can be confusing at first because Vector is also at the bottom of our stack. The idea is to keep the outside world at arms length, and for our purposes, Vector is the outside world. It makes sense, since Vector is running it's own processes, taking requests, and emitting events. Those events are listened to at the API layer, along with events from the messaging system or the blockchain. The HypernetCore object wraps everything up; it is not contained inside the API layer but does form an API.

   Another core concept for my conception of APIs is as a transformation layer. Classes in the API layer are ultimately just mappers; they map a request or an event in one "language" (library, data source) into the internal language of Hypernet Core. Implementations of classes at the API layer can make use of external libraries to react to the outside world, but ultimately they just translate the language of that library into an HNC service call, using the HNC abstractions.

2. Business

   Sometimes referred to as the Service layer. All the core logic of HypernetCore is contained here. This layer speaks only in the business abstractions we have chosen- IE our contracts (contained within the `objects` package). There are no direct dependencies on outside libraries or their own contracts at this layer[^1].

   [^1]: Vector's Transfer objects have kind of slipped in here; this could be alleviated by an additional set of wrapper classes.

3. Data

   This layer makes use entirely of the Repository pattern. Each different class of object has it's own repository. The data layer is just the inverse of the API layer, converting HypernetCore abstractions to other ones. Those other abstractions could be outside libraries or process (IE Vector), storage or peristence mediums, messaging or 3rd party APIs. If it is "leaving" the system, it goes via a Repository. Repositories can also query those outside systems and covert that to a HNC abstraction, which is just a very long winded way of saying they can get and return data.

   Repositories are similar to API listeners in that their implementations can make use of external libraries. The contract for the repository will not have any reference to this, but the implementation can use whatever it wants. This allows us to swap out the implementations as necessary without affecting layers above.

4. Utilities

   This is the base layer, underpinning everything else. Code in the utilities layer can take many forms. The most common are:

   - Providers

     Similar to factories, these are usually simple classes that exist to "provide" a (typically) singleton instance of some utility class to layers above. Examples of this are the config and context providers, but there are some more complicated ones such as the BlockchainProvider, which coordinates all the processes necessary to initialize a Blockchain provider and signer.

   - Factories

     Classes that provide instances of other classes, natch. I use the term "factory" when it is not the same global instance going around, but a new instance each call. Providers are just a specialization of the Factory pattern.

   - Utils

     Classes that process data. These classes typically do not have requirements or only require some low-level providers, and exist to process data. The take in HNC abstractions and return answers, as different HNC abstractions.

### SOLID Principles

hypernet-core adheres, to the best of my understanding of them, to the SOLID design principles (https://en.wikipedia.org/wiki/SOLID).

1. Single Responsibility

   Each class handles a single concept, or ideally a single kind of object.

2. Open-closed

   Everything can be extended, but there's no friend classes here. Most data is protected.

3. Liskov Substitution

   There is a heavy reliance on abstractions and design by contract.

4. Interface Segregation

   This is the main design consideration for the API layer. The business logic always works the same, but each client can have it's own API class to translate that underlying logic into something that client understands.

5. Dependency Inversion

   Pretty much the driving design concern. We currently do not use an injection kernel, but most classes make use of inversify.js annotations and a switch to inversify's kernel is coming soon.

### Payments as Derived Objects

Payments in the Hypernet Protocol are really a wrapper around Vector's lower level Transfer objects. The basic Push payment is just a derivation of 3 different 
Vector transfers, and has no "state" per se. The state of a payment is based on the state of the underlying transfers.

Vector has no concept of grouped or dependent transfers. Transfers are just "A sends value to B, according to some rules". When B needs to send something back to A, 
a Transfer just can't cut it. So we need a few transfers, and to wrap that up we have Payments. The Payment is the native business abstraction for HNC, not the 
Transfer, although the underlying Transfers are available via the Payment.details. To the largest extent possible, the business layer tries to ignore the existence 
of Transfers and operates only in terms of Payments. This requires quite a bit of business-like logic to be pushed down to the Data layer, which must translate a 
change in a Payment to Transfer-ese, and vice versa.

We make use of both a Transfers' State and Metadata properties to enable grouping Transfers. State is preferred, as that is an immutable property backed by the 
blockchain; metadata exists only inside of Vector and is thus more open to modification.

### Gateways and Gateway Connectors

The Hypernet Protocol includes a concept called "Gateways". Gateways are analagous to conventional payment processing networks, such as Visa or Mastercard. However, 
in Hypernet Protocol, Gateways are non-custodial- they never hold funds, and do not actually perform the transfer. They instead act as overseers of the process, and 
arrange for the routers which will perform the actual transfers. Gateways are identified by a canonical URL (GatewayUrl). Gateways are required to support a single 
endpoint after that URL, /connector. For example, if the gateway url is https://hyperpay.io, the /connector endpoint is https://hyperpay.io/connector.

Gateways interact with HNC by publishing a Gateway Connector, a single, probably webpacked, code file available at /connector. This file must be signed with the 
Gateway's private key, and both the signature and the Gateway's address are published into the on-chain Gateway Registry. After a user authorizes use of a particular 
gateway, HNC will create a child process (either an iframe or a worker thread) that hosts an instance of the `gateway-iframe` package. The Gateway Iframe will 
independently pull down the Gateway Connector code, check the signature against the published values in the registry, and then setup a proxy that allows HNC to 
communicate with the connector. This means that, for every Gateway the user has authorized, a seperate, sandboxed process will be setup that will run the Gateway's 
published and signed code. Malicious code from a gateway can not affect HNC as a whole, but does have complete control over it's own sandbox. A malicious (or 
compromised) gateway can still do a lot of damage by requesting improper payments from HNC, but cannot do anything to HNC that a Gateway Connector cannot ordinarily do.

The Gateway Connector has two main purposes. It functions as the Gateway's boots on the ground, and as HNC's interface between what is going on in the payment process 
and with the gateway. The Gateway Connector is meant to be a mini application that runs by itself, and should have a usable GUI for Web usage; details on the 
headless/Node operation mode are still being worked out. The Gateway Connector can manage authentication of the user with the Gateway, and serve as an endpoint 
for communication with the Gateway's servers, such as a socket listener. The connector can emit events which will be ferried to HNC to do things like initiate a 
payment, and must support function calls coming from HNC. These calls may be information- status updates for payments for instance- or requests for information 
about the Gateway. The `gateway-connector` package defines the required interface for a connector, and the `test-gateway-connector` package provides an example 
of how to make one.

Gateways themselves- not the Connector, but the overall service- operate as independed Software-As-A-Service systems. There is huge latitude allowed in the 
business model of the Gateway. They can be subscription systems or charge per transaction. Their API, used by their own clients, is entirely up to them. The 
Gateway has complete control over how and when a user sends a payment- payments can ONLY be initiated by a Gateway, which also has complete control over the 
parameters of the paymennt. Gateways are then responsible for monitoring the progress of the payment, looking for foul play on behalf of either participant. 
The Gateway is provided continual updates on the progress of the payment by both the sender and reciever; if any of those details differ the Gateway can use 
that as evidence of foul play. Once the payment is into the Accepted state (receiver has gotten their money, but the insurance has not been released), the 
Gateway is responsible for releasing the insurance, which it can do at any time up to the expiration date of the insurance transfer. The Gateway also 
determines the actual amount of insurance to release- 0 if everything is good, up to the entire amount if the transfer is deemed fraudulent.

### Vector Protocol

The Vector system (https://github.com/connext/vector) forms the basis of the Hypernet Protocol. Vector is a state channel based system developed by Connext. 
It is based on the concept of State Channels, which is a Layer 2 technology, that can use faster transport mechanisms than the underlying blockchain but still 
provide most of the security and immutability of the blockchain. The main readme has more information about the concept.

Vector is designed as a multiple node system, using NATS for communication between the nodes. In order to participate in the Vector network you must run a node; 
either a browser node or a "server" node; both are equivalent. Routers and clients use the node to change the state of the system. Routers form the core of the system; 
each client opens one or more state channels with one or more routers in the network. Routers act as liquidity providers; each router must hold enough liquidity to 
acilitate the opening and closing of a state channel, the only on-chain operation under normal circumstances. The details of each router are published into an on-chain 
Liquidity Registry, which holds the details of what chains and tokens the router can transact in, and, crucially, which gateways are allowed to use that router. 
Routers may be operated by the Gateway themselves, or by independent operators, but are not allowed to charge fees directly (although this is supported by Vector). 
Router operators depend on out-of-protocol agreements with Gateways to fund their operations. The liquidity registry's listing of supported Gateways allows the 
router to enforce these agreements.

### Neverthrow and async

Hypernet Core, and all of the packages Hypernet Labs builds, make extensive use of the [Neverthrow](https://github.com/supermacro/neverthrow) library. Neverthrow 
allows you to create type-safe exceptions. As HNC is a financial system we are very sensitive to error conditions and want to handle as many as practical. HNC also 
makes heavy use of promises and async constructions. Neverthrow allows us to get most of what we want, at the expense of not being able to use the `async` and `await` 
keywords. Instead, the code looks like older Promise based code, using `.andThen()` chains.

Neverthrow provides the `ResultAsync` object, and almost every single method in HNC will return this object. Because of the way Neverthrow works, the functions 
are not declared as `async`, even though, technically, a `ResultAsync` IS a promise. `ResultAsync` is either a proper result OR an error, and both are strongly 
typed. Since multiple types of errors are possible, we make use of union types for the errors (`BlockchainUnavailableError | ProxyError`), but our error types 
have proper prototypes and can be distinguished using Typescript's reflection mechanisms, instanceof and typeof.

Neverthrow is not to be taken literally- we still sometimes use `throw`, and this is a good thing and recommended by the library itself. We will throw an 
exception, rather than return it in the `ResultAsync`, when it is a completely fatal error, or one that represents some failure of the programming logic 
itself. Basically, errors that should NEVER be thrown but are required to make Typescript happy, or are thrown by the developer themself to represent 
"D'oh"! Errors returned via `ResultAsync` are errors that are considered potentially recoverable during runtime by the application; they are not logical 
errors. This means that checking parameters for validity is answered via throw; there's no way you are recovering and retrying an improper parameter issue 
(other than validating a User/API's input, and that is a different thing entirely). Bad parameters inside the system itself are logical programming errors 
and can not be fixed at runtime.

## Development

Hypernet Core has no direct build products; it is just an NPM package.

`yarn compile`

Compiles the package.

`yarn test`

Runs the unit and integration tests on the package.

There is no "start" command for the core. You should run yarn start at the root to execute the deliverable. If you make changes to Hypernet Core and want to see 
them in the dashboard, you will need to re-dockerize the `iframe` package and re-start at the root.
