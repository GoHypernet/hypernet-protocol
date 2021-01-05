import { Subject } from "rxjs";
import {  Balances,  ControlClaim, HypernetContext, PullPayment, PushPayment } from "../src/interfaces/objects";
import { ContextProvider } from "../src/implementations/utilities/index";
import { IBrowserNodeProvider } from "../src/interfaces/utilities/IBrowserNodeProvider";
import { BrowserNode } from "@connext/vector-browser-node";

export function getContextProvidor() {
  let _inControl = false;
  const onControlClaimed = new Subject<ControlClaim>();
  const onControlYielded = new Subject<ControlClaim>();
  const onPushPaymentProposed = new Subject<PushPayment>();
  const onPushPaymentReceived = new Subject<PushPayment>();
  const onPullPaymentProposed = new Subject<PullPayment>();
  const onPullPaymentApproved = new Subject<PullPayment>();
	const onBalancesChanged = new Subject<Balances>();

  onControlClaimed.subscribe({
    next: () => {
      _inControl = true;
    },
  });

  onControlYielded.subscribe({
    next: () => {
      _inControl = false;
    },
  });

	const context = new HypernetContext(
      "ethereumAddress",
      "vector" + "",
      false,
      onControlClaimed,
      onControlYielded,
      onPushPaymentProposed,
      onPullPaymentProposed,
      onPushPaymentReceived,
      onPullPaymentApproved,
      onBalancesChanged,
    );


    const contextProvider = new ContextProvider(
      onControlClaimed,
      onControlYielded,
      onPushPaymentProposed,
      onPullPaymentProposed,
      onPushPaymentReceived,
      onPullPaymentApproved,
      onBalancesChanged,
	);

	contextProvider.setContext(context);
	return contextProvider;
}

export class BrowserNodeProvider implements IBrowserNodeProvider {
  browserNode: BrowserNode;
  constructor() {
    this.browserNode =  new MyBrowserNode() as BrowserNode;
  }
  getBrowserNode(): Promise<BrowserNode> {
    return Promise.resolve(this.browserNode);
  }
}



export class MyBrowserNode extends BrowserNode {
  constructor() {
    super({});
  }
}


test("Just to keep jest shut up", () => {})