"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// need to use this syntax, because ajv uses export= style exports
// otherwise we force all consumers of the package to set esModuleInterop to true
const Ajv = require("ajv");
// You need to pass `jsonPointers: true`
const ajv = new Ajv({ jsonPointers: true, verbose: true });
// eslint-disable-next-line
const apiSchema = require('./generated-schema.json'); // because https://github.com/TypeStrong/ts-loader/issues/905
ajv.addSchema(apiSchema, 'api.json');
exports.validateRequest = ajv.compile({ $ref: 'api.json#/definitions/StateChannelsRequest' });
exports.validateResponse = ajv.compile({ $ref: 'api.json#/definitions/StateChannelsResponse' });
exports.validateErrorResponse = ajv.compile({
    $ref: 'api.json#/definitions/StateChannelsErrorResponse'
});
exports.validateNotification = ajv.compile({
    $ref: 'api.json#/definitions/StateChannelsNotification'
});
function prettyPrintError(e) {
    switch (e.keyword) {
        case 'additionalProperties': {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const unexpected = e.params.additionalProperty;
            return `Unexpected property '${unexpected}' found at root${e.dataPath} `;
        }
        case 'required': {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const missing = e.params.missingProperty;
            return `Missing required property '${missing}' at root${e.dataPath}`;
        }
        case 'type':
        case 'pattern': {
            return `Property at root${e.dataPath} ${e.message}`;
        }
    }
    return JSON.stringify(e);
}
/**
 * Validates a request against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsRequest}
 * @returns The input, but with the correct type, if it is valid.
 */
function parseRequest(jsonBlob) {
    var _a;
    const valid = exports.validateRequest(jsonBlob);
    if (!valid) {
        throw new Error(`Validation Error: ${(_a = exports.validateRequest.errors) === null || _a === void 0 ? void 0 : _a.map(e => prettyPrintError(e)).join(`;\n`)}`);
    }
    return jsonBlob;
}
exports.parseRequest = parseRequest;
/**
 * Validates a response against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsResponse}
 * @returns The input, but with the correct type, if it is valid.
 */
function parseResponse(jsonBlob) {
    var _a;
    const valid = exports.validateResponse(jsonBlob);
    if (!valid) {
        throw new Error(`
      Validation Error:
        input: ${JSON.stringify(jsonBlob)};\n
        ${(_a = exports.validateResponse.errors) === null || _a === void 0 ? void 0 : _a.map(e => prettyPrintError(e)).join(`;\n`)}
      `);
    }
    return jsonBlob;
}
exports.parseResponse = parseResponse;
/**
 * Validates a notification against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsNotification}
 * @returns The input, but with the correct type, if it is valid.
 */
function parseNotification(jsonBlob) {
    var _a;
    const valid = exports.validateNotification(jsonBlob);
    if (!valid) {
        throw new Error(`
      Validation Error:
        input: ${JSON.stringify(jsonBlob)};\n
        ${(_a = exports.validateNotification.errors) === null || _a === void 0 ? void 0 : _a.map(e => prettyPrintError(e)).join(`;\n`)}
      `);
    }
    return jsonBlob;
}
exports.parseNotification = parseNotification;
/**
 * Validates an error response against the API schema & returns the input cast to the correctly narrowed type.
 *
 * @param jsonBlob - A javascript object that might be a valid {@link StateChannelsErrorResponse}
 * @returns The input, but with the correct type, if it is valid.
 */
function parseErrorResponse(jsonBlob) {
    var _a;
    const valid = exports.validateErrorResponse(jsonBlob);
    if (!valid) {
        throw new Error(`
      Validation Error:
        input: ${JSON.stringify(jsonBlob)};\n
        ${(_a = exports.validateNotification.errors) === null || _a === void 0 ? void 0 : _a.map(e => prettyPrintError(e)).join(`;\n`)}
      `);
    }
    return jsonBlob;
}
exports.parseErrorResponse = parseErrorResponse;
//# sourceMappingURL=validation.js.map