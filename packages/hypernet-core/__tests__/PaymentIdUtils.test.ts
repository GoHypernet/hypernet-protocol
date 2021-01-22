import { ok } from "neverthrow";
import { PaymentIdUtils } from "../src/implementations/utilities/PaymentIdUtils";
import { EPaymentType } from "../src/interfaces/types";
import { v4 as uuidv4 } from "uuid";

const paymentIdUtils = new PaymentIdUtils();
const domain = "Hypernet";

test("Hypernet pull id", async () => {
	const paymentIdResult = paymentIdUtils.makePaymentId(domain, EPaymentType.Pull, uuidv4());
	expect(paymentIdResult.isOk()).toEqual(true);
	const paymentId = paymentIdResult.unwrapOr("");
	expect(paymentId !== "").toEqual(true);
	expect(paymentId.length).toEqual(66);

	expect(paymentIdUtils.getDomain(paymentId)).toEqual(ok(domain));
	expect(paymentIdUtils.getType(paymentId)).toEqual(ok(EPaymentType.Pull));
	expect(paymentIdUtils.isValidPaymentId(paymentId)).toEqual(ok(true));
	expect(paymentIdUtils.getUUID(paymentId).isOk()).toEqual(true);
});

test("Hypernet push id", async () => {
	const paymentIdResult = paymentIdUtils.makePaymentId(domain, EPaymentType.Push, uuidv4());
	expect(paymentIdResult.isOk()).toEqual(true);
	const paymentId = paymentIdResult.unwrapOr("");
	expect(paymentId !== "").toEqual(true);
	expect(paymentId.length).toEqual(66);

	expect(paymentIdUtils.getDomain(paymentId)).toEqual(ok(domain));
	expect(paymentIdUtils.getType(paymentId)).toEqual(ok(EPaymentType.Push));
	expect(paymentIdUtils.isValidPaymentId(paymentId)).toEqual(ok(true));
	expect(paymentIdUtils.getUUID(paymentId).isOk()).toEqual(true);
});

test("Subnet push id", async () => {
	const paymentIdResult = paymentIdUtils.makePaymentId("Subnet", EPaymentType.Push, uuidv4());
	expect(paymentIdResult.isOk()).toEqual(true);
	const paymentId = paymentIdResult.unwrapOr("");
	expect(paymentId !== "").toEqual(true);
	expect(paymentId.length).toEqual(66);

	expect(paymentIdUtils.getDomain(paymentId)).toEqual(ok("Subnet"));
	expect(paymentIdUtils.getType(paymentId)).toEqual(ok(EPaymentType.Push));
	expect(paymentIdUtils.isValidPaymentId(paymentId)).toEqual(ok(true));
	expect(paymentIdUtils.getUUID(paymentId).isOk()).toEqual(true);
});

test("Invalid id", async () => {
	const validId = paymentIdUtils.makePaymentId(domain, EPaymentType.Push, uuidv4()).unwrapOr("");
	expect(validId !== "").toEqual(true);
	expect(validId.length).toEqual(66);

	// Long id
	let paymentId = validId + "extra-characters";
	expect(paymentIdUtils.getDomain(paymentId).isErr()).toEqual(true);
	expect(paymentIdUtils.getType(paymentId).isErr()).toEqual(true);
	expect(paymentIdUtils.getUUID(paymentId).isErr()).toEqual(true);
	expect(paymentIdUtils.isValidPaymentId(paymentId)).toEqual(ok(false));

	expect(paymentIdUtils.makePaymentId("HypernetLongDomain", EPaymentType.Push, uuidv4()).isErr()).toEqual(true);
	expect(paymentIdUtils.makePaymentId(domain, "LongPaymentType", uuidv4()).isErr()).toEqual(true);
	expect(paymentIdUtils.makePaymentId(domain, EPaymentType.Pull, "not 16 characters long uuid").isErr()).toEqual(true);

	// Unknown payment type
	expect(paymentIdUtils.getType(generateId(domain.padEnd(10), "Pulls".padEnd(6))).isOk()).toEqual(false);
	expect(paymentIdUtils.getDomain(generateId("LongDomainName".padEnd(10), EPaymentType.Pull.padEnd(6))).isOk()).toEqual(false);


})

function generateId(domain: string, type: string, uuid?: string): string {
	uuid = uuid || uuidv4().split("-").join("");
	const domainHex = Buffer.from(domain, "ascii").toString("hex");
    const typeHex = Buffer.from(type, "ascii").toString("hex");
    return "0x" + domainHex + typeHex + uuid;
}