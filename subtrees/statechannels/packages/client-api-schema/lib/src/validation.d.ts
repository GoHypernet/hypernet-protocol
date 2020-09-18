import Ajv = require('ajv');
import { StateChannelsRequest, StateChannelsResponse, StateChannelsNotification, StateChannelsErrorResponse } from './types';
export declare const validateRequest: Ajv.ValidateFunction;
export declare const validateResponse: Ajv.ValidateFunction;
export declare const validateErrorResponse: Ajv.ValidateFunction;
export declare const validateNotification: Ajv.ValidateFunction;
/**
 * Validates a request against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsRequest}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseRequest(jsonBlob: object): StateChannelsRequest;
/**
 * Validates a response against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsResponse}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseResponse(jsonBlob: object): StateChannelsResponse;
/**
 * Validates a notification against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsNotification}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseNotification(jsonBlob: object): StateChannelsNotification;
/**
 * Validates an error response against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsErrorResponse}
 * @returns The input, but with the correct type, if it is valid.
 */
export declare function parseErrorResponse(jsonBlob: object): StateChannelsErrorResponse;
//# sourceMappingURL=validation.d.ts.map