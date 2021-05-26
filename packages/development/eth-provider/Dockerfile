FROM connextproject/vector_ethprovider:0.2.5-beta.6
ENV MNEMONIC="candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
ENV CHAIN_ID="1337"
COPY deploy.ts /app/deploy
COPY transferDefinitions/Message.json artifacts/src.sol/transferDefinitions/Message.sol/
COPY transferDefinitions/Insurance.json artifacts/src.sol/transferDefinitions/Insurance.sol/
COPY transferDefinitions/Parameterized.json artifacts/src.sol/transferDefinitions/Parameterized.sol/
COPY src.ts/artifacts.ts src.ts/
EXPOSE 8545