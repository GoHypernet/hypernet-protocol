import {
  ChainId,
  EthereumContractAddress,
  TokenInformation,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITokenInformationService {
  getTokenInformation(): ResultAsync<TokenInformation[], never>;
  getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], never>;
  getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, never>;
}
