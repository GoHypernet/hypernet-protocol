const { pathsToModuleNameMapper } = require('ts-jest/utils');

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');


module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Ignore lib folder, use this or root property include paths but not both https://medium.com/swlh/jest-with-typescript-446ea996cc68
  modulePathIgnorePatterns: [
    "<rootDir>/lib/"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' } )
};
