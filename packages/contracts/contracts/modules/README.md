# Registry Modules

## Summary 

Registry modules are intended to augment the functionality of an [NFR](/packages/contracts/contracts/identity/README.md#summary). Ideally, 
a module contract should be stateless and its functions should take a target registry address as one of the parameters so that it can 
be used with multiple registries simltaneously. Separating customizable logic from the NFR contract itself helps to reduce 
the size, complexity, and cost of deploying an NFR from the NFR factory. 

## Usage

In order for an NFR to make use of a module, a `REGISTRAR_ROLE_ADMIN` should grant the `REGISTRAR_ROLE` to the address 
of the module contract implementing the desired functionality. Once the module has served its purpose, the 
`REGISTRAR_ROLE_ADMIN` can revoke the `REGISTRAR_ROLE` from the module. 

A list of officially supported modules are curated by the Hypernet Protocol DAO via the 
[Registry Modules](/packages/contracts/contracts/identity/README.md#registry-modules) registry. The 
[Hypernet launchpad](https://rinkeby.launchpad.hypernet.foundation/registries) dashboard makes it easy to add a module to an NFR in which 
you occupy the `REGISTRAR_ROLE_ADMIN` role. Adding and removing modules to an NFR requires submitting 1 transaction each. 