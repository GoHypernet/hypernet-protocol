import EventEmitter from "events";

import { BlockTag, TransactionRequest } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { injectable } from "inversify";

interface ICeramicSendData {
  jsonrpc: string;
  id: number;
  method: string;
  params: unknown[];
}

injectable();
export class CeramicEIP1193Bridge extends EventEmitter {
  constructor(
    protected readonly signer: ethers.Signer,
    protected readonly provider: ethers.providers.Provider,
  ) {
    super();
  }

  async sendAsync(
    data: ICeramicSendData,
    callback: (err: unknown | null, result: unknown | null) => void,
  ): Promise<unknown> {
    function throwUnsupported(message: string): never {
      throw new Error(message);
    }

    function callbackSuccess(result: unknown): void {
      callback(null, { id: data.id, jsonrpc: "2.0", result: result });
    }

    switch (data.method) {
      case "eth_gasPrice": {
        const result = await this.provider.getGasPrice();
        callbackSuccess(result.toHexString());
        return;
      }
      case "eth_accounts": {
        const result = new Array<string>();
        if (this.signer) {
          const address = await this.signer.getAddress();
          result.push(address);
        }
        callbackSuccess(result);
        return;
      }
      case "eth_blockNumber": {
        const blockNumber = await this.provider.getBlockNumber();
        callbackSuccess(blockNumber);
        return;
      }
      case "eth_chainId": {
        const result = await this.provider.getNetwork();
        callbackSuccess(result.chainId);
        return;
      }
      case "eth_getBalance": {
        const result = await this.provider.getBalance(
          data.params[0] as string,
          data.params[1] as BlockTag,
        );
        callbackSuccess(result.toHexString());
        return;
      }
      case "eth_getStorageAt": {
        const result = this.provider.getStorageAt(
          data.params[0] as string,
          data.params[1] as ethers.BigNumberish,
          data.params[2] as BlockTag,
        );
        callbackSuccess(result);
        return;
      }
      case "eth_getTransactionCount": {
        const result = await this.provider.getTransactionCount(
          data.params[0] as string,
          data.params[1] as BlockTag,
        );
        callbackSuccess(ethers.utils.hexValue(result));
        return;
      }
      case "eth_getBlockTransactionCountByHash":
      case "eth_getBlockTransactionCountByNumber": {
        const result = await this.provider.getBlock(data.params[0] as BlockTag);
        callbackSuccess(ethers.utils.hexValue(result.transactions.length));
        return;
      }
      case "eth_getCode": {
        const result = await this.provider.getBlock(data.params[0] as BlockTag);
        callbackSuccess(result);
        return;
      }
      case "eth_sendRawTransaction": {
        const result = await this.provider.sendTransaction(
          data.params[0] as string,
        );
        callbackSuccess(result);
        return;
      }
      case "eth_call": {
        const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
          data.params[0] as TransactionRequest,
        );
        const response = await this.provider.call(
          req,
          data.params[1] as BlockTag,
        );
        callbackSuccess(response);
        return;
      }
      case "estimateGas": {
        if (data.params[1] && data.params[1] !== "latest") {
          throwUnsupported("estimateGas does not support blockTag");
        }

        const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
          data.params[0] as TransactionRequest,
        );
        const result = await this.provider.estimateGas(req);
        callbackSuccess(result.toHexString());
        return;
      }

      // @TOOD: Transform? No uncles?
      case "eth_getBlockByHash":
      case "eth_getBlockByNumber": {
        if (data.params[1]) {
          const response = await this.provider.getBlockWithTransactions(
            data.params[0] as BlockTag,
          );
          callbackSuccess(response);
          return;
        } else {
          const response = await this.provider.getBlock(
            data.params[0] as BlockTag,
          );
          callbackSuccess(response);
          return;
        }
      }
      case "eth_getTransactionByHash": {
        const response = await this.provider.getTransaction(
          data.params[0] as string,
        );
        callbackSuccess(response);
        return;
      }
      case "eth_getTransactionReceipt": {
        const response = await this.provider.getTransactionReceipt(
          data.params[0] as string,
        );
        callbackSuccess(response);
        return;
      }

      case "personal_sign":
      case "eth_sign": {
        if (!this.signer) {
          return throwUnsupported("eth_sign requires an account");
        }

        const address = await this.signer.getAddress();
        if (address !== ethers.utils.getAddress(data.params[0] as string)) {
          throw new Error("account mismatch or account not found");
        }

        const response = this.signer.signMessage(
          ethers.utils.arrayify(data.params[1] as number),
        );
        callbackSuccess(response);
        return;
      }

      case "eth_sendTransaction": {
        if (!this.signer) {
          return throwUnsupported("eth_sendTransaction requires an account");
        }

        const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
          data.params[0] as TransactionRequest,
        );
        const tx = await this.signer.sendTransaction(req);
        callbackSuccess(tx.hash);
        return;
      }

      case "eth_getUncleCountByBlockHash":
      case "eth_getUncleCountByBlockNumber":
      case "eth_getTransactionByBlockHashAndIndex":
      case "eth_getTransactionByBlockNumberAndIndex":
      case "eth_getUncleByBlockHashAndIndex":
      case "eth_getUncleByBlockNumberAndIndex":
      case "eth_newFilter":
      case "eth_newBlockFilter":
      case "eth_newPendingTransactionFilter":
      case "eth_uninstallFilter":
      case "eth_getFilterChanges":
      case "eth_getFilterLogs":
      case "eth_getLogs":
        break;
    }

    return throwUnsupported(`unsupported method: ${data.method}`);
  }
}
