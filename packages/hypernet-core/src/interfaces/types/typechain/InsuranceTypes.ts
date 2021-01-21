import { Address, Bytes32, SignatureString } from "@connext/vector-types";

export type InsuranceState = {
  receiver: Address;
  mediator: Address;
  collateral: string;
  expiration: string;
  UUID: string;
};

export type InsuranceResolverData = {
  amount: string;
  UUID: string;
};

export type InsuranceResolver = {
  data: InsuranceResolverData;
  signature: SignatureString;
};
