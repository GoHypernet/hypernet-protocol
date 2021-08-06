import { Log, TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { account, account2, ethereumAddress } from "@mock/mocks";

export class TransactionReceiptMock implements TransactionReceipt {
  public to: string;
  public from: string;
  public contractAddress: string;
  public transactionIndex: number;
  public root?: string | undefined;
  public gasUsed: BigNumber;
  public logsBloom: string;
  public blockHash: string;
  public transactionHash: string;
  public logs: Log[];
  public blockNumber: number;
  public confirmations: number;
  public cumulativeGasUsed: BigNumber;
  public byzantium: boolean;
  public status?: number | undefined;
  public effectiveGasPrice: BigNumber;
  public type: number;

  constructor() {
    this.to = account2;
    this.from = account;
    this.contractAddress = ethereumAddress;
    this.transactionIndex = 1;
    this.gasUsed = BigNumber.from(1);
    this.logsBloom = "logsBloom";
    this.blockHash = "blockHash";
    this.transactionHash = "transactionHash";
    this.logs = [];
    this.blockNumber = 1;
    this.confirmations = 1;
    this.cumulativeGasUsed = BigNumber.from(1);
    this.byzantium = false;
    this.effectiveGasPrice = BigNumber.from(1);
    this.type = 0;
  }
}
