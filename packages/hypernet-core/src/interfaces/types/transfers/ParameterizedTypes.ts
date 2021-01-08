import { Address, Bytes32, SignatureString } from "@connext/vector-types";

export type Rate = {
  deltaAmount: string;
  deltaTime: string;
};

export type ParameterizedState = {
  receiver: Address;
  start: string;
  expiration: string;
  UUID: string;
  rate: Rate;
};

export type ParameterizedResolverData = {
  UUID: string;
  paymentAmountTaken: string;
};

export type ParameterizedResolver = {
  data: ParameterizedResolverData;
  payeeSignature: SignatureString;
};
