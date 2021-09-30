const { pathsToModuleNameMapper } = require("ts-jest/utils");

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require("../../tsconfig.build");

const moduleNames = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/src",
});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Ignore lib folder, use this or root property include paths but not both https://medium.com/swlh/jest-with-typescript-446ea996cc68
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  // This does not seem to support blacklisting any folder which means we can't enable parent directory and disable child
  // We should be using peer directories for coverage and non-coverage tests.
  collectCoverageFrom: [
    // Enabling following means we can't disable src/tests from coverage report
    // "<rootDir>/src/**/*.ts",

    // Add other allowed folders to the list below.
    "<rootDir>/src/implementations/**/*.ts",
    "!<rootDir>/src/implementations/**/index.ts",

    // Disabled because we don't want it to end up in coverage report,
    // "<rootDir>/src/tests/**/*.ts",
  ],
  moduleNameMapper: moduleNames,
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json",
    },
    window: {},
    __CHAIN_PROVIDERS__: '{ "1337": "http://localhost:8545" }',
    __CHAIN_ADDRESSES__:
      '{ \
      "1337": { \
        "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da", \
        "transferRegistryAddress": "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F", \
        "hypertokenAddress": "0x9FBDa871d559710256a2502A2517b794B482Db40", \
        "messageTransferAddress": "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6", \
        "insuranceTransferAddress": "0x30753E4A8aad7F8597332E813735Def5dD395028", \
        "parameterizedTransferAddress": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4", \
        "gatewayRegistryAddress": "0x633BaEfc98220497Eb7eE323480C87ce51a44955" \
      }, \
      "1369": { \
        "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da", \
        "transferRegistryAddress": "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F", \
        "hypertokenAddress": "0x9FBDa871d559710256a2502A2517b794B482Db40", \
        "messageTransferAddress": "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6", \
        "insuranceTransferAddress": "0x30753E4A8aad7F8597332E813735Def5dD395028", \
        "parameterizedTransferAddress": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4", \
        "gatewayRegistryAddress": "0x633BaEfc98220497Eb7eE323480C87ce51a44955" \
      } \
    }',
    __IFRAME_SOURCE__: "http://localhost:5000",
    __INFURA_ID__: "72827ccd538446f2a20e35a632664c52",
    __DEFAULT_CHAIN_ID__: "1337",
    __NATS_URL__: "ws://localhost:4221",
    __AUTH_URL__: "http://localhost:5040",
    __VALIDATOR_IFRAME_URL__: "http://localhost:5005",
    __CERAMIC_NODE_URL__: "https://ceramic-clay.3boxlabs.com",
    __GOVERNANCE_CHAIN_ID__: "1337",
    __GOVERNANCE_PROVIDER_URLS__: '["http://localhost:8545"]',
    __DEBUG__: true,
  },
};
