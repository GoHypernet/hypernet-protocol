import { Address, SignatureString } from "@connext/vector-types";

import { BigNumberString } from "@objects/BigNumberString";
import { PaymentId } from "@objects/PaymentId";

export type InsuranceState = {
  receiver: Address;
  mediator: Address;
  collateral: BigNumberString;
  expiration: string;
  UUID: PaymentId;
};

export type InsuranceResolverData = {
  amount: BigNumberString;
  UUID: PaymentId;
};

export type InsuranceResolver = {
  data: InsuranceResolverData;
  signature: SignatureString;
};
