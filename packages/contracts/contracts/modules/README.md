# modules

This directory contains various contract implementation that are intended to augment the registration function
of an NFR. Every module must be stateless and take a registry address as one of the parameter for the augmented
registration role. Separating advanced registration (minting) logic from the NFR contract itself helps to reduce
the size, complexity, and cost of deploying an NFR. 

In order for an NFR to make use of a module, a REGISTRAR_ROLE_ADMIN should grant the REGISTRAR_ROLE to the address 
of the module contract implementing the desired functionality. Once the module has served its purpose, the 
REGISTRAR_ROLE_ADMIN can revoke the REGISTRAR_ROLE from the module. 