import { EBlockchainNetwork, EPaymentType } from "../src/interfaces/types";
import { ConfigProvider } from "../src/implementations/utilities/ConfigProvider";
import { PaymentUtils } from "../src/implementations/utilities/PaymentUtils";
import {PaymentIdUtils} from "../src/implementations/utilities/PaymentIdUtils";
import {LogUtils} from "../src/implementations/utilities/LogUtils";
import randomstring from "randomstring";
import { Subject } from "rxjs";
import { ok } from "neverthrow";
import { BrowserNodeProvider, ContextProvider } from "../src/implementations/utilities";
import { Balances, ControlClaim, PullPayment, PushPayment } from "../src/interfaces/objects";

const logUtils = new LogUtils();
const paymentIdUtils = new PaymentIdUtils();

describe("Testing payment utils", () => {
	const configProvider = new ConfigProvider(EBlockchainNetwork.Localhost, logUtils);
	const paymentUtils = new PaymentUtils(configProvider, logUtils, paymentIdUtils);
	const contextProvider = new ContextProvider(new Subject<ControlClaim>(), new Subject<ControlClaim>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<Balances>());
	const prepend = (id: string) => "0x" + id;

	it("should accept valid payment id", async () => {
		const validId = randomstring.generate({length: 64, charset: 'hex'});
		expect(paymentIdUtils.isValidPaymentId(prepend(validId))).toEqual(ok(true));
		expect(paymentIdUtils.isValidPaymentId(validId)).toEqual(ok(false));
		expect(paymentIdUtils.isValidPaymentId(randomstring.generate({length: 64, charset: "alphabet"})));
	});

	it("should generate proper payment id", async () => {
		const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
		expect(paymentId.isOk()).toEqual(true);
		expect(paymentId.unwrapOr("").length).toEqual(66)
	});

	it("should check if it is hypernet domain", async () => {
		let id = (await paymentUtils.createPaymentId(EPaymentType.Pull)).unwrapOr("");
		expect(id.length).toEqual(66);
		expect(await paymentUtils.isHypernetDomain(id)).toEqual(ok(true));
		expect(paymentIdUtils.getDomain(id)).toEqual(ok("Hypernet"))
	});

	// it("should sort transfers", async () => {
	// 	const transfer = transferFactory.build({});
	// 	const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
	// 	paymentUtils.sortTransfers(paymentId, [transfer], browserNode );
	// })
});