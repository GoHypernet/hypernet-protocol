import {
  BigNumberString,
  BlockchainUnavailableError,
  EthereumAddress,
  EProposalVoteSupport,
  Proposal,
  ProposalVoteReceipt,
  stringToProposalState,
  HypernetGovernorContractError,
  HypertokenContractError,
  GovernanceSignerUnavailableError,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IGovernanceRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { ethers, utils } from "ethers";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import {
  IRegistryFactoryContract,
  IRegistryFactoryContractType,
  IHypertokenContract,
  IHypertokenContractType,
  IHypernetGovernorContract,
  IHypernetGovernorContractType,
} from "@hypernetlabs/contracts";

@injectable()
export class GovernanceRepository implements IGovernanceRepository {
  protected provider: ethers.providers.Provider | undefined;
  protected signer: ethers.providers.JsonRpcSigner | undefined;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IHypernetGovernorContractType)
    protected hypernetGovernorContract: IHypernetGovernorContract,
    @inject(IRegistryFactoryContractType)
    protected registryFactoryContract: IRegistryFactoryContract,
    @inject(IHypertokenContractType)
    protected hypertokenContract: IHypertokenContract,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError> {
    return this.hypernetGovernorContract
      ._proposalIdTracker()
      .andThen((totalCount) => {
        const proposalListResult: ResultAsync<
          Proposal,
          BlockchainUnavailableError
        >[] = [];
        for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
          const index = totalCount - (pageNumber - 1) * pageSize - i;

          if (index >= 0) {
            proposalListResult.push(
              this.hypernetGovernorContract
                ._proposalMap(index + 1)
                .andThen((proposalId) => {
                  return this.getProposalDetails(proposalId.toString());
                })
                .map((proposalObj) => {
                  proposalObj.proposalNumber = index;
                  return proposalObj;
                }),
            );
          }
        }
        return ResultUtils.combine(proposalListResult);
      });
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    const descriptionHash = ethers.utils.id(name);

    const transferCalldata = this.registryFactoryContract
      .getContract()
      ?.interface.encodeFunctionData("createRegistry", [
        name,
        symbol,
        owner,
        enumerable,
      ]);

    const registryFactoryAddress =
      this.registryFactoryContract.getContractAddress();

    return this.hypernetGovernorContract
      .hashProposal(
        registryFactoryAddress,
        transferCalldata as string,
        descriptionHash,
      )
      .andThen((proposalID) => {
        return this.hypernetGovernorContract
          .propose(registryFactoryAddress, transferCalldata as string, name)
          .andThen(() => {
            return this.getProposalDetails(proposalID);
          });
      });
  }

  public delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, HypertokenContractError> {
    return this.hypertokenContract.delegate(delegateAddress);
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return ResultUtils.combine([
      this.hypernetGovernorContract.proposals(proposalId),
      this.hypernetGovernorContract.state(proposalId),
      this.hypernetGovernorContract.proposalDescriptions(proposalId),
    ]).map((vals) => {
      const [proposal, propsalState, proposalDescription] = vals;
      return new Proposal(
        BigNumberString(proposalId), // proposalId
        stringToProposalState(propsalState.toString()), // propsalState
        proposal[1], // proposalOriginator
        Number(utils.formatEther(proposal[5])), // proposalVotesFor
        Number(utils.formatEther(proposal[6])), // proposalVotesAgainst
        Number(utils.formatEther(proposal[7])), // proposalAbstain
        proposalDescription, // proposalDescription
        null, // proposalNumber
      );
    });
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.hypernetGovernorContract
      .castVote(proposalId, support)
      .andThen(() => {
        return this.getProposalDetails(proposalId);
      });
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, HypernetGovernorContractError> {
    return this.hypernetGovernorContract
      .getReceipt(proposalId, voterAddress)
      .map((receipt) => {
        return new ProposalVoteReceipt(
          BigNumberString(proposalId),
          voterAddress,
          receipt.hasVoted,
          receipt.support,
          receipt.votes,
        );
      });
  }

  public getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return this.hypernetGovernorContract._proposalIdTracker();
  }

  public queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.hypernetGovernorContract.queue(proposalId).andThen(() => {
      return this.getProposalDetails(proposalId);
    });
  }

  public cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.hypernetGovernorContract.cancel(proposalId).andThen(() => {
      return this.getProposalDetails(proposalId);
    });
  }

  public executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.hypernetGovernorContract.execute(proposalId).andThen(() => {
      return this.getProposalDetails(proposalId);
    });
  }

  public getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return this.hypernetGovernorContract
      .proposalThreshold()
      .map((poposalThreshold) => {
        return Number(
          ethers.utils.formatUnits(poposalThreshold.toString(), "ether"),
        );
      });
  }

  public getVotingPower(
    account: EthereumAddress,
  ): ResultAsync<number, HypernetGovernorContractError> {
    return this.hypernetGovernorContract.getVotes(account).map((votes) => {
      return Number(ethers.utils.formatUnits(votes.toString(), "ether"));
    });
  }

  public getHyperTokenBalance(
    account: EthereumAddress,
  ): ResultAsync<number, HypertokenContractError> {
    return this.hypertokenContract.balanceOf(account).map((balance) => {
      return Number(ethers.utils.formatUnits(balance.toString(), "ether"));
    });
  }

  public initializeReadOnly(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).map((vals) => {
      const [config, provider] = vals;
      this.provider = provider;
      this.hypernetGovernorContract.initializeContract(
        provider,
        config.chainAddresses[config.governanceChainId]
          ?.hypernetGovernorAddress as EthereumAddress,
      );
      this.registryFactoryContract.initializeContract(
        provider,
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as EthereumAddress,
      );
      this.hypertokenContract.initializeContract(
        provider,
        config.chainAddresses[config.governanceChainId]
          ?.hypertokenAddress as EthereumAddress,
      );
    });
  }

  public initializeForWrite(): ResultAsync<
    void,
    GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceSigner(),
    ]).map((vals) => {
      const [config, signer] = vals;
      this.signer = signer;
      this.hypernetGovernorContract.initializeContract(
        signer,
        config.chainAddresses[config.governanceChainId]
          ?.hypernetGovernorAddress as EthereumAddress,
      );
      this.registryFactoryContract.initializeContract(
        signer,
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as EthereumAddress,
      );
      this.hypertokenContract.initializeContract(
        signer,
        config.chainAddresses[config.governanceChainId]
          ?.hypertokenAddress as EthereumAddress,
      );
    });
  }
}
