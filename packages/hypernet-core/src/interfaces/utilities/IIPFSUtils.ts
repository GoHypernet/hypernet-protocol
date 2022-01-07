import {
  BlockchainUnavailableError,
  InvalidParametersError,
  IPFSUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { IPFSHTTPClient } from "ipfs-http-client";

export interface ToFile {
  path?: string;
  content:
    | string
    | InstanceType<typeof String>
    | ArrayBufferView
    | ArrayBuffer
    | Blob
    | ReadableStream<Uint8Array>;
}

/**
 * The main purpose of this class is to provide an http client
 * to communicate with a remote IPFS node.
 */
export interface IIPFSUtils {
  initialize(): ResultAsync<void, IPFSUnavailableError>;
  getHttpClient(): ResultAsync<IPFSHTTPClient, IPFSUnavailableError>;
  getGatewayUrl(): ResultAsync<string, IPFSUnavailableError>;
  setGatewayUrl(gatewayUrl: string): void;
  saveFile(file: ToFile): ResultAsync<string, IPFSUnavailableError>;
  getFile(cid: string): ResultAsync<Response, IPFSUnavailableError>;
}

export const IIPFSUtilsType = Symbol.for("IIPFSUtils");
