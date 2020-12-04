import { Address, Bytes32, SignatureString } from "@connext/vector-types";

export type InsuranceState = {
  receiver: Address;
  mediator: Address;
  collateral: string;
  expiration: string;
  UUID: Bytes32;
};

export type InsuranceResolverData = {
  amount: string;
  UUID: Bytes32;
};

export type InsuranceResolver = {
  data: InsuranceResolverData;
  signature: SignatureString;
};