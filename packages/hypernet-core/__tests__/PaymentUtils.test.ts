jest.mock("../src/implementations/utilities/LogUtils");

import { EBlockchainNetwork, EPaymentType } from "../src/interfaces/types";
import { ConfigProvider } from "../src/implementations/utilities/ConfigProvider";
import { PaymentUtils } from "../src/implementations/utilities/PaymentUtils";

import {LogUtils} from "../src/implementations/utilities/LogUtils";
import { PaymentIdUtils } from "../src/implementations/utilities/PaymentIdUtils";
import { ok } from "neverthrow";

const logUtils = new LogUtils();
const paymentIdUtils = new PaymentIdUtils();
const hypernetDomain = "Hypernet";

jest.mock("../src/implementations/utilities/PaymentIdUtils", () => {
	return {
		PaymentIdUtils: jest.fn().mockImplementation(() => {
      		return {
				  makePaymentId: jest.fn(),
				  getDomain: jest.fn(id => ok(hypernetDomain)),
      		};
		})
	};
})

describe("Testing payment utils", () => {
	const configProvider = new ConfigProvider(EBlockchainNetwork.Localhost, logUtils);
	const paymentUtils = new PaymentUtils(configProvider, logUtils, paymentIdUtils);

	it("should call paymentIdUtils makePaymentId", async () => {
		const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
		expect(paymentIdUtils.makePaymentId).toHaveBeenCalledWith("Hypernet", EPaymentType.Pull, expect.stringMatching(/[0-9A-Fa-f\-]/));
	});

	it("should call paymentIdUtils getDomain", async () => {
		let domain = await paymentUtils.isHypernetDomain("0x48797065726e65742020505553482020be292d9237bf4149a3a4badce4b776cd");
		expect(paymentIdUtils.getDomain).toHaveBeenCalledWith(expect.any(String));
		expect(domain).toEqual(ok(true));
	});

	// it("should sort transfers", async () => {
	// 	const transfer = transferFactory.build({});
	// 	const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
	// 	paymentUtils.sortTransfers(paymentId, [transfer], browserNode );
	// })
});