# Contents

## access

Contains an fork of OpenZeppelin's AccessControl library but specialized for NFT-based
accounts. 

## governance

Includes the EIP20 compatible token contract and the Governance DOA implementation.

## identity

Contains NonFunglebleRegistry.sol and the associated factory contract that produces
gas efficient proxy copies. 

## modules

Contains various contract implementations that can be deployed independently of an NFR
and serve as a smart Registrar in order to customize registration logic. Once a module 
is deployed it must be given the REGISTRAR_ROLE for it to be able to successfully make 
a call to an NFR's `register` function. 

## utils

Contains various helper contracts including vesting contracts. 