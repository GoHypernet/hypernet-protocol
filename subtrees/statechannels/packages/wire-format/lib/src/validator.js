"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const apiSchema = require('./generated-schema.json');
const ajv = new Ajv();
ajv.addSchema(apiSchema, 'api.json');
function prettyPrintError(e) {
    switch (e.keyword) {
        case 'additionalProperties': {
            const unexpected = e.params.additionalProperty;
            return `Unexpected property '${unexpected}' found at root${e.dataPath} `;
        }
        case 'required': {
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
exports.messageIsValid = ajv.compile({ $ref: 'api.json#/definitions/Message' });
function validateMessage(jsonBlob) {
    var _a;
    const valid = exports.messageIsValid(jsonBlob);
    if (!valid) {
        const errorMessages = (_a = exports.messageIsValid.errors) === null || _a === void 0 ? void 0 : _a.map(e => prettyPrintError(e)).join('; ');
        throw new Error(`Validation Error: ${errorMessages}`);
    }
    return jsonBlob;
}
exports.validateMessage = validateMessage;
exports.stateIsValid = ajv.compile({ $ref: 'api.json#/definitions/SignedState' });
function validateState(jsonBlob) {
    var _a;
    const valid = exports.stateIsValid(jsonBlob);
    if (!valid) {
        const errorMessages = (_a = exports.stateIsValid.errors) === null || _a === void 0 ? void 0 : _a.map(e => prettyPrintError(e)).join('; ');
        throw new Error(`Validation Error: ${errorMessages}`);
    }
    return jsonBlob;
}
exports.validateState = validateState;
//# sourceMappingURL=validator.js.map