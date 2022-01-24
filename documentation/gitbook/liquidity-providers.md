# Liquidity Providers

As stated in the Digital Payments [introduction](/documentation/gitbook/digital-payments.md), the Hypernet Protocol payments network is intrinsically based on a 
[payment channel](/documentation/gitbook/definitions-and-key-terms.md#payment-channel) architecture. This engineering design decision was chosen due 
to the superior user-experience flows that are enabled by payment channel mechanics. Hypernet Protocol gateway operators direct payments from 
end-users to merchants through one or more liquidity providers. 

A liquidity provider is a participant running a special instance of the Vector payment channel engine whose purpose is to connect participants who do not have
a direct connection through a channel contract on the blockchain. Thus, participating as a liquidity provider is potentially capital intensive since the operator 
must maintain sufficient liquid assets in the channel contracts for them to function. 

Since liquidity providers are running off-chain infrastructure, Hypernet Protocol allows for a decentralized discovery mechanism via the 
[Liquidity Providers](/packages/contracts/contracts/identity/README.md#liquidity-providers) NFR. Hypernet Core (and Gatways build on top of Hypernet Core) will not
instantiate payment transfers from liquidity providers that have not registered in the Liquidity Providers NFR. 