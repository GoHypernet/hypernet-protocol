import { HexString } from "@hypernetlabs/objects";
import { InvalidParametersError, InvalidPaymentIdError } from "@hypernetlabs/objects/errors";
import { EPaymentType } from "@hypernetlabs/objects/types";
import { Result } from "neverthrow";

/**
 * An abstract class for creating & converting payment IDs, as well as verifying
 * correctness, and extracting information from the ID (such as type, domain, UUID)
 *
 * A paymentID is a 64-length hexadecimal string:
 * characters 0-19: domain (encoded as ascii text --> hex)
 * characters 20-32: type  (encoded as ascii text --> hex)
 * characters 32-63: UUID  (encoded as hex)
 */
export interface IPaymentIdUtils {
  /**
   * Returns an ascii representation of the domain portion of the paymentID string.
   * (characters 0-19 of the paymentIdString)
   * @param paymentIdString
   */
  getDomain(paymentIdString: HexString): Result<string, InvalidPaymentIdError>;

  /**
   * Returns an ascii representation of the type portion of the paymentID string.
   * (characters 20-31 of the paymentIdString)
   * @param paymentIdString
   */
  getType(paymentIdString: HexString): Result<EPaymentType, InvalidPaymentIdError>;

  /**
   * Returns the UUID portion of the paymentID string.
   * (characters 32-63 of the paymentIdString)
   * @param paymentIdString
   */
  getUUID(paymentIdString: HexString): Result<string, InvalidPaymentIdError>;

  /**
   * A valid payment ID is exactly 64 characters, hexadecimal, prefixed with 0x.
   * @param paymentIdString
   */
  isValidPaymentId(paymentIdString: HexString): Result<boolean, InvalidParametersError>;

  /**
   * Given domain, type, and uuid, returns the computed paymentId
   * @param domain Alphanumeric string of 10 characters or less
   * @param type Alphanumeric string of 6 characters or less
   * @param uuid Hex string of 32 characterx exactly
   */
  makePaymentId(domain: string, type: string, uuid: string): Result<HexString, InvalidParametersError>;
}
