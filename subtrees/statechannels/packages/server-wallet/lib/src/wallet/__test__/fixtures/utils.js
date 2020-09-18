"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
exports.fixture = function (defaults, modifier = lodash_1.default.identity) {
    return (mergeProps, extendProps) => modifier(lodash_1.default.extend(lodash_1.default.merge(lodash_1.default.cloneDeep(defaults), mergeProps), extendProps), mergeProps);
};
function overwriteOutcome(result, props) {
    var _a;
    if ((_a = props) === null || _a === void 0 ? void 0 : _a.outcome)
        result.outcome = props.outcome;
    return result;
}
exports.overwriteOutcome = overwriteOutcome;
//# sourceMappingURL=utils.js.map