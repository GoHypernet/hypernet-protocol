"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const app_bytecode_1 = require("../models/__test__/fixtures/app-bytecode");
const app_bytecode_2 = require("../models/app-bytecode");
const states_1 = require("../wallet/__test__/fixtures/states");
const evm_validator_1 = require("../evm-validator");
const config_1 = require("../config");
const knex_setup_teardown_1 = require("../../jest/knex-setup-teardown");
const COUNTING_APP_DEFINITION = '0xfffffffffffffffffffffffffffffffffffffffff';
const UNDEFINED_APP_DEFINITION = '0x88c26ec40DC653973C599A1a0762678e795F879F';
beforeEach(async () => {
    await knex_setup_teardown_1.testKnex('app_bytecode').truncate();
    await app_bytecode_2.AppBytecode.query(knex_setup_teardown_1.testKnex).insert([app_bytecode_1.appBytecode()]);
});
it('returns true for a valid transition', async () => {
    expect(await app_bytecode_2.AppBytecode.getBytecode(config_1.defaultConfig.chainNetworkID, COUNTING_APP_DEFINITION, knex_setup_teardown_1.testKnex)).toBeDefined();
    const fromState = states_1.createState({
        appDefinition: COUNTING_APP_DEFINITION,
        appData: ethers_1.utils.defaultAbiCoder.encode(['uint256'], [1]),
    });
    const toState = states_1.createState({
        appDefinition: COUNTING_APP_DEFINITION,
        appData: ethers_1.utils.defaultAbiCoder.encode(['uint256'], [2]),
    });
    expect(await evm_validator_1.validateTransitionWithEVM(fromState, toState, knex_setup_teardown_1.testKnex)).toBe(true);
});
it('returns false for an invalid transition', async () => {
    expect(await app_bytecode_2.AppBytecode.getBytecode(config_1.defaultConfig.chainNetworkID, COUNTING_APP_DEFINITION, knex_setup_teardown_1.testKnex)).toBeDefined();
    const fromState = states_1.createState({
        appDefinition: COUNTING_APP_DEFINITION,
        appData: ethers_1.utils.defaultAbiCoder.encode(['uint256'], [2]),
    });
    const toState = states_1.createState({
        appDefinition: COUNTING_APP_DEFINITION,
        appData: ethers_1.utils.defaultAbiCoder.encode(['uint256'], [1]),
    });
    expect(await evm_validator_1.validateTransitionWithEVM(fromState, toState, knex_setup_teardown_1.testKnex)).toBe(false);
});
it('skips validating when no byte code exists for the app definition', async () => {
    expect(await app_bytecode_2.AppBytecode.getBytecode(config_1.defaultConfig.chainNetworkID, UNDEFINED_APP_DEFINITION, knex_setup_teardown_1.testKnex)).toBeUndefined();
    const state = states_1.createState({
        appDefinition: UNDEFINED_APP_DEFINITION,
    });
    expect(await evm_validator_1.validateTransitionWithEVM(state, state, knex_setup_teardown_1.testKnex)).toBe(true);
});
//# sourceMappingURL=evm-validator.test.js.map