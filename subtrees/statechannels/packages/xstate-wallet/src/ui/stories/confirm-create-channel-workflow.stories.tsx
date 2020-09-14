export default {title: 'X-state wallet'};
import {storiesOf} from '@storybook/react';
import {interpret} from 'xstate';
import {Participant} from '@statechannels/client-api-schema';
import {simpleEthAllocation, BN} from '@statechannels/wallet-core';
import React from 'react';

import {workflow, config, WorkflowContext} from '../../workflows/confirm';
import {logger} from '../../logger';
import {Store} from '../../store';
import {ConfirmCreateChannel} from '../confirm-create-channel-workflow';
import {renderComponentInFrontOfApp} from './helpers';

const store = new Store();
store.initialize(['0x8624ebe7364bb776f891ca339f0aaa820cc64cc9fca6a28eec71e6d8fc950f29']);

const alice: Participant = {
  participantId: 'a',
  signingAddress: '0xa',
  destination: '0xad'
};

const bob: Participant = {
  participantId: 'b',
  signingAddress: '0xb',
  destination: '0xbd'
};

const testContext: WorkflowContext = {
  participants: [alice, bob],
  outcome: simpleEthAllocation([]),
  appDefinition: '0x00',
  appData: '0x00',
  chainId: '0',
  challengeDuration: BN.from(1)
};

if (config.states) {
  Object.keys(config.states).forEach(state => {
    const machine = interpret<any, any, any>(workflow(testContext).withContext(testContext), {
      devTools: true
    }); // start a new interpreted machine for each story
    machine.onEvent(event => logger.info(event.type)).start(state);
    storiesOf('Workflows / Confirm Create Channel', module).add(
      state.toString(),
      renderComponentInFrontOfApp(<ConfirmCreateChannel service={machine} />)
    );
    machine.stop(); // the machine will be stopped before it can be transitioned. This means the logger throws a warning that we sent an event to a stopped machine.
  });
}
