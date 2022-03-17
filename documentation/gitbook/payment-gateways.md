# **Payment Gateways**

Gateways are independent participants in the Hypernet Protocol payment network. They are *third-party* service providers built on top of the Hypernet Protocol primitives exposed
by the [Hypernet Core](/packages/hypernet-core) package. Gateways manage [payment channels](/documentation/gitbook/definitions-and-key-terms.md#payment-channel) and processes 
payments on behalf of end-users and merchants while never having custody of funds (Gateways never know a user's private key).

![Gateways direct payments from end-users to merchants without having custody of funds.](/documentation/images/digital-payments-user-space.png)

It is necessary for a gateway service provider to register their gateway connector code signature in the Hypernet Protocol 
[Gateway registry](/packages/contracts/contracts/identity/README.md#gateways) (which itself is an instance of an 
[NFR](/documentation/gitbook/definitions-and-key-terms.md#non-fungible-registry-nfr) owned by the DAO) for the Hypernet Core infrastructure to allow their service to process payments. 
Registration requires locking a significant amount of Hypertoken into the Gateways Registry contract. This deposit will be forfeited in the scenario that the Hypernet DAO votes 
to remove them from participating in the payment network. The service provider can choose to recover their deposit by burning their registration and exiting the payment 
network.