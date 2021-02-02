import moment from "moment";
import { BigNumber, EthereumAddress, PublicKey } from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import { PublicIdentifier } from "@connext/vector-types";

export abstract class Payment {
  constructor(
    public id: string,
    public to: PublicIdentifier,
    public from: PublicIdentifier,
    public state: EPaymentState,
    public paymentToken: EthereumAddress,
    public requiredStake: BigNumber,
    public amountStaked: BigNumber,
    public expirationDate: number,
    public finalized: boolean,
    public createdTimestamp: number,
    public updatedTimestamp: number,
    public collateralRecovered: BigNumber,
    public disputeMediator: PublicKey,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PushPayment extends Payment {
  constructor(
    id: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    paymentToken: EthereumAddress,
    requiredStake: BigNumber,
    amountStaked: BigNumber,
    expirationDate: number,
    finalized: boolean,
    createdTimestamp: number,
    updatedTimestamp: number,
    collateralRecovered: BigNumber,
    disputeMediator: PublicKey,
    public paymentAmount: BigNumber,
  ) {
    super(
      id,
      to,
      from,
      state,
      paymentToken,
      requiredStake,
      amountStaked,
      expirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
    );
  }
}

// tslint:disable-next-line: max-classes-per-file
export class PullPayment extends Payment {
  constructor(
    id: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    paymentToken: EthereumAddress,
    requiredStake: BigNumber,
    amountStaked: BigNumber,
    expirationDate: number,
    finalized: boolean,
    createdTimestamp: number,
    updatedTimestamp: number,
    collateralRecovered: BigNumber,
    disputeMediator: PublicKey,
    public authorizedAmount: BigNumber,
    public transferedAmount: BigNumber,
    public ledger: PullAmount[],
  ) {
    super(
      id,
      to,
      from,
      state,
      paymentToken,
      requiredStake,
      amountStaked,
      expirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
    );
  }
}

// tslint:disable-next-line: max-classes-per-file
export class PullAmount {
  constructor(public amount: BigNumber, public date: number) {}
}
