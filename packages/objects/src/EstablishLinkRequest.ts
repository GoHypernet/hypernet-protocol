import { EthereumAddress } from "@objects/EthereumAddress";
import "reflect-metadata";
import { Type } from "class-transformer";

// tslint:disable: max-classes-per-file
export class EstablishLinkRequest {
  @Type(() => String)
  public linkId: string;

  @Type(() => String)
  public consumer: EthereumAddress;

  @Type(() => String)
  public provider: EthereumAddress;

  @Type(() => String)
  public paymentToken: EthereumAddress;

  @Type(() => String)
  public merchantUrl: string;

  @Type(() => String)
  public threadAddress: string;

  constructor(
    linkId: string,
    consumer: string,
    provider: string,
    paymentToken: EthereumAddress,
    merchantUrl: string,
    threadAddress: string,
  ) {
    this.linkId = linkId;
    this.consumer = consumer;
    this.provider = provider;
    this.paymentToken = paymentToken;
    this.merchantUrl = merchantUrl;
    this.threadAddress = threadAddress;
  }
}

export class EstablishLinkRequestWithApproval extends EstablishLinkRequest {
  constructor(establishLinkRequest: EstablishLinkRequest, public approve: (approve: boolean) => void) {
    super(
      establishLinkRequest.linkId,
      establishLinkRequest.consumer,
      establishLinkRequest.provider,
      establishLinkRequest.paymentToken,
      establishLinkRequest.merchantUrl,
      establishLinkRequest.threadAddress,
    );
  }
}
