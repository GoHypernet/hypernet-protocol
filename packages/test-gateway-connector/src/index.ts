import { Bytes32 } from "@connext/vector-types";
import { ChannelSigner } from "@connext/vector-utils";
import {
  IAuthorizeFundsRequest,
  IGatewayConnector,
  ISendFundsRequest,
  IResolutionResult,
  IRedirectInfo,
  IResolveInsuranceRequest,
  ISignMessageRequest,
  IStateChannelRequest,
} from "@hypernetlabs/gateway-connector";
import {
  PushPayment,
  PullPayment,
  PublicIdentifier,
  Balances,
  EthereumAddress,
  PaymentId,
  Signature,
  BigNumberString,
  ChainId,
  GatewayUrl,
  GatewayTokenInfo,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { Subject } from "rxjs";

declare global {
  interface Window {
    connector: IGatewayConnector;
  }
}

class TestGatewayConnector implements IGatewayConnector {
  protected routerPublicIdentifier = PublicIdentifier(
    "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR",
  );
  protected paymentToken = EthereumAddress(
    "0xAa588d3737B611baFD7bD713445b314BD453a5C8",
  ); // HyperToken

  protected chainId = ChainId(1337);
  protected gatewayUrl = GatewayUrl("http://localhost:5010");
  protected channelAddress: EthereumAddress | null = null;

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
    const resolverData: InsuranceResolverData = {
      amount: resolutionAmount,
      UUID: paymentId,
    };

    // 3) Encode the data
    const encodedData = defaultAbiCoder.encode(resolverDataEncoding, [
      resolverData,
    ]);

    // 4) Hash the data so that it's a set length
    const hashedData = keccak256(encodedData);

    // 5) Sign the hash of the data so that people know we sent it
    // Note, it is assumed this is being done on the Gateway's server, and this private key is protected.
    const privateKey =
      "0x0123456789012345678901234567890123456789012345678901234567890123";
    const mediator = new ChannelSigner(privateKey);
    const gatewaySignature = await mediator.signUtilityMessage(hashedData);

    // 6) Return both the signature of the hash of the data & the data itself
    return Promise.resolve({
      paymentId,
      gatewaySignature: Signature(gatewaySignature),
      amount: resolutionAmount,
    });
  }

  private _renderContent() {
    const element = window.document.createElement("div");
    element.innerHTML = `
      <div style="text-align: center; display: flex; justify-content: center; flex-direction: column; background-color: #ffffff;">
        <img src="https://res.cloudinary.com/dqueufbs7/image/upload/v1614648372/images/Screen_Shot_2021-03-02_at_04.14.05.png" width="100%" />
        <h2>Galileo gateway connector</h2>
        <div>
        <style>
          .input {
            width: 200px;
          }
          .button {
            width: 210px;
          }
        </style>
        <div>
          <label for="chainId">Chain ID</label><br />
          <input
            type="text"
            id="chainId"
            name="chainId"
            value=""
            class="input"
          /><br />
          <br />
          <label for="routerPublicIdentifier">Router Public Identifier</label><br />
          <input
            type="text"
            id="routerPublicIdentifier"
            name="routerPublicIdentifier"
            value=""
            class="input"
          />
          <br />
          <br />
          <button class="button" onclick="window.connector.stateChannelRequested.next({chainId:document.getElementById('chainId').value,routerPublicIdentifiers:[document.getElementById('routerPublicIdentifier').value]})">Save</button>
        </div>
        <br />
        <br />
        <br />
        <button class="button" onclick="window.connector.sendPayment()">Send Payment</button>
      </div>
      </div>
    `;
    window.document.body.appendChild(element);

    // connector did all the rendering stuff, now he is asking gateway-iframe to show his stuff
    // Gateway iframe Postmate model is running after the connector code get compiled in GatewayConnectorService.activateGatewayConnector so we need a small delay to wait for the Postmate model to get initialized.
    setTimeout(() => {
      //this.displayRequested.next();
    }, 100);

    // connector done with the UI he rendered previously, now he want to ask the gateway-iframe to close everything.
    setTimeout(() => {
      //this.closeRequested.next();
    }, 10000);
  }

  public sendFundsRequested: Subject<ISendFundsRequest>;
  public authorizeFundsRequested: Subject<IAuthorizeFundsRequest>;
  public resolveInsuranceRequested: Subject<IResolveInsuranceRequest>;
  public signMessageRequested: Subject<ISignMessageRequest>;
  public stateChannelRequested: Subject<IStateChannelRequest>;
  public displayRequested: Subject<void>;
  public closeRequested: Subject<void>;
  public onPreRedirect: Subject<IRedirectInfo>;

  constructor() {
    console.log("Instantiating TestGatewayConnector");
    this.sendFundsRequested = new Subject<ISendFundsRequest>();
    this.authorizeFundsRequested = new Subject<IAuthorizeFundsRequest>();
    this.resolveInsuranceRequested = new Subject();
    this.signMessageRequested = new Subject();
    this.stateChannelRequested = new Subject();
    this.displayRequested = new Subject<void>();
    this.closeRequested = new Subject<void>();
    this.onPreRedirect = new Subject<IRedirectInfo>();

    this._renderContent();

    setTimeout(() => {
      // Request a state channel from the core
      console.log(
        `Requesting channel with router ${this.routerPublicIdentifier} on chain ${this.chainId}`,
      );
      this.stateChannelRequested.next({
        chainId: this.chainId,
        routerPublicIdentifiers: [this.routerPublicIdentifier],
        callback: (stateChannel) => {
          console.log(
            `State channel recieved, address: ${stateChannel.channelAddress}`,
          );
          this.channelAddress = stateChannel.channelAddress;
        },
      });
    }, 1000);
  }

  public onIFrameClosed() {
    console.log("Hey, user just closed gateway iframe");
  }

  public onIFrameDisplayed() {
    console.log("Hey, user just opened gateway iframe");
  }

  public deauthorize() {
    return new Promise<void>((resolve, reject) => {
      // async operations, remove stuff from db and other services
      setTimeout(() => {
        return resolve(undefined);
      }, 6000);
    });
  }

  public onPushPaymentSent(payment: PushPayment): void {
    console.log("Push Payment Sent");
    console.log(payment);
  }
  public onPushPaymentUpdated(payment: PushPayment): void {
    console.log("Push Payment Updated");
    console.log(payment);
  }
  public onPushPaymentReceived(payment: PushPayment): void {
    console.log("Push Payment Received");
    console.log(payment);
  }
  public onPushPaymentDelayed(payment: PushPayment): void {
    console.log("Push Payment Delayed");
    console.log(payment);
  }
  public onPushPaymentCanceled(payment: PushPayment): void {
    console.log("Push Payment Canceled");
    console.log(payment);
  }

  public onPullPaymentSent(payment: PullPayment): void {
    console.log("Pull Payment Sent");
    console.log(payment);
  }
  public onPullPaymentUpdated(payment: PullPayment): void {
    console.log("Pull Payment Updated");
    console.log(payment);
  }
  public onPullPaymentReceived(payment: PullPayment): void {
    console.log("Pull Payment Received");
    console.log(payment);
  }
  public onPullPaymentDelayed(payment: PullPayment): void {
    console.log("Pull Payment Delayed");
    console.log(payment);
  }
  public onPullPaymentCanceled(payment: PullPayment): void {
    console.log("Pull Payment Canceled");
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

  public sendPayment(): void {
    if (this.channelAddress == null) {
      alert("Waiting for channel to be established");
      return;
    }
    console.log("Emiting sendFundsRequested");
    this.sendFundsRequested.next({
      channelAddress: this.channelAddress,
      recipientPublicIdentifier: PublicIdentifier(
        "vector71a1WrjwpGYMHRhvb2HAJKspDonJkMDbghygGnCuiULdxmGuG7",
      ), // Galileo account
      amount: BigNumberString("1"),
      expirationDate: UnixTimestamp(
        Math.floor(new Date().getTime() / 1000 + 1000000),
      ),
      requiredStake: BigNumberString("1"),
      paymentToken: this.paymentToken, // Hypertoken
      metadata: null,
    });
  }

  public async getGatewayTokenInfo(): Promise<GatewayTokenInfo[]> {
    return [
      new GatewayTokenInfo(this.paymentToken, this.chainId, [
        this.routerPublicIdentifier,
      ]),
    ];
  }
}

window.connector = new TestGatewayConnector();
