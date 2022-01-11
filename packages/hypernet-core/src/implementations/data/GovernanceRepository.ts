import {
  IRegistryFactoryContract,
  IERC20Contract,
  IHypernetGovernorContract,
  HypernetGovernorContract,
  RegistryFactoryContract,
  ERC20Contract,
} from "@hypernetlabs/governance-sdk";
import {
  BigNumberString,
  BlockchainUnavailableError,
  EProposalVoteSupport,
  EthereumAccountAddress,
  Proposal,
  ProposalVoteReceipt,
  stringToProposalState,
  HypernetGovernorContractError,
  ERC20ContractError,
  GovernanceSignerUnavailableError,
  InvalidParametersError,
  IPFSUnavailableError,
  IpfsCID,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IGovernanceRepository } from "@interfaces/data";
import { ethers, utils } from "ethers";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IIPFSUtils,
  IIPFSUtilsType,
} from "@interfaces/utilities";

@injectable()
export class GovernanceRepository implements IGovernanceRepository {
  protected provider: ethers.providers.Provider | undefined;
  protected signer: ethers.providers.JsonRpcSigner | undefined;
  protected hypernetGovernorContract: IHypernetGovernorContract =
    {} as HypernetGovernorContract;
  protected registryFactoryContract: IRegistryFactoryContract =
    {} as RegistryFactoryContract;
  protected hypertokenContract: IERC20Contract = {} as ERC20Contract;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IIPFSUtilsType) protected ipfsUtils: IIPFSUtils,
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
          HypernetGovernorContractError
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
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    Proposal,
    IPFSUnavailableError | HypernetGovernorContractError
  > {
    const description = JSON.stringify({
      name,
      symbol,
      owner,
      enumerable,
    });
    return this.saveProposalDescriptionToIPFS(description).andThen((cid) => {
      const nameWithDescriptionCID = name + ":" + cid;
      const descriptionHash = ethers.utils.id(nameWithDescriptionCID);

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
            .propose(
              registryFactoryAddress,
              transferCalldata as string,
              nameWithDescriptionCID,
            )
            .andThen(() => {
              return this.getProposalDetails(proposalID);
            });
        });
    });
  }

  public delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError> {
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
        Number(proposal[3]), // proposalStartBlock
        Number(proposal[4]), // proposalEndBlock
      );
    });
  }

  public getProposalDescription(
    descriptionHash: IpfsCID,
  ): ResultAsync<string, IPFSUnavailableError | HypernetGovernorContractError> {
    return this.ipfsUtils.getFile(descriptionHash).andThen((res) => {
      return ResultAsync.fromPromise(res.text(), (e) => {
        this.logUtils.error(e);
        return new IPFSUnavailableError(
          "Failed to parse proposal description from IPFS",
          e,
        );
      });
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
    voterAddress: EthereumAccountAddress,
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
    account: EthereumAccountAddress,
  ): ResultAsync<number, HypernetGovernorContractError | ERC20ContractError> {
    return this.hypertokenContract.getVotes(account).map((votes) => {
      return Number(ethers.utils.formatUnits(votes.toString(), "ether"));
    });
  }

  public getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError> {
    return this.hypertokenContract.balanceOf(account).map((balance) => {
      return Number(ethers.utils.formatUnits(balance.toString(), "ether"));
    });
  }

  public initializeReadOnly(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).map(([config, provider]) => {
      this.provider = provider;

      this.hypernetGovernorContract = new HypernetGovernorContract(
        provider,
        config.governanceChainInformation.hypernetGovernorAddress,
      );
      this.registryFactoryContract = new RegistryFactoryContract(
        provider,
        config.governanceChainInformation.registryFactoryAddress,
      );
      this.hypertokenContract = new ERC20Contract(
        provider,
        config.governanceChainInformation.hypertokenAddress,
      );
    });
  }

  public initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceSigner(),
    ]).map(([config, signer]) => {
      this.signer = signer;

      this.hypernetGovernorContract = new HypernetGovernorContract(
        signer,
        config.governanceChainInformation.hypernetGovernorAddress,
      );
      this.registryFactoryContract = new RegistryFactoryContract(
        signer,
        config.governanceChainInformation.registryFactoryAddress,
      );
      this.hypertokenContract = new ERC20Contract(
        signer,
        config.governanceChainInformation.hypertokenAddress,
      );
    });
  }

  private saveProposalDescriptionToIPFS(
    description: string,
  ): ResultAsync<IpfsCID, IPFSUnavailableError> {
    return this.ipfsUtils.saveFile({ content: description });
  }
}
