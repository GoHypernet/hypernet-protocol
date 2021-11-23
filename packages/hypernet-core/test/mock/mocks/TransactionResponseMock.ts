import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import { account, chainId, TransactionReceiptMock } from "@mock/mocks";
import { BigNumber } from "ethers";

export class TransactionResponseMock implements TransactionResponse {
  public hash: string;
  public blockNumber?: number | undefined;
  public blockHash?: string | undefined;
  public timestamp?: number | undefined;
  public confirmations: number;
  public from: string;
  public raw?: string | undefined;
  public to?: string | undefined;
  public nonce: number;
  public gasLimit: BigNumber;
  public gasPrice: BigNumber;
  public data: string;
  public value: BigNumber;
  public chainId: number;
  public r?: string | undefined;
  public s?: string | undefined;
  public v?: number | undefined;

  constructor() {
    this.hash = "hash";
    this.confirmations = 1;
    this.from = account;
    this.nonce = 0;
    this.gasLimit = BigNumber.from(1);
    this.gasPrice = BigNumber.from(1);
    this.data = "data";
    this.value = BigNumber.from(1);
    this.chainId = chainId;
  }

  public wait(confirmations?: number | undefined): Promise<TransactionReceipt> {
    return Promise.resolve(new TransactionReceiptMock());
  }
}
