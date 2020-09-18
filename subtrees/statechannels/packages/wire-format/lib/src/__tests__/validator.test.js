"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../validator");
const good = __importStar(require("./good_sample_messages"));
const bad = __importStar(require("./bad_sample_messages"));
describe('validateRequest', () => {
    it('works', () => {
        expect(validator_1.messageIsValid(bad.dataMissing)).toBe(false);
        expect(validator_1.messageIsValid(bad.extraProperty)).toBe(false);
        expect(validator_1.messageIsValid(bad.emptyState)).toBe(false);
        expect(validator_1.messageIsValid(good.goodMessage)).toBe(true);
        expect(validator_1.messageIsValid(good.undefinedObjectives1)).toBe(true);
        expect(validator_1.messageIsValid(good.undefinedObjectives2)).toBe(true);
    });
});
describe('validate message', () => {
    it('validates good messages', () => {
        expect(validator_1.validateMessage(good.goodMessage)).toEqual(good.goodMessage);
    });
    it('returns helpful error messages', () => {
        expect(() => validator_1.validateMessage(bad.dataMissing)).toThrow(`Validation Error: Missing required property 'data' at root`);
        expect(() => validator_1.validateMessage(bad.extraProperty)).toThrow(`Validation Error: Unexpected property 'iShouldntBeHere' found at root`);
        expect(() => validator_1.validateMessage(bad.emptyState)).toThrow(`Validation Error: Missing required property 'appData' at root.data.signedStates[0]`);
        expect(() => validator_1.validateMessage(bad.emptyStringObjectives)).toThrow(`Validation Error: Property at root.data.objectives should be array`);
        expect(() => validator_1.validateMessage(bad.nullObjectives)).toThrow(`Validation Error: Property at root.data.objectives should be array`);
    });
});
//# sourceMappingURL=validator.test.js.map