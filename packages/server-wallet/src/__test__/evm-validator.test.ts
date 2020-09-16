import {utils} from 'ethers';

import {appBytecode} from '../models/__test__/fixtures/app-bytecode';
import {AppBytecode} from '../models/app-bytecode';
import {createState} from '../wallet/__test__/fixtures/states';
import {validateTransitionWithEVM} from '../evm-validator';
import {defaultConfig} from '../config';
import {testKnex as knex} from '../../jest/knex-setup-teardown';

const COUNTING_APP_DEFINITION = '0xfffffffffffffffffffffffffffffffffffffffff';
const UNDEFINED_APP_DEFINITION = '0x88c26ec40DC653973C599A1a0762678e795F879F';

beforeEach(async () => {
  await knex('app_bytecode').truncate();
  await AppBytecode.query(knex).insert([appBytecode()]);
});

it('returns true for a valid transition', async () => {
  // Sanity check that we're validating with byte code
  expect(
    await AppBytecode.getBytecode(defaultConfig.chainNetworkID, COUNTING_APP_DEFINITION, knex)
  ).toBeDefined();
  const fromState = createState({
    appDefinition: COUNTING_APP_DEFINITION,
    appData: utils.defaultAbiCoder.encode(['uint256'], [1]),
  });
  const toState = createState({
    appDefinition: COUNTING_APP_DEFINITION,
    appData: utils.defaultAbiCoder.encode(['uint256'], [2]),
  });
  expect(await validateTransitionWithEVM(fromState, toState, knex as any)).toBe(true);
});

it('returns false for an invalid transition', async () => {
  // Sanity check that we're validating with byte code
  expect(
    await AppBytecode.getBytecode(defaultConfig.chainNetworkID, COUNTING_APP_DEFINITION, knex)
  ).toBeDefined();
  const fromState = createState({
    appDefinition: COUNTING_APP_DEFINITION,
    appData: utils.defaultAbiCoder.encode(['uint256'], [2]),
  });
  const toState = createState({
    appDefinition: COUNTING_APP_DEFINITION,
    appData: utils.defaultAbiCoder.encode(['uint256'], [1]),
  });
  expect(await validateTransitionWithEVM(fromState, toState, knex as any)).toBe(false);
});

it('skips validating when no byte code exists for the app definition', async () => {
  // Sanity check that the bytecode doesn't exist
  expect(
    await AppBytecode.getBytecode(defaultConfig.chainNetworkID, UNDEFINED_APP_DEFINITION, knex)
  ).toBeUndefined();
  const state = createState({
    appDefinition: UNDEFINED_APP_DEFINITION,
  });
  expect(await validateTransitionWithEVM(state, state, knex as any)).toBe(true);
});
