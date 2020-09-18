"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wire_format_1 = require("@statechannels/wire-format");
const example_1 = require("./example");
const serialize_1 = require("./serialize");
const deserialize_1 = require("./deserialize");
it('works for states', () => {
    expect(serialize_1.serializeState(example_1.internalStateFormat)).toEqual(example_1.wireStateFormat);
    expect(deserialize_1.deserializeState(example_1.wireStateFormat)).toEqual(example_1.internalStateFormat);
});
it('works for a message', () => {
    const { recipient, sender } = example_1.wireMessageFormat;
    expect(serialize_1.serializeMessage(example_1.internalMessageFormat, recipient, sender)).toEqual(example_1.wireMessageFormat);
    expect(deserialize_1.deserializeMessage(example_1.wireMessageFormat)).toEqual(example_1.internalMessageFormat);
});
it('creates valid wire format', () => {
    const serializedState = serialize_1.serializeState(example_1.internalStateFormat);
    expect(() => wire_format_1.validateState(serializedState)).not.toThrow();
});
//# sourceMappingURL=serde.test.js.map