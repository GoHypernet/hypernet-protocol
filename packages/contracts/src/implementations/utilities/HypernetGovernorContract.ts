import { BigNumber, ethers } from "ethers";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import {
  EProposalVoteSupport,
  EthereumAddress,
  GovernanceAbis,
  HypernetGovernorContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { IHypernetGovernorContract } from "@contracts/interfaces/utilities";

@injectable()
export class HypernetGovernorContract implements IHypernetGovernorContract {
  protected contract: ethers.Contract | null = null;
  constructor(@inject(ILogUtilsType) protected logUtils: ILogUtils) {}

  public initializeContract(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ): void {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.HypernetGovernor.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EthereumAddress {
    return EthereumAddress(this.contract?.address || "");
  }

  public _proposalIdTracker(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return ResultAsync.fromPromise(
      this.contract?._proposalIdTracker() as Promise<BigNumber>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract _proposalIdTracker()",
          e,
        );
      },
    ).map((proposalCounts) => {
      return proposalCounts.toNumber();
    });
  }

  public _proposalMap(
    index: number,
  ): ResultAsync<BigNumber, HypernetGovernorContractError> {
    return ResultAsync.fromPromise(
      this.contract?._proposalMap(index) as Promise<BigNumber>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract _proposalMap()",
          e,
        );
      },
    );
  }

  public proposals(
    proposalId: string,
  ): ResultAsync<string, HypernetGovernorContractError> {
    return ResultAsync.fromPromise(
      this.contract?.proposals(proposalId) as Promise<string>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract proposals()",
          e,
        );
      },
    );
  }

  public state(
    proposalId: string,
  ): ResultAsync<string, HypernetGovernorContractError> {
    return ResultAsync.fromPromise(
      this.contract?.state(proposalId) as Promise<string>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract state()",
          e,
        );
      },
    );
  }

  public proposalDescriptions(
    proposalId: string,
  ): ResultAsync<string, HypernetGovernorContractError> {
    return ResultAsync.fromPromise(
      this.contract?.proposalDescriptions(proposalId) as Promise<string>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract proposalDescriptions()",
          e,
        );
      },
    );
  }

  public hashProposal(
    registryFactoryAddress: string,
    transferCalldata: string,
    descriptionHash: string,
  ): ResultAsync<string, HypernetGovernorContractError> {
    return ResultAsync.fromPromise(
      this.contract?.hashProposal(
        [registryFactoryAddress],
        [0],
        [transferCalldata],
        descriptionHash,
      ) as Promise<string>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract hashProposal()",
          e,
        );
      },
    );
  }

  public propose(
    registryFactoryAddress: string,
    transferCalldata: string,
    name: string,
  ): ResultAsync<void, HypernetGovernorContractError> {
    if (this.contract == null) {
      throw new Error("HypernetGovernorContract is not available");
    }

    return ResultAsync.fromPromise(
      this.contract["propose(address[],uint256[],bytes[],string)"](
        [registryFactoryAddress],
        [0],
        [transferCalldata],
        name,
      ) as Promise<any>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract propose()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<void, HypernetGovernorContractError> {
    if (this.contract == null) {
      throw new Error("HypernetGovernorContract is not available");
    }

    return ResultAsync.fromPromise(
      this.contract?.castVote(proposalId, support) as Promise<any>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract castVote()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public getReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<
    {
      hasVoted: boolean;
      support: EProposalVoteSupport;
      votes: number;
    },
    HypernetGovernorContractError
  > {
    return ResultAsync.fromPromise(
      this.contract?.getReceipt(proposalId, voterAddress) as Promise<{
        hasVoted: boolean;
        support: EProposalVoteSupport;
        votes: number;
      }>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract getReceipt()",
          e,
        );
      },
    );
  }

  public queue(
    proposalId: string,
  ): ResultAsync<void, HypernetGovernorContractError> {
    if (this.contract == null) {
      throw new Error("HypernetGovernorContract is not available");
    }

    return ResultAsync.fromPromise(
      this.contract["queue(uint256)"](proposalId) as Promise<any>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract queue()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public cancel(
    proposalId: string,
  ): ResultAsync<void, HypernetGovernorContractError> {
    if (this.contract == null) {
      throw new Error("HypernetGovernorContract is not available");
    }

    return ResultAsync.fromPromise(
      this.contract["cancel(uint256)"](proposalId) as Promise<any>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract cancel()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public execute(
    proposalId: string,
  ): ResultAsync<void, HypernetGovernorContractError> {
    if (this.contract == null) {
      throw new Error("HypernetGovernorContract is not available");
    }

    return ResultAsync.fromPromise(
      this.contract["execute(uint256)"](proposalId) as Promise<any>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract execute()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public proposalThreshold(): ResultAsync<
    BigNumber,
    HypernetGovernorContractError
  > {
    return ResultAsync.fromPromise(
      this.contract?.proposalThreshold() as Promise<BigNumber>,
      (e) => {
        return new HypernetGovernorContractError(
          "Unable to call HypernetGovernorContract proposalThreshold()",
          e,
        );
      },
    );
  }
}
