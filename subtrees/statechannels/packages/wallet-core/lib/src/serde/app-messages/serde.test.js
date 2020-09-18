"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_1 = require("./serialize");
const deserialize_1 = require("./deserialize");
const example_1 = require("./example");
it('works for a simple eth allocation', () => {
    expect(deserialize_1.deserializeAllocations(example_1.externalEthAllocation)).toEqual(example_1.internalEthAllocation);
    expect(serialize_1.serializeAllocation(example_1.internalEthAllocation)).toEqual(example_1.externalEthAllocation);
});
it('works for a mixed allocation', () => {
    expect(deserialize_1.deserializeAllocations(example_1.externalMixedAllocation)).toEqual(example_1.internalMixedAllocation);
    expect(serialize_1.serializeAllocation(example_1.internalMixedAllocation)).toEqual(example_1.externalMixedAllocation);
});
//# sourceMappingURL=serde.test.js.map