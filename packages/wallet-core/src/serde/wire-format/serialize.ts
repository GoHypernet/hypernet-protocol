import {
  SignedState as SignedStateWire,
  Outcome as OutcomeWire,
  AllocationItem as AllocationItemWire,
  Allocation as AllocationWire,
  Guarantee as GuaranteeWire,
  Message as WireMessage
} from '@statechannels/wire-format';

import {
  SignedState,
  Outcome,
  AllocationItem,
  SimpleAllocation,
  Message,
  SimpleGuarantee
} from '../../types';
import {calculateChannelId} from '../../state-utils';
import {formatAmount} from '../../utils';

export function serializeMessage(message: Message, recipient: string, sender: string): WireMessage {
  const signedStates = (message.signedStates || []).map(ss => serializeState(ss));
  const {objectives} = message;
  return {
    recipient,
    sender,
    data: {signedStates, objectives}
  };
}

export function serializeState(state: SignedState): SignedStateWire {
  const {
    chainId,
    participants,
    channelNonce,
    appDefinition,
    challengeDuration,
    turnNum,
    appData,
    isFinal
  } = state;

  return {
    chainId,
    participants,
    channelNonce,
    appDefinition,
    challengeDuration,
    turnNum,
    appData,
    isFinal,
    outcome: serializeOutcome(state.outcome),
    channelId: calculateChannelId(state),
    signatures: state.signatures.map(s => s.signature)
  };
}

function serializeOutcome(outcome: Outcome): OutcomeWire {
  switch (outcome.type) {
    case 'SimpleAllocation':
      return [serializeSimpleAllocation(outcome)];
    case 'MixedAllocation':
      return outcome.simpleAllocations.map(serializeSimpleAllocation);
    case 'SimpleGuarantee':
      return [serializeSimpleGuarantee(outcome)];
  }
}

function serializeSimpleAllocation(allocation: SimpleAllocation): AllocationWire {
  return {
    assetHolderAddress: allocation.assetHolderAddress,
    allocationItems: allocation.allocationItems.map(serializeAllocationItem)
  };
}

function serializeSimpleGuarantee(guarantee: SimpleGuarantee): GuaranteeWire {
  return {
    assetHolderAddress: guarantee.assetHolderAddress,
    targetChannelId: guarantee.targetChannelId,
    destinations: guarantee.destinations
  };
}

function serializeAllocationItem(allocationItem: AllocationItem): AllocationItemWire {
  const {destination, amount} = allocationItem;
  return {destination, amount: formatAmount(amount)};
}
