import { EthereumAddress } from "@hypernetlabs/objects";

export class PaymentTokenOptionViewModel {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}
