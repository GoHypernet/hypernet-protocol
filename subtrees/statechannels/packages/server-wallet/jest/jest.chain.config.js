const config = require('./jest.config');
config.testMatch = ['<rootDir>/src/**/__chain-test__/?(*.)test.ts?(x)'];
config.setupFilesAfterEnv = [];
config.globalSetup = '<rootDir>/jest/chain-setup.ts';
config.globalTeardown = '<rootDir>/jest/test-teardown.ts';
module.exports = config;
