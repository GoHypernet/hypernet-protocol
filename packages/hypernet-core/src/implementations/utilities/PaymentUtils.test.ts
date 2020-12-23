import { EBlockchainNetwork, EPaymentType } from "@interfaces/types";
import { ConfigProvider } from "./ConfigProvider";
import { PaymentIdUtils, PaymentUtils } from "./PaymentUtils";
import randomstring from "randomstring";

describe("Testing payment utils", () => {
	const configPromise = new ConfigProvider(EBlockchainNetwork.Localhost);
	const paymentUtils = new PaymentUtils(configPromise);
	const prepend = (id: string) => "0x" + id;

	it("should accept valid payment id", async () => {
		const validId = randomstring.generate({length: 64, charset: 'hex'});
		expect(PaymentIdUtils.isValidPaymentId(prepend(validId))).toBe(true);
		expect(() => PaymentIdUtils.isValidPaymentId(validId)).toThrowError();
		expect(() => PaymentIdUtils.isValidPaymentId(randomstring.generate({length: 64, charset: "alphabet"}))).toThrowError();
	});

	it("should generate proper payment id", async () => {
		const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
		expect(paymentId.length).toEqual(66)
	});

	it("should check if it is hypernet domain", async () => {
		expect(await paymentUtils.isHypernetDomain(await paymentUtils.createPaymentId(EPaymentType.Pull))).toBe(true);
		expect(await paymentUtils.isHypernetDomain(await paymentUtils.createPaymentId(EPaymentType.Push))).toBe(true);
		expect(PaymentIdUtils.getDomain(await paymentUtils.createPaymentId(EPaymentType.Pull))).toEqual("Hypernet")
	});

	it("should sort transfers", async () => {
		const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
		// paymentUtils.sortTransfers(paymentId, )
	})
});