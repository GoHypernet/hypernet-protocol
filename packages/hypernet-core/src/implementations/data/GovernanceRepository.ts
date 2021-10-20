import {
  BigNumberString,
  BlockchainUnavailableError,
  EthereumAddress,
  EProposalVoteSupport,
  Proposal,
  ProposalVoteReceipt,
  stringToProposalState,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IGovernanceRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { BigNumber, ethers, utils } from "ethers";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import { GovernanceAbis } from "@hypernetlabs/objects";

class GovernanceContracts {
  constructor(
    public hypernetGovernorContract: ethers.Contract,
    public hypertokenContract: ethers.Contract,
    public registryFactoryContract: ethers.Contract,
  ) {}
}

@injectable()
export class GovernanceRepository implements IGovernanceRepository {
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return this.getProposalsCount().andThen((totalCount) => {
        const proposalListResult: ResultAsync<
          Proposal,
          BlockchainUnavailableError
        >[] = [];
        for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
          const index = totalCount - (pageNumber - 1) * pageSize - i;

          if (index >= 0) {
            proposalListResult.push(
              ResultAsync.fromPromise(
                governanceContracts.hypernetGovernorContract._proposalMap(
                  index + 1,
                ) as Promise<BigNumber>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to retrieve proposals id",
                    e,
                  );
                },
              )
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
    });
  }

  public getProposalsCount(): ResultAsync<number, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract._proposalIdTracker() as Promise<BigNumber>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve proposals count",
            e,
          );
        },
      ).map((proposalCounts) => {
        return proposalCounts.toNumber();
      });
    });
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen((governanceContracts) => {
      const descriptionHash = ethers.utils.id(name);

      const transferCalldata =
        governanceContracts.registryFactoryContract.interface.encodeFunctionData(
          "createRegistry",
          [name, symbol, owner, enumerable],
        );

      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract.hashProposal(
          [governanceContracts.registryFactoryContract.address],
          [0],
          [transferCalldata],
          descriptionHash,
        ) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError("Unable to hashProposal", e);
        },
      ).andThen((proposalID) => {
        return ResultAsync.fromPromise(
          governanceContracts.hypernetGovernorContract[
            "propose(address[],uint256[],bytes[],string)"
          ](
            [governanceContracts.registryFactoryContract.address],
            [0],
            [transferCalldata],
            name,
          ) as Promise<any>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to propose proposal",
              e,
            );
          },
        ).andThen((tx) => {
          return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
            return new BlockchainUnavailableError("Unable to wait for tx", e);
          }).andThen(() => {
            return this.getProposalDetails(proposalID);
          });
        });
      });
    });
  }

  public delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypertokenContract.delegate(
          delegateAddress,
        ) as Promise<any>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve proposals count",
            e,
          );
        },
      ).andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new BlockchainUnavailableError("Unable to wait for tx", e);
        }).andThen(() => {
          return okAsync(undefined);
        });
      });
    });
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return ResultUtils.combine([
        ResultAsync.fromPromise(
          governanceContracts.hypernetGovernorContract.proposals(
            proposalId,
          ) as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to retrieve proposal",
              e,
            );
          },
        ),
        ResultAsync.fromPromise(
          governanceContracts.hypernetGovernorContract.state(
            proposalId,
          ) as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to retrieve proposal state",
              e,
            );
          },
        ),
        ResultAsync.fromPromise(
          governanceContracts.hypernetGovernorContract.proposalDescriptions(
            proposalId,
          ) as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to retrieve proposal description",
              e,
            );
          },
        ),
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
    });
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract.castVote(
          proposalId,
          support,
        ) as Promise<any>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to castVote proposal",
            e,
          );
        },
      ).andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new BlockchainUnavailableError("Unable to wait for tx", e);
        }).andThen(() => {
          return this.getProposalDetails(proposalId);
        });
      });
    });
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract.getReceipt(
          proposalId,
          voterAddress,
        ) as Promise<{
          hasVoted: boolean;
          support: EProposalVoteSupport;
          votes: number;
        }>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to getReceipt proposal",
            e,
          );
        },
      ).map((receipt) => {
        return new ProposalVoteReceipt(
          BigNumberString(proposalId),
          voterAddress,
          receipt.hasVoted,
          receipt.support,
          receipt.votes,
        );
      });
    });
  }

  public queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract["queue(uint256)"](
          proposalId,
        ) as Promise<any>,
        (e) => {
          return new BlockchainUnavailableError("Unable to queue proposal", e);
        },
      ).andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new BlockchainUnavailableError("Unable to wait for tx", e);
        }).andThen(() => {
          return this.getProposalDetails(proposalId);
        });
      });
    });
  }

  public executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract["execute(uint256)"](
          proposalId,
        ) as Promise<any>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to execute proposal",
            e,
          );
        },
      ).andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new BlockchainUnavailableError("Unable to wait for tx", e);
        }).andThen(() => {
          return this.getProposalDetails(proposalId);
        });
      });
    });
  }

  public proposeRegistryEntry(
    registryName: string,
    label: string,
    data: string,
    recipient: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.blockchainProvider.getGovernanceSigner(),
      this.initializeForWrite(),
    ]).andThen((vals) => {
      const [signer, governanceContracts] = vals;
      return ResultAsync.fromPromise(
        governanceContracts.registryFactoryContract.nameToAddress(
          registryName,
        ) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError("Unable to nameToAddress", e);
        },
      ).andThen((registryAddress) => {
        const registryAddressContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          signer,
        );

        const descriptionHash = ethers.utils.id(label);

        const transferCalldata =
          registryAddressContract?.interface.encodeFunctionData("register", [
            recipient,
            label,
            data,
          ]);

        return ResultAsync.fromPromise(
          governanceContracts.hypernetGovernorContract.hashProposal(
            [registryAddress],
            [0],
            [transferCalldata],
            descriptionHash,
          ) as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError("Unable to hashProposal", e);
          },
        ).andThen((proposalID) => {
          return ResultAsync.fromPromise(
            governanceContracts.hypernetGovernorContract[
              "propose(address[],uint256[],bytes[],string)"
            ](
              [registryAddress],
              [0],
              [transferCalldata],
              label,
            ) as Promise<any>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to propose proposal",
                e,
              );
            },
          ).andThen((tx) => {
            return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
              return new BlockchainUnavailableError("Unable to wait for tx", e);
            }).andThen(() => {
              return this.getProposalDetails(proposalID);
            });
          });
        });
      });
    });
  }

  public getProposalThreshold(): ResultAsync<
    number,
    BlockchainUnavailableError
  > {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypernetGovernorContract.proposalThreshold() as Promise<BigNumber>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call proposalThreshold",
            e,
          );
        },
      ).map((poposalThreshold) => {
        return Number(
          ethers.utils.formatUnits(poposalThreshold.toString(), "ether"),
        );
      });
    });
  }

  public getVotingPower(
    account: EthereumAddress,
  ): ResultAsync<number, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypertokenContract.getVotes(
          account,
        ) as Promise<BigNumber>,
        (e) => {
          return new BlockchainUnavailableError("Unable to call getVotes", e);
        },
      ).map((votes) => {
        return Number(ethers.utils.formatUnits(votes.toString(), "ether"));
      });
    });
  }

  public getHyperTokenBalance(
    account: EthereumAddress,
  ): ResultAsync<number, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen((governanceContracts) => {
      return ResultAsync.fromPromise(
        governanceContracts.hypertokenContract.balanceOf(
          account,
        ) as Promise<BigNumber>,
        (e) => {
          return new BlockchainUnavailableError("Unable to call getVotes", e);
        },
      ).map((balance) => {
        return Number(ethers.utils.formatUnits(balance.toString(), "ether"));
      });
    });
  }

  private initializeForWrite(): ResultAsync<
    GovernanceContracts,
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getGovernanceSigner().andThen((signer) => {
      return this.initializeContracts(signer);
    });
  }

  private initializeReadOnly(): ResultAsync<
    GovernanceContracts,
    BlockchainUnavailableError
  > {
    return this.blockchainProvider
      .getGovernanceProvider()
      .andThen((provider) => {
        return this.initializeContracts(provider);
      });
  }

  private initializeContracts(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
  ): ResultAsync<GovernanceContracts, never> {
    return this.configProvider.getConfig().map((config) => {
      const hypernetGovernorContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.hypernetGovernorAddress as string,
        GovernanceAbis.HypernetGovernor.abi,
        providerOrSigner,
      );

      const hypertokenContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.hypertokenAddress as string,
        GovernanceAbis.Hypertoken.abi,
        providerOrSigner,
      );

      const registryFactoryContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as string,
        GovernanceAbis.UpgradeableRegistryFactory.abi,
        providerOrSigner,
      );

      return new GovernanceContracts(
        hypernetGovernorContract,
        hypertokenContract,
        registryFactoryContract,
      );
    });
  }
}
