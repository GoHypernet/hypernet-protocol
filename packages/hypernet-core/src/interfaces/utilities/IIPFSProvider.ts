import {
  BlockchainUnavailableError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * The main purpose of this class is to provide an http client
 * to communicate with a remote IPFS node.
 */
export interface IIPFSProvider {
  /**
   * This initializes the IPFS provider, and makes sure
   */
  initialize(): ResultAsync<void, unknown>;

  // getIPFSHttpClient():

  setGatewayUrl(gatewayUrl: string): void;
}

export const IIPFSProviderType = Symbol.for("IIPFSProvider");
