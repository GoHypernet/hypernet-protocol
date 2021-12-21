import {
  TokenInformation,
  EthereumContractAddress,
  ChainId,
} from "@hypernetlabs/objects";
import {
  ITokenInformationRepositoryType,
  ITokenInformationRepository,
} from "@hypernetlabs/common-repositories";
import { ITokenInformationService } from "@interfaces/business";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

injectable();
export class TokenInformationService implements ITokenInformationService {
  constructor(
    @inject(ITokenInformationRepositoryType)
    protected tokenInformationRepository: ITokenInformationRepository,
  ) {}

  public getTokenInformation(): ResultAsync<TokenInformation[], never> {
    return this.tokenInformationRepository.getTokenInformation();
  }

  public getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], never> {
    return this.tokenInformationRepository.getTokenInformationForChain(chainId);
  }

  public getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, never> {
    return this.tokenInformationRepository.getTokenInformationByAddress(
      tokenAddress,
    );
  }
}
