import { EthereumAddress } from "./EthereumAddress";
import { PublicKey } from "./PublicKey";
import { PullSettings } from "./PullSettings";

export class EstablishLinkRequest {
  constructor(
    public consumer: string,
    public provider: string,
    public paymentToken: EthereumAddress,
    public disputeMediator: PublicKey,
    public pullSettings: PullSettings | null,
    public threadAddress: string,
  ) {}
}
