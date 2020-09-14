import {ethers} from 'ethers';

import {
  Allocation,
  encodeAllocation,
  encodeGuarantee,
  Guarantee,
  hashOutcome,
  Outcome,
} from '../outcome';

export function createTransferAllTransaction(
  assetHolderContractInterface: ethers.utils.Interface,
  channelId: string,
  allocation: Allocation
): ethers.providers.TransactionRequest {
  const data = assetHolderContractInterface.encodeFunctionData('transferAll', [
    channelId,
    encodeAllocation(allocation),
  ]);
  return {data};
}

export function claimAllArgs(
  channelId: string,
  guarantee: Guarantee,
  allocation: Allocation
): any[] {
  return [channelId, encodeGuarantee(guarantee), encodeAllocation(allocation)];
}

export function createClaimAllTransaction(
  assetHolderContractInterface: ethers.utils.Interface,
  channelId: string,
  guarantee: Guarantee,
  allocation: Allocation
): ethers.providers.TransactionRequest {
  const data = assetHolderContractInterface.encodeFunctionData(
    'claimAll',
    claimAllArgs(channelId, guarantee, allocation)
  );
  return {data};
}

export function createSetOutcomeTransaction(
  assetHolderContractInterface: ethers.utils.Interface,
  channelId: string,
  outcome: Outcome
): ethers.providers.TransactionRequest {
  const data = assetHolderContractInterface.encodeFunctionData('setOutcome', [
    channelId,
    hashOutcome(outcome),
  ]);
  return {data};
}
