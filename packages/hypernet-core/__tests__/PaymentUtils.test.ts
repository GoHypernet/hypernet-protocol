import { EBlockchainNetwork, EPaymentType } from "../src/interfaces/types";
import { ConfigProvider } from "../src/implementations/utilities/ConfigProvider";
import { PaymentIdUtils, PaymentUtils } from "../src/implementations/utilities/PaymentUtils";
import randomstring from "randomstring";
import { BrowserNode } from "@connext/vector-browser-node/dist/index";
import { FullTransferState } from "@connext/vector-types";
import * as Factory from "factory.ts";


const transferFactory = Factory.Sync.makeFactory<FullTransferState>({
  channelAddress: "channelAddress",
  transferId: "transferId",
  transferDefinition: "",
  initiator: "sdf", // either alice or bob
  responder: "saf", // either alice or bob
  assetId: "id",
  balance: {
  	amount: [],
  	to: [],
  },
  transferTimeout: "string",
  initialStateHash: "string",

  channelFactoryAddress: "networkContext", // networkContext?
  chainId: Factory.each(i => i),
  transferEncodings: [], // Initial state encoding, resolver encoding
  transferState: {},
  transferResolver: {}, // undefined iff not resolved
  meta: {},
  inDispute: false,
});

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

	// it("should sort transfers", async () => {
	// 	let browserNode = ({} as unknown) as BrowserNode;
	// 	const transfer = transferFactory.build({});
	// 	const paymentId = await paymentUtils.createPaymentId(EPaymentType.Pull);
	// 	paymentUtils.sortTransfers(paymentId, [transfer], browserNode );
	// })
});