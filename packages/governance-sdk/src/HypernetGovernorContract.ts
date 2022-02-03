import {
  EProposalVoteSupport,
  EthereumAccountAddress,
  EthereumContractAddress,
  GovernanceAbis,
  HypernetGovernorContractError,
} from "@hypernetlabs/objects";
import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { GasUtils } from "@governance-sdk/GasUtils";
import { IHypernetGovernorContract } from "@governance-sdk/IHypernetGovernorContract";

export class HypernetGovernorContract implements IHypernetGovernorContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.HypernetGovernor.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EthereumContractAddress {
    return EthereumContractAddress(this.contract.address || "");
  }

  public _proposalIdTracker(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return ResultAsync.fromPromise(
      this.contract._proposalIdTracker() as Promise<BigNumber>,
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
      this.contract._proposalMap(index) as Promise<BigNumber>,
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
      this.contract.proposals(proposalId) as Promise<string>,
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
      this.contract.state(proposalId) as Promise<string>,
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
      this.contract.proposalDescriptions(proposalId) as Promise<string>,
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
      this.contract.hashProposal(
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
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, HypernetGovernorContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new HypernetGovernorContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract["propose(address[],uint256[],bytes[],string)"](
            [registryFactoryAddress],
            [0],
            [transferCalldata],
            name,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new HypernetGovernorContractError(
              "Unable to call HypernetGovernorContract propose()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, HypernetGovernorContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new HypernetGovernorContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract.castVote(proposalId, support, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new HypernetGovernorContractError(
              "Unable to call HypernetGovernorContract castVote()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public getReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<
    {
      hasVoted: boolean;
      support: EProposalVoteSupport;
      votes: number;
    },
    HypernetGovernorContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getReceipt(proposalId, voterAddress) as Promise<{
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
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, HypernetGovernorContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new HypernetGovernorContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract["queue(uint256)"](proposalId, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new HypernetGovernorContractError(
              "Unable to call HypernetGovernorContract queue()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public cancel(
    proposalId: string,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, HypernetGovernorContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new HypernetGovernorContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract["cancel(uint256)"](proposalId, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new HypernetGovernorContractError(
              "Unable to call HypernetGovernorContract cancel()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new HypernetGovernorContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public execute(
    proposalId: string,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, HypernetGovernorContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new HypernetGovernorContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract["execute(uint256)"](proposalId, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new HypernetGovernorContractError(
              "Unable to call HypernetGovernorContract execute()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
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
