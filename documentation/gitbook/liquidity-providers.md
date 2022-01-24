# Liquidity Providers

As stated in the Digital Payments [introduction](/documentation/gitbook/digital-payments.md), the Hypernet Protocol payments network is intrinsically based on a 
[payment channel](/documentation/gitbook/definitions-and-key-terms.md#payment-channel) architecture. This engineering design decision was chosen due 
to the superior user-experience flows that are enabled by payment channel mechanics. Hypernet Protocol gateway operators direct payments from 
end-users to merchants through one or more payment channel liquidity providers. 

A liquidity provider is a participant running a special instance of the [Vector payment channel engine](https://github.com/connext/vector) whose purpose is to 
connect participants who do not have a direct connection through a channel contract on the blockchain. Thus, participating as a liquidity provider is potentially 
capital intensive since the operator must maintain sufficient liquid assets in the channel contracts for them to function. However, liquidity providers can choose
to offset their operational costs by imposing a transaction fee for each transaction they fascilitate. 

Since liquidity providers are running off-chain infrastructure, Hypernet Protocol allows for a decentralized discovery mechanism via the 
[Liquidity Providers](/packages/contracts/contracts/identity/README.md#liquidity-providers) NFR. In oder to obtain an registration token from the Liquidity Provider
registry, the owning account must first create a [Hypernet Profile](/packages/contracts/contracts/identity/README.md#hypernet-profiles) and choose a username. 
Hypernet Core (and Gateways build on top of Hypernet Core) will not instantiate payment transfers from liquidity providers that have not registered in the Liquidity 
Providers NFR. As with the Gateways Registry, the Liquidity Providers registry is also governed by the Hypernet DAO and therefor individual entries can be removed 
by a (successfully passed) proposal. 