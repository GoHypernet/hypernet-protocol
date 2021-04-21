import { PaymentId, UUID } from "@hypernetlabs/objects";
import { InvalidParametersError, InvalidPaymentIdError } from "@hypernetlabs/objects";
import { EPaymentType } from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { err, ok, Result } from "neverthrow";

import { IPaymentIdUtils } from "@interfaces/utilities";

/**
 * An abstract class for creating & converting payment IDs, as well as verifying
 * correctness, and extracting information from the ID (such as type, domain, UUID)
 *
 * A paymentID is a 64-length hexadecimal string:
 * characters 0-19: domain (encoded as ascii text --> hex)
 * characters 20-32: type  (encoded as ascii text --> hex)
 * characters 32-63: UUID  (encoded as hex)
 */
export class PaymentIdUtils implements IPaymentIdUtils {
  /**
   * Returns an ascii representation of the domain portion of the paymentID string.
   * (characters 0-19 of the paymentIdString)
   * @param paymentIdString
   */
  public getDomain(paymentIdString: PaymentId): Result<string, InvalidPaymentIdError> {
    const paymentIdValidRes = this.isValidPaymentId(paymentIdString);
    if (paymentIdValidRes.isErr() || !paymentIdValidRes.value) {
      return err(new InvalidPaymentIdError(`Not a valid paymentId: '${paymentIdString}'`));
    }

    const domainHex = paymentIdString.substr(2, 20);
    const domain = Buffer.from(domainHex, "hex").toString("ascii");
    return ok(domain.trim());
  }

  /**
   * Returns an ascii representation of the type portion of the paymentID string.
   * (characters 20-31 of the paymentIdString)
   * @param paymentIdString
   */
  public getType(paymentIdString: PaymentId): Result<EPaymentType, InvalidPaymentIdError> {
    const paymentIdValidRes = this.isValidPaymentId(paymentIdString);
    if (paymentIdValidRes.isErr() || !paymentIdValidRes.value) {
      return err(new InvalidPaymentIdError(`Not a valid paymentId: '${paymentIdString}'`));
    }
    const typeHex = paymentIdString.substr(22, 12);
    const type = Buffer.from(typeHex, "hex").toString("ascii");
    const trimmedType = type.trim();

    if (trimmedType === EPaymentType.Pull) {
      return ok(EPaymentType.Pull);
    }
    if (trimmedType === EPaymentType.Push) {
      return ok(EPaymentType.Push);
    }

    return err(new InvalidPaymentIdError(`Type did not correspond to a known EPaymentType, got '${type}'`));
  }

  /**
   * Returns the UUID portion of the paymentID string.
   * (characters 32-63 of the paymentIdString)
   * @param paymentIdString
   */
  public getUUID(paymentIdString: PaymentId): Result<UUID, InvalidPaymentIdError> {
    const paymentIdValidRes = this.isValidPaymentId(paymentIdString);
    if (paymentIdValidRes.isErr() || !paymentIdValidRes.value) {
      return err(new InvalidPaymentIdError(`Not a valid paymentId: '${paymentIdString}'`));
    }
    const uuid = UUID(paymentIdString.substr(34, 32));
    return ok(uuid);
  }

  /**
   * A valid payment ID is exactly 64 characters, hexadecimal, refixed with 0x.
   * @param paymentIdString
   */
  public isValidPaymentId(paymentIdString: PaymentId): Result<boolean, InvalidParametersError> {
    const overallRegex = /^0x[0-9A-Fa-f]{64}$/;
    return ok(overallRegex.test(paymentIdString));

    // TODO: Uses ethers library, may be better than regex
    return ok(ethers.utils.isHexString(paymentIdString) && ethers.utils.hexDataLength(paymentIdString) == 64);
  }

  /**
   * Given domain, type, and uuid, returns the computed paymentId
   * @param domain Alphanumeric string of 10 characters or less
   * @param type Alphanumeric string of 6 characters or less
   * @param uuid Hex string of 32 characterx exactly
   */
  public makePaymentId(domain: string, type: EPaymentType, uuid: string): Result<PaymentId, InvalidParametersError> {
    const domainRegex = /^[0-9A-Za-z]{1,10}$/;
    const typeRegex = /^[0-9A-Za-z]{1,6}$/;
    const uuidRegex = /^[0-9A-Fa-f]{32}$/;

    // strip out dashes from the uuid first
    uuid = uuid.split("-").join("");

    if (!domainRegex.test(domain)) {
      return err(new InvalidParametersError(`Domain must be 10 alphanumeric characters or less, got ${domain}`));
    }
    if (!typeRegex.test(type)) {
      return err(new InvalidParametersError(`Type must be 6 alphanumeric characters or less, got ${type}`));
    }
    if (!uuidRegex.test(uuid)) {
      return err(new InvalidParametersError(`UUID must be exactly 16 hex characters, got ${uuid}`));
    }

    // Pad with spaces to reach static lengths
    domain = domain.padEnd(10);
    const stringType = type.padEnd(6);

    // Convert domain and type to hex (/w ascii encoding)
    const domainHex = Buffer.from(domain, "ascii").toString("hex");
    // console.log(`Domain: ${domain}`)
    // console.log(`DomainHex: ${domainHex}`)

    const typeHex = Buffer.from(stringType, "ascii").toString("hex");

    // Sanity check
    if (domainHex.length !== 20) {
      return err(new InvalidParametersError(`Domain hex wasn't 20 chars long, got '${domainHex}'`));
    }
    if (typeHex.length !== 12) {
      return err(new InvalidParametersError(`Type hex wasn't 12 chars long, got '${typeHex}'`));
    }

    const paymentId = PaymentId("0x" + domainHex + typeHex + uuid);

    const isValidRes = this.isValidPaymentId(paymentId);
    if (isValidRes.isOk() && isValidRes.value) {
      return ok(paymentId);
    }

    // Either an error or invalid, either way, it's an invalid parameter issue for us
    return err(
      new InvalidParametersError(
        `Unable to create a valid payment ID from domain: ${domain}, type: ${type}, and uuid: ${uuid}`,
      ),
    );
  }
}
