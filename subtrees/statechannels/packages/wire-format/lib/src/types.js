"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAllocations(outcome) {
    if (outcome.length === 0) {
        return true;
    }
    else {
        const first = outcome[0];
        return 'allocationItems' in first;
    }
}
exports.isAllocations = isAllocations;
const guard = (name) => (o) => o.type === name;
exports.isOpenChannel = guard('OpenChannel');
exports.isVirtuallyFund = guard('VirtuallyFund');
exports.isFundGuarantor = guard('FundGuarantor');
//# sourceMappingURL=types.js.map