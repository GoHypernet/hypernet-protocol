import { Address, SignatureString } from "@connext/vector-types";

import { BigNumberString } from "@objects/BigNumberString";
import { PaymentId } from "@objects/PaymentId";

export type Rate = {
  deltaAmount: BigNumberString;
  deltaTime: string;
};

export type ParameterizedState = {
  receiver: Address;
  start: string;
  expiration: string;
  UUID: PaymentId;
  rate: Rate;
};

export type ParameterizedResolverData = {
  UUID: PaymentId;
  paymentAmountTaken: BigNumberString;
};

export type ParameterizedResolver = {
  data: ParameterizedResolverData;
  payeeSignature: SignatureString;
};
