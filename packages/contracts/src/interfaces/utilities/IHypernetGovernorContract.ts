import { BigNumber, ethers } from "ethers";

import {
  HypernetGovernorContractError,
  EthereumAddress,
  EProposalVoteSupport,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHypernetGovernorContract {
  initializeContract(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ): void;
  getContractAddress(): EthereumAddress;
  _proposalIdTracker(): ResultAsync<number, HypernetGovernorContractError>;
  _proposalMap(
    index: number,
  ): ResultAsync<BigNumber, HypernetGovernorContractError>;
  proposals(
    proposalId: string,
  ): ResultAsync<string, HypernetGovernorContractError>;
  state(proposalId: string): ResultAsync<string, HypernetGovernorContractError>;
  proposalDescriptions(
    proposalId: string,
  ): ResultAsync<string, HypernetGovernorContractError>;
  hashProposal(
    registryFactoryAddress: string,
    transferCalldata: string,
    descriptionHash: string,
  ): ResultAsync<string, HypernetGovernorContractError>;
  propose(
    registryFactoryAddress: string,
    transferCalldata: string,
    name: string,
  ): ResultAsync<void, HypernetGovernorContractError>;
  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<void, HypernetGovernorContractError>;
  getReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<
    {
      hasVoted: boolean;
      support: EProposalVoteSupport;
      votes: number;
    },
    HypernetGovernorContractError
  >;
  queue(proposalId: string): ResultAsync<void, HypernetGovernorContractError>;
  cancel(proposalId: string): ResultAsync<void, HypernetGovernorContractError>;
  execute(proposalId: string): ResultAsync<void, HypernetGovernorContractError>;
  proposalThreshold(): ResultAsync<BigNumber, HypernetGovernorContractError>;
  getVotes(
    account: EthereumAddress,
  ): ResultAsync<BigNumber, HypernetGovernorContractError>;
}

export const IHypernetGovernorContractType = Symbol.for(
  "IHypernetGovernorContract",
);
