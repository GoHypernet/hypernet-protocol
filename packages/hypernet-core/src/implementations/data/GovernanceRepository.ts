import { BlockchainUnavailableError, Proposal } from "@hypernetlabs/objects";
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
      >[];

      if (_proposalsNumberArr == null) {
        proposalsNumberArrResult = this.getProposalsCount().map(
          (proposalCounts) => {
            let countsArr: number[] = [];
            for (let index = 0; index < proposalCounts.toNumber(); index++) {
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
            ).andThen((propsalId) => {
              return ResultUtils.combine([
                ResultAsync.fromPromise(
                  this.hypernetGovernorContract?.proposals(
                    propsalId,
                  ) as Promise<string>,
                  (e) => {
                    return new BlockchainUnavailableError(
                      "Unable to retrieve proposal",
                      e,
                    );
                  },
                ),
                ResultAsync.fromPromise(
                  this.hypernetGovernorContract?.state(
                    propsalId,
                  ) as Promise<string>,
                  (e) => {
                    return new BlockchainUnavailableError(
                      "Unable to retrieve proposal state",
                      e,
                    );
                  },
                ),
                ResultAsync.fromPromise(
                  this.hypernetGovernorContract?.proposalDescriptions(
                    propsalId,
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
                  propsalId,
                  propsalState.toString() as any,
                  proposal[1],
                  proposal[5].toString(),
                  proposal[6].toString(),
                  proposal[2].toString(),
                  proposalDescription,
                  proposalNumber,
                );
              });
            }),
          );
        });

        return ResultUtils.combine(proposalsArrResult);
      });
    });
  }

  public getProposalsCount(): ResultAsync<
    BigNumber,
    BlockchainUnavailableError
  > {
    return this.initializeContracts().andThen(() => {
      return ResultAsync.fromPromise(
        this.hypernetGovernorContract?._proposalIdTracker() as Promise<BigNumber>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to retrieve proposals count",
            e,
          );
        },
      );
    });
  }

  protected initializeContracts(): ResultAsync<
    void,
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

      return okAsync(undefined);
    });
  }
}
