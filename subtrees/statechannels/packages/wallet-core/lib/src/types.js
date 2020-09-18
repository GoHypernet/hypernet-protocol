"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAllocation(outcome) {
    return outcome.type !== 'SimpleGuarantee';
}
exports.isAllocation = isAllocation;
const guard = (name) => (o) => o.type === name;
exports.isOpenChannel = guard('OpenChannel');
exports.isVirtuallyFund = guard('VirtuallyFund');
exports.isFundGuarantor = guard('FundGuarantor');
exports.isFundLedger = guard('FundLedger');
exports.isCloseLedger = guard('CloseLedger');
function isIndirectFunding(funding) {
    var _a;
    return ((_a = funding) === null || _a === void 0 ? void 0 : _a.type) === 'Indirect';
}
exports.isIndirectFunding = isIndirectFunding;
function isVirtualFunding(funding) {
    var _a;
    return ((_a = funding) === null || _a === void 0 ? void 0 : _a.type) === 'Virtual';
}
exports.isVirtualFunding = isVirtualFunding;
function isGuarantee(funding) {
    var _a;
    return ((_a = funding) === null || _a === void 0 ? void 0 : _a.type) === 'Guarantee';
}
exports.isGuarantee = isGuarantee;
function isGuarantees(funding) {
    var _a;
    return ((_a = funding) === null || _a === void 0 ? void 0 : _a.type) === 'Guarantees';
}
exports.isGuarantees = isGuarantees;
//# sourceMappingURL=types.js.map