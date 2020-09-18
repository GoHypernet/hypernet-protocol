"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guard = (name) => (o) => o.type === name;
exports.isOpenChannel = guard('OpenChannel');
exports.isVirtuallyFund = guard('VirtuallyFund');
exports.isFundGuarantor = guard('FundGuarantor');
//# sourceMappingURL=wire-protocol.js.map