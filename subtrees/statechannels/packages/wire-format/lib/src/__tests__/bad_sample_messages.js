"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataMissing = {
    recipient: 'alice',
    sender: 'bob'
};
exports.extraProperty = {
    recipient: 'alice',
    sender: 'bob',
    data: {},
    iShouldntBeHere: true
};
exports.emptyState = {
    recipient: 'alice',
    sender: 'bob',
    data: {
        signedStates: [{}]
    }
};
exports.emptyStringObjectives = {
    recipient: 'alice',
    sender: 'bob',
    data: {
        objectives: ''
    }
};
exports.nullObjectives = {
    recipient: 'alice',
    sender: 'bob',
    data: {
        objectives: null
    }
};
//# sourceMappingURL=bad_sample_messages.js.map