import {
  BlockchainUnavailableError,
  EthereumAddress,
  EVoteSupport,
  Proposal,
  ProposalVoteReceipt,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IGovernanceRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { BigNumber, ethers } from "ethers";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";
import { GovernanceAbis } from "@hypernetlabs/objects";

@injectable()
export class GovernanceRepository implements IGovernanceRepository {
  protected hypernetGovernorContract: ethers.Contract | null = null;
  protected hypertokenContract: ethers.Contract | null = null;
  protected registryFactoryContract: ethers.Contract | null = null;
  protected nonFungibleRegistryContract: ethers.Contract | null = null;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError> {
    return this.initializeContracts().andThen(() => {
      let proposalsNumberArrResult: ResultAsync<
        number[],
        BlockchainUnavailableError
      >;
      let proposalsArrResult: ResultAsync<
        Proposal,
        BlockchainUnavailableError
      >[] = [];

      if (_proposalsNumberArr == null) {
        proposalsNumberArrResult = this.getProposalsCount().map(
          (proposalCounts) => {
            if (proposalCounts == null || proposalCounts == 0) {
              return [];
            }
            let countsArr: number[] = [];
            for (let index = 1; index <= proposalCounts; index++) {
              countsArr.push(index);
            }
            return countsArr;
          },
        );
      } else {
        proposalsNumberArrResult = okAsync(_proposalsNumberArr);
      }

      return proposalsNumberArrResult.andThen((proposalNumberArr) => {
        proposalNumberArr.forEach((proposalNumber) => {
          proposalsArrResult.push(
            ResultAsync.fromPromise(
              this.hypernetGovernorContract?._proposalMap(
                proposalNumber,
              ) as Promise<string>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to retrieve proposals id",
                  e,
                );
              },
            )
              .andThen((proposalId) => {
                return this.getProposalDetails(proposalId);
              })
              .map((proposalObj) => {
                proposalObj.proposalNumber = proposalNumber;
                return proposalObj;
              }),
          );
        });

        return ResultUtils.combine(proposalsArrResult);
      });
    });
  }

  public getProposalsCount(): ResultAsync<number, BlockchainUnavailableError> {
    return this.initializeContracts().andThen(() => {
      return ResultAsync.fromPromise(
        this.hypernetGovernorContract?._proposalIdTracker() as Promise<BigNumber>,
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
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeContracts().andThen(() => {
      const descriptionHash = ethers.utils.id(name);

      const transferCalldata =
        this.registryFactoryContract?.interface.encodeFunctionData(
          "createRegistry",
          [name, symbol, owner],
        );

      return ResultAsync.fromPromise(
        this.hypernetGovernorContract?.hashProposal(
          [this.registryFactoryContract?.address],
          [0],
          [transferCalldata],
          descriptionHash,
        ) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError("Unable to hashProposal", e);
        },
      ).andThen((proposalID) => {
        if (this.hypernetGovernorContract == null) {
          throw new BlockchainUnavailableError(
            "hypernetGovernorContract is not available",
          );
        }

        return ResultAsync.fromPromise(
          this.hypernetGovernorContract[
            "propose(address[],uint256[],bytes[],string)"
          ](
            [this.registryFactoryContract?.address],
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
    return this.initializeContracts().andThen(() => {
      return ResultAsync.fromPromise(
        this.hypertokenContract?.delegate(delegateAddress) as Promise<any>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve proposals count",
            e,
          );
        },
      ).andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          console.log("tx e: ", e);
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
    return ResultUtils.combine([
      ResultAsync.fromPromise(
        this.hypernetGovernorContract?.proposals(proposalId) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve proposal",
            e,
          );
        },
      ),
      ResultAsync.fromPromise(
        this.hypernetGovernorContract?.state(proposalId) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve proposal state",
            e,
          );
        },
      ),
      ResultAsync.fromPromise(
        this.hypernetGovernorContract?.proposalDescriptions(
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
        BigNumber.from(proposalId),
        propsalState.toString() as any,
        proposal[1],
        proposal[5].toString(),
        proposal[6].toString(),
        proposal[2].toString(),
        proposalDescription,
        null,
      );
    });
  }

  public castVote(
    proposalId: string,
    support: EVoteSupport,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeContracts().andThen(() => {
      return ResultAsync.fromPromise(
        this.hypernetGovernorContract?.castVote(
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
          console.log("tx e: ", e);
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
    return this.initializeContracts().andThen(() => {
      return ResultAsync.fromPromise(
        this.hypernetGovernorContract?.getReceipt(
          proposalId,
          voterAddress,
        ) as Promise<{
          hasVoted: boolean;
          support: EVoteSupport;
          votes: number;
        }>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to castVote proposal",
            e,
          );
        },
      ).map((receipt) => {
        return new ProposalVoteReceipt(
          BigNumber.from(proposalId),
          voterAddress,
          receipt.hasVoted,
          receipt.support,
          receipt.votes,
        );
      });
    });
  }

  public proposeRegistryEntry(
    registryName: string,
    label: string,
    data: string,
    recipient: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.nameToAddress(
          registryName,
        ) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError("Unable to nameToAddress", e);
        },
      ).andThen((registryAddress) => {
        const registryAddressContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
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
          this.hypernetGovernorContract?.hashProposal(
            [registryAddress],
            [0],
            [transferCalldata],
            descriptionHash,
          ) as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError("Unable to hashProposal", e);
          },
        ).andThen((proposalID) => {
          console.log("proposalID: ", proposalID);
          if (this.hypernetGovernorContract == null) {
            throw new BlockchainUnavailableError(
              "hypernetGovernorContract is not available",
            );
          }

          return ResultAsync.fromPromise(
            this.hypernetGovernorContract[
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

  public getRegistries(
    _tokenIdsArr?: number[],
  ): ResultAsync<string[], BlockchainUnavailableError> {
    return this.initializeContracts().andThen(() => {
      let tokenIdsCountsArrResult: ResultAsync<
        number[],
        BlockchainUnavailableError
      >;
      let registriesArrResult: ResultAsync<
        string,
        BlockchainUnavailableError
      >[] = [];

      if (_tokenIdsArr == null) {
        tokenIdsCountsArrResult = this.getTokenIdsCount().map(
          (tokenIdsCounts) => {
            console.log("tokenIdsCounts: ", tokenIdsCounts);
            if (tokenIdsCounts == null || tokenIdsCounts == 0) {
              return [];
            }
            let countsArr: number[] = [];
            for (let index = 1; index <= tokenIdsCounts; index++) {
              countsArr.push(index);
            }
            return countsArr;
          },
        );
      } else {
        tokenIdsCountsArrResult = okAsync(_tokenIdsArr);
      }

      return tokenIdsCountsArrResult.andThen((tokenIdsArr) => {
        tokenIdsArr.forEach((tokenId) => {
          registriesArrResult.push(
            ResultAsync.fromPromise(
              this.nonFungibleRegistryContract?.reverseRegistryMap(
                tokenId,
              ) as Promise<string>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to retrieve reverseRegistryMap id",
                  e,
                );
              },
            ).map((registryLabel) => {
              console.log("registryLabel: ", registryLabel);
              return registryLabel;
            }),
          );
        });

        return ResultUtils.combine(registriesArrResult);
      });
    });
  }

  public getTokenIdsCount(): ResultAsync<number, BlockchainUnavailableError> {
    return this.initializeContracts().andThen(() => {
      return ResultAsync.fromPromise(
        this.nonFungibleRegistryContract?._tokenIdTracker() as Promise<BigNumber>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve _tokenIdTracker count",
            e,
          );
        },
      ).map((proposalCounts) => {
        return proposalCounts.toNumber();
      });
    });
  }

  protected initializeContracts(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainUnavailableError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getSigner(),
    ]).andThen((vals) => {
      const [config, signer] = vals;

      this.hypernetGovernorContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.hypernetGovernorAddress as string,
        GovernanceAbis.HypernetGovernor.abi,
        signer,
      );

      this.hypertokenContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.hypertokenAddress as string,
        GovernanceAbis.Hypertoken.abi,
        signer,
      );

      this.registryFactoryContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as string,
        GovernanceAbis.RegistryFactory.abi,
        signer,
      );
      console.log(
        "registryFactoryAddress",
        config.chainAddresses[config.governanceChainId]?.registryFactoryAddress,
      );

      this.nonFungibleRegistryContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.nonFungibleRegistryAddress as string,
        GovernanceAbis.NonFungibleRegistry.abi,
        signer,
      );

      console.log(
        "nonFungibleRegistryAddress",
        config.chainAddresses[config.governanceChainId]
          ?.nonFungibleRegistryAddress,
      );

      return okAsync(signer);
    });
  }
}
