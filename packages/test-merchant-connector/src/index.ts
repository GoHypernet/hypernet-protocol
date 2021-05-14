import { Bytes32 } from "@connext/vector-types";
import { ChannelSigner } from "@connext/vector-utils";
import {
  IAuthorizeFundsRequest,
  IMerchantConnector,
  ISendFundsRequest,
  IResolutionResult,
  IRedirectInfo,
} from "@hypernetlabs/merchant-connector";
import {
  PushPayment,
  PullPayment,
  PublicIdentifier,
  Balances,
  EthereumAddress,
  PaymentId,
  Signature,
} from "@hypernetlabs/objects";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { Subject } from "rxjs";

declare global {
  interface Window {
    connector: IMerchantConnector;
  }
}

class TestMerchantConnector implements IMerchantConnector {
  async resolveChallenge(paymentId: PaymentId): Promise<IResolutionResult> {
    // What the mediator needs to sign:
    // https://github.com/connext/transfers/blob/20f44307164cb245c075cf3723b09d8ff75901d4/tests/insurance/insurance.spec.ts#L399

    // Case: mediator decides to resolve payment in full (ie, the entire insurance payment)
    const resolutionAmount = "1";

    // 1) Construct the ABI snippet for the data we want to sign
    const resolverDataEncoding = ["tuple(uint256 amount, bytes32 UUID)"];

    type InsuranceResolverData = {
      amount: string;
      UUID: Bytes32;
    };

    // 2) Prepare the (un-encoded) data
    const resolverData: InsuranceResolverData = { amount: resolutionAmount, UUID: paymentId };

    // 3) Encode the data
    const encodedData = defaultAbiCoder.encode(resolverDataEncoding, [resolverData]);

    // 4) Hash the data so that it's a set length
    const hashedData = keccak256(encodedData);

    // 5) Sign the hash of the data so that people know we sent it
    // Note, it is assumed this is being done on the Merchant's server, and this private key is protected.
    const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
    const mediator = new ChannelSigner(privateKey);
    const mediatorSignature = await mediator.signUtilityMessage(hashedData);

    // 6) Return both the signature of the hash of the data & the data itself
    return Promise.resolve({
      paymentId,
      mediatorSignature: Signature(mediatorSignature),
      amount: resolutionAmount,
    });
  }

  public async getAddress(): Promise<EthereumAddress> {
    return Promise.resolve(EthereumAddress("0x14791697260E4c9A71f18484C9f997B308e59325"));
  }

  public onIFrameClosed() {
    console.log("Hey, user just closed merchant iframe");
  }

  public onIFrameDisplayed() {
    console.log("Hey, user just opened merchant iframe");
  }

  private _renderContent() {
    const element = window.document.createElement("div");
    element.innerHTML = `
      <div style="text-align: center; display: flex; justify-content: center; flex-direction: column; background-color: #ffffff;">
        <img src="https://res.cloudinary.com/dqueufbs7/image/upload/v1614648372/images/Screen_Shot_2021-03-02_at_04.14.05.png" width="100%" />
        <h2>Galileo merchant connector</h2>
      </div>
    `;
    window.document.body.appendChild(element);

    // connector did all the rendering stuff, now he is asking merchant-iframe to show his stuff
    // Merchant iframe Postmate model is running after the connector code get compiled in MerchantService.activateMerchantConnector so we need a small delay to wait for the Postmate model to get initialized.
    setTimeout(() => {
      //this.displayRequested.next();
    }, 100);

    // connector done with the UI he rendered previously, now he want to ask the merchant-iframe to close everything.
    setTimeout(() => {
      //this.closeRequested.next();
    }, 10000);
  }

  //   paymentCreated(payment: Payment) {
  //       // Send the payment details to galileo
  //   }

  sendFundsRequested: Subject<ISendFundsRequest>;
  authorizeFundsRequested: Subject<IAuthorizeFundsRequest>;
  displayRequested: Subject<void>;
  closeRequested: Subject<void>;
  onPreRedirect: Subject<IRedirectInfo>;

  constructor() {
    console.log("Instantiating TestMerchantConnector");
    this.sendFundsRequested = new Subject<ISendFundsRequest>();
    this.authorizeFundsRequested = new Subject<IAuthorizeFundsRequest>();
    this.displayRequested = new Subject<void>();
    this.closeRequested = new Subject<void>();
    this.onPreRedirect = new Subject<IRedirectInfo>();

    this._renderContent();
  }

  onPushPaymentSent(payment: PushPayment): void {
    console.log("Push Payment Sent");
    console.log(payment);
  }
  onPushPaymentUpdated(payment: PushPayment): void {
    console.log("Push Payment Updated");
    console.log(payment);
  }
  onPushPaymentReceived(payment: PushPayment): void {
    console.log("Push Payment Received");
    console.log(payment);
  }
  onPullPaymentSent(payment: PullPayment): void {
    console.log("Pull Payment Sent");
    console.log(payment);
  }
  onPullPaymentUpdated(payment: PullPayment): void {
    console.log("Pull Payment Updated");
    console.log(payment);
  }
  public onPullPaymentReceived(payment: PullPayment): void {
    console.log("Pull Payment Received");
    console.log(payment);
  }

  public onPublicIdentifierReceived(publicIdentifier: PublicIdentifier): void {
    console.log("Public Identifier Received");
    console.log(publicIdentifier);
  }

  public onBalancesReceived(balances: Balances): void {
    console.log("Balances Received");
    console.log(balances);
  }
}

window.connector = new TestMerchantConnector();
