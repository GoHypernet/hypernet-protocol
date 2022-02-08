import {
  HypernetGovernorContractError,
  EthereumAccountAddress,
  EthereumContractAddress,
  EProposalVoteSupport,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export interface IHypernetGovernorContract {
  getContractAddress(): EthereumContractAddress;
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
    overrides?: ContractOverrides,
  ): ResultAsync<void, HypernetGovernorContractError>;
  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
    overrides?: ContractOverrides,
  ): ResultAsync<void, HypernetGovernorContractError>;
  getReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<
    {
      hasVoted: boolean;
      support: EProposalVoteSupport;
      votes: number;
    },
    HypernetGovernorContractError
  >;
  queue(
    proposalId: string,
    overrides?: ContractOverrides,
  ): ResultAsync<void, HypernetGovernorContractError>;
  cancel(
    proposalId: string,
    overrides?: ContractOverrides,
  ): ResultAsync<void, HypernetGovernorContractError>;
  execute(
    proposalId: string,
    overrides?: ContractOverrides,
  ): ResultAsync<void, HypernetGovernorContractError>;
  proposalThreshold(): ResultAsync<BigNumber, HypernetGovernorContractError>;
}

export const IHypernetGovernorContractType = Symbol.for(
  "IHypernetGovernorContract",
);
