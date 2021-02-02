import { EthereumAddress } from "@hypernetlabs/hypernet-core";

export class PaymentTokenOptionViewModel {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}
