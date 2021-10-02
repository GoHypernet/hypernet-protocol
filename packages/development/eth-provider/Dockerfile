FROM connextproject/vector_ethprovider:0.2.5-beta.6
ARG MNEMONIC_ARG="candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
ENV MNEMONIC $MNEMONIC_ARG

ARG CHAIN_ID_ARG="1337"
ENV CHAIN_ID $CHAIN_ID_ARG

COPY hardhat.config.ts /app/hardhat.config.ts
COPY deploy.ts /app/deploy/
COPY transferDefinitions/Message.json artifacts/src.sol/transferDefinitions/Message.sol/
COPY transferDefinitions/Insurance.json artifacts/src.sol/transferDefinitions/Insurance.sol/
COPY transferDefinitions/Parameterized.json artifacts/src.sol/transferDefinitions/Parameterized.sol/
COPY Hypertoken/Hypertoken.json artifacts/src.sol/testing/Hypertoken.sol/
COPY TimelockController/TimelockController.json artifacts/src.sol/testing/TimelockController.sol/
COPY HypernetGovernor/HypernetGovernor.json artifacts/src.sol/testing/HypernetGovernor.sol/
COPY RegistryFactory/RegistryFactory.json artifacts/src.sol/testing/RegistryFactory.sol/
COPY src.ts/ src.ts/
EXPOSE 8545