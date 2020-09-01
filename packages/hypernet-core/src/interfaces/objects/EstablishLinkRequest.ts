import { EthereumAddress } from "./EthereumAddress";
import { PublicKey } from "./PublicKey";
import { PullSettings } from "./PullSettings";

// tslint:disable: max-classes-per-file
export class EstablishLinkRequest {
  constructor(
    public linkId: string,
    public consumer: string,
    public provider: string,
    public paymentToken: EthereumAddress,
    public disputeMediator: PublicKey,
    public pullSettings: PullSettings | null,
    public threadAddress: string,
  ) {}
}

export class EstablishLinkRequestWithApproval extends EstablishLinkRequest {
  constructor(establishLinkRequest: EstablishLinkRequest, public approve: (approve: boolean) => void) {
    super(
      establishLinkRequest.linkId,
      establishLinkRequest.consumer,
      establishLinkRequest.provider,
      establishLinkRequest.paymentToken,
      establishLinkRequest.disputeMediator,
      establishLinkRequest.pullSettings,
      establishLinkRequest.threadAddress,
    );
  }
}
